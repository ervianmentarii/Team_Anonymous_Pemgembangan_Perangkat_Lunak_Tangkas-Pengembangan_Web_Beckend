import express from "express";
import { PrismaClient } from "@prisma/client";

const Appointment = express.Router();
const prisma = new PrismaClient();

Appointment.post("/appointments", async (req, res) => {
  try {
    const {
      id_dokter,
      id_pasien,
      id_jadwal,
      waktu_janji,
      catatan,
    } = req.body;

    if (!id_dokter || !id_pasien || !id_jadwal || !waktu_janji) {
      return res.status(400).json({
        message: "Field wajib belum lengkap",
      });
    }

    const appointment = await prisma.infJanjiTemu.create({
      data: {
        id_dokter: Number(id_dokter),
        id_pasien: Number(id_pasien),
        id_jadwal: Number(id_jadwal),
        waktu_janji: new Date(waktu_janji),
        catatan: catatan || null,
        
      },
    });

    res.status(201).json({
      message: "Appointment berhasil dibuat",
      data: appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
});

Appointment.get("/appointments", async (req, res) => {
  try {
    const data = await prisma.infJanjiTemu.findMany({
      include: {
        dokter: true,
        pasien: true,
        jadwal: true,
      },
    });

    res.json({
      message: "Data appointment",
      data,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

Appointment.get("/appointments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.infJanjiTemu.findUnique({
      where: { id },
      include: {
        dokter: true,
        pasien: true,
        jadwal: true,
      },
    });

    if (!data) {
      return res.status(404).json({
        message: "Appointment tidak ditemukan",
      });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

Appointment.patch("/appointments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { waktu_janji, status, catatan } = req.body;

    const updated = await prisma.infJanjiTemu.update({
      where: { id },
      data: {
        waktu_janji: waktu_janji ? new Date(waktu_janji) : undefined,
        status: status || undefined,
        catatan: catatan || undefined,
      },
    });

    res.json({
      message: "Appointment berhasil diupdate",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

Appointment.delete("/appointments/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.infJanjiTemu.delete({
      where: { id },
    });

    res.json({
      message: "Appointment berhasil dihapus",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

export default Appointment;