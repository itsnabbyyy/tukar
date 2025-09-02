import { ShoppingCart, Plus, Pin as PinIcon } from 'lucide-react'

export default function ProductCard({ p, onAdd, onPin }) {
  const title = p?.name || 'Untitled product'
  const price = p?.price || ''
  const image = p?.image_url || ''
  const buyUrl = p?.product_url || '#'

  return (
    <div className="h-full rounded-2xl border border-black/10 bg-white p-3 shadow-soft">
      <div className="flex h-full flex-col">
        <div className="mb-2 overflow-hidden rounded-xl border border-black/10 bg-white">
          {image ? (
            <img src={image} alt={title} className="h-40 w-full object-cover" />
          ) : (
            <div className="grid h-40 w-full place-items-center text-xs text-muted">Product Image</div>
          )}
        </div>
        <div className="flex-1 whitespace-normal break-words text-sm font-medium leading-snug text-ink">{title}</div>
        <div className="mt-2 text-sm font-semibold text-ink">{price}</div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <button type="button" onClick={onAdd}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink hover:bg-black/5">
            <Plus size={16} /> Add
          </button>
          <button type="button" onClick={() => onPin?.()}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-black/10 bg-white px-3 py-2 text-sm text-ink hover:bg-black/5">
            <PinIcon size={16} /> Pin
          </button>
          <a href={buyUrl} target="_blank" rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-3 py-2 text-sm font-medium text-cta-text shadow-soft hover:brightness-95">
            <ShoppingCart size={16} /> Buy
          </a>
        </div>
      </div>
    </div>
  )
}
