import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const pasienRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "uploads/pasien");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar yang boleh!"), false);
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

pasienRouter.get("/healthRecords", async (req, res) => {
  try {
    const data = await prisma.infPasien.findMany();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

pasienRouter.post("/healthRecords", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newPasien = await prisma.infPasien.create({
      data: {
        namaLengkap: req.body.namaLengkap,
        password: hashedPassword,
        email: req.body.email,
        nik: req.body.nik,
        jenisKelamin: req.body.jenisKelamin,
        tanggalLahir: new Date(req.body.tanggalLahir),
        alamat: req.body.alamat,
        nomorTelepon: req.body.nomorTelepon,
      },
    });

    await prisma.authUser.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        role: "PASIEN",
        pasienId: newPasien.id,
      },
    });

    res.status(201).json(newPasien);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

pasienRouter.patch("/healthRecords/:id", async (req, res) => {
  try {
    const updated = await prisma.infPasien.update({
      where: { id: Number(req.params.id) },
      data: {
        ...req.body,
        tanggalLahir: req.body.tanggalLahir
          ? new Date(req.body.tanggalLahir)
          : undefined,
      },
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

pasienRouter.delete("/healthRecords/:id", async (req, res) => {
  try {
    await prisma.infPasien.delete({
      where: { id: Number(req.params.id) },
    });
    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: "Delete gagal" });
  }
});

const uploadHandler = (type) => async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "File wajib diupload" });
    if (!req.body.pasienId) return res.status(400).json({ error: "pasienId wajib diisi" });

    const result = await prisma.filePasien.create({
      data: {
        pasienId: Number(req.body.pasienId),
        jenisFile: type,
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });

    res.status(201).json({ message: `Upload ${type} berhasil`, data: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

pasienRouter.post("/ktppasien", upload.single("file"), uploadHandler("KTP"));
pasienRouter.post("/bpjspasien", upload.single("file"), uploadHandler("BPJS"));
pasienRouter.post("/selfiebpjspasien", upload.single("file"), uploadHandler("SELFIE_BPJS"));

export default pasienRouter;