import { useState } from 'react'
import { S, RecipeCard, TagList, RecipeImage, Lightbox } from './shared.jsx'
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
            <div style={{ color: '#a08050', ...S.mono, fontSize: 12, fontWeight: 700 }}>{entry.source}</div>
            <div style={{ color: '#5a4830', fontSize: 10, marginTop: 2 }}>{entry.platform}</div>
          </div>
          <span style={{ color: '#4a3828', fontSize: 12 }}>{open ? '▲' : '▼'}</span>
        </div>
        {open && (
          <div style={{ marginTop: 10, borderTop: '1px solid #2a1f14', paddingTop: 10 }}>
            {entry.imageId && !err && <img src={driveUrl(entry.imageId)} alt="" onError={() => setErr(true)} onClick={() => setLb(true)} style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 3, border: '1px solid #3a2c1e', cursor: 'zoom-in', display: 'block', marginBottom: 10 }} />}
            {entry.imageId && err && <div style={{ background: '#1e160e', border: '1px dashed #3a2c1e', borderRadius: 3, padding: '8px 12px', color: '#4a3828', fontSize: 11, fontStyle: 'italic', ...S.mono, marginBottom: 10 }}>Image unavailable</div>}
            <p style={{ color: '#8a7560', fontSize: 12, lineHeight: 1.7, margin: 0 }}>{entry.notes}</p>
            <TagList tags={entry.tags} />
          </div>
        )}
      </div>
    </>
  )
}

function ModelEntry({ model }) {
  const [open, setOpen] = useState(false)
  const has = model.recipes.length > 0 || model.notes
  return (
    <div style={{ marginBottom: 6 }}>
      <div onClick={() => has && setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: open ? '#1a1208' : 'transparent', border: '1px solid', borderColor: open ? '#3a2c1e' : '#251c12', borderRadius: 3, cursor: has ? 'pointer' : 'default' }}>
        <span style={{ color: '#5a4830', fontSize: 10 }}>◆</span>
        <span style={{ color: '#b89560', ...S.mono, fontSize: 13, flex: 1 }}>{model.name}</span>
        {model.recipes.length > 0 && <span style={{ color: '#5a7040', fontSize: 10, ...S.mono }}>{model.recipes.length} recipe{model.recipes.length !== 1 ? 's' : ''}</span>}
        {has && <span style={{ color: '#4a3828', fontSize: 12 }}>{open ? '▲' : '▼'}</span>}
      </div>
      {open && (
        <div style={{ padding: '10px 10px 4px 20px' }}>
          {model.notes && <p style={{ color: '#6a5840', fontSize: 11, fontStyle: 'italic', marginBottom: 10, lineHeight: 1.6 }}>{model.notes}</p>}
          {model.recipes.length === 0 && <p style={{ color: '#3a2c1e', fontSize: 11, fontStyle: 'italic' }}>No recipes yet.</p>}
          {model.recipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}
        </div>
      )}
    </div>
  )
}

function UnitTypeSection({ section, accentColor }) {
  const [open, setOpen] = useState(true)
  const count = section.models.reduce((s, m) => s + m.recipes.length, 0)
  return (
    <div style={{ marginBottom: 16 }}>
      <div onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid #3a2c1e', cursor: 'pointer', marginBottom: 8 }}>
        <span style={{ ...S.mono, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: accentColor, fontWeight: 700 }}>{section.label}</span>
        <span style={{ flex: 1, height: 1, background: '#2a1f14' }} />
        {count > 0 && <span style={{ color: '#5a7040', fontSize: 10, ...S.mono }}>{count} recipe{count !== 1 ? 's' : ''}</span>}
        <span style={{ color: '#4a3828', fontSize: 11 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div>
          {section.models.length === 0
            ? <p style={{ color: '#3a2c1e', fontSize: 11, fontStyle: 'italic', padding: '4px 10px' }}>No models added yet.</p>
            : section.models.map((m) => <ModelEntry key={m.id} model={m} />)}
        </div>
      )}
    </div>
  )
}

export default function ArmyChapter({ army }) {
  const [tab, setTab] = useState('units')
  const tabs = [{ id: 'units', label: 'Units & Recipes' }, { id: 'shared', label: 'Army Recipes' }, { id: 'moodboard', label: 'Moodboard' }]

  return (
    <div>
      <div style={{ borderBottom: `2px solid ${army.accentColor}`, marginBottom: 20, paddingBottom: 12 }}>
        <div style={{ ...S.mono, fontSize: 20, fontWeight: 700, color: army.accentLight, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{army.name}</div>
        <div style={{ color: '#5a4830', fontSize: 11, marginTop: 3, fontStyle: 'italic' }}>{army.subtitle}</div>
      </div>
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: '1px solid #2a1f14' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: 'none', border: 'none', borderBottom: tab === t.id ? `2px solid ${army.accentLight}` : '2px solid transparent', padding: '6px 14px', marginBottom: -1, color: tab === t.id ? army.accentLight : '#5a4830', ...S.mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer' }}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'units' && <div>{army.unitTypes.length === 0 ? <p style={{ color: '#3a2c1e', fontSize: 12, fontStyle: 'italic' }}>No units added yet.</p> : army.unitTypes.map((s) => <UnitTypeSection key={s.id} section={s} accentColor={army.accentLight} />)}</div>}
      {tab === 'shared' && <div>{army.sharedRecipes.length === 0 ? <p style={{ color: '#3a2c1e', fontSize: 12, fontStyle: 'italic' }}>No army-wide recipes yet.</p> : army.sharedRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)}</div>}
      {tab === 'moodboard' && <div>{army.moodboard.length === 0 ? <p style={{ color: '#3a2c1e', fontSize: 12, fontStyle: 'italic' }}>No moodboard entries yet.</p> : army.moodboard.map((e) => <MoodboardEntry key={e.id} entry={e} />)}</div>}
    </div>
  )
}
