export const analysisData = {
  'photo-1': { sharpness: 0.91, exposure: 0.76, similarTo: null },
  'photo-2': { sharpness: 0.38, exposure: 0.71, similarTo: null },
  'photo-3': { sharpness: 0.73, exposure: 0.22, similarTo: null },
  'photo-4': { sharpness: 0.84, exposure: 0.67, similarTo: null },
  'photo-5': { sharpness: 0.28, exposure: 0.46, similarTo: null },
  'photo-6': { sharpness: 0.65, exposure: 0.91, similarTo: null },
  'photo-7': { sharpness: 0.8, exposure: 0.75, similarTo: 'photo-6' },
  'photo-8': { sharpness: 0.94, exposure: 0.61, similarTo: null },
  'photo-9': { sharpness: 0.55, exposure: 0.19, similarTo: null },
  'photo-10': { sharpness: 0.76, exposure: 0.47, similarTo: 'photo-9' },
  'photo-11': { sharpness: 0.33, exposure: 0.68, similarTo: null },
  'photo-12': { sharpness: 0.88, exposure: 0.82, similarTo: null },
  'photo-13': { sharpness: 0.63, exposure: 0.25, similarTo: null },
  'photo-14': { sharpness: 0.79, exposure: 0.74, similarTo: null },
  'photo-15': { sharpness: 0.87, exposure: 0.59, similarTo: 'photo-22' },
  'photo-16': { sharpness: 0.22, exposure: 0.73, similarTo: null },
  'photo-17': { sharpness: 0.7, exposure: 0.65, similarTo: 'photo-4' },
  'photo-18': { sharpness: 0.9, exposure: 0.28, similarTo: null },
  'photo-19': { sharpness: 0.81, exposure: 0.79, similarTo: null },
  'photo-20': { sharpness: 0.42, exposure: 0.56, similarTo: null },
  'photo-21': { sharpness: 0.74, exposure: 0.83, similarTo: 'photo-19' },
  'photo-22': { sharpness: 0.93, exposure: 0.88, similarTo: null },
  'photo-23': { sharpness: 0.68, exposure: 0.2, similarTo: null },
  'photo-24': { sharpness: 0.86, exposure: 0.38, similarTo: 'photo-11' },
  'photo-25': { sharpness: 0.31, exposure: 0.72, similarTo: null },
  'photo-26': { sharpness: 0.77, exposure: 0.9, similarTo: null },
  'photo-27': { sharpness: 0.83, exposure: 0.27, similarTo: null },
  'photo-28': { sharpness: 0.58, exposure: 0.63, similarTo: 'photo-18' },
  'photo-29': { sharpness: 0.89, exposure: 0.77, similarTo: null },
  'photo-30': { sharpness: 0.4, exposure: 0.43, similarTo: null },
}

export const reviewTargets = {
  sharpness: 0.45,
  exposure: 0.3,
}

export function scorePhotos(photosToScore) {
  return photosToScore.map((photo) => {
    const metrics = analysisData[photo.id]
    if (!metrics) {
      throw new Error(`Missing mock analysis data for photo "${photo.id}"`)
    }

    return { ...photo, metrics }
  })
}

export function getOptimizationSuggestions(analyzedPhotos) {
  const photoById = new Map(analyzedPhotos.map((photo) => [photo.id, photo]))
  const parents = new Map(analyzedPhotos.map((photo) => [photo.id, photo.id]))

  function find(id) {
    const parent = parents.get(id)
    if (parent !== id) parents.set(id, find(parent))
    return parents.get(id)
  }

  function join(firstId, secondId) {
    const firstRoot = find(firstId)
    const secondRoot = find(secondId)
    if (firstRoot !== secondRoot) parents.set(secondRoot, firstRoot)
  }

  for (const photo of analyzedPhotos) {
    const similarPhoto = photo.metrics.similarTo
    if (similarPhoto && photoById.has(similarPhoto)) {
      join(photo.id, similarPhoto)
    }
  }

  const groups = new Map()
  for (const photo of analyzedPhotos) {
    const root = find(photo.id)
    const group = groups.get(root) ?? []
    group.push(photo)
    groups.set(root, group)
  }

  const duplicateKeepers = new Map()
  const duplicateCounts = new Map()
  for (const group of groups.values()) {
    if (group.length < 2) continue
    const keeper = group.reduce((best, photo) => {
      const photoQuality = photo.metrics.sharpness + photo.metrics.exposure
      const bestQuality = best.metrics.sharpness + best.metrics.exposure
      return photoQuality > bestQuality ? photo : best
    })
    for (const photo of group) {
      if (photo.id !== keeper.id) {
        duplicateKeepers.set(photo.id, keeper)
        duplicateCounts.set(photo.id, group.length - 1)
      }
    }
  }

  return analyzedPhotos.flatMap((photo) => {
    const reasons = []
    const reasonDetails = []
    const keeper = duplicateKeepers.get(photo.id)
    const similarCount = duplicateCounts.get(photo.id)
    if (photo.metrics.sharpness < reviewTargets.sharpness) {
      reasons.push('May be blurry')
      reasonDetails.push({
        label: 'Blurry',
        scoreKeys: ['sharpness'],
        explanation: `This photo falls below your sharpness preference${
          keeper && keeper.metrics.sharpness > photo.metrics.sharpness
            ? ', and a sharper shot of this scene exists'
            : ''
        }.`,
      })
    }
    if (photo.metrics.exposure < reviewTargets.exposure) {
      reasons.push('Very dark')
      reasonDetails.push({
        label: 'Too dark',
        scoreKeys: ['exposure'],
        explanation: 'This photo is darker than your preference.',
      })
    }
    if (keeper) {
      reasons.push(`Similar to ${keeper.label}`)
      reasonDetails.push({
        label: 'Near-duplicate',
        detail: `This is a duplicate of ${similarCount} other selected ${
          similarCount === 1 ? 'photo' : 'photos'
        }.`,
      })
    }

    return reasons.length
      ? [{ ...photo, reasons, reasonDetails, keeperPhoto: keeper ?? null }]
      : []
  })
}
