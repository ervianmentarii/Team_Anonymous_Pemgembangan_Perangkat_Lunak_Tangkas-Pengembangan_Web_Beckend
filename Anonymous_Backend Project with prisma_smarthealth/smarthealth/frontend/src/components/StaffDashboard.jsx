import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaUserTie, FaCalendarAlt, FaUsers, FaCheckCircle,
  FaTimesCircle, FaSignOutAlt, FaStethoscope, FaClock,
  FaUserMd, FaSearch, FaChevronDown,
} from 'react-icons/fa';

const STATUS_OPTIONS = ['Terjadwal', 'Selesai', 'Dibatalkan', 'Tidak Hadir'];

const statusBadge = (status) => {
  const map = {
    'Terjadwal':   'bg-blue-100 text-blue-700',
    'Selesai':     'bg-green-100 text-green-700',
    'Dibatalkan':  'bg-red-100 text-red-700',
    'Tidak Hadir': 'bg-yellow-100 text-yellow-700',
  };
  return map[status] || 'bg-gray-100 text-gray-700';
};

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);
  const [activeTab, setActiveTab] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({ total: 0, today: 0, terjadwal: 0, selesai: 0 });
  const [patientStats, setPatientStats] = useState({ total: 0 });
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) { navigate('/login'); return; }
    const parsed = JSON.parse(userData);
    if (parsed.tipe !== 'staff') { navigate('/dashboard'); return; }
    setStaff(parsed);
    fetchAll();
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [filterStatus, filterDate]);

  const fetchAll = async () => {
    await Promise.all([fetchAppointments(), fetchStats(), fetchPatients(), fetchPatientStats()]);
    setLoading(false);
  };

  const fetchAppointments = async () => {
    try {
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterDate) params.append('date', filterDate);
      const res = await axios.get(`http://localhost:5000/api/appointments/all?${params}`);
      setAppointments(res.data.appointments);
    } catch { toast.error('Gagal memuat janji temu'); }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/appointments/stats');
      setStats(res.data.stats);
    } catch {}
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/patients');
      setPatients(res.data.patients);
    } catch {}
  };

  const fetchPatientStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users/patients/stats');
      setPatientStats(res.data.stats);
    } catch {}
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    setUpdatingId(appointmentId);
    try {
      await axios.patch(`http://localhost:5000/api/appointments/${appointmentId}/status`, { status: newStatus });
      toast.success(`Status diperbarui: ${newStatus}`);
      fetchAppointments();
      fetchStats();
    } catch {
      toast.error('Gagal memperbarui status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const filteredPatients = patients.filter(p =>
    p.nama_lengkap.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchPatient.toLowerCase()) ||
    p.nik?.includes(searchPatient)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600">Memuat dashboard staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Staff */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaUserTie className="text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{staff?.nama_lengkap}</h1>
                <p className="text-indigo-200 text-sm">{staff?.jabatan} &bull; Portal Staff SmartHealth</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl text-sm transition-all"
            >
              <FaSignOutAlt /> Keluar
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {[
              { label: 'Total Janji',   value: stats.total,     icon: <FaCalendarAlt /> },
              { label: 'Hari Ini',      value: stats.today,     icon: <FaClock /> },
              { label: 'Terjadwal',     value: stats.terjadwal, icon: <FaCheckCircle /> },
              { label: 'Total Pasien',  value: patientStats.total, icon: <FaUsers /> },
            ].map((s, i) => (
              <div key={i} className="bg-white bg-opacity-15 rounded-xl p-4 text-center backdrop-blur">
                <div className="text-2xl mb-1 opacity-80">{s.icon}</div>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-indigo-200 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigasi */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl shadow p-1.5 w-fit">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'appointments'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaCalendarAlt /> Janji Temu
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'patients'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FaUsers /> Data Pasien
          </button>
        </div>

        {/* Tab: Manajemen Janji Temu */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-2xl shadow">
            <div className="p-5 border-b flex flex-wrap gap-3 items-center">
              <h2 className="text-lg font-bold text-gray-800 mr-auto">Manajemen Janji Temu</h2>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                <option value="">Semua Status</option>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {(filterStatus || filterDate) && (
                <button
                  onClick={() => { setFilterStatus(''); setFilterDate(''); }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>

            {appointments.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FaCalendarAlt className="text-5xl mx-auto mb-3 opacity-30" />
                <p>Tidak ada janji temu ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Pasien</th>
                      <th className="px-4 py-3 text-left">Dokter</th>
                      <th className="px-4 py-3 text-left">Waktu</th>
                      <th className="px-4 py-3 text-left">Gejala</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appointments.map((app) => (
                      <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-800">{app.patient?.nama_lengkap || '-'}</p>
                          <p className="text-gray-400 text-xs">{app.patient?.nomor_telepon}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-700">{app.doctor?.nama_lengkap || '-'}</p>
                          <p className="text-gray-400 text-xs">{app.doctor?.sub_spesialisasi}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                          {new Date(app.waktu_janji).toLocaleString('id-ID', {
                            dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC'
                          })}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">
                          {app.gejala || '-'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadge(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="relative">
                            <select
                              value={app.status}
                              onChange={(e) => handleStatusChange(app.id, e.target.value)}
                              disabled={updatingId === app.id}
                              className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 pr-6 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 appearance-none bg-white cursor-pointer"
                            >
                              {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <FaChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-5 py-3 border-t text-xs text-gray-400">
              Menampilkan {appointments.length} janji temu
            </div>
          </div>
        )}

        {/* Tab: Data Pasien */}
        {activeTab === 'patients' && (
          <div className="bg-white rounded-2xl shadow">
            <div className="p-5 border-b flex items-center gap-3">
              <h2 className="text-lg font-bold text-gray-800 mr-auto">Data Pasien Terdaftar</h2>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Cari nama, email, NIK..."
                  value={searchPatient}
                  onChange={(e) => setSearchPatient(e.target.value)}
                  className="border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-64"
                />
              </div>
            </div>

            {filteredPatients.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <FaUsers className="text-5xl mx-auto mb-3 opacity-30" />
                <p>Tidak ada pasien ditemukan</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Nama Pasien</th>
                      <th className="px-4 py-3 text-left">NIK</th>
                      <th className="px-4 py-3 text-left">Kontak</th>
                      <th className="px-4 py-3 text-left">Jenis Kelamin</th>
                      <th className="px-4 py-3 text-left">Tanggal Lahir</th>
                      <th className="px-4 py-3 text-left">Alamat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPatients.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold flex-shrink-0">
                              {p.nama_lengkap.charAt(0).toUpperCase()}
                            </div>
                            <p className="font-semibold text-gray-800">{p.nama_lengkap}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 font-mono text-xs">{p.nik}</td>
                        <td className="px-4 py-3">
                          <p className="text-gray-700">{p.email || '-'}</p>
                          <p className="text-gray-400 text-xs">{p.nomor_telepon || '-'}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{p.jenis_kelamin}</td>
                        <td className="px-4 py-3 text-gray-600">
                          {p.tanggal_lahir
                            ? new Date(p.tanggal_lahir).toLocaleDateString('id-ID', { dateStyle: 'medium' })
                            : '-'}
                        </td>
                        <td className="px-4 py-3 text-gray-500 max-w-xs truncate">{p.alamat || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="px-5 py-3 border-t text-xs text-gray-400">
              Menampilkan {filteredPatients.length} dari {patients.length} pasien
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;
