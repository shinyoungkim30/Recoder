import React from "react";
import { Table } from "antd";
import "../../css/layout.css";

const Table_HJ = ({ columns, data }) => (
  <div id="dashboard-table">
    <Table
      style={{ 
        color: "darkgray",
      }}
      columns={columns}
      dataSource={data}
    />
  </div>
);
export default Table_HJ;
