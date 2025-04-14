import { Request, Response } from "express";
import { prisma } from "../utils/prisma";

export const uploadPost = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const post = req.file?.path ?? "";

    const newPost = await prisma.post.create({
      data: {
        title,
        description,
        post,
        userId: req.user?.userId ?? ""
      }
    });

    res.status(200).json({ message: "Post uploaded", Post: newPost });
  } catch (error: any) {
    console.error("Post upload error:", error);
    res.status(500).json({ error: error.message || "Upload failed" });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const videos = await prisma.post.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile_pic: true
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
        }
      }
    });

    res.status(200).json({ message: " Post retrieved", videos });
  } catch (error: any) {
    console.error("Post Fetched error:", error);
    res.status(500).json({ error: error.message || "Get failed" });
  }
};

export const likePost = async (req: Request, res: Response) => {
  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: req.user?.userId ?? "",
          postId: req.params.id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: req.user?.userId ?? "",
            postId: req.params.id
          }
        }
      });

      res.status(200).json({ message: "Post disLiked" });
    } else {
      await prisma.like.create({
        data: {
          userId: req.user?.userId ?? "",
          postId: req.params.id
        }
      });

      res.status(200).json({ message: "Post liked" });
    }
  } catch (error: any) {
    console.error("Post like error:", error);
    res.status(500).json({ error: error.message || "Like failed" });
  }
};

export const commentsPost = async (req: Request, res: Response) => {
  try {
    await prisma.comment.create({
      data: {
        text: req.body.text,
        userId: req.user?.userId ?? "",
        postId: req.params.id
      }
    });

    res.status(200).json({ message: "Comment added" });
  } catch (error: any) {
    console.error("Post Comment error:", error);
    res.status(500).json({ error: error.message || "Comment failed" });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const video = await prisma.post.findUnique({
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

    res.status(200).json({ message: "Post Fetched", video });
  } catch (error: any) {
    console.error("Post Fetched error:", error);
    res.status(500).json({ error: error.message || "Post failed" });
  }
};
