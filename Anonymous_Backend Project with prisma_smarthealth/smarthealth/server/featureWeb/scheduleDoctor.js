import express from "express";
import { PrismaClient } from "@prisma/client";

const scheduleDoctor = express.Router();
const prisma = new PrismaClient();

scheduleDoctor.post("/scheduleDoctor", async (req, res) => {
  try {
    const {
      id_dokter,
      hari,
      jam_buka,
      jam_tutup,
      durasi_slot_menit,
    } = req.body;

    if (!id_dokter || !hari || !jam_buka || !jam_tutup || !durasi_slot_menit) {
      return res.status(400).json({
        message: "Field wajib belum lengkap",
      });
    }

    const jadwal = await prisma.infJadwalDokter.create({
      data: {
        id_dokter: Number(id_dokter),
        hari,
        jam_buka: new Date(jam_buka),
        jam_tutup: new Date(jam_tutup),
        durasi_slot_menit: Number(durasi_slot_menit),
      },
    });

    res.status(201).json({
      message: "Jadwal dokter berhasil dibuat",
      data: jadwal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error server",
      error: error.message,
    });
  }
});

scheduleDoctor.get("/scheduleDoctor", async (req, res) => {
  try {
    const data = await prisma.infJadwalDokter.findMany({
      include: {
        dokter: true,
      },
    });

    res.json({
      message: "Data jadwal dokter",
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

scheduleDoctor.get("/scheduleDoctor/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.infJadwalDokter.findUnique({
      where: { id },
      include: {
        dokter: true,
        janjiTemu: true,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Jadwal tidak ditemukan",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

scheduleDoctor.patch("/scheduleDoctor/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      hari,
      jam_buka,
      jam_tutup,
      durasi_slot_menit,
    } = req.body;

    const updated = await prisma.infJadwalDokter.update({
      where: { id },
      data: {
        hari: hari || undefined,
        jam_buka: jam_buka ? new Date(jam_buka) : undefined,
        jam_tutup: jam_tutup ? new Date(jam_tutup) : undefined,
        durasi_slot_menit: durasi_slot_menit
          ? Number(durasi_slot_menit)
          : undefined,
      },
    });

    res.json({
      message: "Jadwal berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

scheduleDoctor.delete("/scheduleDoctor/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.infJadwalDokter.delete({
      where: { id },
    });

    res.json({
      message: "Jadwal berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default scheduleDoctor;