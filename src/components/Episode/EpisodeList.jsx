import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import { filterEpisodes } from "../../utils/api.js";
import Loading from "../Common/Loading";
import Pagination from "../Common/Pagination";
import "../../css/episodeList.css";
import { pageValidate } from "../../utils/helpers.js";

export default function EpisodeList() {
  const { page } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodes, setEpisodes] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [episodeInput, setEpisodeInput] = useState("");
  const nameFilter = searchParams.get("name") || "";
  const episodeFilter = searchParams.get("episode") || "";

  const hasActiveFilters = nameFilter || episodeFilter;

  useEffect(() => {
    setNameInput(nameFilter);
    setEpisodeInput(episodeFilter);
  }, []);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        setLoading(true);
        setError(null);
        setNoResults(false);
        const curPage = parseInt(page);
        const apiPage = Math.ceil(curPage / 4);
        const filters = {};
        if (nameFilter) filters.name = nameFilter;
        if (episodeFilter) filters.episode = episodeFilter;
        const data = await filterEpisodes(filters, apiPage);
        const totalEpisodes = data.info.count;
        const calculatedTotalPages = Math.ceil(totalEpisodes / 5);
        setTotalPages(calculatedTotalPages);
        pageValidate(curPage);
        if (curPage > calculatedTotalPages || curPage < 1)
          throw new Error("Resource not found");
        const pagePosition = (curPage - 1) % 4;
        const startIndex = pagePosition * 5;
        const endIndex = Math.min(startIndex + 5, data.results.length);
        const slicedEpisodes = data.results.slice(startIndex, endIndex);
        if (slicedEpisodes.length === 0) throw new Error("Resource not found");
        setEpisodes(slicedEpisodes);
      } catch (error) {
        if (error.message.includes("not found") && hasActiveFilters) {
          setNoResults(true);
          setEpisodes([]);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, [page, nameFilter, episodeFilter, hasActiveFilters]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = {};
    if (nameInput) newParams.name = nameInput;
    if (episodeInput) newParams.episode = episodeInput;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setNameInput("");
    setEpisodeInput("");
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
        <Link to="/episodes/page/1" className="error-button">
          Go to First Page
        </Link>
      </div>
    );
  }

  return (
    <div className="episode-list-container">
      <h1 className="page-title">Episodes</h1>

      <form className="filter-section" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by episode (e.g., S01E01, S01)..."
          value={episodeInput}
          onChange={(e) => setEpisodeInput(e.target.value)}
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
            No episodes match your current filters. Try adjusting your search
            criteria.
          </p>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {!noResults && episodes.length < 5 && episodes.length > 0 && (
        <p className="last-page-notice">
          Showing last {episodes.length} episode
          {episodes.length !== 1 ? "s" : ""}
        </p>
      )}

      {!noResults && (
        <div className="episode-list">
          {episodes.map((episode) => (
            <Link
              to={`/episodes/${episode.id}`}
              key={episode.id}
              className="episode-card"
            >
              <div className="episode-number">
                <span className="episode-code">{episode.episode}</span>
              </div>

              <div className="episode-info">
                <h2 className="episode-name">{episode.name}</h2>
                <p className="episode-air-date">
                  <strong>Air Date:</strong> {episode.air_date}
                </p>
                <p className="episode-characters">
                  {episode.characters.length} character
                  {episode.characters.length !== 1 ? "s" : ""}
                </p>
              </div>

              <div className="episode-arrow">→</div>
            </Link>
          ))}
        </div>
      )}

      {!noResults && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/episodes/page"
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
