# React + TypeScript + Tailwind CSS + Vite

A modern, fast frontend development setup combining React, TypeScript, Tailwind CSS, and Vite.

## 🚀 Features

- **React 19** - Latest React version with Hooks support
- **TypeScript** - Full TypeScript support for type safety
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vite** - Lightning-fast build tool and dev server
- **ESLint** - Code quality and consistency checking
- **Hot Module Replacement (HMR)** - Instant updates during development

## 📦 Installation

All dependencies are already installed. To install or update locally:

```bash
npm install
```

## 🏃 Getting Started

### Development Server

Start the development server with hot reload:

```bash
npm run dev
```

The dev server will typically run on `http://localhost:5173`

### Build for Production

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

## 🎨 Tailwind CSS Configuration

### Files

- `tailwind.config.js` - Tailwind configuration with content paths
- `postcss.config.js` - PostCSS configuration for Tailwind processing
- `src/index.css` - Tailwind directives imported in the app

### Using Tailwind Classes

Use Tailwind utility classes in your components:

```jsx
<div className="flex items-center justify-center min-h-screen">
  <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
    Click me
  </button>
</div>
```

### Customization

Edit `tailwind.config.js` to customize colors, spacing, fonts, and more:

```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
  plugins: [],
}
```

## 📁 Project Structure

```
src/
├── assets/          # Static assets (images, etc.)
├── App.tsx          # Main App component
├── App.css          # (Optional) Component-specific styles
├── index.css        # Global styles with Tailwind directives
├── main.tsx         # Entry point
└── vite-env.d.ts    # Vite type definitions
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vite.dev)

## 🛠️ Expanding Your Project

### Adding Component Styles

For component-scoped styles, you can:

1. **Use Tailwind classes directly** (recommended):
```jsx
export default function Card() {
  return <div className="rounded-lg shadow-md p-4 bg-white">Card</div>
}
```

2. **Create custom CSS with @apply**:
```css
@apply rounded-lg shadow-md p-4 bg-white;
```

### Adding ESLint Rules

Edit `eslint.config.js` to add or modify rules for your project.

## 💡 Tips

- Press `Ctrl+K Ctrl+Space` in VS Code while typing Tailwind classes to see autocomplete suggestions
- Install [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss) for better editor support
- Use `screen` in media queries for responsive design
- Check [Tailwind UI](https://tailwindui.com) for component examples and inspiration

## Start Building! 🎉

Edit `src/App.tsx` to start creating your React application with Tailwind CSS styling.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
