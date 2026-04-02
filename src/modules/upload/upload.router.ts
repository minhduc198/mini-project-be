import { Router } from "express";
import multer from "multer";
import { UploadController } from "./upload.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Loại file không hợp lệ"));
    }
  },
});

router.post("/", upload.single("file"), UploadController.uploadImage);

router.put("/", upload.single("file"), UploadController.updateImage);

router.delete("/", UploadController.deleteImage);

export default router;
