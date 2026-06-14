const FOLDER_ID = import.meta.env.VITE_DRIVE_FOLDER_ID
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

export function driveUrl(fileId) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w800`
}

export function extractDriveId(url) {
  if (!url) return null
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
  if (m) return m[1]
  const m2 = url.match(/id=([a-zA-Z0-9_-]+)/)
  if (m2) return m2[1]
  if (/^[a-zA-Z0-9_-]{20,}$/.test(url.trim())) return url.trim()
  return null
}

export async function scanDriveFolder() {
  if (!API_KEY) throw new Error('Google API key not configured')
  const url = `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name,mimeType,createdTime)&key=${API_KEY}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Drive API error: ' + res.status)
  const json = await res.json()
  return json.files || []
}

export function getTaggedIds(notebook) {
  const ids = new Set()
  notebook.armies.forEach((army) => {
    army.moodboard.forEach((e) => { if (e.imageId) ids.add(e.imageId) })
    army.sharedRecipes.forEach((r) => { if (r.imageId) ids.add(r.imageId) })
    army.unitTypes.forEach((ut) =>
      ut.models.forEach((m) =>
        m.recipes.forEach((r) => { if (r.imageId) ids.add(r.imageId) })
      )
    )
  })
  return ids
}
