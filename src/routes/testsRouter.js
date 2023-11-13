const express = require("express");
const router = express.Router();

const { testsController } = require("../controllers/testsController");

router.get("/", testsController);

module.exports = router;
