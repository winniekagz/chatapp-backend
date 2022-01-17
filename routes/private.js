const express = require("express");
const router = express.Router();
const { getPrivateRoute } = require("../controllers/private");
const { protect } = require("../middleware/auth");
// jwt token  gen
router.route("/").get(protect, getPrivateRoute);

module.exports = router;
