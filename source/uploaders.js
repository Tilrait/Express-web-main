import { extname } from "path";
import multer, { diskStorage } from "multer";

const uploadHandler = multer({
    storage: diskStorage({
        destination: './storage/uploaded',
        filename: (req, file, cb) => {
            const name = Date.now() + '.' + Math.round(Math.random() * 10000);
            const ext = extname(file.originalname);
            cb(null, name+ext)
        }
    }),
    limits: {
        fileSize: 1024 * 1024 * 10,
        files: 1,
        fields: 2
    }
});

const addendumUploader = uploadHandler.single("addendum");
export { addendumUploader };