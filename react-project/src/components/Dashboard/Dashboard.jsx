import React, { useEffect, useState } from "react";
import ShortInList from "./ShortInList";
import ShortStockList from "./ShortStockList";
import ShortOutList from "./ShortOutList";
import CachedIcon from "@mui/icons-material/Cached";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "react-router-dom";
import axios from "axios";
import WareList from "./WareList";
import CircularProgress from "@mui/material/CircularProgress";
import io from 'socket.io-client'
import BarcodeReader from "../Barcode/BarcodeReader";

const Dashboard = ({ comSeq, selectWhSeq, setSelectWhSeq }) => {
  const [inList, setInList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [outList, setOutList] = useState([]);

  const [isInClick, setIsInClick] = useState(true);
  const [isStockClick, setIsStockClick] = useState(true);
  const [isOutClick, setIsOutClick] = useState(true);

  const [inListCnt, setInListCnt] = useState(0);
  const [outListCnt, setOutListCnt] = useState(0);
  const [stockListCnt, setStockListCnt] = useState(0);

  const getInData = () => {
    return axios.get(`http://localhost:8000/in/${comSeq}/B`);
  };
  const getStockData = () => {
    return axios.get(`http://localhost:8000/in/${comSeq}/I`);
  };
  const getOutData = () => {
    return axios.get(`http://localhost:8000/in/${comSeq}/O`);
  };
  const getInDataCnt = () => {
    return axios.get(`http://localhost:8000/in/cnt/${comSeq}/B`);
  };
  const getStockDataCnt = () => {
    return axios.get(`http://localhost:8000/in/cnt/${comSeq}/I`);
  };
  const getOutDataCnt = () => {
    return axios.get(`http://localhost:8000/in/cnt/${comSeq}/O`);
  };

  useEffect(() => {
    Promise.all([getInData(), getStockData(), getOutData(), getInDataCnt(), getStockDataCnt(), getOutDataCnt()])
    .then((res) => {
      setInList(res[0].data);
      setStockList(res[1].data);
      setOutList(res[2].data);
      setInListCnt(res[3].data);
      setOutListCnt(res[4].data);
      setStockListCnt(res[5].data);
    })
    .catch((err) => {
      console.error(err);
    });
  }, []);

  const inClick = () => {
    if (isInClick) {
      setIsInClick(false);
    } else {
      setIsInClick(true);
    }
  };
  const stockClick = () => {
    if (isStockClick) {
      setIsStockClick(false);
    } else {
      setIsStockClick(true);
    }
  };
  const outClick = () => {
    if (isOutClick) {
      setIsOutClick(false);
    } else {
      setIsOutClick(true);
    }
  };

  useEffect(() => {
    getInData()
      .then((res) => {
        setInList(res.data);
        setTimeout(() => {
          setIsInClick(true);
        }, 300);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isInClick]);
  useEffect(() => {
    getStockData()
      .then((res) => {
        setStockList(res.data);
        setTimeout(() => {
          setIsStockClick(true);
        }, 300);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isStockClick]);
  useEffect(() => {
    getOutData()
      .then((res) => {
        setOutList(res.data);
        setTimeout(() => {
          setIsOutClick(true);
        }, 300);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [isOutClick]);

  return (
    <div id="dashboard">
      <div id="dashboard-header"></div>
      <div>
        <div id="dashboard-body1">
      
          <div id="dashboard-item1">
          
            <div id="current-container">
              <div id="current">
                <div id="current-header">
                  <span>전체 물류현황</span>
                </div>
                <div className="current-item">
                  <span>입고예정</span>
                  <Link to="/in/create">{inListCnt}개</Link>
                </div>
                <div className="current-item">
                  <span>재고</span>
                  <Link to="/stock/select">{stockListCnt}개</Link>
                </div>
                <div className="current-item">
                  <span>출고완료</span>
                  <Link to="/out/controll">{outListCnt}개</Link>
                </div>
              </div>
              <BarcodeReader />
            </div>
            <WareList comSeq={ comSeq } />
          </div>
          <div id="dashboard-item2">
            <div className="dashboard-item-header">
              <span>입고예정</span>
              <div>
                <button onClick={inClick}>
                  <CachedIcon />
                </button>
                <Link to="/in/create">
                  <OpenInNewIcon />
                </Link>
              </div>
            </div>
            {!isInClick ? (
              <CircularProgress />
            ) : (
              <ShortInList inList={inList} />
            )}
          </div>
        </div>
        <div id="dashboard-body2">
          <div id="dashboard-item3">
            <div className="dashboard-item-header">
              <span>재고</span>
              <div>
                <button onClick={stockClick}>
                  <CachedIcon />
                </button>
                <Link to="/stock/select">
                  <OpenInNewIcon />
                </Link>
              </div>
            </div>
            {!isStockClick ? (
              <CircularProgress />
            ) : (
              <ShortStockList stockList={stockList} />
            )}
          </div>
          <div id="dashboard-item4">
            <div className="dashboard-item-header">
              <span>출고완료</span>
              <div>
                <button onClick={outClick}>
                  <CachedIcon />
                </button>
                <Link to="/out/controll">
                  <OpenInNewIcon />
                </Link>
              </div>
            </div>
            {!isOutClick ? (
              <CircularProgress />
            ) : (
              <ShortOutList outList={outList} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
