const Task = require("../models/Task");

// GET all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// CREATE task
exports.createTask = async (req, res) => {
  try {
    const { title, description, date, time, priority, category } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const task = await Task.create({
      title,
      description,
      date,
      time,
      priority,
      category,
    });

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// UPDATE task status
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(400).json({ message: "Failed to update task" });
  }
};

// DELETE task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete task" });
  }
};
