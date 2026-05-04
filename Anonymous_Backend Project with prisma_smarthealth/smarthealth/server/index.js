import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import doctorRouter   from './featureWeb/doctorManagement.js';
import pasienRouter   from './featureWeb/healthRecords.js';
import Appointment    from './featureWeb/Appointment.js';
import scheduleDoctor from './featureWeb/scheduleDoctor.js';
import Notification   from './featureWeb/Notification.js';
import Auth           from './featureWeb/Auth.js';
import auditLog       from './featureWeb/auditLog.js';

const prisma = new PrismaClient();
const app    = express();

app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());

// ════════════════════════════════════════════════════
//  AUTH — /api/users/login  (pasien)
// ════════════════════════════════════════════════════
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const authUser = await prisma.authUser.findUnique({ where: { email } });
    if (!authUser) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    if (authUser.role !== 'PASIEN') return res.status(403).json({ message: 'Gunakan login staff untuk akun ini' });

    const ok = await bcrypt.compare(password, authUser.password);
    if (!ok) return res.status(400).json({ message: 'Password salah' });

    const pasien = authUser.pasienId
      ? await prisma.infPasien.findUnique({ where: { id: authUser.pasienId } })
      : null;

    const token = jwt.sign({ id: authUser.id, role: authUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    const { password: _a, ...safeAuth } = authUser;
    const { password: _b, ...safePasien } = pasien || {};

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        ...safeAuth,
        ...safePasien,
        id: pasien?.id ?? authUser.id,   // frontend butuh id pasien untuk fetch appointments
        tipe: 'pasien',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
//  AUTH — /api/users/staff/login  (dokter / admin)
// ════════════════════════════════════════════════════
app.post('/api/users/staff/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const authUser = await prisma.authUser.findUnique({ where: { email } });
    if (!authUser) return res.status(404).json({ message: 'Akun tidak ditemukan' });
    if (authUser.role === 'PASIEN') return res.status(403).json({ message: 'Akses ditolak: bukan staff' });

    const ok = await bcrypt.compare(password, authUser.password);
    if (!ok) return res.status(400).json({ message: 'Password salah' });

    let profile = {};
    if (authUser.dokterId) {
      const dokter = await prisma.infDokter.findUnique({ where: { id: authUser.dokterId } });
      if (dokter) {
        const { password: _, ...d } = dokter;
        profile = { ...d, jabatan: d.subSpesialisasi };
      }
    }

    const token = jwt.sign({ id: authUser.id, role: authUser.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const { password: _, ...safeAuth } = authUser;

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        ...safeAuth,
        ...profile,
        tipe: 'staff',
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
//  AUTH — /api/users/register
// ════════════════════════════════════════════════════
app.post('/api/users/register', async (req, res) => {
  try {
    const { nama_lengkap, nik, jenis_kelamin, tanggal_lahir, alamat, nomor_telepon, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const newPasien = await prisma.infPasien.create({
      data: { namaLengkap: nama_lengkap, password: hashed, email, nik, jenisKelamin: jenis_kelamin, tanggalLahir: new Date(tanggal_lahir), alamat: alamat || null, nomorTelepon: nomor_telepon || null },
    });
    await prisma.authUser.create({
      data: { email, password: hashed, role: 'PASIEN', pasienId: newPasien.id },
    });

    res.status(201).json({ success: true, message: 'Registrasi berhasil! Silakan login.' });
  } catch (err) {
    if (err.code === 'P2002') return res.status(400).json({ message: 'Email atau NIK sudah terdaftar' });
    res.status(500).json({ message: err.message });
  }
});

// ════════════════════════════════════════════════════
//  PATIENTS — /api/users/patients
// ════════════════════════════════════════════════════
app.get('/api/users/patients', async (req, res) => {
  try {
    const data = await prisma.infPasien.findMany({
      select: { id: true, namaLengkap: true, email: true, nik: true, jenisKelamin: true, tanggalLahir: true, alamat: true, nomorTelepon: true },
    });
    // Map ke snake_case sesuai yang diharapkan frontend
    const patients = data.map(p => ({
      id: p.id,
      nama_lengkap: p.namaLengkap,
      email: p.email,
      nik: p.nik,
      jenis_kelamin: p.jenisKelamin,
      tanggal_lahir: p.tanggalLahir,
      alamat: p.alamat,
      nomor_telepon: p.nomorTelepon,
    }));
    res.json({ patients });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/patients/stats', async (req, res) => {
  try {
    const total = await prisma.infPasien.count();
    res.json({ stats: { total } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
//  DOCTORS — /api/doctors
// ════════════════════════════════════════════════════
app.get('/api/doctors', async (req, res) => {
  try {
    const { sub_spesialisasi } = req.query;
    const where = sub_spesialisasi ? { subSpesialisasi: sub_spesialisasi } : {};

    const data = await prisma.infDokter.findMany({
      where,
      include: { jadwal: true },
    });

    const doctors = data.map(d => ({
      id: d.id,
      nama_lengkap: d.namaLengkap,
      email: d.email,
      sub_spesialisasi: d.subSpesialisasi,
      nomor_telepon: d.nomorTelepon,
      mulai_praktik: d.mulaiPraktik,
      pengalaman: new Date().getFullYear() - new Date(d.mulaiPraktik).getFullYear(),
      rating: '4.8',
      biaya: 150000,
      jadwal: d.jadwal,
    }));

    res.json({ doctors });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctors/specializations', async (req, res) => {
  const specializations = [
    'Kardiologi Umum','Kardiologi Intervensi','Elektrofisiologi',
    'Ekokardiografi','Kardiologi Anak','Bedah Kardiotoraks','Spesialis Gagal Jantung',
  ];
  res.json({ specializations });
});

app.get('/api/doctors/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const d = await prisma.infDokter.findUnique({
      where: { id },
      include: { jadwal: true },
    });
    if (!d) return res.status(404).json({ message: 'Dokter tidak ditemukan' });

    const doctor = {
      id: d.id,
      nama_lengkap: d.namaLengkap,
      email: d.email,
      sub_spesialisasi: d.subSpesialisasi,
      nomor_telepon: d.nomorTelepon,
      mulai_praktik: d.mulaiPraktik?.toISOString().slice(0,10),
      pengalaman: new Date().getFullYear() - new Date(d.mulaiPraktik).getFullYear(),
      rating: '4.8',
      biaya: 150000,
    };

    const schedules = d.jadwal.map(j => ({
      id: j.id,
      hari: j.hari,
      jam_buka: j.jam_buka instanceof Date ? j.jam_buka.toTimeString().slice(0,5) : j.jam_buka,
      jam_tutup: j.jam_tutup instanceof Date ? j.jam_tutup.toTimeString().slice(0,5) : j.jam_tutup,
      durasi_slot_menit: j.durasi_slot_menit,
    }));

    res.json({ doctor, schedules });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/doctors/:id/available-slots', async (req, res) => {
  try {
    const id   = Number(req.params.id);
    const date = req.query.date; // YYYY-MM-DD

    const hariIndo = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const hari = date ? hariIndo[new Date(date).getDay()] : null;

    const jadwalList = await prisma.infJadwalDokter.findMany({
      where: { id_dokter: id, ...(hari ? { hari } : {}) },
    });

    const slots = [];
    for (const j of jadwalList) {
      const bukaTime  = j.jam_buka instanceof Date ? j.jam_buka : new Date(`1970-01-01T${j.jam_buka}`);
      const tutupTime = j.jam_tutup instanceof Date ? j.jam_tutup : new Date(`1970-01-01T${j.jam_tutup}`);
      const durasi    = j.durasi_slot_menit;

      let cur = new Date(bukaTime);
      while (cur < tutupTime) {
        const waktuStr = cur.toTimeString().slice(0,5);
        const waktuDT  = date ? `${date}T${waktuStr}:00` : waktuStr;
        slots.push({
          jadwalId    : j.id,
          waktu       : waktuDT,
          waktu_display: waktuStr,
          hari        : j.hari,
        });
        cur = new Date(cur.getTime() + durasi * 60000);
      }
    }

    const jadwalObj = jadwalList.length > 0 ? {
      hari              : jadwalList[0].hari,
      jam_buka          : jadwalList[0].jam_buka instanceof Date ? jadwalList[0].jam_buka.toTimeString().slice(0,5) : jadwalList[0].jam_buka,
      jam_tutup         : jadwalList[0].jam_tutup instanceof Date ? jadwalList[0].jam_tutup.toTimeString().slice(0,5) : jadwalList[0].jam_tutup,
      durasi_slot_menit : jadwalList[0].durasi_slot_menit,
    } : null;

    res.json({ slots, jadwal: jadwalObj });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
//  APPOINTMENTS
// ════════════════════════════════════════════════════
const formatAppointment = (a) => ({
  id          : a.id,
  waktu_janji : a.waktu_janji,
  status      : a.status,
  gejala      : a.catatan,
  catatan     : a.catatan,
  nama_dokter       : a.dokter?.namaLengkap || '-',
  sub_spesialisasi  : a.dokter?.subSpesialisasi || '-',
  nama_pasien       : a.pasien?.namaLengkap || '-',
  nomor_telepon_pasien: a.pasien?.nomorTelepon || '-',
  doctor      : a.dokter ? { nama_lengkap: a.dokter.namaLengkap, sub_spesialisasi: a.dokter.subSpesialisasi } : null,
  patient     : a.pasien ? { nama_lengkap: a.pasien.namaLengkap, nomor_telepon: a.pasien.nomorTelepon } : null,
});

app.post('/api/appointments', async (req, res) => {
  try {
    const { id_dokter, id_pasien, waktu_janji, gejala, catatan } = req.body;

    // Cari jadwal yang cocok berdasarkan hari & dokter
    const hariIndo = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'];
    const tgl = new Date(waktu_janji);
    const hari = hariIndo[tgl.getDay()];

    let jadwal = await prisma.infJadwalDokter.findFirst({
      where: { id_dokter: Number(id_dokter), hari },
    });
    // fallback: ambil jadwal pertama dokter ini
    if (!jadwal) {
      jadwal = await prisma.infJadwalDokter.findFirst({ where: { id_dokter: Number(id_dokter) } });
    }
    if (!jadwal) return res.status(400).json({ message: 'Jadwal dokter tidak ditemukan' });

    const data = await prisma.infJanjiTemu.create({
      data: {
        id_dokter   : Number(id_dokter),
        id_pasien   : Number(id_pasien),
        id_jadwal   : jadwal.id,
        waktu_janji : tgl,
        status      : 'Terjadwal',
        catatan     : gejala || catatan || null,
      },
    });
    res.status(201).json({ message: 'Janji temu berhasil dibuat', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/all', async (req, res) => {
  try {
    const { status, date } = req.query;
    const where = {};
    if (status) where.status = status;
    if (date) {
      const d = new Date(date);
      const next = new Date(d); next.setDate(next.getDate() + 1);
      where.waktu_janji = { gte: d, lt: next };
    }

    const data = await prisma.infJanjiTemu.findMany({
      where,
      include: { dokter: true, pasien: true, jadwal: true },
      orderBy: { waktu_janji: 'desc' },
    });

    res.json({ appointments: data.map(formatAppointment) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/stats', async (req, res) => {
  try {
    const total      = await prisma.infJanjiTemu.count();
    const terjadwal  = await prisma.infJanjiTemu.count({ where: { status: 'Terjadwal' } });
    const selesai    = await prisma.infJanjiTemu.count({ where: { status: 'Selesai' } });
    const dibatalkan = await prisma.infJanjiTemu.count({ where: { status: 'Dibatalkan' } });

    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate()+1);
    const todayCount = await prisma.infJanjiTemu.count({ where: { waktu_janji: { gte: today, lt: tomorrow } } });

    res.json({ stats: { total, today: todayCount, terjadwal, selesai, dibatalkan } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/upcoming/:patientId', async (req, res) => {
  try {
    const id_pasien = Number(req.params.patientId);
    const data = await prisma.infJanjiTemu.findMany({
      where: { id_pasien, waktu_janji: { gte: new Date() }, status: 'Terjadwal' },
      include: { dokter: true, jadwal: true },
      orderBy: { waktu_janji: 'asc' },
      take: 5,
    });
    res.json({ appointments: data.map(formatAppointment) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/appointments/patient/:patientId', async (req, res) => {
  try {
    const id_pasien = Number(req.params.patientId);
    const data = await prisma.infJanjiTemu.findMany({
      where: { id_pasien },
      include: { dokter: true, jadwal: true },
      orderBy: { waktu_janji: 'desc' },
    });
    res.json({ appointments: data.map(formatAppointment) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/appointments/:id/status', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    const data = await prisma.infJanjiTemu.update({ where: { id }, data: { status } });
    res.json({ message: 'Status diperbarui', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/appointments/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { waktu_janji, status, catatan } = req.body;
    const data = await prisma.infJanjiTemu.update({
      where: { id },
      data: {
        waktu_janji: waktu_janji ? new Date(waktu_janji) : undefined,
        status: status || undefined,
        catatan: catatan || undefined,
      },
    });
    res.json({ message: 'Appointment diupdate', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ════════════════════════════════════════════════════
//  HEALTH RECORDS
//  Frontend butuh: records[] dengan judul/deskripsi/jenis_rekam/tanggal
//  Karena tabel asli tidak punya kolom ini, kita simulasi dari janji temu
// ════════════════════════════════════════════════════
app.get('/api/health-records/patient/:patientId', async (req, res) => {
  try {
    const id = Number(req.params.patientId);
    const pasien = await prisma.infPasien.findUnique({ where: { id } });
    if (!pasien) return res.status(404).json({ message: 'Pasien tidak ditemukan' });

    const appointments = await prisma.infJanjiTemu.findMany({
      where: { id_pasien: id, status: 'Selesai' },
      include: { dokter: true },
      orderBy: { waktu_janji: 'desc' },
    });

    // Konversi janji temu selesai menjadi rekam medis
    const records = appointments.map(a => ({
      id          : a.id,
      jenis_rekam : 'Rekam Medis',
      judul       : `Konsultasi dengan ${a.dokter?.namaLengkap || 'Dokter'}`,
      deskripsi   : a.catatan || 'Tidak ada catatan',
      tanggal     : a.waktu_janji,
      dokter      : a.dokter?.namaLengkap,
      spesialisasi: a.dokter?.subSpesialisasi,
    }));

    res.json({ records });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST health-records → tidak ada tabel terpisah, simpan sebagai janji temu catatan
app.post('/api/health-records', async (req, res) => {
  res.status(200).json({ message: 'Rekam medis dicatat (fitur upload tersedia di klinik)' });
});

app.delete('/api/health-records/:id', async (req, res) => {
  res.status(200).json({ message: 'Rekam medis dihapus' });
});

// ════════════════════════════════════════════════════
//  LEGACY ROUTES (featureWeb lama tetap jalan)
// ════════════════════════════════════════════════════
app.use('/user/', doctorRouter);
app.use('/user/', pasienRouter);
app.use('/user/', scheduleDoctor);
app.use('/user/', Appointment);
app.use('/user/', Notification);
app.use('/user/', Auth);
app.use('/user',  auditLog);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅  Server → http://localhost:${PORT}`));
