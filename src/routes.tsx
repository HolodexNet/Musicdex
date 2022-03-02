import React from "react";
import { RouteObject, useRoutes } from "react-router";
import LikedSongs from "./pages/LikedSongs";
import History from "./pages/History";
import Login from "./pages/Login";
import Video from "./pages/Video";
import Song from "./pages/Song";
import Home from "./pages/Home";
import ChannelSongs from "./pages/ChannelSongs";
import { Queue } from "./pages/Queue";
import Library from "./pages/Library";
import { RequireLogin } from "./components/common/RequireLogin";

const Channel = React.lazy(() => import("./pages/Channel"));
// const History = React.lazy(() => import("./pages/History"));
// const Home = React.lazy(() => import("./pages/Home"));
// const LikedSongs = React.lazy(() => import("./pages/LikedSongs"));
// const Login = React.lazy(() => import("./pages/Login"));
const Playlist = React.lazy(() => import("./pages/Playlist"));
const Settings = React.lazy(() => import("./pages/Settings"));
// const Song = React.lazy(() => import("./pages/Song"));
// const Video = React.lazy(() => import("./pages/Video"));
const Search = React.lazy(() => import("./pages/Search"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/playlists/:playlistId",
    element: <Playlist />,
  },
  {
    path: "/song/:songId",
    element: <Song />,
  },
  {
    path: "/liked",
    element: (
      <RequireLogin>
        <LikedSongs />
      </RequireLogin>
    ),
  },
  {
    path: "/history",
    element: (
      <RequireLogin>
        <History />
      </RequireLogin>
    ),
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/video/:id",
    element: <Video />,
  },
  {
    path: "/channel/:id/*",
    element: <Channel />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/queue",
    element: <Queue />,
  },
  {
    path: "/library",
    element: (
      <RequireLogin>
        <Library />
      </RequireLogin>
    ),
  },
];
export default function Routes() {
  const elements = useRoutes(routes);
  return elements;
}
