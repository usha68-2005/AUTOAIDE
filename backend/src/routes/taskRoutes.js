const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");

// Get all tasks
router.get("/", controller.getTasks);

// Create task
router.post("/", controller.createTask);

// Update task (status / other fields)
router.put("/:id", controller.updateTask);

// Delete task
router.delete("/:id", controller.deleteTask);

module.exports = router;
