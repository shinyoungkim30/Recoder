import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {

    const nav = useNavigate()

  useEffect(() => {
    axios
      .post("http://13.124.126.209:80/user/logout")
      .then((res) => {
        if (res.data === "ok") {
          window.location.href = "http://13.124.126.209:80";
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
