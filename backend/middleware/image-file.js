const multer = require('multer');

// Supported MimeTypes for images
const MIME_TYPE_MAP = {
  'image/png'  : 'png'  ,
  'image/jpeg' : 'jpeg' ,
  'image/jpg'  : 'jpg'
}

// Disk storage for images by Multer
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValidExt = MIME_TYPE_MAP[file.mimetype];
    let error = null;
    if (! isValidExt) {
      error = new Error("Unsupported File (invalid MimeType)");
    }
    // cb(error, path.join(__dirname, '../images'));
    const imagesDir = 'images';
    cb(error, imagesDir);
  },
  filename: (req, file, cb) => {
    // replace spaces by _ and remove the file extension if any
    const filename = file.originalname.toLowerCase().split(' ').join('_').replace(/\.[^.$]+$/, '');
    const fileext = MIME_TYPE_MAP[file.mimetype]; // select the extension
    const uniqueFilename = filename + '_' + Date.now() + '.' + fileext;
    cb(null, uniqueFilename);
    // console.log("imageStorage: uniqueFilename="+uniqueFilename); // DEBUG
  }
});


module.exports = multer({storage: imageStorage}).single("image");
