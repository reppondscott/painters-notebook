import { useState } from 'react'
import { S, uid } from './shared.jsx'

export default function ManagePanel({ notebook, onSubmit, onClose }) {
  const [view, setView] = useState('main') // main | addArmy | addUnit | addModel
  const [selectedArmyId, setSelectedArmyId] = useState('')
  const [selectedUnitId, setSelectedUnitId] = useState('')
  const [form, setForm] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const army = notebook.armies.find((a) => a.id === selectedArmyId)
  const unitType = army?.unitTypes.find((u) => u.id === selectedUnitId)

  const addArmy = () => {
    if (!form.name?.trim()) return
    const newArmy = {
      id: form.name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + uid(),
      name: form.name.trim(),
      subtitle: form.subtitle?.trim() || '',
      accentColor: form.accentColor || '#4a3828',
      accentLight: form.accentLight || '#8a6848',
      moodboard: [], unitTypes: [], sharedRecipes: [],
    }
    onSubmit((nb) => ({ ...nb, armies: [...nb.armies, newArmy] }))
    setForm({})
    setView('main')
  }

  const addUnit = () => {
    if (!selectedArmyId || !form.label?.trim()) return
    const newUnit = { id: form.label.trim().toLowerCase().replace(/\s+/g, '-') + '-' + uid(), label: form.label.trim(), models: [] }
    onSubmit((nb) => ({ ...nb, armies: nb.armies.map((a) => a.id !== selectedArmyId ? a : { ...a, unitTypes: [...a.unitTypes, newUnit] }) }))
    setForm({})
    setView('main')
  }

  const addModel = () => {
    if (!selectedArmyId || !selectedUnitId || !form.name?.trim()) return
    const newModel = { id: form.name.trim().toLowerCase().replace(/\s+/g, '-') + '-' + uid(), name: form.name.trim(), notes: form.notes?.trim() || '', recipes: [] }
    onSubmit((nb) => ({
      ...nb,
      armies: nb.armies.map((a) => a.id !== selectedArmyId ? a : {
        ...a,
        unitTypes: a.unitTypes.map((ut) => ut.id !== selectedUnitId ? ut : { ...ut, models: [...ut.models, newModel] }),
      }),
    }))
    setForm({})
    setView('main')
  }

  const startEdit = (id, val) => { setEditingId(id); setEditValue(val) }
  const commitEdit = (type, armyId, unitId, modelId) => {
    if (!editValue.trim()) { setEditingId(null); return }
    onSubmit((nb) => {
      if (type === 'army') return { ...nb, armies: nb.armies.map((a) => a.id !== armyId ? a : { ...a, name: editValue.trim() }) }
      if (type === 'unit') return { ...nb, armies: nb.armies.map((a) => a.id !== armyId ? a : { ...a, unitTypes: a.unitTypes.map((u) => u.id !== unitId ? u : { ...u, label: editValue.trim() }) }) }
      if (type === 'model') return { ...nb, armies: nb.armies.map((a) => a.id !== armyId ? a : { ...a, unitTypes: a.unitTypes.map((u) => u.id !== unitId ? u : { ...u, models: u.models.map((m) => m.id !== modelId ? m : { ...m, name: editValue.trim() }) }) }) }
      return nb
    })
    setEditingId(null)
  }

  const row = { marginBottom: 12 }
  const itemStyle = { display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 3, background: '#1a1208', marginBottom: 4 }

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: 360, height: '100vh', background: '#0e0a06', borderLeft: '1px solid #2a1f14', overflowY: 'auto', zIndex: 1500, padding: '20px 20px 40px', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ ...S.mono, fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6a5438' }}>
          {view === 'main' ? 'Manage Armies & Models' : view === 'addArmy' ? 'Add Army' : view === 'addUnit' ? 'Add Unit Type' : 'Add Model'}
        </div>
        <button onClick={view === 'main' ? onClose : () => setView('main')} style={{ background: 'none', border: 'none', color: '#5a4830', fontSize: 18, cursor: 'pointer' }}>
          {view === 'main' ? '✕' : '←'}
        </button>
      </div>

      {/* MAIN VIEW */}
      {view === 'main' && (
        <div>
          {/* Quick-add buttons */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
            <button onClick={() => setView('addArmy')} style={{ ...S.btnPrimary, fontSize: 10 }}>+ Army</button>
            <button onClick={() => setView('addUnit')} style={{ ...S.btnGhost, fontSize: 10 }}>+ Unit Type</button>
            <button onClick={() => setView('addModel')} style={{ ...S.btnGhost, fontSize: 10 }}>+ Model</button>
          </div>

          {/* Army list */}
          {notebook.armies.map((a) => (
            <div key={a.id} style={{ marginBottom: 16 }}>
              <div style={itemStyle}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: a.accentLight, flexShrink: 0 }} />
                {editingId === a.id
                  ? <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => commitEdit('army', a.id)} onKeyDown={(e) => e.key === 'Enter' && commitEdit('army', a.id)} autoFocus style={{ ...S.input, padding: '2px 6px', flex: 1 }} />
                  : <span style={{ color: '#b89560', ...S.mono, fontSize: 12, flex: 1 }}>{a.name}</span>}
                <button onClick={() => startEdit(a.id, a.name)} style={{ background: 'none', border: 'none', color: '#4a3828', fontSize: 11, cursor: 'pointer' }}>✎</button>
              </div>

              {/* Unit types */}
              <div style={{ paddingLeft: 16 }}>
                {a.unitTypes.map((ut) => (
                  <div key={ut.id} style={{ marginBottom: 6 }}>
                    <div style={{ ...itemStyle, background: '#150f07' }}>
                      <span style={{ color: '#6a5438', fontSize: 9, ...S.mono }}>▸</span>
                      {editingId === ut.id
                        ? <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => commitEdit('unit', a.id, ut.id)} onKeyDown={(e) => e.key === 'Enter' && commitEdit('unit', a.id, ut.id)} autoFocus style={{ ...S.input, padding: '2px 6px', flex: 1 }} />
                        : <span style={{ color: '#8a6848', ...S.mono, fontSize: 11, flex: 1 }}>{ut.label}</span>}
                      <button onClick={() => startEdit(ut.id, ut.label)} style={{ background: 'none', border: 'none', color: '#4a3828', fontSize: 11, cursor: 'pointer' }}>✎</button>
                    </div>

                    {/* Models */}
                    <div style={{ paddingLeft: 16 }}>
                      {ut.models.map((m) => (
                        <div key={m.id} style={{ ...itemStyle, background: 'transparent', border: '1px solid #1e160e' }}>
                          <span style={{ color: '#3a2c1e', fontSize: 8 }}>◆</span>
                          {editingId === m.id
                            ? <input value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => commitEdit('model', a.id, ut.id, m.id)} onKeyDown={(e) => e.key === 'Enter' && commitEdit('model', a.id, ut.id, m.id)} autoFocus style={{ ...S.input, padding: '2px 6px', flex: 1 }} />
                            : <span style={{ color: '#6a5438', ...S.mono, fontSize: 10, flex: 1 }}>{m.name}</span>}
                          <button onClick={() => startEdit(m.id, m.name)} style={{ background: 'none', border: 'none', color: '#3a2c1e', fontSize: 10, cursor: 'pointer' }}>✎</button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ADD ARMY */}
      {view === 'addArmy' && (
        <div>
          <div style={row}><label style={S.label}>Army name</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} style={S.input} placeholder="e.g. Space Wolves" /></div>
          <div style={row}><label style={S.label}>Subtitle</label><input value={form.subtitle || ''} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} style={S.input} placeholder="e.g. Painting Inspiration · Reference" /></div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <div style={{ flex: 1 }}><label style={S.label}>Accent color (dark)</label><input type="color" value={form.accentColor || '#4a3828'} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} style={{ ...S.input, padding: 4, height: 36 }} /></div>
            <div style={{ flex: 1 }}><label style={S.label}>Accent color (light)</label><input type="color" value={form.accentLight || '#8a6848'} onChange={(e) => setForm({ ...form, accentLight: e.target.value })} style={{ ...S.input, padding: 4, height: 36 }} /></div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => setView('main')} style={S.btnGhost}>Cancel</button>
            <button onClick={addArmy} style={{ ...S.btnPrimary, flex: 1 }}>Add Army</button>
          </div>
        </div>
      )}

      {/* ADD UNIT TYPE */}
      {view === 'addUnit' && (
        <div>
          <div style={row}><label style={S.label}>Army</label><select value={selectedArmyId} onChange={(e) => setSelectedArmyId(e.target.value)} style={S.select}><option value="">— select —</option>{notebook.armies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
          <div style={row}><label style={S.label}>Unit type label</label><input value={form.label || ''} onChange={(e) => setForm({ ...form, label: e.target.value })} style={S.input} placeholder="e.g. Elites, Fast Attack" /></div>
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => setView('main')} style={S.btnGhost}>Cancel</button>
            <button onClick={addUnit} style={{ ...S.btnPrimary, flex: 1 }}>Add Unit Type</button>
          </div>
        </div>
      )}

      {/* ADD MODEL */}
      {view === 'addModel' && (
        <div>
          <div style={row}><label style={S.label}>Army</label><select value={selectedArmyId} onChange={(e) => { setSelectedArmyId(e.target.value); setSelectedUnitId('') }} style={S.select}><option value="">— select —</option>{notebook.armies.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}</select></div>
          {selectedArmyId && <div style={row}><label style={S.label}>Unit type</label><select value={selectedUnitId} onChange={(e) => setSelectedUnitId(e.target.value)} style={S.select}><option value="">— select —</option>{army?.unitTypes.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}</select></div>}
          {selectedUnitId && (
            <>
              <div style={row}><label style={S.label}>Model name</label><input value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} style={S.input} placeholder="e.g. Gravis Captain" /></div>
              <div style={row}><label style={S.label}>Notes</label><textarea value={form.notes || ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} style={{ ...S.input, height: 60, resize: 'vertical' }} placeholder="Role, loadout, attachments…" /></div>
            </>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
            <button onClick={() => setView('main')} style={S.btnGhost}>Cancel</button>
            <button onClick={addModel} style={{ ...S.btnPrimary, flex: 1 }}>Add Model</button>
          </div>
        </div>
      )}
    </div>
  )
}
