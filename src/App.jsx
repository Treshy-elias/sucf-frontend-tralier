import React, { useEffect, useState } from 'react';
import Auth from './components/Auth/Auth.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import User from './components/Users/User.jsx';
import UserDetail from './components/UserDetail/UserDetail.jsx';
import Home from './components/Home/Home.jsx';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import PrivateRoute from './components/PrivateRoutes/PrivateRoutes.jsx';
import AddUsers from './components/AddUsers/AddUsers.jsx';

const App = () => {
  const [users, setUsers] = useState([]);
  const [err, setErr] = useState([]);
  const [position, setPosition] = useState();
  const [userDetail, setUserDetail] = useState();
  const [highLight, setHighLight] = useState('');
  const apiUrl = 'sucf-backend-trailer.vercel.app';

  const [category, setCategory] = useState('all');
  const [searchName, setSearchName] = useState('');

  const getAllUsers = `${apiUrl}/users`;
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
        setUsers(response.data);
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

  const AppContent = () => {
    const location = useLocation();

    return (
      <>
        {/* Only render Navbar if the current path is not /login */}
        {location.pathname !== '/login' && <Navbar userDetail={userDetail} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth authLogin={authLogin} authRegister={authRegister} setUserDetail={setUserDetail} />} />
          <Route
            path="/users"
            element={
              <PrivateRoute
                element={() => (
                  <User 
                    setSearchName={setSearchName} 
                    setCategory={setCategory} 
                    searchName={searchName}
                    highLight={highLight}
                    setHighLight={setHighLight}
                    users={users.filter(item => {
                      const firstName = item.firstName || '';
                      const lastName = item.lastName || '';
                      const matchesName = (firstName.toLowerCase() + ' ' + lastName.toLowerCase()).includes(searchName.toLowerCase());
                      const matchesCategory = 
                        (category === 'excos' && item.isExcos) ||
                        (category === 'admin' && item.isAdmin) ||
                        (category === 'all') || 
                        (category === 'members' && !item.isExcos && !item.isAdmin) || 
                        (category === '100' && item.currentLev === '100') || 
                        (category === '200' && item.currentLev === '200') || 
                        (category === '300' && item.currentLev === '300');
                      return matchesName && matchesCategory;
                    })}
                    setPosition={setPosition}
                    setSelectedUser={setSelectedUser} 
                  />
                )}
              />
            }
          />
          <Route
            path="/user-detail"
            element={
              <PrivateRoute
                element={() => (
                  <UserDetail 
                    getAllUsers={getAllUsers} 
                    uploadImage={uploadImage} 
                    updateUser={updateUser} 
                    deleteUser={deleteUser} 
                    userDetail={userDetail} 
                    selectedUser={selectedUser} 
                  />
                )}
              />
            }
          />
          <Route
            path="/add-user"
            element={
              <PrivateRoute
                element={() => (
                  <AddUsers
                  authRegister={authRegister}
                  />
                )}
              />
            }
          />
        </Routes>
      </>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
