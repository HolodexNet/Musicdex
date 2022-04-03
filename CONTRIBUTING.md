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
cp .env.placeholder .env
yarn install --frozen-lockfile
yarn dev
```

## Build

```bash
yarn build
```

## i18n support for new features with text

1. Check file for anything similar that can be reused
2. If not, format a string following [i18next docs](https://react.i18next.com/)

```
{ t("My new feature") }
```

3. Run i18n command to add new string to translation files before comitting

```
npm run i18n
```

## Links

- [API wishlist from the frontend side · Issue #1 · HolodexNet/Musicdex](https://github.com/HolodexNet/Musicdex/issues/1)
- [Kanban on HolodexNet](https://github.com/HolodexNet/Holodex/projects/2)

## References

- [React documentation](https://reactjs.org/).
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).
- [BearStudio/start-ui: Opinionated UI starter with ⚛️ React, ⚡️ Chakra UI, ⚛️ React Query & 🐜 Formiz — From the 🐻 BearStudio Team](https://github.com/BearStudio/start-ui)
- [Page Sections/Hero - Chakra Templates](https://chakra-templates.dev/page-sections/hero)
- [Optimistic Updates in TypeScript | React Query | TanStack](https://react-query.tanstack.com/examples/optimistic-updates-typescript)
