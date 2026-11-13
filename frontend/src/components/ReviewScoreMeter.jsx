export default function ReviewScoreMeter({
  label,
  value,
  target,
  preferenceLabel = label.toLowerCase(),
}) {
  const scorePercent = Math.round(value * 100)
  const targetPercent = Math.round(target * 100)
  const meetsTarget = value >= target

  return (
    <div>
      <div className="mb-0.5 flex items-center justify-between gap-2 text-[10px] font-medium text-white/65">
        <span>{label}</span>
        <span>
          {scorePercent}% · {meetsTarget ? 'On target' : 'Below target'}
        </span>
      </div>
      <div
        className="relative mb-0.5 h-1.5 overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-label={`${label} score`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={scorePercent}
      >
        <div
          className={`h-full rounded-full ${
            meetsTarget ? 'bg-[#82b9ff]' : 'bg-amber-300'
          }`}
          style={{ width: `${value * 100}%` }}
        />
        <span
          className="absolute inset-y-0 w-0.5 bg-white"
          style={{ left: `${target * 100}%` }}
          aria-hidden="true"
        />
      </div>
      <p className="mb-0 mt-0.5 text-[9px] text-white/45">
        Target {targetPercent}% ·{' '}
        {meetsTarget
          ? `Meets your ${preferenceLabel} preference`
          : `Below your ${preferenceLabel} preference`}
      </p>
    </div>
  )
}
