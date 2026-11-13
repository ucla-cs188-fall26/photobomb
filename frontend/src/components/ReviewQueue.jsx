import { X } from 'lucide-react'

export default function ReviewQueue({
  photos,
  newPhotoCount,
  onClose,
}) {
  if (photos.length === 0) return null

  return (
    <section
      className="absolute inset-x-3 bottom-4 z-20 max-h-[60%] overflow-hidden rounded-2xl bg-white shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
      aria-label="Photos to review"
    >
      <header className="flex items-center justify-between border-b border-black/10 px-4 py-3">
        <div>
          <h2 className="m-0 text-[14px] font-semibold text-[#1d1d1f]">
            Photos to review
          </h2>
          <p className="mt-0.5 text-[11px] text-[#6e6e73]">
            {photos.length} flagged by AI Optimize
            {newPhotoCount > 0 ? ` · ${newPhotoCount} new` : ''}
          </p>
        </div>
        <button
          className="grid size-7 place-items-center rounded-full bg-[#f2f2f7] text-[#6e6e73]"
          type="button"
          onClick={onClose}
          aria-label="Close photos to review"
        >
          <X size={15} />
        </button>
      </header>
      <ul className="hide-scrollbar m-0 max-h-[calc(60vh-70px)] list-none overflow-y-auto px-4 py-2">
        {photos.map((photo) => (
          <li
            className="flex items-center gap-3 border-b border-black/5 py-2.5 last:border-0"
            key={photo.id}
          >
            <img
              className="size-11 shrink-0 rounded-lg object-cover"
              src={photo.src}
              alt=""
            />
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-[#1d1d1f]">
                {photo.label}
              </p>
              <p className="mt-0.5 text-[11px] leading-4 text-[#6e6e73]">
                {photo.reasons.join(' · ')}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
