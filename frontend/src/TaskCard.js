
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const TaskCard = ({ task, isTaskPage, onCompleted }) => {
  //to check if the due date has passed
  const isDueDatePassed = () => {
    const currentDate = new Date();
    const dueDate = new Date(task.dueDate);
    return currentDate > dueDate;
  };

  // Function to handle completion of task
  const handleCompleted = () => {
    onCompleted(task);
  };

  return (
    <Card className="shadow-sm rounded">
      <Card.Header className={isTaskPage && isDueDatePassed() ? 'bg-danger text-white' : 'bg-primary text-white'}>{task.taskTitle}</Card.Header>
      <Card.Body>
        <Card.Title>Assigned To: {task.assignedTo}</Card.Title>
        <Card.Text>
          Due Date: {task.dueDate}
        </Card.Text>
        {!task.completed && (
          <Button variant="success" onClick={handleCompleted}>Mark Completed</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default TaskCard;

