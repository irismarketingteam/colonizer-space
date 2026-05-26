import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const BRANDS = [
  'SpaceX', 'Blue Origin', 'NASA', 'Rocket Lab', 'Relativity Space',
  'United Launch Alliance', 'Axiom Space', 'Sierra Space', 'Vast',
  'Firefly Aerospace', 'ESA', 'JAXA', 'ispace', 'Astrobotic',
  'Intuitive Machines', 'Boeing', 'Northrop Grumman', 'L3Harris',
]

export default function PressPhotos() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [brandFilter, setBrandFilter] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addForm, setAddForm] = useState({
    brand: 'SpaceX',
    url: '',
    thumbnail_url: '',
    alt_text: '',
    credit: '',
    tags: '',
    mission: '',
    vehicle: '',
    source_page: '',
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadPhotos() }, [brandFilter])

  async function loadPhotos() {
    if (!supabase) return
    setLoading(true)
    let query = supabase
      .from('press_photos')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)
    if (brandFilter) query = query.eq('brand', brandFilter)
    const { data } = await query
    setPhotos(data || [])
    setLoading(false)
  }

  async function handleAdd() {
    if (!supabase || !addForm.url || !addForm.credit) return
    setSaving(true)
    const record = {
      brand: addForm.brand,
      url: addForm.url,
      thumbnail_url: addForm.thumbnail_url || null,
      alt_text: addForm.alt_text || null,
      credit: addForm.credit,
      tags: addForm.tags ? addForm.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      mission: addForm.mission || null,
      vehicle: addForm.vehicle || null,
      source_page: addForm.source_page || null,
    }
    const { error } = await supabase.from('press_photos').insert(record)
    setSaving(false)
    if (!error) {
      setShowAdd(false)
      setAddForm({ brand: 'SpaceX', url: '', thumbnail_url: '', alt_text: '', credit: '', tags: '', mission: '', vehicle: '', source_page: '' })
      loadPhotos()
    }
  }

  async function handleDelete(id) {
    if (!supabase || !confirm('Delete this photo?')) return
    await supabase.from('press_photos').delete().eq('id', id)
    loadPhotos()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="font-display text-h3 text-text-primary">Press Photos</h2>
          <span className="font-mono text-micro text-text-tertiary">{photos.length} photos</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="admin-input w-auto"
          >
            <option value="">All brands</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="px-4 py-1.5 font-mono text-micro bg-accent text-white hover:bg-accent-hover transition-colors"
          >
            + Add Photo
          </button>
        </div>
      </div>

      {showAdd && (
        <div className="border border-subtle p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-mono text-micro text-text-secondary mb-1 block">Brand *</span>
              <select value={addForm.brand} onChange={(e) => setAddForm(p => ({ ...p, brand: e.target.value }))} className="admin-input">
                {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="font-mono text-micro text-text-secondary mb-1 block">Credit *</span>
              <input type="text" value={addForm.credit} onChange={(e) => setAddForm(p => ({ ...p, credit: e.target.value }))} placeholder="SpaceX / NASA / Blue Origin" className="admin-input" />
            </label>
          </div>
          <label className="block">
            <span className="font-mono text-micro text-text-secondary mb-1 block">Image URL *</span>
            <input type="url" value={addForm.url} onChange={(e) => setAddForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className="admin-input font-mono text-[0.85rem]" />
          </label>
          {addForm.url && (
            <img src={addForm.url} alt="Preview" className="w-48 aspect-video object-cover border border-subtle" />
          )}
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-mono text-micro text-text-secondary mb-1 block">Alt text</span>
              <input type="text" value={addForm.alt_text} onChange={(e) => setAddForm(p => ({ ...p, alt_text: e.target.value }))} placeholder="Descriptive alt" className="admin-input" />
            </label>
            <label className="block">
              <span className="font-mono text-micro text-text-secondary mb-1 block">Tags (comma-separated)</span>
              <input type="text" value={addForm.tags} onChange={(e) => setAddForm(p => ({ ...p, tags: e.target.value }))} placeholder="starship, launch, boca chica" className="admin-input" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="font-mono text-micro text-text-secondary mb-1 block">Mission</span>
              <input type="text" value={addForm.mission} onChange={(e) => setAddForm(p => ({ ...p, mission: e.target.value }))} placeholder="Starship Flight 7" className="admin-input" />
            </label>
            <label className="block">
              <span className="font-mono text-micro text-text-secondary mb-1 block">Vehicle</span>
              <input type="text" value={addForm.vehicle} onChange={(e) => setAddForm(p => ({ ...p, vehicle: e.target.value }))} placeholder="Starship" className="admin-input" />
            </label>
          </div>
          <label className="block">
            <span className="font-mono text-micro text-text-secondary mb-1 block">Source page URL</span>
            <input type="url" value={addForm.source_page} onChange={(e) => setAddForm(p => ({ ...p, source_page: e.target.value }))} placeholder="https://spacex.com/media" className="admin-input font-mono text-[0.85rem]" />
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={handleAdd} disabled={saving || !addForm.url || !addForm.credit} className="px-4 py-1.5 font-mono text-micro bg-signal-live text-white hover:bg-signal-live/80 transition-colors disabled:opacity-30">
              {saving ? 'Saving...' : 'Save Photo'}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 font-mono text-micro border border-subtle text-text-tertiary hover:text-text-primary transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-text-tertiary font-mono text-caption animate-pulse">Loading photos...</div>
      ) : photos.length === 0 ? (
        <div className="border border-subtle p-8 text-center">
          <p className="text-text-secondary mb-2">No press photos yet.</p>
          <p className="text-text-tertiary text-caption">Add photos from brand media kits (SpaceX, Blue Origin, NASA, etc.) to use as article cover images instead of stock photos.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <div key={photo.id} className="group border border-subtle overflow-hidden">
              <div className="aspect-video bg-elevated relative">
                <img src={photo.thumbnail_url || photo.url} alt={photo.alt_text || photo.brand} className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-2 right-2 w-6 h-6 bg-void/80 text-signal-critical text-micro font-mono opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  x
                </button>
              </div>
              <div className="p-2 space-y-0.5">
                <div className="font-mono text-micro text-accent">{photo.brand}</div>
                {photo.mission && <div className="font-mono text-micro text-text-secondary">{photo.mission}</div>}
                <div className="font-mono text-micro text-text-tertiary truncate">{photo.credit}</div>
                {photo.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {photo.tags.map(t => (
                      <span key={t} className="font-mono text-[0.6rem] px-1.5 py-0.5 bg-elevated text-text-tertiary">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
