# Bingo Site - Frontend

Next.js frontend for the Bingo Site application.

## Setup

```bash
npm install
```

## Configuration

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Home page (main game)
│   ├── about/                   # About page
│   │   └── page.tsx
│   ├── comments/                # Comments/Suggestions page
│   │   └── page.tsx
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles & theme
├── components/                   # React components
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── checkbox.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── switch.tsx
│   │   ├── label.tsx
│   │   └── card.tsx
│   ├── bingo-board.tsx          # Main bingo board component
│   ├── navbar.tsx               # Top navigation bar
│   ├── theme-provider.tsx       # Dark mode provider
│   ├── game-settings-dialog.tsx # Game configuration
│   ├── custom-profile-dialog.tsx # Custom values input
│   ├── win-dialog.tsx           # Win congratulations
│   └── insufficient-values-dialog.tsx # Value handling
├── lib/
│   └── utils.ts                 # Utility functions
├── components.json              # shadcn/ui configuration
├── tailwind.config.ts           # Tailwind configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Key Components

### BingoBoard
Main game board with cell marking and win detection

**Props:**
- `cells`: 2D array of cell values
- `size`: Grid dimensions
- `onWin`: Callback when bingo is achieved

**Features:**
- Cute donut marker overlay (🍩 `public/donut-marker.png`)
- Smooth zoom-in animation when marking cells
- Responsive sizing for all board dimensions

### GameSettingsDialog
Configuration dialog for board size, profile, and options

### CustomProfileDialog
Input dialog for custom comma-separated values

### WinDialog
Congratulations popup with next action options

### InsufficientValuesDialog
Strategy selection for insufficient values

### CommentsPage
User comments and suggestions page with form submission

## Styling

### Theme Colors

The app uses a playful color scheme defined in `app/globals.css`:
- **Primary**: Police Blue
- **Secondary**: Bordo/Maroon
- **Accent**: Pinkish
- **Destructive**: Red

### Dark Mode

Dark mode is managed by the `ThemeProvider` component:
- Toggle in the navbar
- Persisted to localStorage
- Smooth transitions

### Responsive Design

All components are mobile-friendly with:
- Responsive grid layouts
- Touch-friendly interactions
- Adaptive sizing

## Adding shadcn/ui Components

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add alert
```

## API Integration

API calls are made using the Fetch API to the backend:

```typescript
const response = await fetch(`${API_URL}/endpoint`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
})
```

Default API URL: `http://localhost:8000`

## Code Documentation

All components include comprehensive JSDoc comments:
- **Reason**: Purpose of the component/function
- **Called by**: Where it's used
- **Input**: Props and parameters
- **Output**: Return values and side effects

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## Dependencies

### Core
- **Next.js 16**: React framework
- **React 19**: UI library
- **TypeScript**: Type safety

### UI
- **Tailwind CSS**: Styling
- **shadcn/ui**: Component library
- **Lucide React**: Icons
- **Radix UI**: Headless components

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Server-side rendering (SSR)
- Automatic code splitting
- Optimized images and fonts
- Minimal JavaScript bundle

## Accessibility

- Keyboard navigation
- Screen reader support
- ARIA labels
- Focus management
- High contrast support
