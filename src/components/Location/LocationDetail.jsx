import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { getLocationById, getMultipleCharacters } from "../../utils/api.js";
import { extractIdsFromUrls, formatDate } from "../../utils/helpers.js";
import Loading from "../Common/Loading";
import "../../css/locationDetail.css";

export default function LocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getLocationById(id);
        setLocation(data);
        if (data.residents.length > 0) {
          setResidentsLoading(true);
          const residentIds = extractIdsFromUrls(data.residents);
          const residentsData = await getMultipleCharacters(residentIds);
          if (Array.isArray(residentsData)) setResidents(residentsData);
          else setResidents([residentsData]);
          setResidentsLoading(false);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [id]);
  if (loading) return <Loading />;
  if (error && error.includes("not found"))
    return <Navigate to="/404" replace />;
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <Link to="/locations/page/1" className="error-button">
          Back to Locations
        </Link>
      </div>
    );
  }
  return (
    <div className="location-detail-container">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="location-detail-card">
        <div className="location-detail-header">
          <h1 className="location-detail-name">{location.name}</h1>

          <div className="location-detail-info">
            <div className="info-item">
              <span className="info-label">Type:</span>
              <span className="info-value">{location.type}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Dimension:</span>
              <span className="info-value">{location.dimension}</span>
            </div>

            <div className="info-item">
              <span className="info-label">Residents:</span>
              <span className="info-value">{location.residents.length}</span>
            </div>
          </div>
        </div>

        <div className="location-detail-sections">
          <div className="detail-section">
            <h2 className="section-title">
              Residents ({location.residents.length})
            </h2>

            {residentsLoading ? (
              <div className="residents-loading">
                <div className="loading-spinner"></div>
                <p>Loading residents...</p>
              </div>
            ) : location.residents.length > 0 ? (
              <div className="residents-grid">
                {residents.map((resident) => (
                  <Link
                    to={`/characters/${resident.id}`}
                    key={resident.id}
                    className="resident-card"
                  >
                    <img
                      src={resident.image}
                      alt={resident.name}
                      className="resident-image"
                    />
                    <div className="resident-info">
                      <h3 className="resident-name">{resident.name}</h3>
                      <p className="resident-species">{resident.species}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="no-residents">No known residents</p>
            )}
          </div>

          <div className="detail-section">
            <h2 className="section-title">Created</h2>
            <p className="created-date">{formatDate(location.created)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
