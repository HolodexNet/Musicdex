import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "./components/Header";
import { Player } from "./components/player/Player";
import { Home } from "./pages/Home";
import { Playlist } from "./pages/Playlist";
import FrameWithHeader from "./components/Frame";

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
      <Player />
    </Router>
  );
}

export default App;
