//server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Task = require('./models/Task');
const User = require('./models/User');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Function to generate a secure secret key
const generateSecureSecretKey = () => {
  return crypto.randomBytes(32).toString('hex'); 
};

// Set the JWT secret key
const secretKey = generateSecureSecretKey();
process.env.JWT_SECRET = secretKey;

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  console.log('Token:' , token);
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded:' , decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed: Invalid token' });
  }
};

app.post('/register', (req, res) => {
  const userData = req.body;
  const newUser = new User(userData);

  newUser.save()
    .then(user => {
      const payload = { userId: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Error registering new user' });
    });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email })
    .then(user => {
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const payload = { userId: user._id, email: user.email };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });
});

app.post('/tasks', authenticate, (req, res) => {
  const { taskTitle, assignedTo, dueDate } = req.body;
  const userId = req.user.userId;

  const newTask = new Task({
    taskTitle,
    assignedTo,
    dueDate,
    userId
  });

  newTask.save()
    .then(() => {
      res.status(201).json({ message: 'Task created successfully' });
    })
    .catch(error => {
      console.error('Error saving task:', error);
      res.status(500).json({ message: 'Failed to save task' });
    });
});

app.get('/tasks', authenticate, async (req, res) => {
  const userId = req.user.userId;
  try {
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
});

app.put('/tasks/:id', authenticate, async (req, res) => {
  const taskId = req.params.id;
  const userId = req.user.userId;

  try {
    const updatedTask = await Task.findOneAndUpdate({ _id: taskId, userId }, { completed: true }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found or not authorized' });
    }
    res.json(updatedTask);
  } catch (error) {
    console.error('Error marking task as completed:', error);
    res.status(500).json({ message: 'Failed to mark task as completed' });
  }
});

app.get('/completed-tasks', authenticate, async (req, res) => {
  const userId = req.user.userId;
  try {
    const completedTasks = await Task.find({ userId, completed: true });
    res.json(completedTasks);
  } catch (error) {
    console.error('Error fetching completed tasks:', error);
    res.status(500).json({ message: 'Failed to fetch completed tasks' });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});





