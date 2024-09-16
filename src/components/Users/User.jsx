import './User.css';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

const User = ({ setSelectedUser, highLight, setHighLight, setCategory, users }) => {
  const [isActive, setIsActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const handleUserClick = (item) => {
    setSelectedUser(item);
    localStorage.setItem('selectedUser', JSON.stringify(item));
  };

  useEffect(() => {
    if (!users) {
      window.location.reload();
    }
  }, [users]);

  const handleClick = (value) => {
    setCategory(value);
    setHighLight(value);
  };

  const handleSearchClick = () => {
    setIsActive(!isActive);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const inputRef = useRef(null);

  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  const buttonLabels = [
    { value: 'all', label: 'All' },
    { value: 'excos', label: 'Excos' },
    { value: 'admin', label: 'Admins' },
    { value: 'members', label: 'Members' },
    { value: '100', label: '100L' },
    { value: '200', label: '200L' },
    { value: '300', label: '300L' }
  ];

  // Filter users based on search query
  const filteredUsers = users.filter(user =>
    user.firstname.toLowerCase().includes(searchQuery)
  );

  return (
    <div className="userContainer">
      <div className='user'>
        <div className="gallery">
          <div className="upper">
            <h4>Gallery</h4>
            <div className={`search ${isActive ? 'searchActive' : 'searchInactive'}`}>
              {isActive && <input ref={inputRef} type="text" onChange={handleSearchChange} />}
              <FaSearch onClick={handleSearchClick} />
            </div>
          </div>
          <div className="lower">
            {buttonLabels.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleClick(value)}
                style={{
                  backgroundColor: highLight === value ? 'gray' : '',
                  color: highLight === value ? 'white' : ''
                }}
                value={value}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {filteredUsers.length > 0 ? filteredUsers.map((item, index) => (
          <div key={index} className="item-container">
            <Link className='link' to="/user-detail" onClick={() => handleUserClick(item)}>
              <div style={{ backgroundImage: `url(${item.ImageUrl})` }} className="img"></div>
              <div className="text">
                <p>{item.firstname}</p>
                {item.isExcos ? (
                  <p style={{ color: 'blue' }}>Excos</p>
                ) : item.isAdmin ? (
                  <p style={{ color: 'green' }}>Admin</p>
                ) : (
                  <p>Member</p>
                )}
              </div>
            </Link>
          </div>
        ))
        :
        <div style={{ fontFamily: 'sans-serif' }}>No user found. Try reloading page</div>
        }
        <div className="bottom">
          {filteredUsers.length} found
        </div>
      </div>
    </div>
  );
};

export default User;
