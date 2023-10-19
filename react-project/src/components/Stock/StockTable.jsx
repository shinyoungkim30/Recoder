import React from "react";
import { Table } from "antd";

const StockTable = ({ columns, data }) => {
  return (
    <Table
      style={{ 
        color: "darkgray",
        height: 520,
        overflow: 'auto',
        overflowX: 'hidden'
      }}
      columns={columns}
      dataSource={data}
    />
  );
};

export default StockTable;
