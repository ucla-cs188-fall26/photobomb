import { BatteryFull, Signal, Sparkles, Wifi } from 'lucide-react'
import OptimizationProgress from './OptimizationProgress.jsx'

export default function GalleryHeader({
  photosCount,
  analysisPhase,
  analyzedCount,
  analysisTotal,
  analysisProgress,
  showAnalysisStatus,
  reviewCount,
  newReviewCount,
  selectedCount,
  selecting,
  onOptimizerClick,
  onSelectModeToggle,
}) {
  const reviewing = reviewCount > 0 && selectedCount === 0
  const reviewDescription = `${reviewCount} ${
    reviewCount === 1 ? 'photo' : 'photos'
  }`

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
      <div
        className="pointer-events-none absolute inset-0 bg-black/30 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)]"
        aria-hidden="true"
      />
      <div className="pointer-events-none relative z-10 flex h-[52px] items-center justify-between px-7 pt-1 text-[12px] font-semibold text-white">
        <span>9:41</span>
        <span className="absolute left-1/2 top-2 h-[22px] w-[92px] -translate-x-1/2 rounded-full bg-black max-sm:hidden" />
        <div className="flex items-center gap-1">
          <Signal size={15} strokeWidth={2.4} aria-hidden="true" />
          <Wifi size={15} strokeWidth={2.4} aria-hidden="true" />
          <BatteryFull size={17} strokeWidth={2.4} aria-hidden="true" />
        </div>
      </div>
      <header className="pointer-events-none relative z-10 flex h-[76px] items-center justify-between px-5">
        <div className="flex flex-col">
          <h1 className="m-0 text-[28px] font-bold leading-[30px] tracking-[-0.6px] text-white">
            Library
          </h1>
          <span className="mt-0.5 text-[13px] font-medium text-white">
            {photosCount} Photos
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="pointer-events-auto relative">
            <button
              className={`relative grid size-8 shrink-0 place-items-center rounded-full text-white transition-colors disabled:cursor-not-allowed ${
                analysisPhase === 'running'
                  ? 'bg-[#007aff]'
                  : reviewing
                    ? 'bg-green-500 hover:bg-green-600'
                    : selectedCount === 0
                      ? 'bg-neutral-700 text-white/50'
                      : 'bg-[#007aff] hover:bg-[#0067d8]'
              }`}
              type="button"
              aria-label={
                analysisPhase === 'running'
                  ? `Show analysis progress, ${analyzedCount} of ${analysisTotal} photos`
                  : reviewing
                    ? `Review ${reviewDescription}${
                        newReviewCount > 0 ? `, ${newReviewCount} new` : ''
                      }`
                    : 'AI Optimize'
              }
              aria-expanded={
                analysisPhase === 'running'
                  ? showAnalysisStatus
                  : undefined
              }
              aria-describedby={
                analysisPhase === 'running' && showAnalysisStatus
                  ? 'analysis-status'
                  : undefined
              }
              disabled={
                analysisPhase !== 'running' &&
                selectedCount === 0 &&
                reviewCount === 0
              }
              onClick={onOptimizerClick}
              title={
                reviewing
                  ? `Review ${reviewDescription}${
                      newReviewCount > 0 ? ` · ${newReviewCount} new` : ''
                    }`
                  : selectedCount === 0 && analysisPhase === 'idle'
                    ? 'Select photos to optimize'
                    : undefined
              }
            >
              {analysisPhase === 'running' && (
                <OptimizationProgress progress={analysisProgress} />
              )}
              <Sparkles size={14} aria-hidden="true" />
            </button>
            {analysisPhase === 'running' && showAnalysisStatus && (
              <span
                id="analysis-status"
                className="absolute left-1/2 top-full z-20 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-center text-[10px] font-medium text-white shadow-lg"
                role="status"
              >
                Analyzed {analyzedCount} of {analysisTotal}
              </span>
            )}
          </div>
          <button
            className="pointer-events-auto cursor-pointer rounded-full bg-neutral-800 px-3 py-1 text-[12px] font-medium text-white transition-colors"
            type="button"
            aria-pressed={selecting}
            onClick={onSelectModeToggle}
          >
            {selecting ? 'Cancel' : 'Select'}
          </button>
        </div>
      </header>
    </div>
  )
}
