import { Request } from "express";

export type UserData = {
  id: string;
  email: string;
  password: string;
  name: string;
  profile_pic?: string;
  mobileNumber?: string;
  location?: string;
  status?: string;
  dob: Date;
};

export interface CustomRequest extends Request {
  file?: Express.Multer.File;
  uploadedFile?: {
    url: string;
  };
}
