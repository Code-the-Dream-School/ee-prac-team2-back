const express = require("express");
const router = express.Router();

const { testController } = require("../controllers/mainController");

router.get("/", testController);

module.exports = router;
