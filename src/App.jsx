import { Route, Routes } from "react-router-dom";
import './css/app.css';

import Naviagtion from "./components/Common/Navigation";
import Home from "./components/Home";
import CharacterList from "./components/Character/CharacterList";
import CharacterDetail from "./components/Character/CharacterDetail";
import LocationList from "./components/Location/LocationList";
import LocationDetail from "./components/Location/LocationDetail";
import EpisodeList from "./components/Episode/EpisodeList";
import EpisodeDetail from "./components/Episode/EpisodeDetail";
import NotFound from "./components/Common/NotFound";


function App() {
  return (
    <div className="App">
      <Naviagtion />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/characters/page/:page" element={<CharacterList />} />
          <Route path="/characters/:id" element={<CharacterDetail />} />
          <Route path="/locations/page/:page" element={<LocationList />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/episodes/page/:page" element={<EpisodeList />} />
          <Route path="/episodes/:id" element={<EpisodeDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="app-footer">
        <p>
          Data from{" "}
          <a
            href="https://rickandmortyapi.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Rick and Morty API
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
