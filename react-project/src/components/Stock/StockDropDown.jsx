import React, { useState } from "react";
import { Button, Dropdown, Space } from "antd";

const App = ({ value, setValue }) => {
  
  const items = [
    {
      key: "1",
      label: (
        <p
          target="_blank"
          rel="noopener noreferrer"
          style={{
            margin: 10,
          }}
        >
          5개씩 보기
        </p>
      ),
    },
    {
      key: "2",
      label: (
        <p
          target="_blank"
          rel="noopener noreferrer"
          style={{
            margin: 10,
          }}
        >
          50개씩 보기
        </p>
      ),
    },
    {
      key: "3",
      label: (
        <p
          target="_blank"
          rel="noopener noreferrer"
          style={{
            margin: 10,
          }}
        >
          100개씩 보기
        </p>
      ),
    },
    {
      key: "4",
      label: (
        <p
          target="_blank"
          rel="noopener noreferrer"
          style={{
            margin: 10,
          }}
        >
          500개씩 보기
        </p>
      ),
    },
  ];

  const handleMenuClick = (key) => {
    if (key === '1') {
      setValue("5개씩 보기");
    } else if (key === '2') {
      setValue("50개씩 보기");
    } else if (key === '3') {
      setValue("100개씩 보기");
    } else {
      setValue("500개씩 보기");
    }
  };

  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown
          menu={{
            items,
            onClick: ({ key }) => handleMenuClick(key),
          }}
          placement="bottom"
        >
          <Button>{value}</Button>
        </Dropdown>
      </Space>
    </Space>
  );
};

export default App;
