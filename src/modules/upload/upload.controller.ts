import { Request, Response } from "express";
import { UploadService } from "./upload.service";

export class UploadController {
  static async uploadImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file upload" });
      }
      const result = await UploadService.uploadImage(req.file);
      return res.status(200).json(result);
    } catch (error) {
      // Log ra Render logs để debug
      console.error("[UPLOAD] uploadImage error:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to upload image",
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
      console.error("[UPLOAD] deleteImage error:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to delete image",
      });
    }
  }

  static async updateImage(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file upload" });
      }
      const { oldPath } = req.body as { oldPath: string };
      if (!oldPath) {
        return res.status(400).json({ message: "oldPath is required" });
      }
      const result = await UploadService.updateImage(oldPath, req.file);
      return res.status(200).json(result);
    } catch (error) {
      console.error("[UPLOAD] updateImage error:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to update image",
      });
    }
  }
}
