// src/controllers/taskController.js
const Task = require('../models/model');

// Health Check
exports.healthCheck = (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Task Manager API is running',
        timestamp: new Date().toISOString()
    });
};

// Create Task
exports.createTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const task = new Task({ title, description, completed });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get Single Task
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: 'Invalid task ID' });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, completed },
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
        res.json(updatedTask);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Invalid task ID' });
    }
};
