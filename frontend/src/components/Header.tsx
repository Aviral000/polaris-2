import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.scss';

import { RxDropdownMenu } from "react-icons/rx";
import { MdHorizontalRule } from "react-icons/md";
import { FaUser } from 'react-icons/fa';
import axios from 'axios';

gsap.registerPlugin(ScrollTrigger);

interface WindowSize {
  width: number;
  height: number;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export default function Header() {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const loggedIn = localStorage.getItem('loggedIn');
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);
    fetchUser();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8082/u1/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      setError('Failed to fetch user data');
    }
  };

  useEffect(() => {
    const handleOutsideClicks = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClicks);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClicks);
    };
  }, []);

  useLayoutEffect(() => {
    if (menuRef.current) {
      if (menuOpen) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
        );
      } else {
        gsap.to(menuRef.current, { opacity: 0, y: -50, duration: 0.5, ease: "power2.in" });
      }
    }
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  let isLargeScreen = windowSize.width > 750;

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem('token');
    localStorage.removeItem('loggedIn');
    navigate('/login');
  };

  return (
    <header className='header'>
      <div className={isLargeScreen && !menuOpen ? 'A1' : 'A2'}>
        <div className='B1'>
          <img src='https://webstockreview.net/images/newspaper-clipart-newspaper-reader-7.png' alt='logo' />
          <div style={{ fontSize: "1.5rem" }}>
            <Link to='/'>Polaris</Link>
            <div style={{ fontSize: ".5rem" }}>THE TASK REMINDER</div>
          </div>
        </div>
        {windowSize.width > 750 ? (
          !loggedIn ? (
            <div className='B2'>
              <Link to='/login'>Login</Link>
              <Link to='/signup'>SignUp</Link>
            </div>
          ) : (
            <div className='B2'>
              <Link to='/user-profile'>
                <FaUser /> {user?.firstName}
              </Link>
              <Link to='/task'>Tasks</Link>
              <Link to='/login'><button style={{ color: "red" }} onClick={handleLogout}>Logout</button></Link>
            </div>
          )
        ) : (
          <div className='B3'>
            <button className='C1' type='button' onClick={toggleMenu}>
              {!menuOpen ? (
                <RxDropdownMenu style={{ color: 'black' }} />
              ) : (
                <MdHorizontalRule style={{ color: 'black' }} />
              )}
            </button>
            {menuOpen && (
              <div ref={menuRef} className='dropdown-menu'>
                {!loggedIn ? (
                  <>
                    <Link to='/login'>Login</Link>
                    <Link to='/signup'>SignUp</Link>
                  </>
                ) : (
                  <>
                    <Link to='/user-profile'>
                      <FaUser /> {user?.firstName}
                    </Link>
                    <Link to='/task'>Tasks</Link>
                    <Link to='/login'><button onClick={handleLogout}>Logout</button></Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
