import './User.css';
import { Link } from 'react-router-dom';

const User = ({ setSelectedUser, user, setPosition }) => {
  const handleUserClick = (item) => {
    setSelectedUser(item);
    localStorage.setItem('selectedUser', JSON.stringify(item));
  };

  if (!user) {
    window.location.reload()
  }

  return (
    <div className='user'>
      <h1>Sucf Member/Excos</h1>
      <h3>({user.length})</h3>
      {user.map((item, index) => (
        <div key={index} className="item-container">
          <Link className='link' to="/user-detail" onClick={() => handleUserClick(item)}>
            <div style={{backgroundImage: `url(${item.ImageUrl})`}} className="img"></div>
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
      ))}
    </div>
  );
};

export default User;
