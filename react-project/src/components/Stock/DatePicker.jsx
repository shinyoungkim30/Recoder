import React, { useState } from 'react';
import { DatePicker, Select, Space, TimePicker } from 'antd';
const { Option } = Select;
const PickerWithType = ({ type, onChange }) => {
  if (type === 'time') return <TimePicker onChange={onChange} />;
  if (type === 'date') return <DatePicker onChange={onChange} />;
  return <DatePicker picker={type} onChange={onChange} />;
};
const App = () => {
  const [type, setType] = useState('기간 선택');
  return (
    <Space>
      <Select value={type} onChange={setType}>
        {/* <Option value="time">Time</Option> */}
        <Option value="date">1일</Option>
        <Option value="week">1주</Option>
        <Option value="month">1달</Option>
        <Option value="quarter">1분기</Option>
        <Option value="year">1년</Option>
      </Select>
      <PickerWithType type={type} onChange={(value) => console.log(value)} />
    </Space>
  );
};
export default App;