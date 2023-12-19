const router = require("express").Router();
const authCheck = require("../middleware/auth.middleware");
const uploader = require("../middleware/uploader.middleware");
const profileCtrl = require("../controllers/profile.controller");

const fs = require("fs");
const path = require("path");

const uploadPath = (req, res, next) => {
  const publicPath = path.join(__dirname, "../public/");
  const profilePath = path.join(publicPath, "profile/");

  // Check if the 'public' directory exists, create it if not
  if (!fs.existsSync(publicPath)) {
    fs.mkdirSync(publicPath);
  }

  // Check if the 'profile' directory exists, create it if not
  if (!fs.existsSync(profilePath)) {
    fs.mkdirSync(profilePath);
  }

  req.uploadPath = profilePath;
  next();
};

router
  .route("/")
  .get(authCheck, profileCtrl.listAllProfile)
  .post(
    authCheck,
    uploadPath,
    uploader.single("image"),
    profileCtrl.createProfile
  );

router
  .route("/:id")
  .put(
    authCheck,
    uploadPath,
    uploader.single("image"),
    profileCtrl.updateProfile
  )
  .delete(authCheck, profileCtrl.deleteProfile)
  .get(authCheck, profileCtrl.getProfileById);

router.post("/firstEdit", authCheck, profileCtrl.firstEdit);
router.post("/secondEdit", authCheck, profileCtrl.secondEdit);
router.post("/thirdEdit", authCheck, profileCtrl.thirdEdit);
router.post("/hobbies", authCheck, profileCtrl.addHobbies);
router.post("/partnerMessage", authCheck, profileCtrl.partnerMessage);
router.post(
  "/photo",
  authCheck,
  uploadPath,
  uploader.single("image"),
  profileCtrl.addPhoto
);

router.post("/createBio", authCheck, profileCtrl.createBio);
module.exports = router;
