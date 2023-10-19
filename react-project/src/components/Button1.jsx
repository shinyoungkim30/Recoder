import React, { useState } from 'react';
import { DownloadOutlined } from '@ant-design/icons';
import { Button, Radio, Space, Divider } from 'antd';

const Button1 = () => {
  const [size, setSize] = useState('Small'); // default is 'middle'

  return (
    <>
          <Button size={size}>Default</Button>
    </>
  );
};
export default Button1;