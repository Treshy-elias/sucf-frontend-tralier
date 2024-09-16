import { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import logoImg from '../../assets/Sucf-Logo.jpg';

const Navbar = () => {
  const [menu, setMenu] = useState(true);
  let user = JSON.parse(localStorage.getItem('user'));
  let token = localStorage.getItem('token'); // No need to parse the token

  const handleMenu = (navigateTo) => {
    setMenu(!menu);
    localStorage.setItem('selectedUser', JSON.stringify(user));
    if (navigateTo) {
      window.location.href = navigateTo; // Use full page reload to ensure the state is updated
    }
  };

  return (
    <nav>
      <div className="navigation">
        <div className="logo">
          <div style={{ backgroundImage: `url(${logoImg})` }} className="logoImg"></div>
          <div className="title">
            SUCF | <span>UNIDEL</span>
          </div>
        </div>
        {menu === true ? (
          <FaBars onClick={() => handleMenu(null)} className='bars' />
        ) : (
          <FaTimes className='bars' onClick={() => handleMenu(null)} />
        )}
      </div>
    
      <div className={`ul-list ${menu ? '' : 'open'}`}>
        <hr />
        <ul className='ul'>
          <Link onClick={() => handleMenu('/user-detail')} to='/user-detail'>About me</Link>
          <Link onClick={() => handleMenu('/users')} to='/users'>Members</Link>
          {!token ? <Link onClick={() => handleMenu('/login')} to='/login'>Login</Link> : null}
        </ul>
      </div> 
    </nav>
  );
};

export default Navbar;
