import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { Header } from "./components/Header";
import { Home } from "./pages/Home";
import { Playlist } from "./pages/Playlist";
import FrameWithHeader from "./components/framing/Frame";

function App(this: any) {
  return (
    <Router>
      {/* <Header /> */}
      <FrameWithHeader>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/playlists/:playlistId">
            <Playlist />
          </Route>
        </Switch>
      </FrameWithHeader>
    </Router>
  );
}

export default App;
