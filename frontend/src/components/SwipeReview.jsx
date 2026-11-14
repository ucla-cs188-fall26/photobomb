import { Check, ChevronDown, Info, RotateCcw, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { reviewTargets } from '../lib/analysisData.js'
import ReviewReason from './ReviewReason.jsx'
import ReviewScoreMeter from './ReviewScoreMeter.jsx'

const SWIPE_THRESHOLD = 100
const DECISION_ANIMATION_MS = 500

export default function SwipeReview({
  photos,
  totalPhotos,
  canUndo,
  onDecision,
  onUndo,
  onClose,
}) {
  const [dragX, setDragX] = useState(0)
  const [decision, setDecision] = useState(null)
  const [flipped, setFlipped] = useState(false)
  const [showAllScores, setShowAllScores] = useState(false)
  const pointerStart = useRef(null)
  const ignoreNextClick = useRef(false)
  const decisionTimer = useRef(null)
  const decisionCompleted = useRef(false)

  const photo = photos[0]
  function getScoreMetric(key) {
    const target = reviewTargets[key]
    const value = photo?.metrics[key]
    if (target === undefined || value === undefined) return null

    return {
      key,
      label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase()),
      value,
      target,
    }
  }
  const completedCount = totalPhotos - photos.length
  const progress = totalPhotos > 0 ? completedCount / totalPhotos : 1

  useEffect(
    () => () => {
      window.clearTimeout(decisionTimer.current)
    },
    [],
  )

  function completeDecision(action) {
    if (decisionCompleted.current || !photo) return

    decisionCompleted.current = true
    window.clearTimeout(decisionTimer.current)
    setDecision(null)
    setDragX(0)
    setFlipped(false)
    setShowAllScores(false)
    onDecision(photo.id, action)
  }

  function startDecision(action) {
    if (decision) return

    decisionCompleted.current = false
    setDecision(action)
    window.clearTimeout(decisionTimer.current)
    decisionTimer.current = window.setTimeout(
      () => completeDecision(action),
      DECISION_ANIMATION_MS + 20,
    )
  }

  function startDrag(event) {
    if (decision || (event.pointerType === 'mouse' && event.button !== 0)) return

    pointerStart.current = {
      x: event.clientX,
      y: event.clientY,
      startedAt: performance.now(),
    }
    ignoreNextClick.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event) {
    if (!pointerStart.current || decision) return
    const deltaX = event.clientX - pointerStart.current.x
    if (Math.abs(deltaX) > 8) ignoreNextClick.current = true
    setDragX(deltaX)
  }

  function finishDrag(event) {
    if (!pointerStart.current || decision) return

    const deltaX = event.clientX - pointerStart.current.x
    const elapsed = performance.now() - pointerStart.current.startedAt
    pointerStart.current = null
    setDragX(0)
    if (Math.abs(deltaX) > 8) ignoreNextClick.current = true

    if (
      Math.abs(deltaX) >= SWIPE_THRESHOLD ||
      (Math.abs(deltaX) >= 35 && Math.abs(deltaX) / elapsed > 0.5)
    ) {
      startDecision(deltaX < 0 ? 'delete' : 'keep')
    }
  }

  function choose(action) {
    startDecision(action)
  }

  function flipCard() {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false
      return
    }

    setFlipped((current) => !current)
  }

  function handleCardKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      flipCard()
    }
  }

  const rotation = Math.max(-12, Math.min(12, dragX / 18))
  const cardTransform = decision
    ? `translateX(${decision === 'delete' ? '-120vw' : '120vw'}) rotate(${decision === 'delete' ? '-15deg' : '15deg'})`
    : `translateX(${dragX}px) rotate(${rotation}deg)`

  return (
    <section
      className="absolute inset-0 z-20 flex flex-col items-center bg-[#111113] px-5 pb-[max(24px,env(safe-area-inset-bottom))] pt-[112px] text-white"
      aria-label="Swipe to review photos"
    >
      <header className="absolute inset-x-0 top-0 z-10 flex h-[68px] items-center justify-between border-b border-white/10 bg-[#1c1c1e]/95 px-5 pt-1 backdrop-blur">
        <button
          className="grid size-9 place-items-center rounded-full bg-white/10 text-white focus-visible:outline-2 focus-visible:outline-[#66aaff]"
          type="button"
          aria-label="Exit photo review"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
        <h1 className="m-0 text-[16px] font-semibold text-white">
          Review Photos
        </h1>
        <span className="size-9" aria-hidden="true" />
      </header>
      <div
        className="absolute inset-x-5 top-[78px]"
        role="progressbar"
        aria-label="Photo review progress"
        aria-valuemin={0}
        aria-valuemax={totalPhotos}
        aria-valuenow={completedCount}
      >
        <div className="mb-2 flex justify-between text-[11px] font-medium text-white/55">
          <span>
            {completedCount} of {totalPhotos}
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
          <div
            className="h-full rounded-full bg-[#4d9cff] transition-[width] duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>
      {photo ? (
        <>
          <div className="mb-3 shrink-0 text-center">
            <p className="m-0 text-[13px] font-medium text-white/75">
              Swipe left to delete · right to keep
            </p>
            <p className="mb-0 mt-1 flex items-center justify-center gap-1.5 text-[12px] text-white/45">
              <Info size={13} aria-hidden="true" />
              Tap the photo to see why it was flagged
            </p>
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col items-center justify-center">
            <div
              className={`relative w-full max-w-[360px] ${
                flipped ? 'flex min-h-0 flex-1 flex-col' : ''
              }`}
              style={{ width: 'min(100%, 360px, calc(100dvh - 360px))' }}
            >
            <article
              className={`flex w-full touch-pan-y flex-col focus-visible:outline-2 focus-visible:outline-[#66aaff] ${
                flipped ? 'min-h-0 flex-1' : 'flex-none'
              }`}
              role="button"
              tabIndex={0}
              aria-label={
                flipped
                  ? `Reasons ${photo.label} was flagged`
                  : `Flip ${photo.label} to see why it was flagged`
              }
              style={{
                transform: cardTransform,
                perspective: '1200px',
                transition: decision
                  ? `transform ${DECISION_ANIMATION_MS}ms ease-out`
                  : 'none',
              }}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={finishDrag}
              onPointerCancel={() => {
                pointerStart.current = null
                setDragX(0)
              }}
              onClick={flipCard}
              onKeyDown={handleCardKeyDown}
            >
              <div
                className={`relative w-full overflow-hidden bg-[#262629] shadow-[0_12px_36px_rgba(0,0,0,0.55)] ${
                  flipped ? 'min-h-0 flex-1' : 'aspect-square'
                }`}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 450ms ease',
                  }}
                >
                  <div
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <img
                      className="absolute inset-0 size-full select-none object-cover"
                      src={photo.src}
                      alt={photo.label}
                      draggable="false"
                    />
                    <span
                      className={`pointer-events-none absolute left-5 top-6 rounded-lg border-[3px] px-3 py-1 text-[24px] font-black uppercase tracking-wider transition-opacity ${
                        dragX > 20 ||
                        decision === 'keep'
                          ? 'border-green-400 text-green-400 opacity-100'
                          : 'opacity-0'
                      }`}
                      aria-hidden="true"
                    >
                      Keep
                    </span>
                    <span
                      className={`pointer-events-none absolute right-5 top-6 rounded-lg border-[3px] px-3 py-1 text-[24px] font-black uppercase tracking-wider transition-opacity ${
                        dragX < -20 || decision === 'delete'
                          ? 'border-red-400 text-red-400 opacity-100'
                          : 'opacity-0'
                      }`}
                      aria-hidden="true"
                    >
                      Delete
                    </span>
                  </div>
                  <div
                    className="absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-br from-[#29292d] to-[#1d1d20] px-4 py-4 text-left"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                    aria-hidden={!flipped}
                  >
                  <h2 className="mb-2 flex shrink-0 items-center gap-2 text-[18px] font-semibold leading-tight text-white">
                    <Info size={17} className="text-white/60" aria-hidden="true" />
                    Why it was flagged
                  </h2>
                  <div className="mb-2 flex flex-col gap-2">
                    {photo.reasonDetails.map(({ scoreKeys = [], ...reason }) => (
                      <ReviewReason key={reason.label} {...reason}>
                        {!showAllScores &&
                          scoreKeys
                            .map(getScoreMetric)
                            .filter(Boolean)
                            .map((metric) => (
                              <ReviewScoreMeter
                                key={metric.key}
                                label={metric.label}
                                value={metric.value}
                                target={metric.target}
                              />
                            ))}
                      </ReviewReason>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
              </article>
              <div className="flex min-h-10 items-center justify-between gap-2 pt-2">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  {flipped ? (
                    <span className="text-[9px] text-white/40">
                      Tap to flip back to photo
                    </span>
                  ) : (
                    photo.reasonDetails.map(({ label, detail }) => (
                      <span
                        className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.07] px-3 py-1 text-[12px] font-semibold text-white/85"
                        key={label}
                      >
                        {label}
                        {detail && label !== 'Near-duplicate' && (
                          <span className="text-[9px] font-normal text-white/55">
                            {detail}
                          </span>
                        )}
                      </span>
                    ))
                  )}
                </div>
                <button
                  className="flex shrink-0 items-center gap-1 border-0 bg-transparent p-0 text-[10px] font-medium text-white/60 focus-visible:outline-2 focus-visible:outline-[#82b9ff]"
                  type="button"
                  aria-expanded={showAllScores}
                  onClick={() => setShowAllScores((current) => !current)}
                >
                  <ChevronDown
                    className={`transition-transform ${
                      showAllScores ? 'rotate-180' : ''
                    }`}
                    size={12}
                    aria-hidden="true"
                  />
                  All scores
                </button>
              </div>
              </div>
          </div>
          {showAllScores && (
            <button
              className="absolute inset-0 z-20 border-0 bg-black/35 p-0 backdrop-blur-xs"
              type="button"
              aria-label="Close all scores"
              onClick={() => setShowAllScores(false)}
            />
          )}
          <section
            className={`absolute inset-x-0 bottom-0 top-1/2 z-30 flex flex-col overflow-hidden rounded-t-2xl border-t border-white/15 bg-[#202023] shadow-[0_-12px_36px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
              showAllScores
                ? 'translate-y-0'
                : 'pointer-events-none translate-y-full'
            }`}
            aria-label="All scores"
            aria-hidden={!showAllScores}
          >
            <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="m-0 text-[15px] font-semibold text-white">
                All scores
              </h2>
              <button
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white/75 focus-visible:outline-2 focus-visible:outline-[#82b9ff]"
                type="button"
                aria-label="Close all scores"
                tabIndex={showAllScores ? 0 : -1}
                onClick={() => setShowAllScores(false)}
              >
                <X size={17} aria-hidden="true" />
              </button>
            </header>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-5 py-4">
              {Object.keys(reviewTargets)
                .map(getScoreMetric)
                .filter(Boolean)
                .map((metric) => (
                  <ReviewScoreMeter
                    key={metric.key}
                    label={metric.label}
                    value={metric.value}
                    target={metric.target}
                  />
                ))}
            </div>
          </section>
          <div className="mt-4 flex shrink-0 items-center justify-center gap-8">
                <button
                className="grid size-14 place-items-center rounded-full bg-[#242427] text-red-400 shadow-md transition-transform enabled:hover:scale-105 focus-visible:outline-2 focus-visible:outline-red-400"
                type="button"
                aria-label={`Delete ${photo.label}`}
                disabled={Boolean(decision)}
                onClick={() => choose('delete')}
              >
                <Trash2 size={23} aria-hidden="true" />
              </button>
              <button
                className="grid size-12 place-items-center rounded-full bg-white/10 text-white/80 shadow-md transition-transform enabled:hover:scale-105 focus-visible:outline-2 focus-visible:outline-white disabled:text-white/30"
                type="button"
                aria-label="Undo last decision"
                disabled={!canUndo || Boolean(decision)}
                onClick={onUndo}
              >
                <RotateCcw size={19} aria-hidden="true" />
              </button>
              <button
                className="grid size-14 place-items-center rounded-full bg-[#242427] text-green-400 shadow-md transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-green-400"
                type="button"
                aria-label={`Keep ${photo.label}`}
                disabled={Boolean(decision)}
                onClick={() => choose('keep')}
              >
                <Check size={25} aria-hidden="true" />
              </button>
          </div>
          <p className="mb-0 mt-3 shrink-0 text-center text-[11px] leading-4 text-white/45">
            Deleted photos can be recovered in Recently Deleted for 30 days.
          </p>
        </>
      ) : (
        <div className="my-auto flex flex-col items-center text-center">
          <span className="mb-4 grid size-16 place-items-center rounded-full bg-white/10 text-green-400 shadow-sm">
            <Check size={30} aria-hidden="true" />
          </span>
          <h2 className="m-0 text-[22px] font-semibold text-white">
            Review complete
          </h2>
          <p className="mb-0 mt-2 max-w-[260px] text-[14px] leading-5 text-white/60">
            You reviewed all {totalPhotos}{' '}
            {totalPhotos === 1 ? 'photo' : 'photos'} flagged for review.
          </p>
          <button
            className="mt-7 flex h-11 items-center justify-center gap-2 rounded-full bg-white/10 px-5 text-[14px] font-medium text-white transition-colors enabled:hover:bg-white/15 disabled:text-white/30"
            type="button"
            aria-label="Undo last decision"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <RotateCcw size={17} aria-hidden="true" />
            Undo
          </button>
        </div>
      )}
    </section>
  )
}
