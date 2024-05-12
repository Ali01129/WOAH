import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/navbar.css';
import { FaShoppingCart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';

const Navbar = () => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('authToken'));
  const navigate = useNavigate();

  const toHome = () => {
    navigate('/');
  };

  const toShop = () => {
    navigate('/shop');
  };

  const toLoginOrLogout = () => {
    if (authToken === null) {
      navigate('/login');
    } else {
      // Clear token on logout
      localStorage.removeItem('authToken');
      setAuthToken(null); // Update state to trigger re-render
      navigate('/');
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setAuthToken(localStorage.getItem('authToken'));
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const gotoCart=()=>{
    navigate('/cart');
  }

  return (
    <div className="container-fluid my-3 px-5">
      <ul className="nav d-flex align-items-center justify-content-between">
        <li className="nav-item">
          <button className="main" onClick={toHome}>
            <b>WOAH</b>
          </button>
        </li>
        <div className="nav-item" style={{ display: 'flex' }}>
          <button className="btn_nav" onClick={toHome}>
            Home
          </button>
          <button className="btn_nav" onClick={toShop}>
            Shop
          </button>
        </div>
        <div style={{display:"flex"}}>
          <button className="lbtn mx-2" onClick={toLoginOrLogout}>
            {authToken === null ? 'Login' : 'Logout'}
          </button>
          {authToken !== null ? (
        <div className='cart' onClick={gotoCart}>
          <FaUser />
        </div>) : null} 
        </div>
      </ul>
    </div>
  );
};

export default Navbar;
