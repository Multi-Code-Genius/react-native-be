import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import bcrypt from "bcryptjs";
import { UserData } from "../types/user";

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = req.user.userId;
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    console.log("user", user);
    res.status(200).json({ message: "User Data Fetched successfully.", user });
  } catch (error: unknown) {
    console.error("user error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error"
    });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password }: UserData = req.body;

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = req.user.userId;

    const existingUser = await prisma.user.findUnique({
      where: { id }
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error(error);
    if (error.code === "P2002") {
      res.status(400).json({ message: "Email already in use" });
      return;
    }
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error: unknown) {
    console.error("DeleteUser error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error."
    });
  }
};

export const uploadProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const imageUrl = req.file.path;
    const userId = req.params.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profile_pic: imageUrl }
    } as any);

    res.json({ success: true, imageUrl, user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    });
  }
};
