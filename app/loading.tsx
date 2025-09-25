import { Spin } from "antd";

export default function Loading() {
  return (
    <div style={{ display: "flex", width: "100%", minHeight: 300, alignItems: "center", justifyContent: "center" }}>
      <Spin tip="Загрузка..." />
    </div>
  );
}
