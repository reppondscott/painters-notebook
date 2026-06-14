import { useState } from 'react'
import { S, RecipeCard, TagList, Lightbox } from './shared.jsx'
import { driveUrl } from '../lib/drive.js'

function MoodboardEntry({ entry }) {
  const [open, setOpen] = useState(false)
  const [lb, setLb] = useState(false)
  const [err, setErr] = useState(false)
  return (
    <>
      {lb && entry.imageId && <Lightbox src={driveUrl(entry.imageId)} onClose={() => setLb(false)} />}
      <div style={{ background: '#1a1208', border: '1px solid #2a1f14', borderRadius: 4, padding: '10px 12px', marginBottom: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
          <div>
            <div style={{ color: '#a08050', ...S.mono, fontSize: 13, fontWeight: 700 }}>{entry.source}</div>
            <div style={{ color: '#5a4830', fontSize: 12, marginTop: 2 }}>{entry.platform}</div>
          </div>
          <span style={{ color: '#4a3828', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
        </div>
        {open && (
          <div style={{ marginTop: 10, borderTop: '1px solid #2a1f14', paddingTop: 10 }}>
            {entry.imageId && !err && <img src={driveUrl(entry.imageId)} alt="" onError={() => setErr(true)} onClick={() => setLb(true)} style={{ width: '100%', maxHeight: 280, objectFit: 'cover', borderRadius: 3, border: '1px solid #3a2c1e', cursor: 'zoom-in', display: 'block', marginBottom: 10 }} />}
            {entry.imageId && err && <div style={{ background: '#1e160e', border: '1px dashed #3a2c1e', borderRadius: 3, padding: '8px 12px', color: '#4a3828', fontSize: 11, fontStyle: 'italic', ...S.mono, marginBottom: 10 }}>Image unavailable</div>}
            <p style={{ color: '#8a7560', fontSize: 13, lineHeight: 1.7, margin: 0 }}>{entry.notes}</p>
            <TagList tags={entry.tags} />
          </div>
        )}
      </div>
    </>
  )
}

export default function BasesSection({ bases }) {
  const [tab, setTab] = useState('recipes')
  const tabs = [{ id: 'recipes', label: 'Recipes' }, { id: 'moodboard', label: 'Moodboard' }]

  return (
    <div>
      {/* Header */}
      <div style={{ borderBottom: '2px solid #4a3828', marginBottom: 24, paddingBottom: 14 }}>
        <div style={{ ...S.mono, fontSize: 26, fontWeight: 700, color: '#c8a96e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Bases & Terrain
        </div>
        <div style={{ color: '#5a4830', fontSize: 13, marginTop: 4, fontStyle: 'italic' }}>
          Global — applies across all armies
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 24, borderBottom: '1px solid #2a1f14' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            background: 'none', border: 'none',
            borderBottom: tab === t.id ? '2px solid #c8a96e' : '2px solid transparent',
            padding: '10px 18px', marginBottom: -1,
            color: tab === t.id ? '#c8a96e' : '#5a4830',
            ...S.mono, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Recipes tab */}
      {tab === 'recipes' && (
        <div>
          {/* Group recipes by style/type if tagged, otherwise flat list */}
          {!bases.recipes || bases.recipes.length === 0
            ? <p style={{ color: '#3a2c1e', fontSize: 13, fontStyle: 'italic' }}>No base recipes yet. Use + Add Entry to add one.</p>
            : bases.recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
          }
        </div>
      )}

      {/* Moodboard tab */}
      {tab === 'moodboard' && (
        <div>
          {!bases.moodboard || bases.moodboard.length === 0
            ? <p style={{ color: '#3a2c1e', fontSize: 13, fontStyle: 'italic' }}>No moodboard entries yet. Use + Add Entry to add one.</p>
            : bases.moodboard.map((e) => <MoodboardEntry key={e.id} entry={e} />)
          }
        </div>
      )}
    </div>
  )
}
