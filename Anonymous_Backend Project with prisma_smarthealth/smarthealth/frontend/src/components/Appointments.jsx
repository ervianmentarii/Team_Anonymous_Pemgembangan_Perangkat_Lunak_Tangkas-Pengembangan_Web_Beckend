import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format, addDays } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import {
  FaUserMd, FaCalendarAlt, FaClock, FaNotesMedical,
  FaCheckCircle, FaArrowRight, FaArrowLeft, FaHeartbeat,
  FaStethoscope, FaSearch, FaStar, FaPhone,
} from 'react-icons/fa';

/* ── Stepper ── */
const STEPS = [
  { id: 1, label: 'Pilih Dokter',  icon: <FaUserMd /> },
  { id: 2, label: 'Pilih Jadwal',  icon: <FaCalendarAlt /> },
  { id: 3, label: 'Pilih Waktu',   icon: <FaClock /> },
  { id: 4, label: 'Konfirmasi',    icon: <FaNotesMedical /> },
];

const HARI_INDO = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];

const Appointments = () => {
  const location = useLocation();
  const navigate = useNavigate();

  /* ── state ── */
  const [step, setStep]                   = useState(1);
  const [doctors, setDoctors]             = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [filterSpec, setFilterSpec]       = useState('');
  const [searchQ, setSearchQ]             = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate]   = useState(
    location.state?.selectedDate || format(new Date(), 'yyyy-MM-dd')
  );
  const [slots, setSlots]                 = useState([]);
  const [selectedSlot, setSelectedSlot]   = useState(location.state?.selectedSlot || null);
  const [gejala, setGejala]               = useState('');
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [loadingSlots, setLoadingSlots]   = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [done, setDone]                   = useState(false);

  /* ── fetch ── */
  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [filterSpec]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) fetchSlots();
  }, [selectedDoctor, selectedDate]);

  /* pre-fill dari DoctorSchedule/DoctorDetail */
  useEffect(() => {
    if (location.state?.doctorId && doctors.length > 0) {
      const doc = doctors.find(d => d.id === Number(location.state.doctorId));
      if (doc) { setSelectedDoctor(doc); setStep(2); }
    }
  }, [doctors]);

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const params = filterSpec ? { sub_spesialisasi: filterSpec } : {};
      const { data } = await axios.get('http://localhost:5000/api/doctors', { params });
      setDoctors(data.doctors || []);
    } catch { toast.error('Gagal memuat data dokter'); }
    finally { setLoadingDoctors(false); }
  };

  const fetchSpecializations = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/doctors/specializations');
      setSpecializations(data.specializations || []);
    } catch {}
  };

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setSlots([]);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/doctors/${selectedDoctor.id}/available-slots?date=${selectedDate}`
      );
      setSlots(data.slots || []);
    } catch { toast.error('Gagal memuat slot waktu'); }
    finally { setLoadingSlots(false); }
  };

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) { toast.error('Silakan login terlebih dahulu'); navigate('/login'); return; }
    if (user.tipe === 'staff') { toast.error('Staff tidak bisa membuat janji temu. Login sebagai pasien.'); return; }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/appointments', {
        id_dokter   : selectedDoctor.id,
        id_pasien   : user.id,
        waktu_janji : selectedSlot.waktu,
        gejala,
        catatan     : gejala,
      });
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal membuat janji temu');
    } finally {
      setSubmitting(false);
    }
  };

  /* ── helpers ── */
  const filteredDoctors = doctors.filter(d =>
    d.nama_lengkap.toLowerCase().includes(searchQ.toLowerCase()) ||
    d.sub_spesialisasi?.toLowerCase().includes(searchQ.toLowerCase())
  );

  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      value : format(d, 'yyyy-MM-dd'),
      hari  : HARI_INDO[d.getDay()],
      label : format(d, 'd MMM', { locale: idLocale }),
      isToday: i === 0,
    };
  });

  const hariSelected = HARI_INDO[new Date(selectedDate + 'T12:00:00').getDay()];

  /* ══════════════════════════════════════════════════════════
     SUCCESS SCREEN
  ══════════════════════════════════════════════════════════ */
  if (done) return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaCheckCircle className="text-green-500 text-4xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Janji Temu Berhasil!</h2>
        <p className="text-gray-500 mb-6">Jadwal Anda telah dikonfirmasi</p>

        <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-8">
          <div className="flex items-center gap-3">
            <FaUserMd className="text-blue-600 text-lg flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Dokter</p>
              <p className="font-semibold text-gray-800">{selectedDoctor?.nama_lengkap}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaStethoscope className="text-blue-600 text-lg flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Spesialisasi</p>
              <p className="font-medium text-gray-700">{selectedDoctor?.sub_spesialisasi}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <FaCalendarAlt className="text-blue-600 text-lg flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Waktu</p>
              <p className="font-medium text-gray-700">
                {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy', { locale: idLocale })}
                {' • '}{selectedSlot?.waktu_display}
              </p>
            </div>
          </div>
          {gejala && (
            <div className="flex items-start gap-3">
              <FaNotesMedical className="text-blue-600 text-lg flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">Keluhan</p>
                <p className="text-gray-700 text-sm">{gejala}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate('/appointment-history')}
            className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Lihat Riwayat
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════
     MAIN BOOKING FLOW
  ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-3">
            <FaHeartbeat className="text-white text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Buat Janji Temu</h1>
          <p className="text-gray-500 mt-1">Ikuti langkah berikut untuk membuat jadwal konsultasi</p>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-8">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step > s.id
                    ? 'bg-green-500 text-white'
                    : step === s.id
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {step > s.id ? <FaCheckCircle /> : s.icon}
                </div>
                <span className={`text-xs mt-1 hidden sm:block font-medium ${
                  step === s.id ? 'text-blue-600' : step > s.id ? 'text-green-500' : 'text-gray-400'
                }`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-1 mx-2 rounded ${step > s.id ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ─── STEP 1: Pilih Dokter ─── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FaUserMd className="text-blue-600" /> Pilih Dokter
            </h2>

            {/* Filter */}
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <div className="relative flex-1">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Cari nama atau spesialisasi..."
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <select
                value={filterSpec}
                onChange={(e) => setFilterSpec(e.target.value)}
                className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="">Semua Spesialisasi</option>
                {specializations.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Doctor list */}
            {loadingDoctors ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <FaUserMd className="text-4xl mx-auto mb-3 opacity-30" />
                <p>Tidak ada dokter ditemukan</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {filteredDoctors.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => { setSelectedDoctor(doc); setStep(2); }}
                    className="w-full text-left p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaUserMd className="text-blue-600 text-xl" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 truncate">{doc.nama_lengkap}</p>
                      <p className="text-sm text-blue-600">{doc.sub_spesialisasi}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <FaStar className="text-yellow-400" /> {doc.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          {doc.pengalaman} tahun pengalaman
                        </span>
                        {doc.nomor_telepon && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaPhone className="text-gray-400" /> {doc.nomor_telepon}
                          </span>
                        )}
                      </div>
                    </div>
                    <FaArrowRight className="text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── STEP 2: Pilih Tanggal ─── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Dokter terpilih */}
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl mb-6">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <FaUserMd className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500">Dokter terpilih</p>
                <p className="font-bold text-gray-800">{selectedDoctor?.nama_lengkap}</p>
                <p className="text-sm text-blue-600">{selectedDoctor?.sub_spesialisasi}</p>
              </div>
              <button
                onClick={() => { setSelectedDoctor(null); setStep(1); }}
                className="text-sm text-blue-600 hover:underline flex items-center gap-1"
              >
                <FaArrowLeft className="text-xs" /> Ganti
              </button>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" /> Pilih Tanggal
            </h2>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 mb-6">
              {dateOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDate(opt.value)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedDate === opt.value
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : 'border-gray-200 hover:border-blue-400 text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  <p className="text-xs font-medium">{opt.isToday ? 'Hari ini' : opt.hari}</p>
                  <p className="text-sm font-bold mt-0.5">{opt.label}</p>
                </button>
              ))}
            </div>

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                <FaArrowLeft /> Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Lihat Slot <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 3: Pilih Waktu ─── */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            {/* Summary */}
            <div className="flex flex-wrap gap-3 p-4 bg-blue-50 rounded-xl mb-6">
              <div className="flex items-center gap-2 text-sm text-blue-800">
                <FaUserMd /> <span className="font-semibold">{selectedDoctor?.nama_lengkap}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700">
                <FaCalendarAlt />
                <span>{format(new Date(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy', { locale: idLocale })}</span>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FaClock className="text-blue-600" /> Pilih Waktu
            </h2>

            {loadingSlots ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
              </div>
            ) : slots.length === 0 ? (
              <div className="text-center py-10 bg-orange-50 rounded-xl">
                <FaCalendarAlt className="text-orange-300 text-4xl mx-auto mb-3" />
                <p className="text-orange-700 font-semibold">
                  Dokter tidak praktik pada hari <strong>{hariSelected}</strong>
                </p>
                <p className="text-gray-500 text-sm mt-1">Silakan pilih tanggal lain</p>
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 px-5 py-2 rounded-lg bg-orange-100 text-orange-700 text-sm font-medium hover:bg-orange-200 transition"
                >
                  Pilih Tanggal Lain
                </button>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  <span className="text-green-600 font-semibold">{slots.length} slot tersedia</span> — pilih waktu yang sesuai
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-6">
                  {slots.map((slot, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${
                        selectedSlot?.waktu === slot.waktu
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                          : 'border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      {slot.waktu_display}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                <FaArrowLeft /> Kembali
              </button>
              <button
                onClick={() => setStep(4)}
                disabled={!selectedSlot}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Lanjut <FaArrowRight />
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP 4: Konfirmasi ─── */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-5 flex items-center gap-2">
              <FaNotesMedical className="text-blue-600" /> Konfirmasi Janji Temu
            </h2>

            {/* Summary card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white mb-6">
              <p className="text-blue-200 text-xs font-semibold uppercase tracking-wider mb-3">Ringkasan Booking</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaUserMd className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Dokter</p>
                    <p className="font-bold">{selectedDoctor?.nama_lengkap}</p>
                    <p className="text-sm text-blue-200">{selectedDoctor?.sub_spesialisasi}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0">
                    <FaCalendarAlt className="text-sm" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200">Waktu</p>
                    <p className="font-bold">
                      {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy', { locale: idLocale })}
                    </p>
                    <p className="text-sm text-blue-200">Pukul {selectedSlot?.waktu_display} WIB</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Keluhan */}
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2 text-sm">
                Gejala / Keluhan <span className="text-gray-400 font-normal">(opsional)</span>
              </label>
              <textarea
                rows={4}
                value={gejala}
                onChange={(e) => setGejala(e.target.value)}
                placeholder="Ceritakan gejala atau keluhan yang Anda rasakan agar dokter bisa mempersiapkan diri..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
            </div>

            {/* Cek login */}
            {!localStorage.getItem('token') && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 mb-5 text-sm text-yellow-800">
                ⚠️ Anda belum login. Silakan{' '}
                <button
                  onClick={() => navigate('/login', { state: { from: '/appointments' } })}
                  className="font-semibold underline text-yellow-900"
                >
                  login terlebih dahulu
                </button>{' '}
                untuk membuat janji temu.
              </div>
            )}

            <div className="flex justify-between gap-3">
              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
              >
                <FaArrowLeft /> Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !localStorage.getItem('token')}
                className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <><FaCheckCircle /> Konfirmasi Janji Temu</>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Appointments;
