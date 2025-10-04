import React from 'react'

export default function Pagination({ page, totalPages, onChange }: { page:number, totalPages:number, onChange:(p:number)=>void }) {
  if(totalPages <= 1) return null
  const pages = []
  const start = Math.max(1, page-2)
  const end = Math.min(totalPages, page+2)
  for(let i=start;i<=end;i++) pages.push(i)
  return (
    <nav className="pagination" aria-label="pagination">
      <button onClick={()=>onChange(1)} disabled={page===1}>«</button>
      <button onClick={()=>onChange(page-1)} disabled={page===1}>‹</button>
      {pages.map(p=>(
        <button key={p} className={p===page ? 'active':''} onClick={()=>onChange(p)}>{p}</button>
      ))}
      <button onClick={()=>onChange(page+1)} disabled={page===totalPages}>›</button>
      <button onClick={()=>onChange(totalPages)} disabled={page===totalPages}>»</button>
    </nav>
  )
}
