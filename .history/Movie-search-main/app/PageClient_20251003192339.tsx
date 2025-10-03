"use client";

import { useState } from "react";
import { Pagination } from "antd";

type PageClientProps = {
  genresMap: any;
  moviesData: any;
};

export default function PageClient({ genresMap, moviesData }: PageClientProps) {
  const [page, setPage] = useState(1);

  return (
    <div style={{ textAlign: "center", marginTop: 12 }}>
      <Pagination
        current={page}
        total={moviesData?.total_results || 0} // ✅ безопасно берём total_results
        pageSize={10}
        onChange={(p) => setPage(p)}
      />
    </div>
  );
}