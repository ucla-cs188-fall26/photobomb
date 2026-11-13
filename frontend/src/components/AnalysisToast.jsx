export default function AnalysisToast({ message }) {
  if (!message) return null

  return (
    <div
      className="absolute bottom-4 left-1/2 z-30 w-max max-w-[calc(100%-32px)] -translate-x-1/2 rounded-full bg-[#242426]/95 px-4 py-2.5 text-center text-[12px] font-medium text-white shadow-lg"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  )
}
