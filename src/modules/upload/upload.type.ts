export interface UploadImageResponse {
  url: string;
  path: string;
}

export interface DeleteImageRequest {
  path: string;
}

export interface DeleteImageResponse {
  success: boolean;
}

export interface UpdateImageRequest {
  oldPath: string;
  file: Express.Multer.File;
}
