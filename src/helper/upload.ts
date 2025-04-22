import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary";
import path from "path";

const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "auto",
    folder: "profile-pics",
    allowed_formats: ["jpg", "png"],
    transformation: [{ width: 300, height: 300, crop: "limit" }]
  } as any
});

const postStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "auto",
    folder: "post",
    allowed_formats: ["jpg", "png"],
    transformation: [{ width: 1080, height: 1080, crop: "limit" }]
  } as any
});

const messageImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "auto",
    folder: "message-images",
    allowed_formats: ["jpg", "png", "gif", "jpeg", "webp"],
    transformation: [{ width: 1080, height: 1080, crop: "limit" }]
  } as any
});

const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    resource_type: "video",
    folder: "reels-videos",
    allowed_formats: ["mp4", "mov", "webm"],
    public_id: (req: unknown, file: { originalname: string }) => {
      const nameWithoutExt = path.parse(file.originalname).name;
      return `video-${Date.now()}-${nameWithoutExt}`;
    }
  } as any
});

export const uploadVideo = multer({ storage: videoStorage });
export const uploadProfile = multer({ storage: profileStorage });
export const uploadPost = multer({ storage: postStorage });
export const uploadMessageImage = multer({ storage: messageImageStorage });
