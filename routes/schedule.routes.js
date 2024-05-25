const router = require("express").Router();

const scheduleController = require("../controllers/schedule_service")

router.post("/", scheduleController.findSchedule)

module.exports = router