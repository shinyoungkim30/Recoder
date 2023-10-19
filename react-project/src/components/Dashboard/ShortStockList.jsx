import React, { useEffect, useState } from "react";
import StockTable from "./StockTable";
import axios from "axios";
import { useNavigate } from "react-router";

function In_HJ({ stockList }) {
  
  // Table_HJ 컴포넌트 props 데이터
  const columns = [
    {
      title: "제품ID",
      dataIndex: "stock_id",
      key: "stock_id",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "제품명",
      dataIndex: "stock_name",
      key: "stock_name",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "종류",
      dataIndex: "stock_kind",
      key: "stock_kind",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "적재위치",
      dataIndex: "loading_position",
      key: "loading_position",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "유통기한",
      dataIndex: "stock_expired",
      key: "stock_expired",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "수량",
      dataIndex: "stock_bal",
      key: "stock_bal",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
  ];

  const data = stockList.map((item, idx) => ({
    key: idx + 1,
    stock_id: item.Stock.stock_seq,
    stock_name: item.Stock.stock_kind,
    stock_kind: item.Stock.cl_seq,
    loading_position: item.loading_position,
    stock_expired: item.Stock.stock_expired,
    stock_bal: item.Stock.stock_balance_cnt,
  }));

  return (
    <div>
      <StockTable columns={columns} data={data} />
    </div>
  );
}

export default In_HJ;
