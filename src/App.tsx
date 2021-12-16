import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "./components/Header";
// import { Player } from "./components/player/Player";
import { Home } from "./pages/Home";
import { Playlist } from "./pages/Playlist";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/playlists/:playlistId">
          <Playlist />
        </Route>
      </Switch>
      {/* <Player /> */}
    </Router>
  );
}

export default App;
