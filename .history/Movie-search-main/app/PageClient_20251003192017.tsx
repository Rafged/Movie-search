
import { useState } from "react";
import { Pagination } from "antd";

export default function PageClient({ genresMap, moviesData }: { genresMap: any, moviesData: any }) {
  const [page, setPage] = useState(1);

  return (
    <div style={{ textAlign: "center", marginTop: 12 }}>
      <Pagination
        current={page}
        total={moviesData?.total_results || 0} // ✅ защита от undefined
        pageSize={10}
        onChange={(p) => setPage(p)}
      />
    </div>
  );
}