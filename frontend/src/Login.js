import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import loginValidation from './LogininVal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate form fields using loginValidation
    const formErrors = loginValidation(values);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, values);

        const token = response.data.token;

        localStorage.setItem('token', token);

        navigate('/Task');

      } catch (error) {
        if (error.response) {
          setMessage(error.response.data.message); 
        } else {
          setMessage('Server error. Please try again.');
        }
      }
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
      <div className='bg-white p-3 rounded w-25'>
        <h2>Log-In</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor='email'><strong>Email</strong></label>
            <input type="email" placeholder='Enter Email' name='email'
              value={values.email} onChange={handleInput} className='form-control rounded-0' />
            {errors.email && <span className='text-danger'>{errors.email}</span>}
          </div>
          <div className='mb-3'>
            <label htmlFor='password'><strong>Password</strong></label>
            <input type="password" placeholder='Enter Password' name='password'
              value={values.password} onChange={handleInput} className='form-control rounded-0' />
            {errors.password && <span className='text-danger'>{errors.password}</span>}
          </div>
          <button type='submit' className='btn btn-success w-100'><strong>Log In</strong></button>
          {message && <p className={`text-${message.includes('successful') ? 'success' : 'danger'}`}>{message}</p>}
          <p>You agree to our terms and conditions</p>
          <Link to="/Signup" className='btn btn-default border w-100 bg-light text-decoration-none'>Create Account</Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
