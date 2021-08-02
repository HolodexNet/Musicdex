# Contribution Guide

## Project Structure

- `/src` - source code
  - `index.tsx` - Entrypoint (`Provider` chain, store rehydration, ...)
  - `App.tsx` - Root component
  - `/store` - State management
  - `/modules` - api, i18n, text, ...
  - `/components` - list, button, panel, ...
  - `/utils` - Miscellaneous utilities

## Dev

```bash
yarn install
yarn start
```

## Build

```bash
yarn build
```

## References

- [React documentation](https://reactjs.org/).
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
- [BearStudio/start-ui: Opinionated UI starter with ⚛️ React, ⚡️ Chakra UI, ⚛️ React Query & 🐜 Formiz — From the 🐻 BearStudio Team](https://github.com/BearStudio/start-ui)
- [Page Sections/Hero - Chakra Templates](https://chakra-templates.dev/page-sections/hero)
- [Optimistic Updates in TypeScript | React Query | TanStack](https://react-query.tanstack.com/examples/optimistic-updates-typescript)
