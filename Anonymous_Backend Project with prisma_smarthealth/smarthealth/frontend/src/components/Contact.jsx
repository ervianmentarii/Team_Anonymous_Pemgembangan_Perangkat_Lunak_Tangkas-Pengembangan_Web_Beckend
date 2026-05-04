import React, { useState } from 'react';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const handleSubmit = (e) => { e.preventDefault(); toast.success('Pesan terkirim!'); setFormData({ name: '', email: '', message: '' }); };

  return (
    <div>
      <div className="bg-blue-600 text-white py-16"><div className="container mx-auto px-4 text-center"><h1 className="text-4xl font-bold mb-4">Hubungi Kami</h1><p className="text-xl">Kami siap membantu Anda</p></div></div>
      <div className="container mx-auto px-4 py-16"><div className="grid md:grid-cols-2 gap-12">
        <div><h2 className="text-2xl font-semibold mb-6">Informasi Kontak</h2><div className="space-y-6">
          <div className="flex items-center"><FaPhone className="text-blue-600 text-2xl mr-4" /><div><p className="font-semibold">Telepon</p><p className="text-gray-600">+62 812 3456 7890</p></div></div>
          <div className="flex items-center"><FaEnvelope className="text-blue-600 text-2xl mr-4" /><div><p className="font-semibold">Email</p><p className="text-gray-600">info@S-HealthByAnonymous.com</p></div></div>
          <div className="flex items-center"><FaMapMarkerAlt className="text-blue-600 text-2xl mr-4" /><div><p className="font-semibold">Alamat</p><p className="text-gray-600">Jl. Ringroad No. 123, Medan</p></div></div>
          <div className="flex items-center"><FaClock className="text-blue-600 text-2xl mr-4" /><div><p className="font-semibold">Jam Operasional</p><p className="text-gray-600">Senin - Jumat: 09:00 - 20:00<br />Sabtu: 10:00 - 16:00</p></div></div>
        </div></div>
        <div className="bg-white rounded-xl shadow-lg p-8"><h2 className="text-2xl font-semibold mb-6">Kirim Pesan</h2><form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nama Anda" className="input-field" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <input type="email" placeholder="Email Anda" className="input-field" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
          <textarea rows="5" placeholder="Pesan Anda" className="input-field" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required></textarea>
          <button type="submit" className="btn-primary w-full">Kirim Pesan</button>
        </form></div>
      </div></div>
    </div>
  );
};

export default Contact;
