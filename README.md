# 🎯 Bingo Site

A modern, customizable web-based bingo game perfect for meetings, movie nights, parties, and any occasion where you want to add interactive fun!

## ✨ Features

- **Multiple Themes**: Pre-loaded profiles including Office, Meeting, Movie Night, and Cooking Show bingo
- **Custom Values**: Create your own bingo card with custom comma-separated values
- **Flexible Board Sizes**: Choose from 2×2 up to 10×10 grids
- **FREE SPACE Option**: Enable a free center square for classic bingo feel
- **Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works great on both desktop and mobile devices
- **Smart Handling**: Automatic detection and handling of insufficient values
- **Win Detection**: Automatic detection of completed rows, columns, and diagonals
- **Comments System**: Share suggestions and read feedback from other users

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** (for backend)
- **Node.js 18+** (for frontend)
- **npm** or **yarn** (for frontend package management)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bingo_site
   ```

2. **Setup Backend**
   ```bash
   cd backend
   python setup.py
   ```

   Or manually:
   ```bash
   cd backend
   python -m venv .venv
   # On Windows:
   .venv\Scripts\activate
   # On macOS/Linux:
   source .venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   ```

4. **Configure Environment** (Optional)
   
   Create `frontend/.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Running the Application

You need to run both the backend and frontend servers:

#### Terminal 1 - Backend Server

```bash
cd backend
# Activate virtual environment first (Windows):
.venv\Scripts\activate
# Or on macOS/Linux:
source .venv/bin/activate

# Start the server
python main.py
# Or with auto-reload:
uvicorn main:app --reload
```

The backend API will be available at `http://localhost:8000`

#### Terminal 2 - Frontend Server

```bash
cd frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

Open your browser and navigate to `http://localhost:3000` to start playing!

## 📁 Project Structure

```
bingo_site/
├── backend/                 # FastAPI backend
│   ├── main.py             # Main API application
│   ├── requirements.txt    # Python dependencies
│   └── setup.py            # Backend setup script
├── frontend/               # Next.js frontend
│   ├── app/                # Next.js app directory
│   │   ├── page.tsx        # Home page
│   │   ├── about/          # About page
│   │   ├── layout.tsx      # Root layout
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── bingo-board.tsx # Main bingo board
│   │   ├── navbar.tsx      # Navigation bar
│   │   ├── theme-provider.tsx
│   │   └── ...             # Other components
│   ├── lib/                # Utility functions
│   ├── package.json        # Node dependencies
│   └── components.json     # shadcn/ui config
├── profiles/               # Bingo profile files
│   ├── office.txt          # Office bingo
│   ├── meeting.txt         # Meeting bingo
│   ├── movie-night.txt     # Movie night bingo
│   └── cooking-show.txt    # Cooking show bingo
├── data/                   # Application data
│   └── comments.json       # User comments storage
└── README.md               # This file
```

## 🎮 How to Play

1. **Start a Game**: When you first open the site, a default 5×5 bingo board is generated
2. **Custom Game**: Click "Custom Game" to:
   - Select board size (2×2 to 10×10)
   - Choose a profile theme
   - Enable FREE SPACE option
   - Create custom values
3. **Mark Cells**: Click on cells to mark them with a cute donut marker 🍩 (click again to unmark)
4. **Win**: Complete a full row, column, or diagonal to win!
5. **Play Again**: Generate a new board anytime

## 📝 Adding Custom Profiles

You can add your own profile themes by creating a `.txt` file in the `profiles/` folder:

1. Create a new file: `profiles/my-profile.txt`
2. Add comma-separated values:
   ```
   Value 1, Value 2, Value 3, Another value, More fun, ...
   ```
3. Restart the backend server
4. Your profile will appear in the profile selection dropdown!

## 🛠️ Technology Stack

### Backend
- **FastAPI**: Modern, fast Python web framework
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Frontend
- **Next.js 16**: React framework with App Router
- **React 19**: UI library
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Beautiful, accessible UI components
- **Lucide React**: Icon library

## 📚 API Documentation

Once the backend is running, visit:
- **API Docs**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Main Endpoints

- `GET /profiles` - List all available profiles
- `POST /generate` - Generate a bingo board
- `POST /generate-with-strategy` - Generate board with value handling strategy
- `GET /comments` - Get all user comments
- `POST /comments` - Submit a new comment

## 🎨 Customization

### Colors
The playful color scheme uses:
- **Pinkish Bordo**: Warm, playful accent
- **Police Blue**: Primary actions and highlights
- **Red**: Alerts and important actions
- **White/Black**: Base colors with dark mode support

Edit `frontend/app/globals.css` to customize the color palette.

### Profiles
Add or modify profile files in the `profiles/` directory. Each file should contain comma-separated values.

## 🔧 Development

### Backend Development

```bash
cd backend
.venv\Scripts\activate  # Windows
source .venv/bin/activate  # macOS/Linux
uvicorn main:app --reload
```

### Frontend Development

```bash
cd frontend
npm run dev
```

### Code Documentation

All functions include comprehensive documentation:
- **Reason**: Why the function exists
- **Called by**: Where it's used
- **Input**: Parameters and types
- **Output**: Return values and side effects

## 🧪 Future Enhancements

- [ ] User accounts and saved games
- [ ] Multiplayer support
- [ ] Game history and statistics
- [ ] More profile themes
- [ ] Share board links
- [ ] Print-friendly bingo cards
- [ ] Audio/visual win celebrations
- [ ] Progressive Web App (PWA) support

## 📄 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new profile themes
- Report bugs
- Suggest features
- Submit pull requests

## 💖 Credits

Built with modern web technologies and attention to detail for an excellent user experience.

---

**Enjoy playing Bingo! 🎉**
