const router = require("express").Router();
const authCheck = require("../middleware/auth.middleware");
const uploader = require("../middleware/uploader.middleware");
const profileCtrl = require("../controllers/profile.controller");

const uploadPath = (req, res, next) => {
  req.uploadPath = "./public/profile/";
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
