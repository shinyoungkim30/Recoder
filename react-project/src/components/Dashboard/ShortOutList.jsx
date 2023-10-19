import OutTable from "./OutTable";

function In_HJ({ outList }) {
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
      title: "출고지",
      dataIndex: "stock_shipping_des",
      key: "stock_shipping_des",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "출고일자",
      dataIndex: "out_created_at",
      key: "out_created_at",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "수량",
      dataIndex: "stock_bal",
      key: "stock_bal",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "담당자",
      dataIndex: "loading_manager",
      key: "loading_manager",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
  ];

  const data = outList.map((item, idx) => ({
    key: idx + 1,
    stock_id: item.Stock.stock_seq,
    stock_name: item.Stock.stock_name,
    stock_shipping_des: item.stock_shipping_des,
    out_created_at: item.out_created_at,
    stock_bal: item.Stock.stock_balance_cnt,
    loading_manager: item.loading_manager,
  }));  

  return (
    <div>
      <OutTable columns={columns} data={data} />
    </div>
  );
}

export default In_HJ;
