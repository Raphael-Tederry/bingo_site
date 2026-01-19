# 🚀 Quick Start Guide

Get your Bingo Site up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ **Python 3.8+** installed (`python --version`)
- ✅ **Node.js 18+** installed (`node --version`)
- ✅ **npm** installed (`npm --version`)

## One-Command Setup

```bash
python setup.py
```

This will automatically:
1. Set up the Python virtual environment
2. Install all backend dependencies
3. Install all frontend dependencies
4. Check profile files
5. Create environment configuration

## Running the Application

### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
.venv\Scripts\activate          # Windows
# or
source .venv/bin/activate       # macOS/Linux

python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Option 2: PowerShell (Windows)

```powershell
# Terminal 1
cd backend; .\.venv\Scripts\activate.ps1; python main.py

# Terminal 2  
cd frontend; npm run dev
```

## Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## First Game

1. The default 5×5 bingo board loads automatically
2. Click cells to mark them
3. Complete a row, column, or diagonal to win!
4. Click "Custom Game" to try different sizes and profiles

## Troubleshooting

### Backend won't start
```bash
cd backend
.venv\Scripts\activate  # Activate the virtual environment first
python main.py
```

### Frontend shows connection error
- Make sure the backend is running on port 8000
- Check `frontend/.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:8000`

### Port already in use
**Backend (8000):**
```bash
# Find and kill the process using port 8000
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

**Frontend (3000):**
```bash
# Next.js will automatically suggest port 3001 if 3000 is taken
```

### npm install fails
Try:
```bash
cd frontend
rm -rf node_modules package-lock.json  # or del on Windows
npm install
```

### Python dependencies fail
Try:
```bash
cd backend
.venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
```

## What's Next?

- **Add Custom Profiles**: Create `.txt` files in `backend/profiles/` folder
- **Customize Colors**: Edit `frontend/app/globals.css`
- **Try Dark Mode**: Click the moon/sun icon in the navbar
- **Read Full Docs**: Check out `README.md` for detailed information

## Project Structure Overview

```
bingo_site/
├── backend/           # Python FastAPI backend
│   ├── profiles/      # Bingo theme files (.txt)
│   └── data/          # Application data
├── frontend/          # Next.js React frontend
├── setup.py           # Main setup script
└── README.md          # Full documentation
```

## Common Commands

### Backend
```bash
cd backend
.venv\Scripts\activate
python main.py                    # Start server
uvicorn main:app --reload         # Start with auto-reload
```

### Frontend
```bash
cd frontend
npm run dev                       # Development mode
npm run build                     # Build for production
npm start                         # Run production build
```

## Need Help?

1. Check `README.md` for detailed documentation
2. Check `backend/README.md` for API documentation
3. Check `frontend/README.md` for frontend details
4. Visit http://localhost:8000/docs for interactive API docs

---

**Happy Bingo Playing! 🎯**
