import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import validation from './SignupVal';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleInput = (event) => {
    setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  useEffect(() => {
    setErrors(validation(values));
  }, [values]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validation(values);
    setErrors(formErrors);
  
    if (Object.keys(formErrors).length === 0) {
      axios.post('http://127.0.0.1:3001/register', values)
        .then(result => {
          console.log(result.data);
          navigate('/');
        })
        .catch(err => console.log(err));
    }
  };
  
  return (
    <div>
      <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-25'>
          <h2>Sign-Up</h2>
          <form onSubmit={handleSubmit}>
            <div className='mb-3'>
              <label htmlFor='name'><strong>Name</strong></label>
              <input
                type="text"
                placeholder='Enter Name'
                name='name'
                value={values.name}
                onChange={handleInput}
                className='form-control rounded-0'
              />
              {errors.name && <span className='text-danger'> {errors.name}</span>}
            </div>
            <div className='mb-3'>
              <label htmlFor='email'><strong>Email</strong></label>
              <input
                type="email"
                placeholder='Enter Email'
                name='email'
                value={values.email}
                onChange={handleInput}
                className='form-control rounded-0'
              />
              {errors.email && <span className='text-danger'> {errors.email}</span>}
            </div>
            <div className='mb-3'>
              <label htmlFor='password'><strong>Password</strong></label>
              <input
                type="password"
                placeholder='Enter Password'
                name='password'
                value={values.password}
                onChange={handleInput}
                className='form-control rounded-0'
              />
              {errors.password && <span className='text-danger'> {errors.password}</span>}
            </div>
            <button type='submit' className='btn btn-success w-100'><strong>Sign up</strong></button>
            <p>You agree to our terms and conditions </p>
            <Link to="/" className='btn btn-default border w-100 bg-light text-decoration-none'>Log in</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;

