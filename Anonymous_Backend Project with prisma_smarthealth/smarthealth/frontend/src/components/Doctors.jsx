import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaStar, FaCalendarAlt, FaPhone, FaEnvelope, FaMoneyBillWave, FaBriefcase } from 'react-icons/fa';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpec, setSelectedSpec] = useState('');

  useEffect(() => {
    fetchDoctors();
    fetchSpecializations();
  }, [selectedSpec]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const params = selectedSpec ? { sub_spesialisasi: selectedSpec } : {};
      const response = await axios.get('http://localhost:5000/api/doctors', { params });
      setDoctors(response.data.doctors);
    } catch (error) {
      toast.error('Gagal memuat data dokter');
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/doctors/specializations');
      setSpecializations(response.data.specializations);
    } catch (error) {
      console.error('Failed to fetch specializations');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Dokter Spesialis Kami</h1>
        <p className="text-gray-600 text-lg">Tim dokter berpengalaman siap melayani kesehatan Anda</p>
      </div>

      <div className="mb-8 flex justify-center">
        <select value={selectedSpec} onChange={(e) => setSelectedSpec(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Semua Spesialisasi</option>
          {specializations.map(spec => <option key={spec} value={spec}>{spec}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map(doctor => (
            <div key={doctor.id} className="card overflow-hidden hover:transform hover:scale-105 transition duration-300">
              <img src={doctor.image_url || 'https://via.placeholder.com/400x200'} alt={doctor.nama_lengkap} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{doctor.nama_lengkap}</h3>
                <p className="text-blue-600 font-medium mb-3">{doctor.sub_spesialisasi}</p>
                <div className="flex items-center mb-2"><FaBriefcase className="text-gray-400 mr-2" />{doctor.pengalaman} tahun pengalaman</div>
                <div className="flex items-center mb-2"><FaMoneyBillWave className="text-gray-400 mr-2" />Rp {doctor.biaya?.toLocaleString()}</div>
                <div className="flex items-center mb-4"><FaStar className="text-yellow-400 mr-1" /><span className="font-semibold">{doctor.rating}</span> / 5.0</div>
                <Link to={`/doctors/${doctor.id}`} className="btn-primary w-full text-center inline-block">Lihat Jadwal</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Doctors;
