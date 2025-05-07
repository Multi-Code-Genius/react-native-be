import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { UserData } from "../types/user";

// Custom interface to extend Express Request type
// interface CustomRequest extends Request {
//   file?: Express.Multer.File;
//   uploadedFile?: {
//     url: string;
//   };
// }
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const id = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        messagesReceived: {
          where: {
            read: false,
          },
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_pic: true,
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_pic: true,
              },
            },
          },
        },
        videos: true,
        posts: true,
        sentRequests: {
          where: {
            status: "pending",
          },
          include: {
            receiver: {
              select: {
                id: true,
                name: true,
                profile_pic: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
        receivedRequests: {
          where: {
            status: "pending",
          },
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                profile_pic: true,
                isOnline: true,
                lastSeen: true,
              },
            },
          },
        },
        RoomUser: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const mutualFriends = await prisma.friend.findMany({
      where: {
        OR: [{ userId: id }, { friendId: id }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_pic: true,
            isOnline: true,
            email: true,
            location: true,
            lastSeen: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            profile_pic: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
    });

    const friendsData = mutualFriends.map((fr) => {
      const friendUser = fr.user.id === id ? fr.friend : fr.user;
      return {
        id: friendUser.id,
        data: friendUser,
      };
    });

    const friendIds = friendsData.map((f) => f.id);

    const allFriendRequests = await prisma.friendRequest.findMany({
      where: {
        OR: friendIds.flatMap((friendId) => [
          { senderId: id, receiverId: friendId },
          { senderId: friendId, receiverId: id },
        ]),
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
      },
    });

    const friendsWithRequestId = friendsData.map((friend) => {
      const request = allFriendRequests.find(
        (fr) =>
          (fr.senderId === id && fr.receiverId === friend.id) ||
          (fr.senderId === friend.id && fr.receiverId === id)
      );

      return {
        ...friend.data,
        friendRequestId: request?.id ?? null,
      };
    });

    const friends = Array.from(
      new Map(friendsWithRequestId.map((f) => [f.id, f])).values()
    );

    const fullUserData = {
      ...user,
      friends,
    };

    res.status(200).json({
      message: "User Data Fetched successfully.",
      user: fullUserData,
    });
  } catch (error: unknown) {
    console.error("User profile error:", error);
    res.status(500).json({
      message: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const UpdateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, location, mobileNumber, status, dob }: UserData =
      req.body;

    if (!req.user || !req.user.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const id = req.user.userId;

    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updateData: any = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (location) updateData.location = location;
    if (mobileNumber) updateData.mobileNumber = mobileNumber;
    if (status) updateData.status = status;

    if (dob) {
      const parsedDob = new Date(dob);
      if (isNaN(parsedDob.getTime())) {
        return res.status(400).json({ error: "Invalid date format for dob" });
      }
      updateData.dob = parsedDob;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error: any) {
    console.error(error);
    console.log("error", error);
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
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({ message: "User not found." });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error: unknown) {
    console.error("DeleteUser error:", error);
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Internal server error.",
    });
  }
};

interface UploadedFile {
  url: string;
  fileId: string;
  original: any;
}

interface CustomRequest extends Request {
  uploadedFiles?: UploadedFile[];
}

export const uploadProfilePicture = async (
  req: CustomRequest,
  res: Response
) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    // const imageUrl = req.uploadedFile?.url || req.file?.path;

    const uploadedFiles = req.uploadedFiles || [];
    const imagePaths = uploadedFiles.map((file: any) => file.url);

    const userId = req.params.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: { profile_pic: imagePaths[0] },
    } as any);

    res
      .status(200)
      .json({ message: "Profile Picture uploaded successfully", user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getAllUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const sent = await prisma.friendRequest.findMany({
      where: {
        senderId: userId,
      },
      select: { receiverId: true },
    });

    const received = await prisma.friendRequest.findMany({
      where: {
        receiverId: userId,
      },
      select: { senderId: true },
    });

    const sentIds = sent.map((req) => req.receiverId);
    const receivedIds = received.map((req) => req.senderId);

    const ids = [...sentIds, ...receivedIds, userId].filter(
      (id): id is string => typeof id === "string"
    );

    const excludeIds = Array.from(new Set(ids));

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: excludeIds,
        },
      },
      select: {
        id: true,
        name: true,
        profile_pic: true,
        email: true,
        dob: true,
        mobileNumber: true,
        status: true,
        location: true,
        isOnline: true,
        lastSeen: true,
      },
    });

    res.status(200).json({
      message: "Suggested users fetched successfully.",
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const getUserByid = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req?.user?.userId;
    const viewer = req.params.id;

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_pic: true,
              },
            },
          },
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_pic: true,
              },
            },
          },
        },
        videos: true,
        posts: true,
      },
    });

    const mutualFriends = await prisma.friend.findMany({
      where: {
        OR: [{ userId: viewer }, { friendId: viewer }],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_pic: true,
            isOnline: true,
            email: true,
            location: true,
            lastSeen: true,
          },
        },
        friend: {
          select: {
            id: true,
            name: true,
            email: true,
            location: true,
            profile_pic: true,
            isOnline: true,
            lastSeen: true,
          },
        },
      },
    });

    const friendsData = mutualFriends.map((fr) => {
      const friendUser = fr.user.id === viewer ? fr.friend : fr.user;
      return {
        id: friendUser.id,
        data: friendUser,
      };
    });

    const friendIds = friendsData.map((f) => f.id);

    const allFriendRequests = await prisma.friendRequest.findMany({
      where: {
        OR: friendIds.flatMap((friendId) => [
          { senderId: viewer, receiverId: friendId },
          { senderId: friendId, receiverId: viewer },
        ]),
      },
      select: {
        id: true,
        senderId: true,
        receiverId: true,
      },
    });

    const friendsWithRequestId = friendsData.map((friend) => {
      const request = allFriendRequests.find(
        (fr) =>
          (fr.senderId === viewer && fr.receiverId === friend.id) ||
          (fr.senderId === friend.id && fr.receiverId === viewer)
      );

      return {
        ...friend.data,
        friendRequestId: request?.id ?? null,
      };
    });

    const friends = Array.from(
      new Map(friendsWithRequestId.map((f) => [f.id, f])).values()
    );

    const fullUserData = {
      ...user,
      friends,
    };

    res.status(200).json({
      message: "User data fetched successfully.",
      user: fullUserData,
    });
  } catch (error) {
    console.error("Error fetching users:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const searchUser = async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: query,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile_pic: true,
      },
    });

    res.status(200).json({ message: "Search results", users });
  } catch (error) {
    console.error("Error fetching users:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    res.status(500).json({ message });
  }
};

export const pingOnline = async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) return res.status(400).json({ error: "User ID required" });

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        isOnline: true,
        lastSeen: new Date(),
      },
    });

    res.json({ status: "active" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

export const updateLocation = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { location } = req.body;

    if (!location) {
      res.status(401).json({ message: "Location Required" });
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const updateLocation: any = {};
    if (location) updateLocation.location = location;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateLocation,
    });

    res.status(200).json({
      message: "User Location updated successfully",
      user: updatedUser,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};
