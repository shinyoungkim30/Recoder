import InTable from "./InTable";

function In_HJ({ inList }) {
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
      title: "거래처",
      dataIndex: "cl_seq",
      key: "cl_seq",
      render: (text) => <span style={{ color: "darkgray" }}>{text}</span>,
    },
    {
      title: "등록일자",
      dataIndex: "created_at",
      key: "created_at",
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

  const data = inList.map((item, idx) => ({
    key: idx + 1,
    stock_id: item.Stock.stock_seq,
    stock_name: item.Stock.stock_name,
    cl_seq: item.Stock.cl_seq,
    created_at: item.created_at,
    stock_bal: item.Stock.stock_balance_cnt,
    loading_manager: item.loading_manager,
  }));

  return (
    <div>
      <InTable columns={columns} data={data} />
    </div>
  );
}

export default In_HJ;
