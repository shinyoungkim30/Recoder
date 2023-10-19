import { Descriptions } from 'antd';
const items = [
  {
    key: '1',
    label: 'UserName',
    children: '',
  },
  {
    key: '2',
    label: 'Telephone',
    children: '',
  },
  {
    key: '3',
    label: 'Live',
    children: '',
  },
  {
    key: '4',
    label: 'Remark',
    children: '',
  },
  {
    key: '5',
    label: 'Address',
    children: '',
  },
];

const title = "타이틀"
const TopBoard = ({title,items}) => <Descriptions title={title} items={items} />;
export default TopBoard;