import multer from "multer";
import { randomBytes } from "crypto";
import { Request } from "express";

const storageTypes = {
  local: multer.diskStorage({
    destination: `${process.cwd()}/public`,
    filename: (_: Request, file: Express.Multer.File, callback: any) => {
      randomBytes(16, (error: Error | null, hash: Buffer) => {
        if (error) callback(error, "");

        const key = `${hash.toString("hex")}-${file.originalname}`;
        callback(null, key);
      });
    }
  }),
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (_: Request, file: any, callback: any) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid fyle type"));
    }
  }
};

const multerConfig = {
  dest: `${process.cwd()}/public`,
  storage: storageTypes["local"],
  limits: {
    fileSize: 2 * 1024 * 1024
  },
  fileFilter: (_: Request, file: Express.Multer.File, callback: any) => {
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/gif"
    ];

    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"));
    }
  }
};

export default multerConfig;
