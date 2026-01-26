# nexum

A first browser prototype - A browser game built with React 19.2 and TypeScript.

## Tech Stack

- **React 19.0.0** - Modern UI library
- **TypeScript 5.9.3** - Type-safe development
- **Vite 7.2.4** - Fast build tool and dev server
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **ESLint 9.18.0** - Code linting
- **Prettier 3.4.2** - Code formatting

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Project Structure

```
nexum/
├── src/
│   ├── App.tsx           # Main application component
│   ├── GameCanvas.tsx    # Canvas rendering component
│   ├── DialogueBox.tsx   # Dialogue interaction component
│   ├── main.tsx          # Application entry point
│   └── style.css         # Global styles (Tailwind + minimal custom CSS)
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── eslint.config.js      # ESLint configuration
└── .prettierrc           # Prettier configuration
```

## Features

- Interactive canvas-based game scene with animated stars
- Click-through dialogue system
- Responsive design
- TypeScript for type safety
- Modern React best practices

