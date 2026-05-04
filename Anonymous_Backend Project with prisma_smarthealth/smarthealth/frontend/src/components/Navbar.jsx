import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHeartbeat, FaUser, FaSignOutAlt, FaBars, FaTimes,
  FaFileMedical, FaCalendarCheck, FaChevronDown,
  FaStethoscope, FaHome, FaPhone, FaCalendarAlt, FaConciergeBell
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    toast.success('Logout berhasil');
    navigate('/');
  };

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
    }`;

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4" ref={dropdownRef}>
        <div className="flex justify-between items-center py-4">

          <Link to="/" className="flex items-center space-x-2">
            <FaHeartbeat className="text-blue-600 text-3xl" />
            <span className="text-2xl font-bold text-gray-800">
              S-Health<span className="text-blue-600">ByAnonymous</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">

            <Link to="/" className={navLinkClass('/')}>Beranda</Link>

            <div className="relative">
              <button
                onClick={() => toggleDropdown('layanan')}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  isActive('/services') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Layanan
                <FaChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    openDropdown === 'layanan' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'layanan' && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <Link
                    to="/services"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <FaConciergeBell className="text-blue-500" />
                    Semua Layanan
                  </Link>
                  <Link
                    to="/doctor-schedule"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <FaCalendarCheck className="text-blue-500" />
                    Cek Jadwal Dokter
                  </Link>
                  <Link
                    to="/appointments"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <FaCalendarAlt className="text-blue-500" />
                    Buat Janji Temu
                  </Link>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleDropdown('dokter')}
                className={`flex items-center gap-1 text-sm font-medium transition-colors ${
                  location.pathname.startsWith('/doctor') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                }`}
              >
                Dokter
                <FaChevronDown
                  className={`text-xs transition-transform duration-200 ${
                    openDropdown === 'dokter' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openDropdown === 'dokter' && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                  <Link
                    to="/doctors"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <FaStethoscope className="text-blue-500" />
                    Daftar Dokter
                  </Link>
                  <Link
                    to="/doctor-schedule"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    <FaCalendarCheck className="text-blue-500" />
                    Jadwal Dokter
                  </Link>
                </div>
              )}
            </div>

            <Link to="/contact" className={navLinkClass('/contact')}>Kontak</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => toggleDropdown('user')}
                  className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors"
                >
                  <FaUser className="text-xs" />
                  <span>{user?.nama_lengkap?.split(' ')[0]}</span>
                  <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${
                      openDropdown === 'user' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openDropdown === 'user' && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link
                      to={user?.tipe === 'staff' ? '/staff-dashboard' : '/dashboard'}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      <FaUser className="text-blue-500" />
                      {user?.tipe === 'staff' ? 'Staff Dashboard' : 'Dashboard'}
                    </Link>
                    {user?.tipe !== 'staff' && (
                    <>
                      <Link
                        to="/appointment-history"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <FaCalendarAlt className="text-blue-500" />
                        Riwayat Janji
                      </Link>
                      <Link
                        to="/health-records"
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <FaFileMedical className="text-blue-500" />
                        Rekam Medis
                      </Link>
                    </>
                  )}
                    <div className="border-t border-gray-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FaSignOutAlt />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm">Masuk</Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100 pt-3 space-y-1">
            <Link to="/" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
              <FaHome className="text-blue-400" /> Beranda
            </Link>
            <Link to="/services" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
              <FaConciergeBell className="text-blue-400" /> Layanan
            </Link>
            <Link to="/doctors" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
              <FaStethoscope className="text-blue-400" /> Daftar Dokter
            </Link>
            <Link to="/doctor-schedule" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
              <FaCalendarCheck className="text-blue-400" /> Jadwal Dokter
            </Link>
            <Link to="/appointments" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
              <FaCalendarAlt className="text-blue-400" /> Buat Janji
            </Link>
            <Link to="/contact" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
              <FaPhone className="text-blue-400" /> Kontak
            </Link>
            {isLoggedIn && (
              <>
                <div className="border-t border-gray-100 my-2" />
                <Link to="/dashboard" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
                  <FaUser className="text-blue-400" /> Dashboard
                </Link>
                <Link to="/appointment-history" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
                  <FaCalendarAlt className="text-blue-400" /> Riwayat Janji
                </Link>
                <Link to="/health-records" className="flex items-center gap-3 py-2.5 px-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg text-sm">
                  <FaFileMedical className="text-blue-400" /> Rekam Medis
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full py-2.5 px-2 text-red-600 hover:bg-red-50 rounded-lg text-sm"
                >
                  <FaSignOutAlt /> Keluar
                </button>
              </>
            )}
            {!isLoggedIn && (
              <Link to="/login" className="block text-center btn-primary text-sm mt-2">Masuk</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
