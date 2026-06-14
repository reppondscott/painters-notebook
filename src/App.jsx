import { useState, useEffect, useCallback } from 'react'
import { loadNotebook, saveNotebook } from './lib/supabase.js'
import { SEED } from './data/seed.js'
import { S } from './components/shared.jsx'
import ArmyChapter from './components/ArmyChapter.jsx'
import PartIndex from './components/PartIndex.jsx'
import IntakeForm from './components/IntakeForm.jsx'
import FolderScan from './components/FolderScan.jsx'
import ManagePanel from './components/ManagePanel.jsx'

const SAVE_COLORS = { idle: 'transparent', saving: '#5a4830', saved: '#5a7040', error: '#7a3828' }
const SAVE_LABELS = { idle: '', saving: 'Saving…', saved: 'Saved ✓', error: 'Save failed' }

export default function App() {
  const [notebook, setNotebook] = useState(null)
  const [activeArmy, setActiveArmy] = useState(null)
  const [saveStatus, setSaveStatus] = useState('idle')
  const [panel, setPanel] = useState(null) // null | 'intake' | 'scan' | 'manage'
  const [initError, setInitError] = useState(null)

  // ── Load from Supabase ──
  useEffect(() => {
    async function init() {
      try {
        let data = await loadNotebook()
        // If empty armies array, seed it
        if (!data || !data.armies || data.armies.length === 0) {
          data = SEED
          await saveNotebook(SEED)
        }
        setNotebook(data)
        setActiveArmy(data.armies[0]?.id ?? null)
      } catch (e) {
        setInitError(e.message)
        // Fall back to seed data so app is usable
        setNotebook(SEED)
        setActiveArmy(SEED.armies[0]?.id ?? null)
      }
    }
    init()
  }, [])

  // ── Save helper ──
  const save = useCallback(async (data) => {
    setSaveStatus('saving')
    try {
      await saveNotebook(data)
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }, [])

  // ── Update helper ──
  const update = useCallback((updater) => {
    setNotebook((prev) => {
      const next = updater(prev)
      save(next)
      return next
    })
  }, [save])

  // ── Loading ──
  if (!notebook) {
    return (
      <div style={{ minHeight: '100vh', background: '#120d08', display: 'flex', alignItems: 'center', justifyContent: 'center', ...S.mono, color: '#5a4830', fontSize: 12, letterSpacing: '0.1em' }}>
        Loading notebook…
      </div>
    )
  }

  const showIndex = activeArmy === '__index__'
  const army = notebook.armies.find((a) => a.id === activeArmy)

  return (
    <div style={{ minHeight: '100vh', background: '#120d08', color: '#c8a96e', fontFamily: "Georgia, 'Times New Roman', serif", paddingBottom: 60 }}>

      {/* ── Top bar ── */}
      <div style={{ background: '#0e0a06', borderBottom: '1px solid #2a1f14', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ ...S.mono, fontSize: 13, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6a5438', fontWeight: 700 }}>
          Painter's Notebook
        </div>
        <div style={{ color: '#3a2c1e', fontSize: 11, fontStyle: 'italic' }}>Warhammer 40,000</div>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          {saveStatus !== 'idle' && <span style={{ fontSize: 10, ...S.mono, color: SAVE_COLORS[saveStatus] }}>{SAVE_LABELS[saveStatus]}</span>}
          {initError && <span style={{ fontSize: 10, ...S.mono, color: '#7a3828' }} title={initError}>⚠ DB offline — changes won't persist</span>}
          <button onClick={() => setPanel(panel === 'scan' ? null : 'scan')} style={{ ...S.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', background: panel === 'scan' ? '#3a2c1e' : 'none', border: '1px solid #3a2c1e', borderRadius: 3, padding: '5px 12px', color: '#8a6848', cursor: 'pointer' }}>
            Scan Folder
          </button>
          <button onClick={() => setPanel(panel === 'manage' ? null : 'manage')} style={{ ...S.mono, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', background: panel === 'manage' ? '#3a2c1e' : 'none', border: '1px solid #3a2c1e', borderRadius: 3, padding: '5px 12px', color: '#8a6848', cursor: 'pointer' }}>
            Manage
          </button>
          <button onClick={() => setPanel(panel === 'intake' ? null : 'intake')} style={{ ...S.mono, fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', background: '#2d5a27', border: 'none', borderRadius: 3, padding: '6px 14px', color: '#c8a96e', cursor: 'pointer' }}>
            + Add Entry
          </button>
        </div>
      </div>

      {/* ── Army tabs ── */}
      <div style={{ background: '#0e0a06', borderBottom: '1px solid #1e160e', padding: '0 24px', display: 'flex', gap: 0, overflowX: 'auto' }}>
        {notebook.armies.map((a) => (
          <button key={a.id} onClick={() => setActiveArmy(a.id)} style={{ background: 'none', border: 'none', borderBottom: activeArmy === a.id ? `2px solid ${a.accentLight}` : '2px solid transparent', padding: '10px 18px', color: activeArmy === a.id ? a.accentLight : '#4a3828', ...S.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {a.name}
          </button>
        ))}
        <button onClick={() => setActiveArmy('__index__')} style={{ background: 'none', border: 'none', borderBottom: showIndex ? '2px solid #8a6a38' : '2px solid transparent', padding: '10px 18px', color: showIndex ? '#c8a96e' : '#4a3828', ...S.mono, fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', whiteSpace: 'nowrap' }}>
          By Part
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px' }}>
        {showIndex
          ? <div>
              <div style={{ borderBottom: '2px solid #4a3828', marginBottom: 20, paddingBottom: 12 }}>
                <div style={{ ...S.mono, fontSize: 20, fontWeight: 700, color: '#c8a96e', letterSpacing: '0.05em', textTransform: 'uppercase' }}>By Part</div>
                <div style={{ color: '#5a4830', fontSize: 11, marginTop: 3, fontStyle: 'italic' }}>All recipes across all armies, grouped by model surface</div>
              </div>
              <PartIndex armies={notebook.armies} />
            </div>
          : army && <ArmyChapter army={army} />}
      </div>

      {/* ── Panels ── */}
      {panel === 'intake' && <IntakeForm notebook={notebook} onSubmit={update} onClose={() => setPanel(null)} />}
      {panel === 'scan' && <FolderScan notebook={notebook} onSubmit={update} onClose={() => setPanel(null)} />}
      {panel === 'manage' && <ManagePanel notebook={notebook} onSubmit={update} onClose={() => setPanel(null)} />}
    </div>
  )
}
