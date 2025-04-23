import { Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { CustomRequest } from "../types/user";

export const uploadVideos = async (req: CustomRequest, res: Response) => {
  try {
    const { title, description } = req.body;
    const videoUrl = req.uploadedFile?.url || req.file?.path || "";
    const thumbnail = videoUrl
      .replace("/upload/", "/upload/so_1,c_fill,w_300,h_300/")
      .replace(/\.(webm|mp4|mov)$/, ".jpg");

    const newVideo = await prisma.video.create({
      data: {
        title,
        description,
        thumbnail,
        videoUrl,
        userId: req.user?.userId ?? ""
      }
    });

    res.status(200).json({ message: "Video uploaded", video: newVideo });
  } catch (error: any) {
    console.error("Video upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
};

export const getVideos = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const videos = await prisma.video.findMany({
      skip,
      take: Number(limit),
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, profile_pic: true } },
        comments: {
          include: {
            user: { select: { id: true, name: true, profile_pic: true } }
          }
        },
        likes: {
          include: {
            user: { select: { id: true, name: true, profile_pic: true } }
          }
        }
      }
    });

    res.status(200).json({ videos });
  } catch (error: any) {
    console.error("Video fetch error:", error);
    res.status(500).json({ error: error.message || "Failed to fetch videos" });
  }
};

export const likeVideos = async (req: Request, res: Response) => {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_videoId: {
          userId: req.user?.userId ?? "",
          videoId: req.params.id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_videoId: {
            userId: req.user?.userId ?? "",
            videoId: req.params.id
          }
        }
      });

      res.status(200).json({ message: "Video disLiked" });
    } else {
      await prisma.like.create({
        data: {
          userId: req.user?.userId ?? "",
          videoId: req.params.id
        }
      });

      res.status(200).json({ message: "Video liked" });
    }
  } catch (error: any) {
    console.error("Video like error:", error);
    res.status(500).json({ error: error.message || "Like failed" });
  }
};

export const commentsVideos = async (req: Request, res: Response) => {
  try {
    await prisma.comment.create({
      data: {
        text: req.body.text,
        userId: req.user?.userId ?? "",
        videoId: req.params.id
      }
    });

    res.status(200).json({ message: "Comment added" });
  } catch (error: any) {
    console.error("Video Comment error:", error);
    res.status(500).json({ error: error.message || "Comment failed" });
  }
};

export const getVideoById = async (req: Request, res: Response) => {
  try {
    const video = await prisma.video.findUnique({
      where: { id: req.params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_pic: true
          }
        },
        likes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_pic: true
              }
            }
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profile_pic: true
              }
            }
          }
        }
      }
    });

    res.status(200).json({ message: "Video Fetched", video });
  } catch (error: any) {
    console.error("Video Fetched error:", error);
    res.status(500).json({ error: error.message || "video failed" });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  const { videoId } = req.params;

  try {
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { videoId } }),
      prisma.like.deleteMany({ where: { videoId } }),
      prisma.video.delete({ where: { id: videoId } })
    ]);

    return res
      .status(200)
      .json({ message: "Video and related data deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to delete video" });
  }
};
