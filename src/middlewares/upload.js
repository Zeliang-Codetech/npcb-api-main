import multer from "multer";
import multerS3 from "multer-s3-v2";
import { s3 } from "../services/s3.js";
import { nanoid } from "nanoid";
import path from "path";
const storageS3 = multerS3({
  s3: s3,
  bucket: process.env.AWS_BUCKET_NAME,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: function (req, file, cb) {
    cb(null, nanoid(20) + path.extname(file.originalname));
  },
  metadata: function (req, file, cb) {
    cb(null, { fieldName: "Meta_Data" });
  },
  // acl: "public-read",
  limits: {
    fileSize: 1024 * 1024 * 5, //  allowed only 5 MB files
  },
});
const upload = multer({
  storage: storageS3,
  limits: { fileSize: 1000000 * 5 },
});
export default upload;
