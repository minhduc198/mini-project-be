import { Request, Response } from "express";
import { UploadService } from "./upload.service";

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const result = await UploadService.uploadImage(req.file);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }

  static async deleteImage(req: Request, res: Response) {
    try {
      const { path } = req.body as { path: string };

      if (!path) {
        return res.status(400).json({ message: "Path is required" });
      }

      await UploadService.deleteImage(path);
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Delete image failed",
      });
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { oldPath } = req.body as { oldPath: string };

      if (!oldPath) {
        return res.status(400).json({ message: "oldPath is required" });
      }

      const result = await UploadService.updateImage(oldPath, req.file);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Update image failed",
      });
    }
  }
}
