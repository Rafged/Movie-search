import React from 'react'

export default function Tabs({ active, onChange }: { active:'search'|'rated', onChange: (t:'search'|'rated')=>void }) {
  return (
    <div className="tabs" role="tablist" aria-label="tabs">
      <button className={active==='search' ? 'active':''} onClick={()=>onChange('search')}>Search</button>
      <button className={active==='rated' ? 'active':''} onClick={()=>onChange('rated')}>Rated</button>
    </div>
  )
}
