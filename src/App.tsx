import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Frame from "./components/layout/Frame";
import Routes from "./routes";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorFallback";
function App(this: any) {
  return (
    <Router>
      <Frame>
        {/* TODO: ADD REAL LOADING PAGE */}
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              window.location.reload();
              // reset the state of your app so the error doesn't happen again
            }}
          >
            <Routes />
          </ErrorBoundary>
        </Suspense>
      </Frame>
    </Router>
  );
}

export default App;
