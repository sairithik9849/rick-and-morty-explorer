import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import { filterLocations } from "../../utils/api.js";
import Loading from "../Common/Loading";
import Pagination from "../Common/Pagination";
import "../../css/locationList.css";
import { pageValidate } from "../../utils/helpers.js";

export default function LocationList() {
  const { page } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [locations, setLocations] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [dimensionInput, setDimensionInput] = useState("");

  const nameFilter = searchParams.get("name") || "";
  const typeFilter = searchParams.get("type") || "";
  const dimensionFilter = searchParams.get("dimension") || "";

  const hasActiveFilters = nameFilter || typeFilter || dimensionFilter;

  useEffect(() => {
    setNameInput(nameFilter);
    setTypeInput(typeFilter);
    setDimensionInput(dimensionFilter);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoResults(false);
        const curPage = parseInt(page);
        const apiPage = Math.ceil(curPage / 4);
        const filters = {};
        if (nameFilter) filters.name = nameFilter;
        if (typeFilter) filters.type = typeFilter;
        if (dimensionFilter) filters.dimension = dimensionFilter;
        const data = await filterLocations(filters, apiPage);
        const calcTotalPages = Math.ceil(data.info.count / 5);
        setTotalPages(calcTotalPages);
        pageValidate(curPage);
        if (curPage > calcTotalPages || curPage < 1)
          throw new Error("Resource not found");
        const pagePosition = (curPage - 1) % 4;
        const startIndex = pagePosition * 5;
        const endIndex = Math.min(startIndex + 5, data.results.length);
        const slicedLocations = data.results.slice(startIndex, endIndex);
        if (slicedLocations.length === 0) throw new Error("Resource not found");
        setLocations(slicedLocations);
      } catch (error) {
        if (error.message.includes("not found") && hasActiveFilters) {
          setNoResults(true);
          setLocations([]);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, [page, nameFilter, typeFilter, dimensionFilter, hasActiveFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = {};
    if (nameInput) newParams.name = nameInput;
    if (typeInput) newParams.type = typeInput;
    if (dimensionInput) newParams.dimension = dimensionInput;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setNameInput("");
    setTypeInput("");
    setDimensionInput("");
    setSearchParams({});
  };

  if (loading) return <Loading />;
  if (error && error.includes("not found"))
    return <Navigate to="/404" replace />;
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <Link to="/locations/page/1" className="error-button">
          Go to First Page
        </Link>
      </div>
    );
  }
  return (
    <div className="location-list-container">
      <h1 className="page-title">Locations</h1>

      <form className="filter-section" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by type (e.g., Planet, Space station)..."
          value={typeInput}
          onChange={(e) => setTypeInput(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by dimension (e.g., C-137)..."
          value={dimensionInput}
          onChange={(e) => setDimensionInput(e.target.value)}
        />

        <button type="submit">Search</button>
        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </form>

      {noResults && (
        <div className="no-results">
          <h2>No Results Found</h2>
          <p>
            No locations match your current filters. Try adjusting your search
            criteria.
          </p>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {!noResults && locations.length < 5 && locations.length > 0 && (
        <p className="last-page-notice">
          Showing last {locations.length} location
          {locations.length !== 1 ? "s" : ""}
        </p>
      )}

      {!noResults && (
        <div className="location-list">
          {locations.map((location) => (
            <Link
              to={`/locations/${location.id}`}
              key={location.id}
              className="location-card"
            >
              <div className="location-info">
                <h2 className="location-name">{location.name}</h2>
                <div className="location-details">
                  <span className="location-type">
                    <strong>Type:</strong> {location.type}
                  </span>
                  <span className="location-dimension">
                    <strong>Dimension:</strong> {location.dimension}
                  </span>
                </div>
                <p className="location-residents">
                  {location.residents.length} resident
                  {location.residents.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="location-arrow">→</div>
            </Link>
          ))}
        </div>
      )}

      {!noResults && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/locations/page"
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
