import React, { useEffect, useRef, useState } from 'react';
import '../css/Login.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
// import {Ionicons} from "@expo/vector-icons";

const Login = () => {

  const nav = useNavigate()

  const idRef = useRef()
  const pwRef = useRef()

  const [userData, setUserData] = useState({})

  const handleLogin = (e) => {

    e.preventDefault()

    setUserData({
      user_id: idRef.current.value,
      user_pw: pwRef.current.value
    })
  }

  useEffect(() => {
    if (userData.user_id !== undefined) {
      axios.post('http://localhost:8000/user/login', userData)
        .then((res) => {
          console.log(res);
          if (res.data.user_id) {
            // window.location.href = 'http://localhost:3000/main'
            window.location.href = 'http://localhost:3000/ware/select'
          }
        })
        .catch((err) => {
          console.error(err);
        })
    }
  }, [userData])

  const handleJoin = () => {
    nav('/join')
  }

  return (
    <div className='login_main'>
        <body>
          <section>
            <div className="form_box">
              <div className="form_value">
                <form onSubmit={handleLogin}>

                  <h2>로그인</h2>

                  <div className="inputbox">
                    <input type='text' ref={idRef} required />
                    <label htmlFor="">ID</label>
                  </div>

                  <div className="inputbox">
                    <input type='password' ref={pwRef} required />
                    <label htmlFor="">Password</label>
                  </div>

                  <button type='submit' className='login_button'>로그인</button>
                  <button onClick={handleJoin} className='login_join_button'>회원가입</button>

                </form>
              </div>
            </div>
          </section>
        </body>
    </div>
  );
};

export default Login;
