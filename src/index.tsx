import "react-contexify/ReactContexify.css";
import { ChakraProvider } from "@chakra-ui/react";
// import {
//   HyperThemeEditor,
//   ThemeEditorProvider,
// } from "@hypertheme-editor/chakra-ui";
import { StoreProvider } from "easy-peasy";
// https://chakra-ui.com/docs/migration#css-reset
import "focus-visible/dist/focus-visible";
import React from "react";
import { createRoot } from "react-dom/client";
import {
  queryClient,
  QueryClientProvider,
} from "./modules/services/queryClient";
import App from "./App";
import "./modules/common/i18n";
import { store } from "./store";
import { theme } from "./theme";
import "./global.css";
import "@fontsource/manrope/700.css";
import "@fontsource/assistant/400.css";
import "@fontsource/assistant/500.css";
import "@fontsource/assistant/600.css";
import { BrowserRouter as Router } from "react-router-dom";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import { HelmetProvider } from "react-helmet-async";

// https://github.com/ctrlplusb/easy-peasy/issues/741
type Props = StoreProvider["props"] & { children: React.ReactNode };
const StoreProviderReact18Casted =
  StoreProvider as unknown as React.ComponentType<Props>;

// Using new root kills the player iframe
const container = document.getElementById("root");
const root = createRoot(container!);

store.persist.resolveRehydration().then(() => {
  root.render(
    <StoreProviderReact18Casted store={store}>
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <HelmetProvider>
            <Router>
              <App />
            </Router>
          </HelmetProvider>
        </QueryClientProvider>
      </ChakraProvider>
    </StoreProviderReact18Casted>,
  );
});

// serviceWorkerRegistration.register();
