const multer = require("multer");

const myStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/");
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.split(".").pop();
    let filename = Date.now() + "." + ext;
    cb(null, filename);
  },
});

const imageFilter = (req, file, cb) => {
  let ext = file.originalname.split(".").pop();
  let allowed = ["jpg", "jpeg", "png", "gif", "svg", "bmp", "webp"];
  if (allowed.includes(ext.toLowerCase())) {
    cb(null, true);
  } else {
    cb({ status: 400, msg: "Image not supported" });
  }
};

const uploader = multer({
  storage: myStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5000000,
  },
});

module.exports = uploader.single("image");
