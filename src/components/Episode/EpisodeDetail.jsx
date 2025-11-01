import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { getEpisodeById, getMultipleCharacters } from "../../utils/api";
import { extractIdsFromUrls, formatDate } from "../../utils/helpers";
import Loading from "../Common/Loading";
import "../../css/episodeDetail.css";

export default function EpisodeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [episode, setEpisode] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [charactersLoading, setCharactersLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEpisodeAndCharacters = async () => {
      try {
        setLoading(true);
        setError(null);
        const episodeData = await getEpisodeById(id);
        setEpisode(episodeData);
        if (episodeData.characters.length > 0) {
          setCharactersLoading(true);
          const characterIds = extractIdsFromUrls(episodeData.characters);
          const charactersData = await getMultipleCharacters(characterIds);
          if (Array.isArray(charactersData)) setCharacters(charactersData);
          else setCharacters([charactersData]);
          setCharactersLoading(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodeAndCharacters();
  }, [id]);
  if (loading) return <Loading />;
  if (error && error.includes("not found"))
    return <Navigate to="/404" replace />;
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <Link to="/episodes/page/1" className="error-button">
          Back to Episodes
        </Link>
      </div>
    );
  }
  return (
    <div className="episode-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="episode-detail-card">
        <div className="episode-detail-header">
          <div className="episode-badge">
            <span className="episode-code-large">{episode.episode}</span>
          </div>

          <h1 className="episode-detail-name">{episode.name}</h1>

          <div className="episode-detail-info">
            <div className="info-item">
              <span className="info-label">Episode</span>
              <span className="info-value">{episode.episode}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Air Date</span>
              <span className="info-value">{episode.air_date}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Characters</span>
              <span className="info-value">{episode.characters.length}</span>
            </div>
          </div>
        </div>

        <div className="episode-detail-sections">
          {/* Characters Section */}
          <div className="detail-section">
            <h2 className="section-title">
              Characters in this Episode ({episode.characters.length})
            </h2>

            {charactersLoading ? (
              <div className="characters-loading">
                <div className="loading-spinner"></div>
                <p>Loading characters...</p>
              </div>
            ) : episode.characters.length > 0 ? (
              <div className="episode-characters-grid">
                {characters.map((character) => (
                  <Link
                    to={`/characters/${character.id}`}
                    key={character.id}
                    className="episode-character-card"
                  >
                    <img
                      src={character.image}
                      alt={character.name}
                      className="episode-character-image"
                    />
                    <div className="episode-character-info">
                      <h3 className="episode-character-name">{character.name}</h3>
                      <p className="episode-character-species">{character.species}</p>
                      <span
                        className={`episode-character-status status-${character.status.toLowerCase()}`}
                      >
                        {character.status}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="no-characters">No characters in this episode</p>
            )}
          </div>

          {/* Created Date */}
          <div className="detail-section">
            <h2 className="section-title">Created</h2>
            <p className="created-date">{formatDate(episode.created)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
