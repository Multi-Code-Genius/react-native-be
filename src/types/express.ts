import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
        name?: string;
        location?: {
          latitude: number;
          longitude: number;
        };
      };
      file?: Express.Multer.File;
    }
  }
}
