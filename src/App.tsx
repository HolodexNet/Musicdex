import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Frame from "./components/layout/Frame";
import Routes from "./routes";

function App(this: any) {
  return (
    <Router>
      <Frame>
        {/* TODO: ADD REAL LOADING PAGE */}
        <Suspense fallback={<div>Loading...</div>}>
          <Routes />
        </Suspense>
      </Frame>
    </Router>
  );
}

export default App;
