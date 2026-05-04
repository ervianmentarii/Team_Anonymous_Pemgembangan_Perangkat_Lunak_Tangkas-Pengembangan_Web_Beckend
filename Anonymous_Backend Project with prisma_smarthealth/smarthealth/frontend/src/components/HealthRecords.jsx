import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { FaFileMedical, FaPlus, FaTrash, FaDownload, FaStethoscope, FaFlask, FaSyringe, FaFilePdf } from 'react-icons/fa';

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jenis_rekam: 'Rekam Medis',
    judul: '',
    deskripsi: '',
    tanggal: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    try {
      const response = await axios.get(`http://localhost:5000/api/health-records/patient/${user.id}`);
      setRecords(response.data.records);
    } catch (error) {
      toast.error('Gagal memuat rekam medis');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/health-records', {
        id_pasien: user.id,
        ...formData
      });
      toast.success('Rekam medis berhasil ditambahkan');
      setShowForm(false);
      setFormData({ jenis_rekam: 'Rekam Medis', judul: '', deskripsi: '', tanggal: format(new Date(), 'yyyy-MM-dd') });
      fetchRecords();
    } catch (error) {
      toast.error('Gagal menambah rekam medis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (window.confirm('Hapus rekam medis ini?')) {
      try {
        await axios.delete(`http://localhost:5000/api/health-records/${id}`, { data: { patientId: user.id } });
        toast.success('Rekam medis dihapus');
        fetchRecords();
      } catch (error) {
        toast.error('Gagal menghapus');
      }
    }
  };

  const getIcon = (jenis) => {
    const icons = {
      'Rekam Medis': <FaFileMedical />,
      'Hasil Lab': <FaFlask />,
      'Vaksinasi': <FaSyringe />,
      'Resep Obat': <FaFilePdf />
    };
    return icons[jenis] || <FaStethoscope />;
  };

  if (loading) return <div className="text-center py-12"><div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Rekam Medis Saya</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center">
          <FaPlus className="mr-2" /> Tambah Rekam Medis
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Tambah Rekam Medis Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><label className="block text-gray-700 mb-2">Jenis Rekam Medis</label>
              <select value={formData.jenis_rekam} onChange={(e) => setFormData({...formData, jenis_rekam: e.target.value})} className="input-field">
                <option value="Rekam Medis">Rekam Medis</option>
                <option value="Hasil Lab">Hasil Lab</option>
                <option value="Vaksinasi">Vaksinasi</option>
                <option value="Resep Obat">Resep Obat</option>
              </select>
            </div>
            <div><label className="block text-gray-700 mb-2">Judul</label>
              <input type="text" value={formData.judul} onChange={(e) => setFormData({...formData, judul: e.target.value})} className="input-field" required /></div>
            <div><label className="block text-gray-700 mb-2">Deskripsi</label>
              <textarea rows="3" value={formData.deskripsi} onChange={(e) => setFormData({...formData, deskripsi: e.target.value})} className="input-field"></textarea></div>
            <div><label className="block text-gray-700 mb-2">Tanggal</label>
              <input type="date" value={formData.tanggal} onChange={(e) => setFormData({...formData, tanggal: e.target.value})} className="input-field" required /></div>
            <div className="flex space-x-3"><button type="submit" className="btn-primary">Simpan</button><button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Batal</button></div>
          </form>
        </div>
      )}

      {records.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl"><p className="text-gray-500">Belum ada rekam medis</p></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {records.map(record => (
            <div key={record.id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div className="flex items-center"><div className="text-blue-600 text-3xl mr-3">{getIcon(record.jenis_rekam)}</div>
                  <div><h3 className="font-semibold text-lg">{record.judul}</h3><p className="text-sm text-gray-500">{record.jenis_rekam}</p></div>
                </div>
                <button onClick={() => handleDelete(record.id)} className="text-red-500 hover:text-red-700"><FaTrash /></button>
              </div>
              <div className="mt-3"><p className="text-gray-600 text-sm">{record.deskripsi}</p></div>
              <div className="mt-4 flex justify-between items-center"><span className="text-sm text-gray-500">{format(new Date(record.tanggal), 'dd MMMM yyyy', { locale: id })}</span></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HealthRecords;
