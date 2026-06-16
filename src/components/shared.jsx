import { useState } from 'react'
import { driveUrl } from '../lib/drive.js'

export const PART_ORDER = ['armor','robes','tabards','cloaks','weapons','metallics','bases','gems','eyes','shields','skin','other']

export const S = {
  mono: { fontFamily: "'Courier New', monospace" },
  tag: { background: '#251a10', border: '1px solid #3a2a18', borderRadius: 2, padding: '1px 6px', fontSize: 10, color: '#6a5438', fontFamily: "'Courier New', monospace", letterSpacing: '0.05em', textTransform: 'uppercase' },
  label: { color: '#6a5438', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Courier New', monospace", display: 'block', marginBottom: 5 },
  input: { background: '#1a1208', border: '1px solid #3a2c1e', borderRadius: 3, padding: '7px 10px', color: '#c8a96e', fontFamily: "'Courier New', monospace", fontSize: 12, width: '100%', boxSizing: 'border-box', outline: 'none' },
  select: { background: '#1a1208', border: '1px solid #3a2c1e', borderRadius: 3, padding: '7px 10px', color: '#c8a96e', fontFamily: "'Courier New', monospace", fontSize: 12, width: '100%', boxSizing: 'border-box', outline: 'none' },
  btnPrimary: { background: '#2d5a27', border: 'none', borderRadius: 3, padding: '8px 16px', color: '#c8a96e', fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer', textTransform: 'uppercase' },
  btnGhost: { background: 'none', border: '1px solid #3a2c1e', borderRadius: 3, padding: '8px 16px', color: '#6a5438', fontFamily: "'Courier New', monospace", fontSize: 11, letterSpacing: '0.08em', cursor: 'pointer', textTransform: 'uppercase' },
}

export function uid() { return Math.random().toString(36).slice(2, 10) }

// Normalize recipe to always use imageIds array
export function normalizeRecipe(recipe) {
  if (recipe.imageIds) return recipe
  if (recipe.imageId) return { ...recipe, imageIds: [recipe.imageId], imageId: undefined }
  return { ...recipe, imageIds: [] }
}

export function Lightbox({ src, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, cursor: 'zoom-out' }}>
      <div onClick={(e) => e.stopPropagation()} style={{ position: 'relative' }}>
        <img src={src} alt="Reference" style={{ maxWidth: '90vw', maxHeight: '85vh', objectFit: 'contain', borderRadius: 4, display: 'block' }} />
        <button onClick={onClose} style={{ position: 'absolute', top: -14, right: -14, background: '#1e160e', border: '1px solid #4a3828', color: '#c8a96e', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
      </div>
    </div>
  )
}

// Multi-image gallery component
export function RecipeGallery({ imageIds }) {
  const [lightboxIdx, setLightboxIdx] = useState(null)
  const [errors, setErrors] = useState({})

  const ids = imageIds?.filter(Boolean) || []
  if (!ids.length) return null

  const validIds = ids.filter((id) => !errors[id])

  return (
    <>
      {lightboxIdx !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          {/* Close */}
          <button onClick={() => setLightboxIdx(null)} style={{ position: 'absolute', top: 16, right: 16, background: '#1e160e', border: '1px solid #4a3828', color: '#c8a96e', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>✕</button>

          {/* Main image */}
          <img src={driveUrl(ids[lightboxIdx])} alt="" style={{ maxWidth: '85vw', maxHeight: '75vh', objectFit: 'contain', borderRadius: 4, display: 'block' }} />

          {/* Nav arrows */}
          {ids.length > 1 && (
            <div style={{ display: 'flex', gap: 16, marginTop: 16, alignItems: 'center' }}>
              <button onClick={() => setLightboxIdx((lightboxIdx - 1 + ids.length) % ids.length)} style={{ background: '#1e160e', border: '1px solid #4a3828', color: '#c8a96e', borderRadius: 3, padding: '6px 14px', cursor: 'pointer', fontSize: 16 }}>‹</button>
              <span style={{ color: '#6a5438', fontFamily: "'Courier New', monospace", fontSize: 12 }}>{lightboxIdx + 1} / {ids.length}</span>
              <button onClick={() => setLightboxIdx((lightboxIdx + 1) % ids.length)} style={{ background: '#1e160e', border: '1px solid #4a3828', color: '#c8a96e', borderRadius: 3, padding: '6px 14px', cursor: 'pointer', fontSize: 16 }}>›</button>
            </div>
          )}

          {/* Thumbnail strip */}
          {ids.length > 1 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center', maxWidth: '90vw' }}>
              {ids.map((id, i) => (
                <img key={id} src={driveUrl(id)} alt="" onClick={() => setLightboxIdx(i)}
                  style={{ width: 52, height: 40, objectFit: 'cover', borderRadius: 2, cursor: 'pointer', border: i === lightboxIdx ? '2px solid #c8a96e' : '2px solid #3a2c1e', opacity: i === lightboxIdx ? 1 : 0.6 }} />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        {ids.length === 1 ? (
          // Single image — full width
          errors[ids[0]]
            ? <div style={{ background: '#1a1208', border: '1px dashed #3a2c1e', borderRadius: 3, padding: '8px 12px', color: '#4a3828', fontSize: 11, fontStyle: 'italic', ...S.mono }}>Image unavailable</div>
            : <img src={driveUrl(ids[0])} alt="" onError={() => setErrors((e) => ({ ...e, [ids[0]]: true }))} onClick={() => setLightboxIdx(0)}
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 3, border: '1px solid #3a2c1e', cursor: 'zoom-in', display: 'block' }} />
        ) : (
          // Multiple images — thumbnail strip
          <div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ids.map((id, i) => (
                errors[id]
                  ? null
                  : <img key={id} src={driveUrl(id)} alt="" onError={() => setErrors((e) => ({ ...e, [id]: true }))} onClick={() => setLightboxIdx(i)}
                      style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 3, border: '1px solid #3a2c1e', cursor: 'zoom-in', display: 'block' }} />
              ))}
            </div>
            {validIds.length > 0 && (
              <div style={{ marginTop: 6, color: '#5a4830', fontSize: 10, ...S.mono }}>{validIds.length} image{validIds.length !== 1 ? 's' : ''} — click to enlarge</div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export function MixBadge({ mix }) {
  const total = mix.reduce((s, m) => s + m.parts, 0)
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
      {mix.map((m, i) => <span key={i} style={{ background: '#2a1f14', border: '1px solid #4a3828', borderRadius: 3, padding: '2px 8px', fontSize: 11, ...S.mono, color: '#c8a96e' }}>{m.paint} · {Math.round((m.parts / total) * 100)}%</span>)}
    </div>
  )
}

export function WorkflowSteps({ steps }) {
  return (
    <ol style={{ margin: '8px 0 0', padding: 0, listStyle: 'none' }}>
      {steps.map((s, i) => (
        <li key={i} style={{ display: 'flex', gap: 10, marginBottom: 5, fontSize: 12, lineHeight: 1.5 }}>
          <span style={{ minWidth: 20, height: 20, background: '#2a1f14', border: '1px solid #4a3828', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#c8a96e', ...S.mono, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
          <div>
            <span style={{ color: '#a08050', fontWeight: 600, ...S.mono, fontSize: 11 }}>{s.label}</span>
            <span style={{ color: '#8a7560', marginLeft: 6 }}>{s.detail}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function TagList({ tags }) {
  if (!tags?.length) return null
  return <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>{tags.map((t) => <span key={t} style={S.tag}>{t}</span>)}</div>
}

export function RecipeCard({ recipe, showMeta }) {
  const [open, setOpen] = useState(false)
  const imageIds = recipe.imageIds || (recipe.imageId ? [recipe.imageId] : [])
  const imageCount = imageIds.filter(Boolean).length

  return (
    <div style={{ background: '#1e160e', border: '1px solid #3a2c1e', borderRadius: 4, padding: '10px 12px', marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setOpen(!open)}>
        <div>
          <div style={{ color: '#d4b483', ...S.mono, fontSize: 15, fontWeight: 700 }}>{recipe.name}</div>
          <div style={{ color: '#6a5840', fontSize: 13, marginTop: 2 }}>
            {recipe.source} · {recipe.type === 'mix' ? 'Mix ratio' : 'Workflow'}
            {imageCount > 0 && <span style={{ color: '#4a5830', marginLeft: 8 }}>· {imageCount} image{imageCount !== 1 ? 's' : ''}</span>}
            {showMeta && recipe._army && <span style={{ color: '#4a3828', marginLeft: 8 }}>— {recipe._army}{recipe._model ? ` / ${recipe._model}` : ''}</span>}
          </div>
        </div>
        <span style={{ color: '#5a4830', fontSize: 14, marginTop: 2 }}>{open ? '▲' : '▼'}</span>
      </div>
      {open && (
        <div style={{ marginTop: 10, borderTop: '1px solid #2a1f14', paddingTop: 10 }}>
          <RecipeGallery imageIds={imageIds} />
          {recipe.type === 'mix' && <MixBadge mix={recipe.mix} />}
          {recipe.type === 'workflow' && <WorkflowSteps steps={recipe.steps} />}
          {recipe.notes && <p style={{ color: '#7a6848', fontSize: 11, marginTop: 8, fontStyle: 'italic', lineHeight: 1.6 }}>{recipe.notes}</p>}
          <TagList tags={recipe.tags} />
        </div>
      )}
    </div>
  )
}
