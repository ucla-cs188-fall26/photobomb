import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { useState } from 'react'

const questions = [
  {
    title: 'Light & mood',
    prompt: 'Which lighting feels more like your favorite photos?',
    options: [
      { photoId: 'photo-18', label: 'Bright and airy' },
      { photoId: 'photo-9', label: 'Warm and sunlit' },
      { photoId: 'photo-10', label: 'Moody and dim' },
      { photoId: 'photo-2', label: 'Dark and dramatic' },
    ],
  },
  {
    title: 'Sharpness',
    prompt: 'Which look do you prefer?',
    options: [
      { photoId: 'photo-8', label: 'Crisp and detailed' },
      { photoId: 'photo-14', label: 'Clean and in focus' },
      { photoId: 'photo-11', label: 'A little soft' },
      { photoId: 'photo-28', label: 'Soft and dreamy' },
    ],
  },
  {
    title: 'Composition',
    prompt: 'Which composition would you choose?',
    options: [
      { photoId: 'photo-6', label: 'Open and spacious' },
      { photoId: 'photo-16', label: 'Close-up details' },
      { photoId: 'photo-20', label: 'A wide scene' },
      { photoId: 'photo-3', label: 'Lots happening' },
    ],
  },
  {
    title: 'Faces & moments',
    prompt: 'Which kind of moment do you want to keep?',
    options: [
      { photoId: 'photo-3', label: 'A laughing candid, even if soft' },
      { photoId: 'photo-8', label: 'Sharp and posed' },
      { photoId: 'photo-12', label: 'A natural in-between moment' },
      { photoId: 'photo-17', label: 'A polished portrait' },
    ],
  },
]

export default function PreferenceQuiz({ photos, onClose }) {
  const [step, setStep] = useState(-1)
  const [answers, setAnswers] = useState({})
  const currentQuestion = questions[step]
  const photoById = new Map(photos.map((photo) => [photo.id, photo]))
  const onWelcome = step === -1
  const onThanks = step === questions.length
  const progress =
    Math.min(step + 1, questions.length) / questions.length

  function chooseOption(optionIndex) {
    setAnswers((current) => ({ ...current, [step]: optionIndex }))
  }

  function goForward() {
    if (onWelcome) {
      setStep(0)
      return
    }

    if (onThanks) {
      onClose()
      return
    }

    if (answers[step] === undefined) return
    setStep((current) => current + 1)
  }

  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-black/45 p-4 backdrop-blur-md">
      <section
        className="flex max-h-full w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#1c1c1f]/95 text-white shadow-[0_24px_70px_rgba(0,0,0,0.55)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preference-quiz-title"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="min-w-0 flex-1">
            {!onWelcome && (
              <>
                <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.16em] text-white/45">
                  {onThanks
                    ? 'Complete'
                    : `Question ${step + 1} of ${questions.length}`}
                </p>
                <div
                  className="h-1 overflow-hidden rounded-full bg-white/10"
                  role="progressbar"
                  aria-label="Quiz progress"
                  aria-valuemin={0}
                  aria-valuemax={questions.length}
                  aria-valuenow={Math.min(step + 1, questions.length)}
                >
                  <div
                    className="h-full rounded-full bg-[#82b9ff] transition-[width] duration-300"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>
          <button
            className="ml-4 flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium text-white/55 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-[#82b9ff]"
            type="button"
            onClick={onClose}
          >
            Skip
            <X size={14} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {onWelcome ? (
            <div className="flex min-h-[310px] flex-col justify-center">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#a9cfff]">
                Make it yours
              </p>
              <h1
                className="mb-3 mt-0 text-[27px] font-semibold leading-tight"
                id="preference-quiz-title"
              >
                Your photos, your taste.
              </h1>
              <p className="mb-0 text-[14px] leading-6 text-white/65">
                Pick the photo you like best in each set. We’ll use your choices
                to personalize photo suggestions.
              </p>
            </div>
          ) : onThanks ? (
            <div className="flex min-h-[310px] flex-col items-center justify-center text-center">
              <span className="mb-4 grid size-14 place-items-center rounded-full bg-green-400/10 text-green-300">
                <Check size={26} aria-hidden="true" />
              </span>
              <h1
                className="mb-2 mt-0 text-[24px] font-semibold"
                id="preference-quiz-title"
              >
                Thanks for sharing.
              </h1>
              <p className="m-0 max-w-[270px] text-[13px] leading-5 text-white/60">
                Your picks will help shape photo suggestions around what you
                love.
              </p>
            </div>
          ) : (
            <>
              <h1
                className="mb-1 mt-0 text-[21px] font-semibold"
                id="preference-quiz-title"
              >
                {currentQuestion.title}
              </h1>
              <p className="mb-4 mt-0 text-[13px] leading-5 text-white/60">
                {currentQuestion.prompt}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {currentQuestion.options.map((option, index) => {
                  const photo = photoById.get(option.photoId)
                  const selected = answers[step] === index

                  return (
                    <button
                      className={`group relative aspect-[4/3] overflow-hidden rounded-xl border-2 bg-[#29292d] p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#82b9ff] ${
                        selected
                          ? 'border-[#82b9ff] ring-2 ring-[#82b9ff]/35'
                          : 'border-transparent'
                      }`}
                      type="button"
                      key={option.label}
                      aria-pressed={selected}
                      onClick={() => chooseOption(index)}
                    >
                      <img
                        className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        src={photo?.src}
                        alt=""
                        draggable="false"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent px-2.5 pb-2 pt-7 text-[11px] font-medium leading-4 text-white">
                        {option.label}
                      </span>
                      {selected && (
                        <span className="absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-[#82b9ff] text-[#101418]">
                          <Check size={14} aria-hidden="true" />
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>

        <footer className="flex shrink-0 items-center justify-between border-t border-white/10 px-5 py-4">
          <button
            className="flex h-10 items-center gap-1 rounded-full px-3 text-[12px] font-medium text-white/65 transition-colors hover:bg-white/10 disabled:invisible"
            type="button"
            disabled={onWelcome}
            onClick={() => setStep((current) => Math.max(-1, current - 1))}
          >
            <ArrowLeft size={15} aria-hidden="true" />
            Back
          </button>
          <button
            className="flex h-10 items-center gap-2 rounded-full bg-white px-5 text-[13px] font-semibold text-[#171719] transition-colors hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-35"
            type="button"
            disabled={!onWelcome && !onThanks && answers[step] === undefined}
            onClick={goForward}
          >
            {onWelcome ? 'Get started' : onThanks ? 'Done' : 'Next'}
            {!onThanks && <ArrowRight size={15} aria-hidden="true" />}
          </button>
        </footer>
      </section>
    </div>
  )
}
