// import React from 'react'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    // try {
    //   const response = await axios.get('http://localhost:8099/soolsool/checkLoginStatus', { withCredentials: true });
    //   if (response.data.loggedIn) {
    //     setIsLoggedIn(true);
    //   } else {
    //     setIsLoggedIn(false);
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  };

  const handleLogout = async () => {
    // try {
    //   await axios.post('http://localhost:8099/soolsool/logout', {}, { withCredentials: true });
    //   setIsLoggedIn(false);
    //   // 홈으로 이동
    //   window.location.href = '/';
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <div className='header-container'>
      <div className="header-main">
        {/* 로그인/마이페이지 */}
        <div className="menu-item">
          {isLoggedIn ? (
            <>
              <Link to="/MyPage">회원정보수정</Link>
            </>
          ) : (
            <Link to="/login">로그인</Link>
          )}
        </div>
      </div>

      {/* 다크모드 & 로그인 버튼 */}

      <div className="Log">
        {isLoggedIn ? (
          <>
            <button onClick={handleLogout} className="log-inout">
              로그아웃
            </button>
          </>
        ) : (
          <button className="log-inout">
            <Link to="/login">로그인</Link>
          </button>
        )}
      </div>

    </div>

  )
}

export default Header