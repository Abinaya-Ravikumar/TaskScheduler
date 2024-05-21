import React from 'react'
import Login from './Login'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Signup from './Signup'
import Task from './Task';
import CompletedTasks from './CompletedTasks';


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
          <Route path='/' element={<Login />}></Route>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path="/Task" element={<Task />} />
          <Route path="/completed-tasks" element={<CompletedTasks />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App;
