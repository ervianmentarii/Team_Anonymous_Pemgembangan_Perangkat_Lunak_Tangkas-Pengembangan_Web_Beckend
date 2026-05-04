import React from 'react';
import { FaVideo, FaFileMedical, FaCalendarCheck, FaHeartbeat, FaStethoscope, FaAmbulance, FaSyringe, FaBabyCarriage } from 'react-icons/fa';

const Services = () => {
  const services = [
    { icon: <FaVideo />, title: "Konsultasi Online", desc: "Konsultasi dengan dokter via video call dari rumah" },
    { icon: <FaFileMedical />, title: "Rekam Medis Digital", desc: "Akses rekam medis kapan saja secara online" },
    { icon: <FaCalendarCheck />, title: "Booking Janji", desc: "Jadwalkan janji dengan mudah" },
    { icon: <FaHeartbeat />, title: "Monitoring Kesehatan", desc: "Pantau kesehatan secara real-time" },
    { icon: <FaStethoscope />, title: "Konsultasi Spesialis", desc: "Akses berbagai spesialis medis" },
    { icon: <FaAmbulance />, title: "Layanan Darurat", desc: "Bantuan darurat 24/7" }
  ];

  return (
    <div className="py-12">
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Layanan Kami</h1>
          <p className="text-xl">Solusi kesehatan lengkap untuk Anda dan keluarga</p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="card p-6 text-center hover:transform hover:scale-105 transition">
              <div className="text-blue-600 text-5xl mb-4 flex justify-center">{s.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
              <p className="text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
