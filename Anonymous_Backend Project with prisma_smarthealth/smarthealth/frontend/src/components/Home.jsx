import React from 'react';
import { Link } from 'react-router-dom';
import { FaVideo, FaUserMd, FaCalendarCheck, FaPhoneAlt } from 'react-icons/fa';

const Home = () => {
  const services = [
    { 
      icon: <FaVideo />, 
      title: "Layanan", 
      description: "Memberikan list layanan kesehatan digital lengkap yang kami sediakan khusus untuk Anda.",
      path: "/services"
    },
    { 
      icon: <FaUserMd />, 
      title: "Dokter",
      description: "Temukan dan pilih dokter spesialis berpengalaman yang siap memberikan solusi medis terbaik.",
      path: "/doctors"
    },
    { 
      icon: <FaCalendarCheck />, 
      title: "Buat Janji", 
      description: "Jadwalkan pertemuan dengan tenaga medis pilihan Anda secara cepat, praktis, dan tanpa antre.",
      path: "/appointments"
    },
    { 
      icon: <FaPhoneAlt />, 
      title: "Kontak", 
      description: "Hubungi tim layanan pelanggan kami untuk bantuan informasi atau keadaan darurat SmartHealth.",
      path: "/contact"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4 text-center lg:text-left">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Kesehatan Anda,<br />Prioritas Kami
            </h1>
            <p className="text-lg md:text-xl mb-10 text-blue-100 opacity-90">
              Layanan Kesehatan Digital Terlengkap untuk Anda yang Lebih Sehat.
            </p>
            <Link 
              to="/appointments" 
              className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold hover:bg-blue-50 transition duration-300 no-underline shadow-lg inline-block"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Layanan Kami</h2>
            <p className="text-gray-500 max-w-lg mx-auto">Perawatan Berkualitas, Kapanpun, Dimanapun</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <Link 
                key={index} 
                to={service.path} 
                className="no-underline group"
              >
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 text-center h-full cursor-pointer flex flex-col items-center">
                  <div className="text-4xl text-blue-600 mb-5 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-base font-bold text-gray-800 mb-3">{service.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed italic">
                    "{service.description}"
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-700 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Siap Mengontrol Kesehatan Anda?</h2>
          <p className="text-lg mb-8 opacity-80 max-w-2xl mx-auto font-light">
            Bergabunglah dengan ribuan pasien yang puas menggunakan SmartHealth.
            Kesehatan Anda dan semua orang adalah prioritas utama kami.
          </p>
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <p className="text-md italic">
                "Kami memfasilitasi akses digital agar memudahkan setiap orang menghubungi dokter dengan cepat."
              </p>
            </div>
            <p className="text-xl font-semibold tracking-wide mt-6">
              MENYEMBUHKAN DUNIA & MEMBANTU SESAMA
            </p>
          </div>
        </div>
        
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      </section>
    </div>
  );
};

export default Home;