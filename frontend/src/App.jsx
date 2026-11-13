import Gallery from './components/Gallery.jsx'
import { photos } from './lib/photos.js'

function App() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[#d5d5d8] p-6 max-sm:p-0">
      <section
        className="relative flex h-[min(900px,calc(100dvh-48px))] w-[min(430px,calc(100vw-48px))] flex-col overflow-hidden rounded-[48px] border-[8px] border-[#202022] bg-black shadow-[0_24px_80px_rgba(0,0,0,0.28)] max-sm:h-[100dvh] max-sm:w-full max-sm:rounded-none max-sm:border-0 max-sm:shadow-none"
        aria-label="Photo gallery"
      >
        <Gallery photos={photos} />
      </section>
    </main>
  )
}

export default App
