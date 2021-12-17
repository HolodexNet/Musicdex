import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Header } from "./components/Header";
// import { Player } from "./components/player/Player";
import { Home } from "./pages/Home";
import { Playlist } from "./pages/Playlist";
import SideBar from "./components/Sidebar";

function App(this: any) {
  return (
    <Router>
      <Header />
      <SideBar>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/playlists/:playlistId">
            <Playlist />
          </Route>
        </Switch>
      </SideBar>
    </Router>
  );
}

export default App;
