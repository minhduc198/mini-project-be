import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { UploadImageResponse } from "./upload.type";

const BUCKET = "image";
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (_client) return _client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      `SUPABASE_URL=${url ? "OK" : "MISSING"}, SUPABASE_SERVICE_ROLE_KEY=${key ? "OK" : "MISSING"}`,
    );
  }

  _client = createClient(url, key);
  return _client;
}

export class UploadService {
  private static validateFile(file: Express.Multer.File) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new Error(
        `File type is not allowed. Only ${ALLOWED_MIME_TYPES.join(", ")} are accepted.`,
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File is too large, Maximum size is 5MB");
    }
  }

  static async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadImageResponse> {
    this.validateFile(file);

    const supabase = getClient();
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
    const supabase = getClient();
    const { error } = await supabase.storage.from(BUCKET).remove([path]);
    if (error) throw new Error(`Failed to delete image: ${error.message}`);
  }

  static async updateImage(
    oldPath: string,
    file: Express.Multer.File,
  ): Promise<UploadImageResponse> {
    const newImage = await this.uploadImage(file);
    try {
      await this.deleteImage(oldPath);
    } catch {
      console.warn(`Cannot delete old image at path ${oldPath}`);
    }
    return newImage;
  }
}
