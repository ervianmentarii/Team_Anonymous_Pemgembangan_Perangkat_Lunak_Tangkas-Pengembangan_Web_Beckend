import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();

const prisma = new PrismaClient();
const app = express();

router.get("/informasidokter",async (req,res)=>{
    const allUser=await prisma.user.findMany()
    res.send(allUser)
});

router.post("/registerdokter",async (req,res)=>{
    const {namaLengkap,subSpesialisasi,email,nomorTelepon,mulaiPraktik,jadwal,janjiTemu}=req.body;
   try{
    const allUser=await prisma.user.create({
        data:{
            namaLengkap,subSpesialisasi,email,nomorTelepon,mulaiPraktik,jadwal,janjiTemu
        },

    })
    res.status(200)}
    catch(err){
        res.send(400).json({err:"Input Data Dokter Error Silahkan coba lagi."});
    }
});

router.patch("/updatedatadokter/:id",(req,res)=>{
    const {id,email}=req.params.id;
    let resultSearch={};
    const {namaLengkap,subSpesialisasi,email,nomorTelepon,mulaiPraktik,jadwal,janjiTemu}=req.body;

    if (id) {
    searchCriteria = { id: Number(id) };
    } else if (email) {
    searchCriteria = { email: email };
    } else {
    return res.status(400).json({ error: "Harus menyertakan ID atau Email untuk update" });
    }
    try {
    const updatedUser = await prisma.user.update({
      where: resultSearch,
      data: {  
        namaLengkap,subSpesialisasi,email,nomorTelepon,mulaiPraktik,jadwal,janjiTemu
      }
    });
    }
    catch(err){
        res.send(400).json({err:"Update Data Dokter Error Silahkan coba lagi."});
    }
});

module.exports = router;