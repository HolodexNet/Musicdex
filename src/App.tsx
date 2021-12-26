import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Playlist } from "./pages/Playlist";

import FrameWithHeader from "./components/layout/Frame";
import styled from "@emotion/styled";
import { Song } from "./pages/Song";
import { History } from "./pages/History";

function App(this: any) {
  return (
    <Router>
      <FrameWithHeader>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/playlists/:playlistId" element={<Playlist />}></Route>
          <Route path="/song/:songId" element={<Song />}></Route>
          <Route
            path="/playlists"
            element={
              <InProgress>My Playlists page under construction</InProgress>
            }
          />
          <Route
            path="/liked"
            element={
              <InProgress>My Playlists page under construction</InProgress>
            }
          />
          <Route path="/history" element={<History />} />
        </Routes>
      </FrameWithHeader>
    </Router>
  );
}

const InProgress = styled.div`
  font-size: 20px;
`;
export default App;
