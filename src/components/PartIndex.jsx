import { useState } from 'react'
import { PART_ORDER, S, RecipeCard } from './shared.jsx'

function buildPartIndex(armies) {
  const index = {}
  armies.forEach((army) => {
    const all = [
      ...army.sharedRecipes.map((r) => ({ ...r, _army: army.name, _model: null })),
      ...army.unitTypes.flatMap((ut) => ut.models.flatMap((m) => m.recipes.map((r) => ({ ...r, _army: army.name, _model: m.name })))),
    ]
    all.forEach((r) => {
      const p = r.part || 'other'
      if (!index[p]) index[p] = []
      index[p].push(r)
    })
  })
  return index
}

export default function PartIndex({ armies }) {
  const index = buildPartIndex(armies)
  const parts = PART_ORDER.filter((p) => index[p]?.length > 0)
  const [openParts, setOpenParts] = useState({})

  if (!parts.length) return <p style={{ color: '#3a2c1e', fontSize: 12, fontStyle: 'italic' }}>No recipes tagged by part yet.</p>

  return (
    <div>
      {parts.map((part) => (
        <div key={part} style={{ marginBottom: 16 }}>
          <div onClick={() => setOpenParts((s) => ({ ...s, [part]: !s[part] }))} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #3a2c1e', cursor: 'pointer', marginBottom: 8 }}>
            <span style={{ ...S.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#c8a96e', fontWeight: 700 }}>{part}</span>
            <span style={{ flex: 1, height: 1, background: '#2a1f14' }} />
            <span style={{ color: '#5a7040', fontSize: 10, ...S.mono }}>{index[part].length} recipe{index[part].length !== 1 ? 's' : ''}</span>
            <span style={{ color: '#4a3828', fontSize: 11 }}>{openParts[part] ? '▲' : '▼'}</span>
          </div>
          {openParts[part] && index[part].map((r) => <RecipeCard key={r.id + r._army} recipe={r} showMeta />)}
        </div>
      ))}
    </div>
  )
}
