import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaCalendarAlt, FaClock, FaSearch, FaUserMd, FaStar, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';
import { format, addDays } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const DoctorSchedule = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [slots, setSlots] = useState([]);
  const [jadwalInfo, setJadwalInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, []);

  useEffect(() => {
    if (selectedSpecialization) {
      fetchDoctors(selectedSpecialization);
      setSelectedDoctor(null);
      setSlots([]);
      setJadwalInfo(null);
    } else {
      fetchDoctors();
    }
  }, [selectedSpecialization]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchSlots(selectedDoctor.id, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDoctors = async (spesialisasi = '') => {
    setLoading(true);
    try {
      const params = spesialisasi ? { sub_spesialisasi: spesialisasi } : {};
      const res = await axios.get('http://localhost:5000/api/doctors', { params });
      setDoctors(res.data.doctors);
    } catch {
      toast.error('Gagal memuat data dokter');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/doctors/specializations');
      setSpecializations(res.data.specializations);
    } catch {}
  };

  const fetchSlots = async (doctorId, date) => {
    setLoadingSlots(true);
    setSlots([]);
    setJadwalInfo(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/doctors/${doctorId}/available-slots?date=${date}`);
      setSlots(res.data.slots);
      setJadwalInfo(res.data.jadwal || null);
    } catch {
      toast.error('Gagal mengambil slot waktu');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleBookSlot = (slot) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      toast.error('Silakan login terlebih dahulu');
      navigate('/login');
      return;
    }
    navigate('/appointments', {
      state: {
        doctorId: selectedDoctor.id,
        doctorName: selectedDoctor.nama_lengkap,
        selectedDate,
        selectedSlot: slot.waktu,
      },
    });
  };

  // Generate tanggal 14 hari ke depan
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const d = addDays(new Date(), i);
    return {
      value: format(d, 'yyyy-MM-dd'),
      label: format(d, 'EEEE, d MMM yyyy', { locale: idLocale }),
      isToday: i === 0,
    };
  });

  const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const hariSelected = namaHari[new Date(selectedDate + 'T12:00:00').getDay()];

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Cek Jadwal Dokter</h1>
        <p className="text-gray-500">Pilih dokter dan tanggal untuk melihat slot waktu yang tersedia</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Panel Kiri: Filter + Pilih Dokter */}
        <div className="lg:col-span-1 space-y-4">
          {/* Filter Spesialisasi */}
          <div className="bg-white rounded-2xl shadow p-5">
            <label className="block text-sm font-semibold text-gray-600 mb-2">Filter Spesialisasi</label>
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Spesialisasi</option>
              {specializations.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Daftar Dokter */}
          <div className="bg-white rounded-2xl shadow p-5">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FaUserMd className="text-blue-600" /> Pilih Dokter
              <span className="ml-auto text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{doctors.length} dokter</span>
            </h3>
            {loading ? (
              <div className="text-center py-6">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {doctors.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                      selectedDoctor?.id === doc.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={doc.image_url || 'https://via.placeholder.com/40'}
                        alt={doc.nama_lengkap}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{doc.nama_lengkap}</p>
                        <p className="text-xs text-blue-600 truncate">{doc.sub_spesialisasi}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center text-xs text-yellow-500">
                            <FaStar className="mr-0.5" /> {doc.rating}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <FaMoneyBillWave className="mr-0.5" /> Rp {Number(doc.biaya).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Panel Kanan: Kalender + Slot */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pilih Tanggal */}
          <div className="bg-white rounded-2xl shadow p-5">
            <label className="block text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
              <FaCalendarAlt className="text-blue-600" /> Pilih Tanggal
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {dateOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedDate(opt.value)}
                  className={`p-2 rounded-lg border text-xs text-center transition-all ${
                    selectedDate === opt.value
                      ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                      : 'border-gray-200 hover:border-blue-400 text-gray-700'
                  }`}
                >
                  {opt.isToday ? 'Hari ini' : opt.label.split(', ')[0]}
                  <br />
                  <span className="font-semibold">{opt.label.split(', ')[1]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Info Jadwal + Slot Waktu */}
          {selectedDoctor ? (
            <div className="bg-white rounded-2xl shadow p-5">
              <div className="flex items-center gap-4 mb-5 pb-4 border-b">
                <img
                  src={selectedDoctor.image_url || 'https://via.placeholder.com/60'}
                  alt={selectedDoctor.nama_lengkap}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedDoctor.nama_lengkap}</h2>
                  <p className="text-blue-600 text-sm">{selectedDoctor.sub_spesialisasi}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {format(new Date(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy', { locale: idLocale })}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/doctors/${selectedDoctor.id}`)}
                  className="ml-auto text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  Lihat Profil <FaArrowRight />
                </button>
              </div>

              {loadingSlots ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-3"></div>
                  <p className="text-gray-500 text-sm">Memuat slot waktu...</p>
                </div>
              ) : jadwalInfo ? (
                <>
                  {/* Info jadwal hari ini */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-4 flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-2 text-blue-700">
                      <FaCalendarAlt /> Hari praktik: <strong>{jadwalInfo.hari}</strong>
                    </span>
                    <span className="flex items-center gap-2 text-blue-700">
                      <FaClock /> Jam: <strong>{jadwalInfo.jam_buka} – {jadwalInfo.jam_tutup}</strong>
                    </span>
                    <span className="flex items-center gap-2 text-blue-700">
                      Durasi slot: <strong>{jadwalInfo.durasi_slot_menit} menit</strong>
                    </span>
                  </div>

                  {slots.length > 0 ? (
                    <>
                      <p className="text-sm text-gray-600 mb-3">
                        <span className="font-semibold text-green-600">{slots.length} slot tersedia</span> — klik untuk langsung booking
                      </p>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {slots.map((slot, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleBookSlot(slot)}
                            className="py-2 px-1 rounded-lg bg-green-50 border border-green-300 text-green-700 text-sm font-semibold hover:bg-green-600 hover:text-white hover:border-green-600 transition-all"
                          >
                            {slot.waktu_display}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-3">* Klik waktu untuk membuat janji temu</p>
                    </>
                  ) : (
                    <div className="text-center py-6 bg-orange-50 rounded-xl">
                      <p className="text-orange-600 font-semibold">Semua slot sudah penuh</p>
                      <p className="text-gray-500 text-sm mt-1">Coba pilih tanggal lain</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-xl">
                  <FaCalendarAlt className="text-gray-400 text-3xl mx-auto mb-3" />
                  <p className="text-gray-600 font-semibold">
                    Dokter tidak praktik pada hari <strong>{hariSelected}</strong>
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Silakan pilih tanggal lain</p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
              <FaSearch className="text-5xl mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-semibold">Pilih dokter terlebih dahulu</p>
              <p className="text-sm mt-1">untuk melihat jadwal dan slot yang tersedia</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorSchedule;
