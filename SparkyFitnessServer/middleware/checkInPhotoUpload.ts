// @ts-expect-error TS(7016): Could not find a declaration file for module 'multer'
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createUploadMiddleware } from './uploadMiddleware.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getUploadDir = (userId: string, entryDate: string) => {
  const dir = path.join(
    __dirname,
    '..',
    'uploads',
    'check-in',
    userId,
    entryDate
  );
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

const checkInPhotoStorage = multer.diskStorage({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  destination: (req: any, _file: any, cb: any) => {
    const userId = req.userId as string;
    const entryDate = req.params.date as string;
    cb(null, getUploadDir(userId, entryDate));
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filename: (req: any, file: any, cb: any) => {
    const photoType = req.params.type as string;
    cb(null, `${photoType}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const checkInPhotoUpload = createUploadMiddleware(checkInPhotoStorage);
export default checkInPhotoUpload;
