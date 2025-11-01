import { Link } from "react-router-dom"
import "../css/home.css"

export default function Home() {
  return (
    <div className="home-container">
      
      <div className="portal-background">
        <div className="portal-ring portal-ring-1"></div>
        <div className="portal-ring portal-ring-2"></div>
        <div className="portal-ring portal-ring-3"></div>
      </div>

      <div className="home-hero">
        <div className="hero-content">
          <div className="glitch-wrapper">
            <h1 className="home-title glitch" data-text="Welcome to the Rick and Morty Multiverse!">
              Welcome to the Rick and Morty Multiverse!
            </h1>
          </div>
          <p className="home-subtitle">
            Explore infinite dimensions, characters, locations, and episodes from across the multiverse
          </p>
          <div className="hero-particles">
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
            <span className="particle"></span>
          </div>
        </div>
      </div>

      <div className="home-content">
        <section className="home-section info-card">
          <div className="section-icon">🔬</div>
          <h2>About This Site</h2>
          <p>
            This Single Page Application allows you to explore the vast universe of Rick and Morty. 
            Dive into detailed information about your favorite characters, discover unique locations 
            across dimensions, and relive memorable episodes from the series. Navigate through infinite 
            realities with our multiverse explorer!
          </p>
        </section>

        <section className="home-section info-card">
          <div className="section-icon">⚡</div>
          <h2>About the API</h2>
          <p>
            All data is powered by the{' '}
            <a 
              href="https://rickandmortyapi.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="api-link"
            >
              Rick and Morty API
            </a>
            , a free and open RESTful API that provides comprehensive information about the show. 
            The API includes data about hundreds of characters, dozens of locations, and all episodes 
            from the series.
          </p>
        </section>

        <section className="home-section explore-section">
          <h2 className="explore-title">
            <span className="title-line"></span>
            Start Exploring the Multiverse
            <span className="title-line"></span>
          </h2>
          <div className="home-cards">
            <Link to="/characters/page/1" className="home-card card-characters">
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">🧑‍🔬</div>
                <h3>Characters</h3>
                <p>Browse through all characters from across infinite dimensions</p>
                <span className="card-arrow">→</span>
              </div>
              <div className="card-particles">
                <div className="card-particle"></div>
                <div className="card-particle"></div>
                <div className="card-particle"></div>
              </div>
            </Link>

            <Link to="/locations/page/1" className="home-card card-locations">
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">🌍</div>
                <h3>Locations</h3>
                <p>Explore different dimensions, planets, and parallel realities</p>
                <span className="card-arrow">→</span>
              </div>
              <div className="card-particles">
                <div className="card-particle"></div>
                <div className="card-particle"></div>
                <div className="card-particle"></div>
              </div>
            </Link>

            <Link to="/episodes/page/1" className="home-card card-episodes">
              <div className="card-glow"></div>
              <div className="card-content">
                <div className="card-icon">📺</div>
                <h3>Episodes</h3>
                <p>Relive every adventure, every dimension, every moment</p>
                <span className="card-arrow">→</span>
              </div>
              <div className="card-particles">
                <div className="card-particle"></div>
                <div className="card-particle"></div>
                <div className="card-particle"></div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
