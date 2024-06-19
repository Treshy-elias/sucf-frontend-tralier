import { useState } from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const [menu, setMenu] = useState(true)
  let user = JSON.parse(localStorage.getItem('user'))

  const handleMenu = (navigateTo) => {
    setMenu(!menu)
    localStorage.setItem('selectedUser', JSON.stringify(user))
    if (navigateTo) {
      window.location.href = navigateTo // Use full page reload to ensure the state is updated
    }
  }

  return (
    <nav>
      <div className="navigation">
        <div className="logo">SUCF</div>
        {menu === true ? 
          <FaBars onClick={() => handleMenu(null)} className='bars' /> : 
          <FaTimes className='bars' onClick={() => handleMenu(null)} />
        }
      </div>
      {menu === false ? 
        <div className="ul-list">
          <hr />
          <ul className='ul'>
            <Link onClick={() => handleMenu('/user-detail')} to='/user-detail'>About me</Link>
            <Link onClick={() => handleMenu('/')} to='/'>Members</Link>
          </ul>
        </div> : 
        <></>
      }
    </nav>
  )
}

export default Navbar
