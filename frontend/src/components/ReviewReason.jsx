export default function ReviewReason({
  label,
  explanation,
  detail,
  children,
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2">
      <p className="mb-1 text-[10px] font-semibold text-white/55">{label}</p>
      {detail && (
        <p className="mb-1 text-[10px] font-medium text-[#a9cfff]">{detail}</p>
      )}
      {explanation && (
        <p className="m-0 text-[11px] leading-[15px] text-white/80">
          {explanation}
        </p>
      )}
      {children && <div className="mt-2 flex flex-col gap-1.5">{children}</div>}
    </div>
  )
}
