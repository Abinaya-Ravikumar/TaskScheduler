
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import TaskCard from './TaskCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Task = () => {
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
      await axios.post('http://127.0.0.1:3001/tasks', {
        taskTitle,
        assignedTo,
        dueDate,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      setTaskTitle('');
      setAssignedTo('');
      setDueDate('');
  
      alert('Task saved successfully!');
      setShowForm(false);
  
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task. Please try again.');
      setShowForm(false);
    }
  };
  

  const handleTaskCompleted = async (completedTask) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No token found. Please log in.');
      return;
    }
    
    try {
      await axios.put(`http://127.0.0.1:3001/tasks/${completedTask._id}`, {
        completed: true,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Remove completed task from tasks list
      const updatedTasks = tasks.filter(task => task._id !== completedTask._id);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error marking task as completed:', error);
      alert('Failed to mark task as completed. Please try again.');
    }
  };
  
    const fetchTasks = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No token found. Please log in.');
        return;
      }
    
      try {
        const response = await axios.get('http://127.0.0.1:3001/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
    
        const filteredTasks = response.data.filter(task => !task.completed);
        setTasks(filteredTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <div className="navbar-brand">Task Manager</div>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/Task">Tasks</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/completed-tasks">Completed Tasks</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className='mt-3 text-center'>
        <button type='submit' className='btn btn-success w-40' style={{ backgroundColor: 'blue', color: 'white' }} onClick={toggleForm}><strong>Add Task +</strong></button>
      </div>
    {showForm && (
    <div className="container mt-3">
      <div className="card mx-auto" style={{ maxWidth: '600px' }}>
        <div className="card-body">
          <form onSubmit={handleFormSubmit}>
            <div className="mb-3">
              <label htmlFor="taskTitle" className="form-label">Task Title</label>
            < input type="text" className="form-control" id="taskTitle" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="assignedTo" className="form-label">Assigned To</label>
                <input type="text" className="form-control" id="assignedTo" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} />
            </div>
            <div className="mb-3">
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input type="date" className="form-control" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="text-center"> {/* Centering div */}
              <button type="submit" className="btn btn-primary">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )}

  <div className="container mt-3">
    <Row xs={1} md={3} className="g-4">
      {tasks.map(task => (
        <Col key={task._id}>
          <TaskCard task={task} isTaskPage={true} onCompleted={handleTaskCompleted} />
        </Col>
      ))}
    </Row>
    </div>
  </div>
  );
};

export default Task;



