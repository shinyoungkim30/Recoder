import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {

    const nav = useNavigate()

  useEffect(() => {
    axios
      .post("http://localhost:8000/user/logout")
      .then((res) => {
        console.log(res);
        if (res.data === "ok") {
          window.location.href = "http://localhost:3000";
        } 
      })
      .catch((err) => {
        console.error(err);
        if (err.response.status === 401) {
            alert('아마도 개발중에만 이 창이 뜰겁니다.. 아마도..')
            nav('/main')
        }
      });
  }, []);

  return <div></div>;
};

export default Logout;
