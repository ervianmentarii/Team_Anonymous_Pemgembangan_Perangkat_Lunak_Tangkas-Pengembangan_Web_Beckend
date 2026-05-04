import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaPhone, FaEnvelope, FaCalendarAlt, FaClock, FaArrowLeft, FaBriefcase, FaMoneyBillWave, FaStar, FaMapMarkerAlt } from 'react-icons/fa';

const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctorDetail();
  }, [id]);

  const fetchDoctorDetail = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/doctors/${id}`);
      setDoctor(response.data.doctor);
      setSchedules(response.data.schedules);
    } catch (error) {
      toast.error('Gagal memuat detail dokter');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  if (!doctor) return <div className="text-center py-12 text-gray-600">Dokter tidak ditemukan</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <button onClick={() => navigate('/doctors')} className="flex items-center text-blue-600 hover:text-blue-700 mb-6">
        <FaArrowLeft className="mr-2" /> Kembali ke Daftar Dokter
      </button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img src={doctor.image_url || 'https://via.placeholder.com/400x400'} alt={doctor.nama_lengkap} className="w-full h-full object-cover" />
          </div>
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{doctor.nama_lengkap}</h1>
            <p className="text-xl text-blue-600 font-medium mb-4">{doctor.sub_spesialisasi}</p>
            <div className="flex items-center mb-2"><FaStar className="text-yellow-400 mr-1" /><span className="font-semibold">{doctor.rating}</span> / 5.0</div>
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center"><FaBriefcase className="text-blue-600 mr-2" />{doctor.pengalaman} tahun pengalaman</div>
              <div className="flex items-center"><FaMoneyBillWave className="text-blue-600 mr-2" />Rp {doctor.biaya?.toLocaleString()} / konsultasi</div>
              <div className="flex items-center"><FaPhone className="text-blue-600 mr-2" />{doctor.nomor_telepon}</div>
              <div className="flex items-center"><FaEnvelope className="text-blue-600 mr-2" />{doctor.email}</div>
              <div className="flex items-center"><FaCalendarAlt className="text-blue-600 mr-2" />Praktik sejak {doctor.mulai_praktik}</div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t">
          <h3 className="text-xl font-semibold mb-4">Jadwal Praktik</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {schedules.map(schedule => (
              <div key={schedule.id} className="border rounded-lg p-4 flex items-center justify-between">
                <span className="font-semibold">{schedule.hari}</span>
                <div className="flex items-center"><FaClock className="text-blue-600 mr-2" />{schedule.jam_buka} - {schedule.jam_tutup}</div>
                <span className="text-sm text-gray-500">{schedule.durasi_slot_menit} menit/slot</span>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => navigate('/appointments', { state: { doctorId: doctor.id, doctorName: doctor.nama_lengkap } })}
              className="btn-primary px-8 py-3 text-lg">
              Buat Janji Temu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetail;
