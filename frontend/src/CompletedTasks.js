
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TaskCard from './TaskCard';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

  if (!token) {
    alert('No token found. Please log in.');
    return;
  }
    axios.get('http://127.0.0.1:3001/completed-tasks', {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then(response => {
        setCompletedTasks(response.data); // Update completedTasks state
      })
      .catch(error => {
        console.error('Error fetching completed tasks:', error);
      });
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
    <div>
      <div className="text-center">
        <h2>Completed Tasks</h2>
      </div>
      <div className="container mt-3">
        <Row xs={1} md={3} className="g-4">
          {completedTasks.map(task => (
            <Col key={task._id}>
              <TaskCard task={task} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  </div>
  );
};

export default CompletedTasks;


  