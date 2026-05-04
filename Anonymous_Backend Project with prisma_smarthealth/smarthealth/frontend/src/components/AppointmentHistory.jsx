import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FaCalendarAlt, FaUserMd, FaStethoscope, FaCheckCircle, FaTimesCircle, FaClock, FaNotesMedical } from 'react-icons/fa';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/appointments/patient/${user.id}`);
      setAppointments(response.data.appointments);
    } catch (error) {
      toast.error('Gagal memuat riwayat janji temu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statuses = {
      'Terjadwal': { color: 'bg-yellow-100 text-yellow-800', icon: <FaClock /> },
      'Selesai': { color: 'bg-green-100 text-green-800', icon: <FaCheckCircle /> },
      'Dibatalkan': { color: 'bg-red-100 text-red-800', icon: <FaTimesCircle /> }
    };
    const s = statuses[status] || statuses['Terjadwal'];
    return <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${s.color}`}>{s.icon}<span className="ml-1">{status}</span></span>;
  };

  if (loading) return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Riwayat Janji Temu</h1>
      {appointments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl"><p className="text-gray-500">Belum ada janji temu</p></div>
      ) : (
        <div className="space-y-4">
          {appointments.map(app => (
            <div key={app.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex flex-wrap justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center mb-2"><FaUserMd className="text-blue-600 mr-2" /><h3 className="text-xl font-semibold">{app.nama_dokter}</h3></div>
                  <div className="flex items-center text-gray-600 mb-2"><FaStethoscope className="mr-2" />{app.sub_spesialisasi}</div>
                  <div className="flex items-center text-gray-600"><FaCalendarAlt className="mr-2" />{format(new Date(app.waktu_janji), 'EEEE, dd MMMM yyyy HH:mm', { locale: id })}</div>
                  {app.gejala && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center mb-1"><FaNotesMedical className="text-gray-500 mr-2" /><span className="font-medium">Gejala:</span></div>
                      <p className="text-sm text-gray-600">{app.gejala}</p>
                    </div>
                  )}
                </div>
                <div className="mt-3 md:mt-0">{getStatusBadge(app.status)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AppointmentHistory;
