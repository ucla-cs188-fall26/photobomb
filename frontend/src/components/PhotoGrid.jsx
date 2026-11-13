import { Check } from 'lucide-react'

export default function PhotoGrid({
  photos,
  selectedIds,
  selecting,
  onPhotoClick,
}) {
  return (
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
              onClick={() => onPhotoClick(photo.id)}
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
  )
}
