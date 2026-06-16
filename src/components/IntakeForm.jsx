import { useState } from 'react'
import { S, PART_ORDER, uid } from './shared.jsx'
import { extractDriveId, driveUrl } from '../lib/drive.js'

const BLANK = { scope: 'model', armyId: '', unitTypeId: '', modelId: '', name: '', source: '', type: 'workflow', part: '', imageUrls: [''], notes: '', tags: '', stepsRaw: '', mixRaw: '' }
const SCOPES = [{ value: 'model', label: 'Model recipe' }, { value: 'army', label: 'Army-wide' }, { value: 'moodboard', label: 'Moodboard' }, { value: 'bases', label: 'Bases & Terrain' }]

export default function IntakeForm({ notebook, onSubmit, onClose }) {
  const [f, setF] = useState(BLANK)
  const [previews, setPreviews] = useState({})
  const [previewErrors, setPreviewErrors] = useState({})

  const set = (k, v) => setF((prev) => {
    const next = { ...prev, [k]: v }
    if (k === 'armyId') { next.unitTypeId = ''; next.modelId = '' }
    if (k === 'unitTypeId') next.modelId = ''
    return next
  })

  const army = notebook.armies.find((a) => a.id === f.armyId)
  const unitType = army?.unitTypes.find((u) => u.id === f.unitTypeId)

  // Image URL handlers
  const setImageUrl = (idx, val) => {
    setF((prev) => {
      const urls = [...prev.imageUrls]
      urls[idx] = val
      return { ...prev, imageUrls: urls }
    })
    const id = extractDriveId(val)
    setPreviews((p) => ({ ...p, [idx]: id ? driveUrl(id) : null }))
    setPreviewErrors((e) => ({ ...e, [idx]: false }))
  }

  const addImageUrl = () => setF((prev) => ({ ...prev, imageUrls: [...prev.imageUrls, ''] }))
  const removeImageUrl = (idx) => {
    setF((prev) => {
      const urls = prev.imageUrls.filter((_, i) => i !== idx)
      return { ...prev, imageUrls: urls.length ? urls : [''] }
    })
    setPreviews((p) => { const n = { ...p }; delete n[idx]; return n })
  }

  const buildRecipe = (extraFields = {}) => {
    const imageIds = f.imageUrls.map((u) => extractDriveId(u)).filter(Boolean)
    const tags = f.tags.split(',').map((t) => t.trim()).filter(Boolean)
    let recipe = { id: 'r-' + uid(), name: f.name.trim(), type: f.type, source: f.source.trim(), part: f.part, imageIds, notes: f.notes.trim(), tags, ...extraFields }
    if (f.type === 'workflow') {
      recipe.steps = f.stepsRaw.split('\n').map((line) => { const [label, ...rest] = line.split(':'); return { label: label.trim(), detail: rest.join(':').trim() } }).filter((s) => s.label)
    } else {
      recipe.mix = f.mixRaw.split('\n').map((line) => { const m = line.match(/^(.+?)\s*[x×*]?\s*(\d+\.?\d*)\s*$/); return m ? { paint: m[1].trim(), parts: parseFloat(m[2]) } : null }).filter(Boolean)
    }
    return recipe
  }

  const handleSubmit = () => {
    if (!f.name.trim()) return
    const imageIds = f.imageUrls.map((u) => extractDriveId(u)).filter(Boolean)
    const tags = f.tags.split(',').map((t) => t.trim()).filter(Boolean)

    if (f.scope === 'moodboard') {
      const entry = { id: 'mb-' + uid(), source: f.name.trim(), platform: f.source.trim(), notes: f.notes.trim(), tags, imageIds }
      onSubmit((nb) => ({ ...nb, armies: nb.armies.map((a) => a.id !== f.armyId ? a : { ...a, moodboard: [...a.moodboard, entry] }) }))
      onClose(); return
    }

    if (f.scope === 'bases') {
      const recipe = buildRecipe({ part: 'bases' })
      onSubmit((nb) => ({ ...nb, bases: { ...nb.bases, recipes: [...(nb.bases?.recipes || []), recipe] } }))
      onClose(); return
    }

    const recipe = buildRecipe()

    if (f.scope === 'army') {
      onSubmit((nb) => ({ ...nb, armies: nb.armies.map((a) => a.id !== f.armyId ? a : { ...a, sharedRecipes: [...a.sharedRecipes, recipe] }) }))
    } else {
      if (!f.unitTypeId || !f.modelId) return
      onSubmit((nb) => ({
        ...nb,
        armies: nb.armies.map((a) => a.id !== f.armyId ? a : {
          ...a,
          unitTypes: a.unitTypes.map((ut) => ut.id !== f.unitTypeId ? ut : {
            ...ut,
            models: ut.models.map((m) => m.id !== f.modelId ? m : { ...m, recipes: [...m.recipes, recipe] }),
          }),
        }),
      }))
    }
    onClose()
  }

  const valid = f.name.trim() && (
    f.scope === 'bases' ||
    (f.armyId && (f.scope !== 'model' || (f.unitTypeId && f.modelId)))
  )
  const row = { marginBottom: 14 }

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 360, height: '100vh', background: '#0e0a06', borderLeft: '1px solid #2a1f14', overflowY: 'auto', zIndex: 1500, padding: '20px 20px 40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ ...S.mono, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a5438' }}>Add Entry</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5a4830', fontSize: 18, cursor: 'pointer' }}>✕</button>
      </div>

      <div style={row}>
        <label style={S.label}>Entry type</label>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SCOPES.map((o) => (
            <button key={o.value} onClick={() => set('scope', o.value)} style={{ ...S.mono, fontSize: 10, padding: '5px 10px', border: '1px solid', borderRadius: 3, cursor: 'pointer', letterSpacing: '0.05em', textTransform: 'uppercase', background: f.scope === o.value ? '#2d5a27' : '#1a1208', borderColor: f.scope === o.value ? '#4a7c3f' : '#3a2c1e', color: f.scope === o.value ? '#c8a96e' : '#6a5438' }}>
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {f.scope !== 'bases' && (
        <div style={row}>
          <label style={S.label}>Army</label>
          <select value={f.armyId} onChange={(e) => set('armyId', e.target.value)} style={S.select}>
            <option value="">— select army —</option>
            {notebook.armies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
      )}

      {f.scope === 'model' && f.armyId && (
        <>
          <div style={row}>
            <label style={S.label}>Unit type</label>
            <select value={f.unitTypeId} onChange={(e) => set('unitTypeId', e.target.value)} style={S.select}>
              <option value="">— select —</option>
              {army?.unitTypes.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
          </div>
          {f.unitTypeId && (
            <div style={row}>
              <label style={S.label}>Model</label>
              <select value={f.modelId} onChange={(e) => set('modelId', e.target.value)} style={S.select}>
                <option value="">— select —</option>
                {unitType?.models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          )}
        </>
      )}

      <div style={{ borderTop: '1px solid #2a1f14', margin: '18px 0 16px' }} />

      <div style={row}>
        <label style={S.label}>{f.scope === 'moodboard' ? 'Source / creator' : 'Recipe name'}</label>
        <input value={f.name} onChange={(e) => set('name', e.target.value)} style={S.input} placeholder={f.scope === 'moodboard' ? '@artist or channel' : 'e.g. Dark Green Basecoat'} />
      </div>
      <div style={row}>
        <label style={S.label}>{f.scope === 'moodboard' ? 'Platform' : 'Source'}</label>
        <input value={f.source} onChange={(e) => set('source', e.target.value)} style={S.input} placeholder={f.scope === 'moodboard' ? 'Instagram, YouTube…' : '@handle or URL'} />
      </div>

      {f.scope !== 'moodboard' && (
        <>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Type</label>
              <select value={f.type} onChange={(e) => set('type', e.target.value)} style={S.select}>
                <option value="workflow">Workflow</option>
                <option value="mix">Mix ratio</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label style={S.label}>Part</label>
              <select value={f.part} onChange={(e) => set('part', e.target.value)} style={S.select}>
                <option value="">— part —</option>
                {PART_ORDER.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          {f.type === 'workflow' && (
            <div style={row}>
              <label style={S.label}>Steps (Label: Detail, one per line)</label>
              <textarea value={f.stepsRaw} onChange={(e) => set('stepsRaw', e.target.value)} style={{ ...S.input, height: 100, resize: 'vertical' }} placeholder={'Base: Khorne Red over primer\nLayer: Mephiston Red\nHighlight: Evil Sunz Scarlet'} />
            </div>
          )}
          {f.type === 'mix' && (
            <div style={row}>
              <label style={S.label}>Mix (Paint Name × Parts, one per line)</label>
              <textarea value={f.mixRaw} onChange={(e) => set('mixRaw', e.target.value)} style={{ ...S.input, height: 80, resize: 'vertical' }} placeholder={'Lahmian Medium × 2\nRatling Grime × 1'} />
            </div>
          )}
        </>
      )}

      {/* Multi-image input */}
      <div style={row}>
        <label style={S.label}>Drive images ({f.imageUrls.length})</label>
        {f.imageUrls.map((url, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <input value={url} onChange={(e) => setImageUrl(idx, e.target.value)} style={{ ...S.input, flex: 1 }} placeholder="https://drive.google.com/file/d/…" />
              {f.imageUrls.length > 1 && (
                <button onClick={() => removeImageUrl(idx)} style={{ background: 'none', border: '1px solid #3a2c1e', borderRadius: 3, color: '#7a3828', cursor: 'pointer', padding: '4px 8px', fontSize: 12, flexShrink: 0 }}>✕</button>
              )}
            </div>
            {previews[idx] && !previewErrors[idx] && (
              <img src={previews[idx]} alt="" onError={() => setPreviewErrors((e) => ({ ...e, [idx]: true }))}
                style={{ marginTop: 6, width: '100%', maxHeight: 100, objectFit: 'cover', borderRadius: 3, border: '1px solid #3a2c1e' }} />
            )}
            {previewErrors[idx] && <div style={{ marginTop: 4, color: '#7a3828', fontSize: 10, ...S.mono }}>Preview unavailable</div>}
          </div>
        ))}
        <button onClick={addImageUrl} style={{ ...S.btnGhost, fontSize: 10, padding: '5px 12px', marginTop: 4 }}>+ Add image</button>
      </div>

      <div style={row}>
        <label style={S.label}>Notes</label>
        <textarea value={f.notes} onChange={(e) => set('notes', e.target.value)} style={{ ...S.input, height: 70, resize: 'vertical' }} placeholder="Technique tips, context, caveats…" />
      </div>
      <div style={row}>
        <label style={S.label}>Tags (comma separated)</label>
        <input value={f.tags} onChange={(e) => set('tags', e.target.value)} style={S.input} placeholder="green, armor, NMM" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button onClick={onClose} style={S.btnGhost}>Cancel</button>
        <button onClick={handleSubmit} style={{ ...S.btnPrimary, opacity: valid ? 1 : 0.4, cursor: valid ? 'pointer' : 'default', flex: 1 }}>Add to Notebook</button>
      </div>
    </div>
  )
}
