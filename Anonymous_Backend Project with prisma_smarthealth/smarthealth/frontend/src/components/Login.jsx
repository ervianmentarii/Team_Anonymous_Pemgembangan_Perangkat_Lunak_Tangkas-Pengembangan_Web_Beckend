import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  FaEnvelope, FaLock, FaUser, FaUserTie,
  FaHeartbeat, FaEye, FaEyeSlash, FaUserShield,
} from 'react-icons/fa';

/* ── akun demo sesuai database web_uts ── */
const DEMO_STAFF = [
  { label: 'Admin',    email: 'admin@smarthealthy.id',                pass: 'password123' },
  { label: 'Dr. Andi', email: 'andi.pratama@smarthealthy.id',         pass: 'password123' },
  { label: 'Dr. Siti', email: 'siti.rahayu@smarthealthy.id',          pass: 'password123' },
  { label: 'Dr. Budi', email: 'budi.santoso@smarthealthy.id',         pass: 'password123' },
  { label: 'Dr. Dewi', email: 'dewi.lestari@smarthealthy.id',         pass: 'password123' },
  { label: 'Dr. Reza', email: 'reza.firmansyah@smarthealthy.id',      pass: 'password123' },
];
const DEMO_PASIEN = [
  { label: 'Ahmad',   email: 'ahmad.fauzi@gmail.com',     pass: 'password123' },
  { label: 'Rina',    email: 'rina.kusuma@gmail.com',      pass: 'password123' },
  { label: 'Teguh',   email: 'teguh.wibowo@gmail.com',     pass: 'password123' },
  { label: 'Maya',    email: 'maya.indah@gmail.com',       pass: 'password123' },
  { label: 'Hendra',  email: 'hendra.gunawan@gmail.com',   pass: 'password123' },
];

const Login = () => {
  const [activeTab, setActiveTab]       = useState('patient');
  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const navigate = useNavigate();

  const isStaff = activeTab === 'staff';

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    setFormData({ email: '', password: '' });
    setShowPassword(false);
  };

  const fillDemo = (demo) => {
    setFormData({ email: demo.email, password: demo.pass });
    toast(`"${demo.label}" dipilih — klik Masuk`, { icon: '✏️', duration: 1800 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isStaff
        ? 'http://localhost:5000/api/users/staff/login'
        : 'http://localhost:5000/api/users/login';

      const { data } = await axios.post(endpoint, {
        email: formData.email,
        password: formData.password,
      });

      if (data.success === false) throw new Error(data.message);

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(
        isStaff
          ? `Selamat datang, ${data.user.nama_lengkap || 'Staff'}!`
          : `Selamat datang, ${data.user.nama_lengkap || 'Pasien'}!`
      );
      navigate(isStaff ? '/staff-dashboard' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login gagal. Periksa email & password.');
    } finally {
      setLoading(false);
    }
  };

  const demoList = isStaff ? DEMO_STAFF : DEMO_PASIEN;
  const accentCls = isStaff ? 'indigo' : 'blue';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg mb-4">
            <FaHeartbeat className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">
            Smart<span className="text-blue-600">Health</span>
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Sistem Informasi Kesehatan</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Tab Switcher */}
          <div className="flex">
            <button
              onClick={() => handleTabSwitch('patient')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                !isStaff
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FaUser /> Login Pasien
            </button>
            <button
              onClick={() => handleTabSwitch('staff')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all border-b-2 ${
                isStaff
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <FaUserTie /> Login Staff
            </button>
          </div>

          <div className="p-8">

            {/* Header */}
            <div className="mb-5 text-center">
              {isStaff ? (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-3">
                    <FaUserShield className="text-indigo-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Portal Staff</h2>
                  <p className="text-gray-500 text-sm mt-1">Login sebagai Admin atau Dokter</p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-3">
                    <FaUser className="text-blue-600 text-xl" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Selamat Datang</h2>
                  <p className="text-gray-500 text-sm mt-1">Masuk ke akun pasien Anda</p>
                </>
              )}
            </div>

            {/* Quick-fill Demo Accounts */}
            <div className={`rounded-xl p-3 mb-5 border ${
              isStaff ? 'bg-indigo-50 border-indigo-200' : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-xs font-semibold mb-2 ${isStaff ? 'text-indigo-700' : 'text-blue-700'}`}>
                🚀 Akun Demo — klik untuk mengisi otomatis:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {demoList.map((d) => (
                  <button
                    key={d.email}
                    type="button"
                    onClick={() => fillDemo(d)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                      isStaff
                        ? 'bg-white border-indigo-300 text-indigo-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                        : 'bg-white border-blue-300 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Password: <code className="bg-gray-100 px-1 rounded font-mono">password123</code>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={isStaff ? 'Email staff / dokter' : 'Email pasien Anda'}
                    className="input-field pl-10 text-sm"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2 text-sm">Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan password"
                    className="input-field pl-10 pr-10 text-sm"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isStaff
                    ? 'bg-indigo-600 hover:bg-indigo-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  `Masuk sebagai ${isStaff ? 'Staff' : 'Pasien'}`
                )}
              </button>
            </form>

            {!isStaff && (
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm">
                  Belum punya akun?{' '}
                  <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Daftar di sini
                  </Link>
                </p>
              </div>
            )}

            {isStaff && (
              <p className="mt-5 text-center text-xs text-gray-400">
                Hubungi administrator jika mengalami kendala login.
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6">
          &copy; {new Date().getFullYear()} SmartHealth. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
