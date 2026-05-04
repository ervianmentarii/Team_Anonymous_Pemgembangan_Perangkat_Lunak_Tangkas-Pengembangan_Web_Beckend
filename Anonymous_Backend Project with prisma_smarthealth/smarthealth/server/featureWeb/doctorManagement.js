import express from "express";
import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const doctorRouter = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadPath = path.join(__dirname, "uploads/doctors");
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

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

doctorRouter.get("/doctorManagement", async (req, res) => {
  try {
    const data = await prisma.infDokter.findMany({
      select: {
        id: true,
        namaLengkap: true,
        email: true,
        subSpesialisasi: true,
        nomorTelepon: true,
        mulaiPraktik: true,
      },
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
});

doctorRouter.post("/doctorManagement", async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newDoctor = await prisma.infDokter.create({
      data: {
        namaLengkap: req.body.namaLengkap,
        password: hashedPassword,
        subSpesialisasi: req.body.subSpesialisasi,
        nomorTelepon: req.body.nomorTelepon,
        email: req.body.email,
        mulaiPraktik: new Date(req.body.mulaiPraktik),
      },
    });

    await prisma.authUser.create({
      data: {
        email: req.body.email,
        password: hashedPassword,
        role: "DOKTER",
        dokterId: newDoctor.id,
      },
    });

    const { password, ...safeDoctor } = newDoctor;
    res.status(201).json(safeDoctor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

doctorRouter.patch("/doctorManagement/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);

      await prisma.authUser.update({
        where: { dokterId: Number(req.params.id) },
        data: { password: updateData.password },
      });
    }

    if (updateData.mulaiPraktik) {
      updateData.mulaiPraktik = new Date(updateData.mulaiPraktik);
    }

    const updated = await prisma.infDokter.update({
      where: { id: Number(req.params.id) },
      data: updateData,
    });

    const { password, ...safeData } = updated;
    res.json(safeData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

doctorRouter.delete("/doctorManagement/:id", async (req, res) => {
  try {
    await prisma.authUser.deleteMany({
      where: { dokterId: Number(req.params.id) },
    });

    await prisma.infDokter.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ message: "Data berhasil dihapus" });
  } catch (err) {
    res.status(400).json({ error: "Delete gagal" });
  }
});

const uploadHandler = (type) => async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "File wajib diupload" });
    }

    if (!req.body.dokterId) {
      return res.status(400).json({ error: "dokterId wajib diisi" });
    }

    const result = await prisma.fileDokter.create({
      data: {
        dokterId: Number(req.body.dokterId),
        jenisFile: type,
        filename: req.file.filename,
        filepath: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    });

    res.status(201).json({
      message: `Upload ${type} berhasil`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

doctorRouter.post("/ktpdokter", upload.single("file"), uploadHandler("KTP"));
doctorRouter.post("/lisensidokter", upload.single("file"), uploadHandler("LISENSI"));

export default doctorRouter;