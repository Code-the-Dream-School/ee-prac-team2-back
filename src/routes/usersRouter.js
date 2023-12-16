const express = require("express");
const router = express.Router();

const { getUsers } = require("../controllers/usersController");

router.get("/", getUsers);

module.exports = router;
