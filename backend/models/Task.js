const mongoose = require('mongoose');

// task schema
const taskSchema = new mongoose.Schema({
  taskTitle: { type: String, required: true },
  assignedTo: { type: String, required: true },
  dueDate: { type: Date, required: true },
  completed: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});


const Task = mongoose.model('Task', taskSchema);

module.exports = Task; 
