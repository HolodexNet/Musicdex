import { Suspense } from "react";
import Frame from "./components/layout/Frame";
import Routes from "./routes";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./ErrorFallback";
import usePageTracking from "./modules/common/usePageTracking";
function App(this: any) {
  // Page tracker suggested via https://stackoverflow.com/a/63249329
  usePageTracking();

  return (
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
  );
}

export default App;
