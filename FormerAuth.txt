import React, { useState } from 'react';
import './Auth.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Auth = ({setUserDetail, authRegister, authLogin}) => {
  const [category, setCategory] = useState('');
  const [signUp, setSignUp] = useState(true);
  const [confirmPass, setConfirmPass] = useState(true);
  const [errMessage, setErrMessage] = useState('');
  const [errDisplay, setErrDisplay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstname: '',
    lastname: '',
    pin: '',
    role: ''
  });

  const handleData = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signUp) {
      if (data.password !== data.confirmPassword) {
        setConfirmPass(false);
      } else {
        setConfirmPass(true);
        try {
          setIsLoading(true);
          const response = await axios.post(`${authRegister}`, data, {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
              }
            },
          });
          console.log(response.data);
          setIsLoading(false);
          setData({
            email: '',
            password: '',
            confirmPassword: '',
            firstname: '',
            lastname: '',
            pin: '',
            role: ''
          });
          setSignUp(false);
        } catch (error) {
          console.log(error.response.data);
          setErrMessage(error.response.data.message || 'Registration failed');
          handleErr();
          setIsLoading(false)
        }
      }
    } else {
      try {
        setIsLoading(true);
        const response = await axios.post(`${authLogin}`, data, {
          onDownloadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setProgress(percentCompleted);
            }
          },
        });
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setUserDetail(response.data.user)
          
          navigate('/');
        } else {
          throw new Error('Token not found in response');
        }
        console.log(response);
        setData({
          email: '',
          password: '',
          confirmPassword: '',
          firstname: '',
          lastname: '',
          pin: '',
          role: ''
        });
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false)
        console.log(error.response ? error.response.data : error.message);
        setErrMessage(error.response ? error.response.data : error.message);
        handleErr();
      }
    }
    console.log(data);
  };

  const toggleLogin = () => {
    setSignUp(!signUp);
    setConfirmPass(true);
    setData({
      email: '',
      password: '',
      confirmPassword: '',
      firstname: '',
      lastname: '',
      pin: '',
      role: ''
    });
  };

  const handleCategoryClean = () => {
    setData({
      ...data, pin: ''
    });
  };

  const handleErr = () => {
    setErrDisplay(true);
    setTimeout(() => {
      setErrDisplay(false);
    }, 4000);
  };

  return (
    <div className='auth'>
      <form onSubmit={handleSubmit} action="">
        <div className="header">
          <h1>{signUp ? 'Register' : 'Login'}</h1>
          <p style={{ display: `${errDisplay ? 'block' : 'none'}`, color: 'red' }}>{errMessage}</p>
          {signUp && (
            <select value={category} onChange={(e) => { setCategory(e.target.value); handleCategoryClean(); }} name="" id="">
              <option value="members">Members</option>
              <option value="excos">Excos</option>
              <option value="admin">Admin</option>
            </select>
          )}
        </div>
        <input value={data.email} onChange={handleData} required placeholder='Enter phone number' name='email' type="text" />
        <input value={data.password} onChange={handleData} required placeholder='Password' name='password' type="password" />
        {signUp && (
          <>
            <input value={data.confirmPassword} onChange={handleData} type="password" name='confirmPassword' placeholder='Confirm password' />
            <input value={data.firstname} onChange={handleData} required placeholder='Firstname' name='firstname' type="text" />
            <input value={data.lastname} onChange={handleData} required placeholder='Lastname' name='lastname' type="text" />
            {(category === "excos" || category === "admin") && (
              <div className="">
              <input type="password" onChange={handleData} name="pin" value={data.pin} required placeholder={`${category} key required`} />
              <br />
              {category === 'excos' ?  <input type="text" id='role' onChange={handleData} name="role" value={data.role} required placeholder="Enter your role e.g Secretary" />:null}
             
              </div>
            )}
          </>
        )}
        {!confirmPass && <span className='passCheck' style={{ color: 'red' }}>Passwords do not match</span>}
        <button type='submit'>{isLoading ? `Loading ${progress}%` : signUp ? 'Sign Up' : 'Login'}</button>
        <div className="navigate">
          <a onClick={toggleLogin}>{signUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}</a>
        </div>
      </form>
    </div>
  );
};

export default Auth;
