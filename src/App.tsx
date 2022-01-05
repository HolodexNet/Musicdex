import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Frame from "./components/layout/Frame";
import { Channel } from "./pages/Channel";
import { History } from "./pages/History";
import { Home } from "./pages/Home";
import { LikedSongs } from "./pages/LikedSongs";
import { Login } from "./pages/Login";
import { Playlist } from "./pages/Playlist";
import { Search } from "./pages/Search";
import { Settings } from "./pages/Settings";
import { Song } from "./pages/Song";
import { Video } from "./pages/Video";

function App(this: any) {
  return (
    <Router>
      <Frame>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/playlists/:playlistId" element={<Playlist />}></Route>
          <Route path="/song/:songId" element={<Song />}></Route>
          <Route path="/liked" element={<LikedSongs />} />
          <Route path="/history" element={<History />} />
          <Route path="/search" element={<Search></Search>} />
          <Route path="/video/:id" element={<Video></Video>} />
          <Route path="/channel/:id" element={<Channel />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Frame>
    </Router>
  );
}

export default App;
