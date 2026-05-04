import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaUser, FaIdCard, FaCalendar, FaPhone, FaEnvelope, FaLock, FaVenusMars, FaHome } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    nama_lengkap: '', nik: '', jenis_kelamin: 'Laki-laki', tanggal_lahir: '',
    alamat: '', nomor_telepon: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) { toast.error('Password tidak cocok!'); return; }
    if (!/^[0-9]{16}$/.test(formData.nik)) { toast.error('NIK harus 16 digit angka!'); return; }
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', {
        nama_lengkap: formData.nama_lengkap, nik: formData.nik, jenis_kelamin: formData.jenis_kelamin,
        tanggal_lahir: formData.tanggal_lahir, alamat: formData.alamat, nomor_telepon: formData.nomor_telepon,
        email: formData.email, password: formData.password
      });
      if (response.data.success) { toast.success('Pendaftaran berhasil! Silakan login.'); navigate('/login'); }
    } catch (error) { toast.error(error.response?.data?.message || 'Pendaftaran gagal'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4"><div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-6"><h1 className="text-2xl font-bold text-white">Daftar Akun Baru</h1><p className="text-blue-100">Isi data diri Anda dengan lengkap</p></div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2"><label className="block text-gray-700 font-medium mb-2">Nama Lengkap *</label>
              <div className="relative"><FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} className="input-field pl-10" required /></div></div>
            <div><label className="block text-gray-700 font-medium mb-2">NIK (16 digit) *</label>
              <div className="relative"><FaIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength="16" className="input-field pl-10" required /></div></div>
            <div><label className="block text-gray-700 font-medium mb-2">Jenis Kelamin *</label>
              <div className="relative"><FaVenusMars className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} className="input-field pl-10"><option value="Laki-laki">Laki-laki</option><option value="Perempuan">Perempuan</option></select></div></div>
            <div><label className="block text-gray-700 font-medium mb-2">Tanggal Lahir *</label>
              <div className="relative"><FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} className="input-field pl-10" required /></div></div>
            <div><label className="block text-gray-700 font-medium mb-2">Nomor Telepon *</label>
              <div className="relative"><FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="tel" name="nomor_telepon" value={formData.nomor_telepon} onChange={handleChange} className="input-field pl-10" required /></div></div>
            <div><label className="block text-gray-700 font-medium mb-2">Email *</label>
              <div className="relative"><FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field pl-10" required /></div></div>
            <div className="md:col-span-2"><label className="block text-gray-700 font-medium mb-2">Alamat</label>
              <div className="relative"><FaHome className="absolute left-3 top-3 text-gray-400" />
                <textarea name="alamat" value={formData.alamat} onChange={handleChange} rows="2" className="input-field pl-10"></textarea></div></div>
            <div><label className="block text-gray-700 font-medium mb-2">Password *</label>
              <div className="relative"><FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field pl-10" required /></div></div>
            <div><label className="block text-gray-700 font-medium mb-2">Konfirmasi Password *</label>
              <div className="relative"><FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="input-field pl-10" required /></div></div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Memproses...' : 'Daftar Sekarang'}</button>
          <p className="text-center text-gray-600">Sudah punya akun? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Masuk di sini</Link></p>
        </form>
      </div></div>
    </div>
  );
};

export default Register;
