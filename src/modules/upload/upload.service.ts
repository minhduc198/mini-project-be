import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageResponse } from "./upload.type";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
);

const BUCKET = "IMAGE";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export class UploadService {
  private static validateFile(file: Express.Multer.File) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(
        `This file is not suitable. Only accept: ${ALLOWED_MIME_TYPES.join(", ")}`,
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Max file size is 5MB");
    }
  }

  static async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadImageResponse> {
    this.validateFile(file);

    const ext = file.originalname.split(".").pop();
    const fileName = `${uuidv4()}.${ext}`;

    const { data, error } = await supabase.storage
      .from(BUCKET)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(data.path);

    return {
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  }

  static async deleteImage(path: string): Promise<void> {
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(`Delete image failed: ${error.message}`);
  }

  static async updateImage(
    oldPath: string,
    file: Express.Multer.File,
  ): Promise<UploadImageResponse> {
    const newImage = await this.uploadImage(file);

    try {
      await this.deleteImage(oldPath);
    } catch {
      console.warn(`Delete old image failed at path: ${oldPath}`);
    }

    return newImage;
  }
}
