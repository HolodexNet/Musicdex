import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Home } from "./pages/Home";
import { Playlist } from "./pages/Playlist";
import FrameWithHeader from "./components/framing/Frame";
import styled from "@emotion/styled";

function App(this: any) {
  return (
    <Router>
      <FrameWithHeader>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/playlists/:playlistId">
            <Playlist />
          </Route>
          <Route path="/playlists">
            <InProgress>My Playlists page under construction</InProgress>
          </Route>
          <Route path="/liked">
            <InProgress>Liked page under construction</InProgress>
          </Route>
          <Route path="/history">
            <InProgress>History page under construction</InProgress>
          </Route>
        </Switch>
      </FrameWithHeader>
    </Router>
  );
}

const InProgress = styled.div`
  font-size: 20px;
`;
export default App;
