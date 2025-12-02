# GitHub Copilot — Repository-Wide Instructions
# Project: React Native / Expo News App
# Purpose: Enforce consistent file structure, navigation design, naming patterns, and UI architecture.

## GENERAL PROJECT GUIDELINES
- This project uses **Expo**, **Expo Router**, and **React Native**.
- Use **Expo Router** for all navigation. Never suggest React Navigation.
- Every screen should live under the `app/` directory following the routing conventions described below.
- Avoid generating unused boilerplate or extra layers of abstraction unless explicitly requested.

## FOLDER STRUCTURE RULES
The project follows this structure:

app/
 ├── _layout.js              → Global Stack layout
 ├── index.js                → “For You” page (Home)
 ├── today.js                → “For Today” page
 ├── later.js                → “For Later” page
 ├── discover/
 │     └── index.js          → “Discover” root page
 ├── article/
 │     └── [id].js           → Article detail page

components/
 ├── cards/                  → Article cards, category cards, etc.
 ├── layout/                 → Header, navigation bar, tab bar
 ├── shared/                 → Buttons, loaders, UI primitives

lib/
 ├── api.js                  → All API calls
 ├── formatters.js           → Date & text helpers
 ├── constants.js            → App-wide constants (colors, spacing, etc.)

assets/
 ├── fonts/
 ├── images/
 └── icons/

## NAVIGATION REQUIREMENTS
- Use Expo Router's file-based routing.
- Define the global navigation bar inside `app/_layout.js` or `components/layout/NavBar.js`.
- The bottom navigation bar must link to:
  - `/` → For You
  - `/today`
  - `/later`
  - `/discover`

## PAGE RULES
### For You Page (`app/index.js`)
- Displays recommended or personalized articles.
- Uses the `ArticleCard` component from `components/cards`.

### For Today Page (`app/today.js`)
- Displays curated articles for today, sorted chronologically.

### For Later Page (`app/later.js`)
- Displays user-saved articles.
- Use persistent storage suggestions (AsyncStorage) if necessary.

### Discover Page (`app/discover/index.js`)
- Displays categories, search bar, and trending topics.
- Should be extendable into nested routes under `/discover/`.

### Article Detail Page (`app/article/[id].js`)
- Uses WebView or in-app rendering.
- Receives article parameters via Expo Router params.

## COMPONENT RULES
- Always extract reusable UI into the appropriate folder inside `components/`.
- Copilot should:
  - Place new UI into the correct subfolder.
  - Use descriptive component names and keep them small and composable.

## API RULES
- All external API calls must be defined in `lib/api.js`.
- Never fetch directly inside multiple components—use a wrapper API function.

## STATE & DATA
- Prefer React hooks and local state unless global state is required.
- If global state is needed, suggest Zustand (not Redux).

## STYLE & UI
- Use React Native components and Expo-compatible libraries only.
- Keep styles lightweight and consistent.
- Use constants from `lib/constants.js` where possible.

## WHEN GENERATING CODE
Copilot should always:
- Follow the directory structure above.
- Reference existing components before creating new ones.
- Ask for clarification only when required functionality does not fit the established structure.
- Avoid unnecessary new folders unless explicitly required.
- Maintain clean, readable code with meaningful names.

## TESTING
- Prefer simple unit tests with Jest.
- Place test files next to their components: `ComponentName.test.js`.

## DO NOT
- Do not suggest ejecting Expo.
- Do not introduce React Navigation.
- Do not create random utility folders.
- Do not add TypeScript unless explicitly asked.

