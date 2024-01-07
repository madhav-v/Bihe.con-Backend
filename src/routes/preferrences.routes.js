const router = require("express").Router();
const preferenceCtrl = require("../controllers/preferrencesMatch.controller");
const authCheck = require("../middleware/auth.middleware");

router.get("/education", authCheck, preferenceCtrl.findMatchesByEducation);
router.get("/occupation", authCheck, preferenceCtrl.findMatchesByOccupation);
router.get("/income", authCheck, preferenceCtrl.findMatchesByIncome);
router.get(
  "/weightedScore",
  authCheck,
  preferenceCtrl.findMatchesByWeightedScore
); 

module.exports = router;
