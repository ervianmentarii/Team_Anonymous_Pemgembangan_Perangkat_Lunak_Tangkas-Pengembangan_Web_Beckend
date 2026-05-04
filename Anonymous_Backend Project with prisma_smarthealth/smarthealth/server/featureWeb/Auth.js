import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const Auth = express.Router();
const prisma = new PrismaClient();

Auth.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.authUser.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: _, ...safeUser } = user;

    res.json({
      message: "Login success",
      token,
      user: safeUser,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default Auth;