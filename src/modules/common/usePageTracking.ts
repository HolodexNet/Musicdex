import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga4";

// Page tracker via https://stackoverflow.com/a/63249329

// adapted for GA4 via https://github.com/PriceRunner/react-ga4

const usePageTracking = () => {
  const location = useLocation();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!window.location.href.includes("localhost")) {
      ReactGA.initialize("G-WNVV2Y5KNB");
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized) {
      // https://github.com/PriceRunner/react-ga4
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname + location.search,
      });
    }
  }, [initialized, location]);
};

export default usePageTracking;
