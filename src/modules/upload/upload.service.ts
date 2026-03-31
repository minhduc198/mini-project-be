import { Express } from "express";
import { supabase } from "../../config/supabase";

export const uploadImage = async (file: Express.Multer.File) => {
  const fileName = `${Date.now()}-${file.originalname}`;

  const { error } = await supabase.storage
    .from("IMAGE")
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
    });

  if (error) throw error;

  const { data } = supabase.storage.from("IMAGE").getPublicUrl(fileName);

  return data.publicUrl;
};
