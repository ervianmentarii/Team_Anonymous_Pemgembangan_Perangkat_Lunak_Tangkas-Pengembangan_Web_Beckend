import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

dotenv.config();

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  throw new Error("EMAIL_USER and EMAIL_PASS must be set in .env");
}

const prisma = new PrismaClient();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const Notification = express.Router();

Notification.post("/notification", async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ message: "Semua field wajib diisi" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Admin Klinik" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial;">
          <h2>Pesan dari Admin</h2>
          <p>${message}</p>
        </div>
      `,
    });

    res.json({ message: "Email berhasil dikirim" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

Notification.get("/notification", async (req, res) => {
  try {
    const data = await prisma.infJanjiTemu.findMany({
      orderBy: { waktu_janji: "desc" },
    });

    res.json({
      message: "Get all success",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

Notification.get("/notification/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = await prisma.infJanjiTemu.findUnique({
      where: { id },
    });

    if (!data) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({
      message: "Get by id success",
      data,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default Notification;