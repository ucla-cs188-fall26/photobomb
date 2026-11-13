import { useState } from 'react'
import { BatteryFull, Check, Signal, Wifi } from 'lucide-react'

export default function Gallery({ photos }) {
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [selecting, setSelecting] = useState(false)
  const selectedPhotos = photos.filter((photo) => selectedIds.has(photo.id))
  const selectedCount = selectedPhotos.length

  function toggleSelection(id) {
    if (!selecting) return

    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectMode() {
    if (selecting) setSelectedIds(new Set())
    setSelecting((current) => !current)
  }

  return (
    <>
      <div className="absolute inset-x-0 top-0 z-10">
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)]"
          aria-hidden="true"
        />
        <div className="relative z-10 flex h-[52px] items-center justify-between px-7 pt-1 text-[12px] font-semibold text-white">
          <span>9:41</span>
          <span className="absolute left-1/2 top-2 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black max-sm:hidden" />
          <div className="flex items-center gap-1">
            <Signal size={15} strokeWidth={2.4} aria-hidden="true" />
            <Wifi size={15} strokeWidth={2.4} aria-hidden="true" />
            <BatteryFull size={17} strokeWidth={2.4} aria-hidden="true" />
          </div>
        </div>
        <header className="relative z-10 flex h-[76px] items-center justify-between px-5">
          <div className="flex flex-col">
            <h1 className="m-0 text-[28px] font-bold leading-[30px] tracking-[-0.6px] text-white">
              Library
            </h1>
            <span className="mt-0.5 text-[13px] font-medium text-white">
              {photos.length} Photos
            </span>
          </div>
          <button
            className="cursor-pointer rounded-full bg-neutral-800 px-3 py-1 text-[12px] font-medium text-white transition-colors"
            type="button"
            aria-pressed={selecting}
            onClick={toggleSelectMode}
          >
            {selecting ? 'Cancel' : 'Select'}
          </button>
        </header>
      </div>

      <div
        className={`hide-scrollbar absolute inset-x-0 top-0 overflow-y-auto overscroll-contain bg-white ${
          selecting ? 'bottom-[52px]' : 'bottom-0'
        }`}
      >
        <div className="grid grid-cols-3 gap-0">
          {photos.map((photo) => {
            const isSelected = selectedIds.has(photo.id)

            return (
              <button
                key={photo.id}
                className={`group relative block aspect-[4/3] w-full cursor-pointer overflow-hidden border-0 bg-[#ddd] p-0 text-left after:pointer-events-none after:absolute after:inset-0 after:border after:border-black/70 after:content-[''] focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-[#007aff] focus-visible:outline-offset-[-3px] ${
                  isSelected ? 'z-[1] ring-2 ring-inset ring-[#007aff]' : ''
                }`}
                type="button"
                aria-label={`${isSelected ? 'Deselect' : 'Select'} ${photo.label}`}
                aria-pressed={selecting ? isSelected : undefined}
                onClick={() => toggleSelection(photo.id)}
              >
                <img
                  className="absolute inset-0 size-full object-cover"
                  src={photo.src}
                  alt={photo.label}
                  loading="lazy"
                  draggable="false"
                />
                {isSelected && (
                  <span
                    className="pointer-events-none absolute inset-0 bg-black/45"
                    aria-hidden="true"
                  />
                )}
                {selecting && isSelected && (
                  <span
                    className="absolute bottom-1.5 right-1.5 grid size-[22px] place-items-center rounded-full border-2 border-white bg-[#007aff] text-white"
                    aria-hidden="true"
                  >
                    <Check size={14} strokeWidth={3} />
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {selecting && (
        <footer className="absolute inset-x-0 bottom-0 z-10 flex h-[52px] items-center justify-center bg-neutral-700 px-4 text-center text-[13px] text-white font-bold">
          <span aria-live="polite">
            {selectedCount === 0
              ? 'Select Items'
              : `${selectedCount} ${selectedCount === 1 ? 'Item' : 'Items'} Selected`}
          </span>
        </footer>
      )}
    </>
  )
}
