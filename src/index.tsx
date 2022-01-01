import { ChakraProvider } from "@chakra-ui/react";
import {
  HyperThemeEditor,
  ThemeEditorProvider,
} from "@hypertheme-editor/chakra-ui";
import { createStore, persist, StoreProvider } from "easy-peasy";
// https://chakra-ui.com/docs/migration#css-reset
import "focus-visible/dist/focus-visible";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import {
  queryClient,
  QueryClientProvider,
} from "./modules/services/queryClient";
import App from "./App";
import "./modules/common/i18n";
import { store } from "./store";
import { theme } from "./theme";
import reportWebVitals from "./utils/reportWebVitals";
import "./global.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";

console.log(`${process.env.REACT_APP_NAME} ${process.env.REACT_APP_VERSION}`);
(window as any)["App_Version"] = process.env.REACT_APP_VERSION;

store.persist.resolveRehydration().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <StoreProvider store={store}>
        <ChakraProvider theme={theme}>
          {/* <ThemeEditorProvider>
            <HyperThemeEditor pos="fixed" bottom={20} right={5} zIndex={12} />
          </ThemeEditorProvider> */}

          <QueryClientProvider client={queryClient}>
            <Suspense fallback="...">
              <App />
            </Suspense>
          </QueryClientProvider>
        </ChakraProvider>
      </StoreProvider>
    </React.StrictMode>,
    document.getElementById("root")
  );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
