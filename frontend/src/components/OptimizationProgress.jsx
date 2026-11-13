export default function OptimizationProgress({ progress }) {
  const radius = 9
  const circumference = 2 * Math.PI * radius

  return (
    <svg
      className="pointer-events-none absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r={radius}
        fill="none"
        stroke="#93c5fd"
        strokeWidth="4"
      />
      <path
        d="M12 21 A9 9 0 1 1 12 3 A9 9 0 1 1 12 21"
        fill="none"
        stroke="#0057c2"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - progress)}
        style={{ transition: 'stroke-dashoffset 80ms linear' }}
      />
    </svg>
  )
}
