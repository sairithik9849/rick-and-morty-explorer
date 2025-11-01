import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { getCharacterById } from "../../utils/api";
import Loading from "../Common/Loading";
import { extractIdFromUrl, getStatusColor, formatDate } from "../../utils/helpers";
import "../../css/characterDetail.css"

export default function CharacterDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setLoading(true);
        setError(false);
        const data = await getCharacterById(id);
        setCharacter(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCharacter();
  }, [id]);
  if (loading) return <Loading />;
  if (error && error.includes("not found"))
    return <Navigate to="/404" replace />;
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <Link to="/characters/page/1" className="error-button">
          Back to Characters
        </Link>
      </div>
    );
  }
  const originId = extractIdFromUrl(character.origin.url);
  const locationId = extractIdFromUrl(character.location.url);
  return (
    <div className="character-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="character-detail-card">
        <div className="character-detail-header">
          <div className="character-detail-image-wrapper">
            <img
              src={character.image}
              alt={character.name}
              className="character-detail-image"
            />
            <span
              className={`status-badge ${getStatusColor(character.status)}`}
            >
              {character.status}
            </span>
          </div>

          <div className="character-detail-info">
            <h1 className="character-detail-name">{character.name}</h1>

            <div className="character-detail-stats">
              <div className="stat-item">
                <span className="stat-label">Species:</span>
                <span className="stat-value">{character.species}</span>
              </div>

              {character.type && (
                <div className="stat-item">
                  <span className="stat-label">Type:</span>
                  <span className="stat-value">{character.type}</span>
                </div>
              )}

              <div className="stat-item">
                <span className="stat-label">Gender:</span>
                <span className="stat-value">{character.gender}</span>
              </div>

              <div className="stat-item">
                <span className="stat-label">Status:</span>
                <span className="stat-value">{character.status}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="character-detail-sections">
          <div className="detail-section">
            <h2 className="section-title">Origin</h2>
            {originId ? (
              <Link to={`/locations/${originId}`} className="location-link">
                {character.origin.name}
              </Link>
            ) : (
              <p className="no-link">{character.origin.name}</p>
            )}
          </div>

          <div className="detail-section">
            <h2 className="section-title">Current Location</h2>
            {locationId ? (
              <Link to={`/locations/${locationId}`} className="location-link">
                {character.location.name}
              </Link>
            ) : (
              <p className="no-link">{character.location.name}</p>
            )}
          </div>

          <div className="detail-section">
            <h2 className="section-title">
              Episodes ({character.episode.length})
            </h2>
            <div className="episodes-grid">
              {character.episode.map((episodeUrl) => {
                const episodeId = extractIdFromUrl(episodeUrl);
                return (
                  <Link
                    to={`/episodes/${episodeId}`}
                    key={episodeId}
                    className="episode-chip"
                  >
                    Episode {episodeId}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="detail-section">
            <h2 className="section-title">Created</h2>
            <p className="created-date">{formatDate(character.created)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
