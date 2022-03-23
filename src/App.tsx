import { Suspense } from "react";
import Frame from "./components/layout/Frame";
import Routes from "./routes";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/common/ErrorFallback";
import usePageTracking from "./modules/common/usePageTracking";
import { useCookieTokenFallback } from "./modules/client";
import { unregister } from "./serviceWorkerRegistration";
import { LoadingFullScreen } from "./components/common/GlobalLoadingStatus";
import { useTranslation } from "react-i18next";
function App(this: any) {
  // Page tracker suggested via https://stackoverflow.com/a/63249329
  usePageTracking();
  useCookieTokenFallback();

  const { ready: translationReady } = useTranslation();

  return (
    // Last resort error boundary
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        window.location.reload();
        // reset the state of your app so the error doesn't happen again
      }}
    >
      {translationReady ? (
        <Frame>
          {/* TODO: ADD REAL LOADING PAGE */}
          <Suspense fallback={<LoadingFullScreen />}>
            <ErrorBoundary
              FallbackComponent={ErrorFallback}
              onReset={() => {
                unregister();
                window.location.reload();
                // reset the state of your app so the error doesn't happen again
              }}
            >
              <Routes />
            </ErrorBoundary>
          </Suspense>
        </Frame>
      ) : (
        <LoadingFullScreen />
      )}
    </ErrorBoundary>
  );
}

export default App;
