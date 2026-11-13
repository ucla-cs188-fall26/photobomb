import { useEffect, useRef, useState } from 'react'
import {
  getOptimizationSuggestions,
  scorePhotos,
} from '../lib/analysisData.js'
import AnalysisToast from './AnalysisToast.jsx'
import GalleryHeader from './GalleryHeader.jsx'
import PhotoGrid from './PhotoGrid.jsx'
import ReviewQueue from './ReviewQueue.jsx'
import SelectionFooter from './SelectionFooter.jsx'

export default function Gallery({ photos }) {
  const [selectedIds, setSelectedIds] = useState(() => new Set())
  const [selecting, setSelecting] = useState(false)
  const [analysisPhase, setAnalysisPhase] = useState('idle')
  const [analyzedCount, setAnalyzedCount] = useState(0)
  const [analysisTotal, setAnalysisTotal] = useState(0)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const [showAnalysisStatus, setShowAnalysisStatus] = useState(false)
  const [analyzedPhotos, setAnalyzedPhotos] = useState([])
  const [reviewPhotos, setReviewPhotos] = useState([])
  const [newReviewCount, setNewReviewCount] = useState(0)
  const [showReviewPhotos, setShowReviewPhotos] = useState(false)
  const [toast, setToast] = useState('')
  const timer = useRef(null)
  const toastTimer = useRef(null)
  const selectedPhotos = photos.filter((photo) => selectedIds.has(photo.id))
  const selectedCount = selectedPhotos.length

  useEffect(
    () => () => {
      window.clearInterval(timer.current)
      window.clearTimeout(toastTimer.current)
    },
    [],
  )

  function toggleSelection(id) {
    if (!selecting || analysisPhase === 'running') return

    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    setAnalysisPhase('idle')
    setShowReviewPhotos(false)
    setToast('')
  }

  function toggleSelectMode() {
    if (selecting) {
      window.clearInterval(timer.current)
      setSelectedIds(new Set())
      setAnalysisPhase('idle')
      setAnalyzedCount(0)
      setAnalysisTotal(0)
      setAnalysisProgress(0)
      setShowReviewPhotos(false)
      setToast('')
      window.clearTimeout(toastTimer.current)
    }
    setSelecting((current) => !current)
  }

  function runOptimization() {
    if (selectedCount === 0 || analysisPhase !== 'idle') return

    const analyzedIds = new Set(analyzedPhotos.map((photo) => photo.id))
    const newPhotos = selectedPhotos.filter((photo) => !analyzedIds.has(photo.id))
    const newlyScoredPhotos = scorePhotos(newPhotos)
    const nextAnalyzedPhotos = [...analyzedPhotos, ...newlyScoredPhotos]
    const total = newPhotos.length
    const previousReviewIds = new Set(reviewPhotos.map((photo) => photo.id))
    const photosToReview = getOptimizationSuggestions(nextAnalyzedPhotos)
    const addedReviewCount = photosToReview.filter(
      (photo) => !previousReviewIds.has(photo.id),
    ).length
    window.clearInterval(timer.current)
    window.clearTimeout(toastTimer.current)
    setAnalysisPhase('running')
    setAnalyzedCount(0)
    setAnalysisTotal(total)
    setAnalysisProgress(0)
    setShowAnalysisStatus(false)
    setShowReviewPhotos(false)
    setToast('')
    setSelectedIds(new Set())
    setSelecting(false)

    const duration = total > 0 ? Math.max(100, 1800 / total) * total : 100
    const startedAt = performance.now()
    timer.current = window.setInterval(() => {
      const progress = Math.min(1, (performance.now() - startedAt) / duration)
      setAnalysisProgress(progress)
      setAnalyzedCount(Math.floor(progress * total))

      if (progress >= 1) {
        window.clearInterval(timer.current)
        setAnalyzedCount(total)
        setAnalyzedPhotos(nextAnalyzedPhotos)
        setReviewPhotos(photosToReview)
        setNewReviewCount(addedReviewCount)
        setAnalysisPhase('done')
        setShowAnalysisStatus(false)
        setToast(
          photosToReview.length
            ? `Analysis complete · ${photosToReview.length} ${
                photosToReview.length === 1 ? 'photo needs' : 'photos need'
              } review${addedReviewCount ? ` · ${addedReviewCount} new` : ''}`
            : total === 0
              ? 'No new photos to analyze · existing review queue kept'
              : 'Analysis complete · no photos need review',
        )
        toastTimer.current = window.setTimeout(() => setToast(''), 4000)
      }
    }, 16)
  }

  function handleOptimizerClick() {
    if (analysisPhase === 'running') {
      setShowAnalysisStatus((isVisible) => !isVisible)
      return
    }

    if (reviewPhotos.length > 0 && selectedCount === 0) {
      setShowReviewPhotos((isVisible) => {
        if (!isVisible) setNewReviewCount(0)
        return !isVisible
      })
      return
    }

    runOptimization()
  }

  return (
    <>
      <GalleryHeader
        photosCount={photos.length}
        analysisPhase={analysisPhase}
        analyzedCount={analyzedCount}
        analysisTotal={analysisTotal}
        analysisProgress={analysisProgress}
        showAnalysisStatus={showAnalysisStatus}
        reviewCount={reviewPhotos.length}
        newReviewCount={newReviewCount}
        selectedCount={selectedCount}
        selecting={selecting}
        showReviewPhotos={showReviewPhotos}
        onOptimizerClick={handleOptimizerClick}
        onSelectModeToggle={toggleSelectMode}
      />
      <PhotoGrid
        photos={photos}
        selectedIds={selectedIds}
        selecting={selecting && analysisPhase === 'idle'}
        onPhotoClick={toggleSelection}
      />
      {selecting && analysisPhase === 'idle' && (
        <SelectionFooter selectedCount={selectedCount} />
      )}
      <AnalysisToast message={toast} />
      {showReviewPhotos && (
        <ReviewQueue
          photos={reviewPhotos}
          newPhotoCount={newReviewCount}
          onClose={() => setShowReviewPhotos(false)}
        />
      )}
    </>
  )
}
