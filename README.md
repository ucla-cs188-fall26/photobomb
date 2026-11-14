# Photo Bomb

A mobile-first web prototype that helps you narrow a large set of photos down to the ones you care about. You pick some photos, tap the sparkle button, and the app suggests photos to delete (blurry, too dark, near-duplicates). You swipe to keep or delete each one and tap a card to see why it was suggested.

How it works: a fixed, explainable scoring pipeline (sharpness, brightness, duplicate grouping) ranks the photos, and a short quiz plus your swipes tune how much each score matters to you. The app only suggests; you make every final decision.

**Deleting is simulated.** The app works on copies of photos you load into it. Nothing is removed from your real photo library.

## What's in this repo

```
frontend/   React + Vite + Tailwind CSS (the app you see)
backend/    Python + FastAPI (photo scoring, duplicate grouping, preferences, SQLite)
```

## Requirements

| Tool | Version | Check with |
| --- | --- | --- |
| Node.js | 20 or newer | `node -v` |
| Python | 3.10 to 3.12 | `python3 --version` |
| Git | any recent version | `git --version` |

No accounts, API keys, or paid services are needed. Everything runs on your computer.

## Install and run

You need two terminal windows: one for the backend and one for the frontend.

### 1. Get the code

```bash
git clone [REPO URL]
cd [REPO NAME]
```

### 2. Start the backend (terminal 1)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Leave it running. You should see a line like `Uvicorn running on http://127.0.0.1:8000`. To check it works, open http://127.0.0.1:8000/health in a browser. You should see `{"status":"ok"}`. The interactive API page is at http://127.0.0.1:8000/docs.

The first run creates the SQLite database file automatically. [Confirm: file name and location, e.g. `backend/app.db`.]

### 3. Start the frontend (terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Open the **Local** address it prints (usually http://localhost:5173). The page works best in a narrow window or your browser's phone view, since it is designed for a phone-sized screen.

[If the frontend needs to know the backend address, add: copy `frontend/.env.example` to `frontend/.env` and check that `VITE_API_URL` is `http://127.0.0.1:8000`. Remove this line if the address is built in.]

## Run the scenario, step by step

1. **Quiz.** On first load, answer the short preference quiz (lighting, blur, [composition, faces,] cleanup style). Tap an image to choose, then **Next**. The X or **Skip** skips it. You can reopen it from **Preferences** at the bottom of the gallery.
2. **Load photos.** [Describe how photos get in: e.g. "Tap **Add photos** and choose images from your computer" or "The gallery starts with the sample photos in `sample_photos/`."]
3. **Select.** Tap **Select**, then tap photos, or tap **Select all**.
4. **Clean up.** Tap the blue sparkle button. A progress ring shows the analysis. Tap the ring to see "Analyzed x of N".
5. **Review.** When it finishes, the button becomes **Review N**. Tap it.
6. **Swipe.** Swipe a card left to delete or right to keep. The Trash and Keep buttons do the same, and the arrow keys work on a computer. Undo reverses your last decision.
7. **See why.** Tap a card to flip it. The back shows why it was suggested and its scores against your preferences.
8. **Why keep?** When you keep a high-confidence suggestion, an optional strip asks why. Your answer helps the app learn. It can be skipped.

Your swipes are saved and adjust your preferences for the next run.

## Tech stack

| Part | Tools |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, [lucide-react] |
| Backend | Python, FastAPI, Uvicorn |
| Image analysis | OpenCV, NumPy, Pillow, pillow-heif, imagehash |
| Storage | SQLite |

## Team

Sydney Vo
Tyler Kastenholz