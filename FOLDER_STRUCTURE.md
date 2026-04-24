# Project Folder Structure

This is a modular React TypeScript application with Tailwind CSS. The structure is organized for scalability and maintainability.

## Directory Layout

```
src/
├── App.tsx                    # Main application component
├── main.tsx                   # Application entry point
├── index.css                  # Tailwind CSS directives
│
├── assets/                    # Static assets
│   ├── images/               # Image files
│   ├── fonts/                # Font files
│   └── react.svg             # Example images
│
├── styles/                    # Global stylesheets
│   └── globals.css           # Global CSS rules
│
├── modules/                   # Feature modules (each is a feature/domain)
│   ├── dashboard/            # Dashboard feature
│   │   ├── index.ts          # Module exports
│   │   └── Dashboard.tsx      # Dashboard component
│   ├── users/                # Users feature
│   │   ├── index.ts
│   │   └── Users.tsx
│   ├── products/             # Products feature
│   │   ├── index.ts
│   │   └── Products.tsx
│   ├── bookings/             # Bookings feature
│   │   ├── index.ts
│   │   └── Bookings.tsx
│   ├── rentals/              # Rentals feature
│   │   ├── index.ts
│   │   └── Rentals.tsx
│   └── snacks/               # Snacks feature
│       ├── index.ts
│       └── Snacks.tsx
│
├── core/                      # Core configuration and services
│   └── index.ts              # API base URL and core exports
│
├── components/                # Reusable components
│   └── Button.tsx            # Example button component
│
├── layouts/                   # Layout components
│   └── MainLayout.tsx        # Main layout with sidebar and header
│
├── hooks/                     # Custom React hooks
│   └── useApi.ts             # Example API hook
│
├── utils/                     # Utility functions
│   └── index.ts              # Helper functions (format, capitalize, etc.)
│
└── types/                     # TypeScript type definitions
    └── index.ts              # Shared types and interfaces
```

## Module Structure

Each module in `src/modules/` follows this pattern:

```
module-name/
├── index.ts                  # Barrel export
├── ModuleName.tsx            # Main component
├── components/               # (Optional) Sub-components
├── hooks/                    # (Optional) Module-specific hooks
├── services/                 # (Optional) Module-specific API calls
├── types/                    # (Optional) Module-specific types
└── styles/                   # (Optional) Module-specific styles
```

## Usage Examples

### Importing from Modules

```typescript
// Clean imports using barrel exports
import { Dashboard } from './modules/dashboard'
import { Users } from './modules/users'

// Or import specific items
import { useApi } from './hooks/useApi'
import { Button } from './components/Button'
```

### Creating a New Module

1. Create a new folder in `src/modules/`
2. Create `index.ts` with barrel exports
3. Create components in the module
4. Add to `App.tsx` for navigation

### Adding Shared Components

Add new reusable components to `src/components/`:

```typescript
// src/components/Card.tsx
export function Card({ children, className = '' }) {
  return (
    <div className={`p-4 bg-white rounded-lg shadow ${className}`}>
      {children}
    </div>
  )
}
```

### Adding Utilities

Add helper functions to `src/utils/`:

```typescript
// src/utils/index.ts
export function parseJSON(json: string) {
  return JSON.parse(json)
}
```

### Adding Custom Hooks

Add custom React hooks to `src/hooks/`:

```typescript
// src/hooks/useLocalStorage.ts
export function useLocalStorage(key: string) {
  // Hook implementation
}
```

## Best Practices

- **Modules**: Each module represents a feature or domain (Dashboard, Users, etc.)
- **Components**: Reusable UI components shared across modules
- **Hooks**: Custom React logic that can be shared
- **Utils**: Pure functions without React dependencies
- **Types**: Centralized TypeScript interfaces and types
- **Barrel Exports**: Use `index.ts` for clean imports

## Styling

- **Tailwind CSS**: Use utility classes for styling
- **Global Styles**: Add to `src/styles/globals.css`
- **Component-level**: Inline Tailwind classes in components
- **Module-specific**: Create `styles/` folder within module if needed

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## TypeScript Configuration

All files use strict TypeScript configuration. Files use `.tsx` for React components and `.ts` for non-JSX code.
