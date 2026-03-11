import { create } from 'zustand'

const API = '/api'

export const useStore = create((set, get) => ({
  pitch: null,
  loading: false,
  error: null,
  currentSlide: 0,
  theme: 'midnight',
  themes: [],
  exporting: null, // 'pptx' | 'pdf' | null

  fetchThemes: async () => {
    try {
      const r = await fetch(`${API}/themes`)
      const data = await r.json()
      set({ themes: data })
    } catch (e) {}
  },

  generate: async (idea, industry, stage, slideCount) => {
    set({ loading: true, error: null, pitch: null, currentSlide: 0 })
    try {
      const r = await fetch(`${API}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, industry, stage, slide_count: slideCount })
      })
      if (!r.ok) throw new Error(await r.text())
      const data = await r.json()
      set({ pitch: data, loading: false })
    } catch (e) {
      set({ error: e.message, loading: false })
    }
  },

  exportDeck: async (format) => {
    const { pitch, theme } = get()
    if (!pitch) return
    set({ exporting: format })
    try {
      const r = await fetch(`${API}/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch, theme, format })
      })
      if (!r.ok) throw new Error('Export failed')
      const blob = await r.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${pitch.startup_name?.replace(/\s+/g,'-') || 'pitchdeck'}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    }
    set({ exporting: null })
  },

  setTheme: (t) => set({ theme: t }),
  setSlide: (i) => set({ currentSlide: i }),
  reset: () => set({ pitch: null, error: null, currentSlide: 0 }),
}))
