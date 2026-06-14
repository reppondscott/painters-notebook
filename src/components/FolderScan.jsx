import { useState } from 'react'
import { S, PART_ORDER, uid } from './shared.jsx'
import { scanDriveFolder, getTaggedIds, driveUrl, extractDriveId } from '../lib/drive.js'

const BLANK_TAG = { scope: 'model', armyId: '', unitTypeId: '', modelId: '', name: '', source: '', part: '', notes: '', tags: '' }

export default function FolderScan({ notebook, onSubmit, onClose }) {
  const [status, setStatus] = useState('idle') // idle | scanning | done | error
  const [files, setFiles] = useState([])
  const [tagging, setTagging] = useState(null) // file being tagged
  const [form, setForm] = useState(BLANK_TAG)
  const [errorMsg, setErrorMsg] = useState('')

  const scan = async () => {
    setStatus('scanning')
    setErrorMsg('')
    try {
      const allFiles = await scanDriveFolder()
      const tagged = getTaggedIds(notebook)
      const untagged = allFiles.filter((f) => !tagged.has(f.id))
      setFiles(untagged)
      setStatus('done')
    } catch (e) {
      setErrorMsg(e.message)
      setStatus('error')
    }
  }

  const startTag = (file) => {
    setTagging(file)
    setForm({ ...BLANK_TAG, name: file.name.replace(/\.[^.]+$/, '') })
  }

  const setF = (k, v) => setForm((prev) => {
    const next = { ...prev, [k]: v }
    if (k === 'armyId') { next.unitTypeId = ''; next.modelId = '' }
    if (k === 'unitTypeId') next.modelId = ''
    return next
  })

  const army = notebook.armies.find((a) => a.id === form.armyId)
  const unitType = army?.unitTypes.find((u) => u.id === form.unitTypeId)

  const handleTag = () => {
    if (!tagging || !form.armyId || !form.name.trim()) return
    const imageId = tagging.id
    const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)

    if (form.scope === 'moodboard') {
      const entry = { id: 'mb-' + uid(), source: form.name.trim(), platform: form.source.trim(), notes: form.notes.trim(), tags, imageId }
      onSubmit((nb) => ({ ...nb, armies: nb.armies.map((a) => a.id !== form.armyId ? a : { ...a, moodboard: [...a.moodboard, entry] }) }))
    } else if (form.scope === 'army') {
      const recipe = { id: 'r-' + uid(), name: form.name.trim(), type: 'workflow', source: form.source.trim(), part: form.part, imageId, notes: form.notes.trim(), tags, steps: [] }
      onSubmit((nb) => ({ ...nb, armies: nb.armies.map((a) => a.id !== form.armyId ? a : { ...a, sharedRecipes: [...a.sharedRecipes, recipe] }) }))
    } else {
      if (!form.unitTypeId || !form.modelId) return
      const recipe = { id: 'r-' + uid(), name: form.name.trim(), type: 'workflow', source: form.source.trim(), part: form.part, imageId, notes: form.notes.trim(), tags, steps: [] }
      onSubmit((nb) => ({
        ...nb,
        armies: nb.armies.map((a) => a.id !== form.armyId ? a : {
          ...a,
          unitTypes: a.unitTypes.map((ut) => ut.id !== form.unitTypeId ? ut : {
            ...ut,
            models: ut.models.map((m) => m.id !== form.modelId ? m : { ...m, recipes: [...m.recipes, recipe] }),
          }),
        }),
      }))
    }

    setFiles((prev) => prev.filter((f) => f.id !== tagging.id))
    setTagging(null)
    setForm(BLANK_TAG)
  }

  const row = { marginBottom: 12 }
  const noApiKey = !import.meta.env.VITE_GOOGLE_API_KEY

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 380, height: '100vh', background: '#0e0a06', borderLeft: '1px solid #2a1f14', overflowY: 'auto', zIndex: 1500, padding: '20px 20px 40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ ...S.mono, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a5438' }}>Scan Drive Folder</div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#5a4830', fontSize: 18, cursor: 'pointer' }}>✕</button>
      </div>

      {noApiKey && (
        <div style={{ background: '#1a0e08', border: '1px solid #5a3828', borderRadius: 4, padding: '10px 12px', marginBottom: 16, color: '#a06848', fontSize: 11, ...S.mono, lineHeight: 1.6 }}>
          Google API key not configured. Add VITE_GOOGLE_API_KEY to your Vercel environment variables to enable folder scanning.
        </div>
      )}

      {status === 'idle' && (
        <button onClick={scan} disabled={noApiKey} style={{ ...S.btnPrimary, opacity: noApiKey ? 0.4 : 1, cursor: noApiKey ? 'default' : 'pointer', width: '100%' }}>
          Scan Folder for New Images
        </button>
      )}

      {status === 'scanning' && <div style={{ color: '#5a4830', fontSize: 12, ...S.mono, textAlign: 'center', padding: '20px 0' }}>Scanning…</div>}

      {status === 'error' && (
        <div style={{ color: '#7a3828', fontSize: 11, ...S.mono, marginBottom: 12 }}>{errorMsg}</div>
      )}

      {status === 'done' && !tagging && (
        <div>
          <div style={{ color: '#5a7040', fontSize: 11, ...S.mono, marginBottom: 16 }}>
            {files.length === 0 ? 'All images already tagged.' : `${files.length} untagged image${files.length !== 1 ? 's' : ''} found.`}
          </div>
          {files.map((file) => (
            <div key={file.id} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 10, background: '#1a1208', border: '1px solid #2a1f14', borderRadius: 4, padding: '8px 10px' }}>
              <img src={driveUrl(file.id)} alt="" style={{ width: 60, height: 44, objectFit: 'cover', borderRadius: 3, flexShrink: 0 }} />
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ color: '#a08050', fontSize: 11, ...S.mono, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</div>
              </div>
              <button onClick={() => startTag(file)} style={{ ...S.mono, fontSize: 10, padding: '4px 10px', background: '#2d5a27', border: 'none', borderRadius: 3, color: '#c8a96e', cursor: 'pointer', textTransform: 'uppercase', flexShrink: 0 }}>Tag</button>
            </div>
          ))}
          {files.length > 0 && <button onClick={scan} style={{ ...S.btnGhost, width: '100%', marginTop: 8 }}>Rescan</button>}
        </div>
      )}

      {tagging && (
        <div>
          <div style={{ marginBottom: 14 }}>
            <img src={driveUrl(tagging.id)} alt="" style={{ width: '100%', maxHeight: 140, objectFit: 'cover', borderRadius: 4, border: '1px solid #3a2c1e' }} />
            <div style={{ color: '#6a5438', fontSize: 10, ...S.mono, marginTop: 6 }}>{tagging.name}</div>
          </div>

          <div style={row}>
            <label style={S.label}>Entry type</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[{ value: 'model', label: 'Model' }, { value: 'army', label: 'Army-wide' }, { value: 'moodboard', label: 'Moodboard' }].map((o) => (
                <button key={o.value} onClick={() => setF('scope', o.value)} style={{ ...S.mono, fontSize: 10, padding: '5px 10px', border: '1px solid', borderRadius: 3, cursor: 'pointer', textTransform: 'uppercase', background: form.scope === o.value ? '#2d5a27' : '#1a1208', borderColor: form.scope === o.value ? '#4a7c3f' : '#3a2c1e', color: form.scope === o.value ? '#c8a96e' : '#6a5438' }}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div style={row}>
            <label style={S.label}>Army</label>
            <select value={form.armyId} onChange={(e) => setF('armyId', e.target.value)} style={S.select}>
              <option value="">— select —</option>
              {notebook.armies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          {form.scope === 'model' && form.armyId && (
            <>
              <div style={row}>
                <label style={S.label}>Unit type</label>
                <select value={form.unitTypeId} onChange={(e) => setF('unitTypeId', e.target.value)} style={S.select}>
                  <option value="">— select —</option>
                  {army?.unitTypes.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
                </select>
              </div>
              {form.unitTypeId && (
                <div style={row}>
                  <label style={S.label}>Model</label>
                  <select value={form.modelId} onChange={(e) => setF('modelId', e.target.value)} style={S.select}>
                    <option value="">— select —</option>
                    {unitType?.models.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              )}
            </>
          )}

          <div style={row}>
            <label style={S.label}>Name / title</label>
            <input value={form.name} onChange={(e) => setF('name', e.target.value)} style={S.input} />
          </div>
          <div style={row}>
            <label style={S.label}>Source</label>
            <input value={form.source} onChange={(e) => setF('source', e.target.value)} style={S.input} placeholder="@handle or platform" />
          </div>
          {form.scope !== 'moodboard' && (
            <div style={row}>
              <label style={S.label}>Part</label>
              <select value={form.part} onChange={(e) => setF('part', e.target.value)} style={S.select}>
                <option value="">— part —</option>
                {PART_ORDER.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          )}
          <div style={row}>
            <label style={S.label}>Notes</label>
            <textarea value={form.notes} onChange={(e) => setF('notes', e.target.value)} style={{ ...S.input, height: 60, resize: 'vertical' }} />
          </div>
          <div style={row}>
            <label style={S.label}>Tags</label>
            <input value={form.tags} onChange={(e) => setF('tags', e.target.value)} style={S.input} placeholder="green, armor" />
          </div>

          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button onClick={() => { setTagging(null); setForm(BLANK_TAG) }} style={S.btnGhost}>Back</button>
            <button onClick={handleTag} style={{ ...S.btnPrimary, flex: 1 }}>Tag Image</button>
          </div>
        </div>
      )}
    </div>
  )
}
