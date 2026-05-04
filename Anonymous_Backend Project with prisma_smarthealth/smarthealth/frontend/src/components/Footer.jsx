import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCode } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Bagian Tentang */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tentang S-Health by Anonymous</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Menyediakan solusi kesehatan digital komprehensif untuk kehidupan yang lebih baik dan sehat.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/services" className="text-gray-300 hover:text-white transition no-underline">Layanan</Link></li>
              <li><Link to="/doctors" className="text-gray-300 hover:text-white transition no-underline">Dokter</Link></li>
              <li><Link to="/appointments" className="text-gray-300 hover:text-white transition no-underline">Buat Janji</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition no-underline">Hubungi Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCode className="text-blue-400" /> Dev Team
            </h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>Laurencio Luckson</li>
              <li>Shawn Michael</li>
              <li>Ervian Mentari</li>
              <li>Jonathan Felix Fubrianto</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-4">
              {/* Ganti '#' dengan link akun media sosial yang asli */}
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-blue-500 text-2xl transition duration-300"
              >
                <FaFacebook />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-pink-500 text-2xl transition duration-300"
              >
                <FaInstagram />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-blue-400 text-2xl transition duration-300"
              >
                <FaTwitter />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-300 hover:text-red-600 text-2xl transition duration-300"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} S-Health. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;