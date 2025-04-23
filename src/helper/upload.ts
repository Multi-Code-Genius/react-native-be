import multer from "multer";
import path from "path";
import { imagekit } from "../utils/imageKit";

const memoryStorage = multer.memoryStorage();

const fileFilterFactory =
  (allowedMimes: string[]) =>
  (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type"));
    }
  };

const imageKitUploader = (folder: string, transform?: string) => {
  return async (req: any, res: any, next: any) => {
    if (!req.file) return next();

    const file = req.file;
    const buffer = file.buffer;
    const base64File = `data:${file.mimetype};base64,${buffer.toString(
      "base64"
    )}`;
    const nameWithoutExt = path.parse(file.originalname).name;
    const customName = `${folder}-${Date.now()}-${nameWithoutExt}`;

    try {
      const uploadResult = await imagekit.upload({
        file: base64File,
        fileName: customName,
        folder,
        useUniqueFileName: false
      });

      req.uploadedFile = {
        url: transform
          ? `${uploadResult.url}?tr=${transform}`
          : uploadResult.url,
        fileId: uploadResult.fileId,
        original: uploadResult
      };

      next();
    } catch (err) {
      next(err);
    }
  };
};

export const uploadVideo = multer({
  storage: memoryStorage,
  fileFilter: fileFilterFactory(["video/mp4", "video/webm", "video/quicktime"])
});

export const uploadProfile = multer({
  storage: memoryStorage,
  fileFilter: fileFilterFactory(["image/jpeg", "image/png"])
});

export const uploadPost = multer({
  storage: memoryStorage,
  fileFilter: fileFilterFactory(["image/jpeg", "image/png"])
});

export const uploadMessageImage = multer({
  storage: memoryStorage,
  fileFilter: fileFilterFactory([
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ])
});

export const handleUploadProfile = imageKitUploader(
  "profile-pics",
  "w-300,h-300,c-limit"
);
export const handleUploadPost = imageKitUploader(
  "post",
  "w-1080,h-1080,c-limit"
);
export const handleUploadMessageImage = imageKitUploader(
  "message-images",
  "w-1080,h-1080,c-limit"
);
export const handleUploadVideo = imageKitUploader("reels-videos");
