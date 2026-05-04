import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaHistory, FaSignOutAlt, FaHeartbeat, FaStethoscope, FaFileMedical } from 'react-icons/fa';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [healthRecordsCount, setHealthRecordsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    if (parsed.tipe === 'staff') { navigate('/staff-dashboard'); return; }
    setUser(parsed);
    fetchUpcomingAppointments();
    fetchHealthRecordsCount();
  }, []);

  const fetchUpcomingAppointments = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/upcoming/${userData.id}`);
      setUpcomingAppointments(response.data.appointments);
    } catch (error) { console.error(error); }
  };

  const fetchHealthRecordsCount = async () => {
    const userData = JSON.parse(localStorage.getItem('user'));
    try {
      const response = await axios.get(`http://localhost:5000/api/health-records/patient/${userData.id}`);
      setHealthRecordsCount(response.data.records.length);
    } catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8"><h1 className="text-3xl font-bold text-gray-800">Halo, {user.nama_lengkap}!</h1><p className="text-gray-600">Selamat datang di dashboard kesehatan Anda</p></div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 text-center"><FaUser className="text-blue-600 text-4xl mx-auto mb-3" /><p className="text-gray-600">Pasien</p></div>
          <div className="bg-white rounded-lg shadow p-6 text-center"><FaCalendarAlt className="text-blue-600 text-4xl mx-auto mb-3" /><p className="text-2xl font-bold">{upcomingAppointments.length}</p><p className="text-gray-600">Janji Mendatang</p></div>
          <div className="bg-white rounded-lg shadow p-6 text-center"><FaFileMedical className="text-blue-600 text-4xl mx-auto mb-3" /><p className="text-2xl font-bold">{healthRecordsCount}</p><p className="text-gray-600">Rekam Medis</p><Link to="/health-records" className="text-blue-600 text-sm hover:underline">Kelola</Link></div>
          <div className="bg-white rounded-lg shadow p-6 text-center"><FaSignOutAlt className="text-red-600 text-4xl mx-auto mb-3" /><button onClick={handleLogout} className="text-red-600 hover:underline">Keluar</button></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Janji Temu Mendatang</h2>
            {upcomingAppointments.length === 0 ? <p className="text-gray-500">Tidak ada janji temu mendatang</p> :
              upcomingAppointments.map(app => (<div key={app.id} className="border-b py-3"><p className="font-medium">{app.nama_dokter}</p><p className="text-sm text-gray-600">{app.sub_spesialisasi}</p><p className="text-sm text-gray-500">{new Date(app.waktu_janji).toLocaleString('id-ID')}</p></div>))}
            <Link to="/appointments" className="inline-block mt-4 text-blue-600 hover:underline">+ Buat Janji Baru</Link>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow p-6 text-white">
            <div className="flex items-center mb-4"><FaHeartbeat className="text-3xl mr-3" /><h2 className="text-xl font-semibold">Tips Kesehatan</h2></div>
            <ul className="space-y-2 text-sm"><li>✓ Jaga pola makan sehat dan seimbang</li><li>✓ Istirahat yang cukup 7-8 jam per hari</li><li>✓ Olahraga teratur minimal 30 menit</li><li>✓ Minum air putih minimal 8 gelas per hari</li><li>✓ Kelola stres dengan baik</li></ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
