// imagekit.config.ts
import ImageKit from "imagekit";
import {
  IMAGE_ENDPOINT,
  IMAGEPRIVETE_API_KEY,
  IMAGEPUBLIC_API_KEY
} from "../config/env";

export const imagekit = new ImageKit({
  publicKey: IMAGEPUBLIC_API_KEY!,
  privateKey: IMAGEPRIVETE_API_KEY!,
  urlEndpoint: IMAGE_ENDPOINT!
});
