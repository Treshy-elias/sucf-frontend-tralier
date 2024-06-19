import React, { useEffect, useState } from 'react';
import Auth from './components/Auth/Auth.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import User from './components/Users/User.jsx';
import UserDetail from './components/UserDetail/UserDetail.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import PrivateRoute from './components/PrivateRoutes/PrivateRoutes.jsx';

const App = () => {
  const [user, setUser] = useState([]);
  const [err, setErr] = useState([]);
  const [position, setPosition] = useState();
  const [userDetail, setUserDetail] = useState()
  const apiUrl = 'https://sucf-backend-trailer.vercel.app';

  const getAllUsers = `${apiUrl}/users/`;
  const authRegister = `${apiUrl}/auth/register`;
  const authLogin = `${apiUrl}/auth/login`;
  const updateUser = `${apiUrl}/users/update`;
  const deleteUser = `${apiUrl}/users/delete`;
  const uploadImage = `${apiUrl}/upload/image`;

  useEffect(() => {
    console.log('Fetching data...');
    const fetchData = async () => {
      try {
        const response = await axios.get(`${getAllUsers}`);
        setUser(response.data);
        console.log('Data fetched successfully');
        console.log(response);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErr('Error' + error);
      }
    };

    fetchData();
  }, []);

  const [selectedUser, setSelectedUser] = useState();

  return (
    <div>
      <Router>
        <Navbar userDetail={userDetail} />
        <Routes>
          <Route path="/login" element={<Auth authLogin={authLogin} authRegister={authRegister} setUserDetail={setUserDetail} />} />
          <Route
            path="/"
            element={
              <PrivateRoute
                element={() => (
                  <User user={user}  setPosition={setPosition} setSelectedUser={setSelectedUser} />
                )}
              />
            }
          />
          <Route
            path="/user-detail"
            element={
              <PrivateRoute
                element={() => (
                  <UserDetail getAllUsers={getAllUsers} uploadImage={uploadImage} updateUser={updateUser} deleteUser={deleteUser} userDetail={userDetail} selectedUser={selectedUser} />
                )}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;