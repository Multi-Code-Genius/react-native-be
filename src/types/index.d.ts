import "express";

declare global {
  namespace Express {
    interface Request {
      uploadedFile?: {
        url: string;
        file?: Express.Multer.File;
      };
    }
  }
}
