import React, { useState, useEffect } from 'react'
import '../Sidebar.css'
import '../App.css'
import App from '../three/02-geometry'
import '../three/02-geometry.css'
import axios from 'axios'

const Main = () => {

  useEffect(() => {
    new App();
  }, []);

  return (
    <div id="webgl-container"></div>
  );
}

export default Main