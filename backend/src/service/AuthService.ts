import prisma from "../../prisma/client";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export const AuthService = {
  register: async (username: string, password: string) => {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error("User sudah terdaftar");
    }

    const hashedPassword = await Bun.password.hash(password);

    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role: "admin",
      },
    });

    return {
      username: user.username,
      role: user.role,
    };
  },

  login: async (username: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || !(await Bun.password.verify(password, user.password))) {
      throw new Error("Username dan Password salah");
    }

    const accessToken = await new SignJWT({
      username: user.username,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(String(user.id_user))
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    return {
      accessToken,
      user: {
        username: user.username,
        role: user.role,
      },
    };
  },

  verifyToken: async (authHeader?: string) => {
    if (!authHeader?.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.slice(7).trim();

    if (!token) return null;

    try {
      const { payload } = await jwtVerify(token, secret);
      return payload;
    } catch {
      return null;
    }
  },
};
