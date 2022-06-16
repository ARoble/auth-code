const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

router.route("/login").post(authController.login);

router
  .route("/admin")
  .get(
    authController.protect,
    authController.checkRole("admin", "hr"),
    authController.admin
  );

router
  .route("/hr")
  .get(
    authController.protect,
    authController.checkRole("hr"),
    authController.hr
  );

router.route("/forgetPassword").post(authController.forgotPassword);

router.route("/changePassword/:token").post(authController.changePassword);

module.exports = router;
