import { extname } from 'path';

export const imageFileFilter = (req, file, callback) => {
  console.log("file.originalname",file.originalname);
  if (
    !file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf)$/)
  ) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};
