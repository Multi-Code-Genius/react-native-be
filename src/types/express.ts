import { Multer } from "multer";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email?: string;
        name?: string;
      };
      files?:
        | {
            [fieldname: string]: Multer.File[];
          }
        | Multer.File[];
    }
  }
}

export {};
