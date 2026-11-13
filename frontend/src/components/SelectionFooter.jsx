export default function SelectionFooter({ selectedCount }) {
  return (
    <footer className="absolute inset-x-0 bottom-0 z-10 flex h-[52px] items-center justify-center bg-neutral-700 px-4 text-center text-[13px] font-bold text-white">
      <span aria-live="polite">
        {selectedCount === 0
          ? 'Select Items'
          : `${selectedCount} ${selectedCount === 1 ? 'Item' : 'Items'} Selected`}
      </span>
    </footer>
  )
}
