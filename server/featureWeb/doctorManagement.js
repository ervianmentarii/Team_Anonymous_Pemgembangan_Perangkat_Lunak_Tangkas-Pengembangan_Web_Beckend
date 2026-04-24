import express from 'express';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const doctorUserrouter = express.Router();

doctorUserrouter.get("/informasidokter", async (req, res) => {
  try {
    const allUser = await prisma.infDokter.findMany();
    res.json(allUser);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

doctorUserrouter.post("/registerdokter", async (req, res) => {
  const { namaLengkap, subSpesialisasi, email, nomorTelepon, mulaiPraktik } = req.body;
  
  try {
    const newUser = await prisma.infDokter.create({
      data: { namaLengkap, subSpesialisasi, email, nomorTelepon, mulaiPraktik }
    });
    res.status(201).json(newUser).send("Input Data Dokter Error");
  } catch (err) {
    res.status(400).json({ error:err.message });
  }
});

doctorUserrouter.patch("/updatedatadokter/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedUser = await prisma.infDokter.update({
      where: { id: Number(id) },
      data: req.body
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: "Update gagal" });
  }
});

doctorUserrouter.delete("/deletedatadokter/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.infDokter.delete({ where: { id: Number(id) } });
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: "Delete gagal" });
  }
});

export default doctorUserrouter;