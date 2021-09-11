import { ChakraProvider } from "@chakra-ui/react";
import { createStore, persist, StoreProvider } from "easy-peasy";
// https://chakra-ui.com/docs/migration#css-reset
import "focus-visible/dist/focus-visible";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./modules/i18n";
import storeModel from "./store";
import { theme } from "./theme";
import reportWebVitals from "./utils/reportWebVitals";

// https://easy-peasy.dev/docs/api/persist.html
const store = createStore(persist(storeModel, { storage: "localStorage" }));

store.persist.resolveRehydration().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <StoreProvider store={store}>
        <ChakraProvider theme={theme}>
          <App />
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
