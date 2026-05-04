import express from "express";
import { PrismaClient } from "@prisma/client";

const auditLog = express.Router();
const prisma = new PrismaClient();

auditLog.post("/audit", async (req, res) => {
  try {
    const { dokterId, pasienId, status, catatan } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "status wajib diisi",
      });
    }

    const log = await prisma.auditLog.create({
      data: {
        dokterId: dokterId ?? null,
        pasienId: pasienId ?? null,
        status,
        catatan: catatan ?? null,
      },
    });

    res.status(201).json({
      message: "Audit log berhasil dibuat",
      data: log,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});


auditLog.get("/audit", async (req, res) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        dokter: true,
        pasien: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

auditLog.get("/audit/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const log = await prisma.auditLog.findUnique({
      where: { id },
      include: {
        dokter: true,
        pasien: true,
      },
    });

    if (!log) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

auditLog.patch("/audit/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status, catatan } = req.body;

    const updated = await prisma.auditLog.update({
      where: { id },
      data: {
        status,
        catatan,
      },
    });

    res.json({
      message: "Audit log berhasil diupdate",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

auditLog.delete("/audit/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.auditLog.delete({
      where: { id },
    });

    res.json({
      message: "Audit log berhasil dihapus",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default auditLog;