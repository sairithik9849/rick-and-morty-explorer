import { useEffect, useState } from "react";
import { useParams, Link, Navigate, useSearchParams } from "react-router-dom";
import { filterCharacters } from "../../utils/api.js";
import { pageValidate, getStatusColor } from "../../utils/helpers.js";
import Loading from "../Common/Loading.jsx";
import Pagination from "../Common/Pagination.jsx";
import "../../css/characterList.css";

export default function CharacterList() {
  const { page } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [characters, setCharacters] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState(false);

  const [nameInput, setNameInput] = useState("");
  const [statusInput, setStatusInput] = useState("");
  const [speciesInput, setSpeciesInput] = useState("");
  const [typeInput, setTypeInput] = useState("");
  const [genderInput, setGenderInput] = useState("");

  const nameFilter = searchParams.get("name") || "";
  const statusFilter = searchParams.get("status") || "";
  const speciesFilter = searchParams.get("species") || "";
  const typeFilter = searchParams.get("type") || "";
  const genderFilter = searchParams.get("gender") || "";

  const hasActiveFilters =
    nameFilter || statusFilter || speciesFilter || typeFilter || genderFilter;

  useEffect(() => {
    setNameInput(nameFilter);
    setStatusInput(statusFilter);
    setSpeciesInput(speciesFilter);
    setTypeInput(typeFilter);
    setGenderInput(genderFilter);
  }, []);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        setError(false);
        setNoResults(false);
        const curPage = parseInt(page);
        const apiPage = Math.ceil(curPage / 2);

        const filters = {};
        if (nameFilter) filters.name = nameFilter;
        if (statusFilter) filters.status = statusFilter;
        if (speciesFilter) filters.species = speciesFilter;
        if (typeFilter) filters.type = typeFilter;
        if (genderFilter) filters.gender = genderFilter;

        const data = await filterCharacters(filters, apiPage);

        const calcTotalPages = Math.ceil(data.info.count / 10);
        setTotalPages(calcTotalPages);
        pageValidate(curPage);
        if (curPage > calcTotalPages || curPage < 1)
          throw new Error("Resource not found");
        const isOddPage = curPage % 2 === 1;
        const startIndex = isOddPage ? 0 : 10;
        const endIndex = isOddPage ? 10 : 20;
        setCharacters(data.results.slice(startIndex, endIndex));
      } catch (error) {
        if (error.message.includes("not found") && hasActiveFilters) {
          setNoResults(true);
          setCharacters([]);
        } else {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCharacters();
  }, [
    page,
    nameFilter,
    statusFilter,
    speciesFilter,
    typeFilter,
    genderFilter,
    hasActiveFilters,
  ]);

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = {};
    if (nameInput) newParams.name = nameInput;
    if (statusInput) newParams.status = statusInput;
    if (speciesInput) newParams.species = speciesInput;
    if (typeInput) newParams.type = typeInput;
    if (genderInput) newParams.gender = genderInput;
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setNameInput("");
    setStatusInput("");
    setSpeciesInput("");
    setTypeInput("");
    setGenderInput("");
    setSearchParams({});
  };

  if (loading) return <Loading />;

  if (error && error.includes("not found") && !hasActiveFilters)
    return <Navigate to="/404" replace />;

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p className="error-message">{error}</p>
        <Link to="/characters/page/1" className="error-button">
          Go to First Page
        </Link>
      </div>
    );
  }

  return (
    <div className="character-list-container">
      <h1 className="page-title">Characters</h1>

      <form className="filter-section" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Filter by name..."
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />

        <select
          value={statusInput}
          onChange={(e) => setStatusInput(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="alive">Alive</option>
          <option value="dead">Dead</option>
          <option value="unknown">Unknown</option>
        </select>

        <input
          type="text"
          placeholder="Filter by species..."
          value={speciesInput}
          onChange={(e) => setSpeciesInput(e.target.value)}
        />

        <input
          type="text"
          placeholder="Filter by type..."
          value={typeInput}
          onChange={(e) => setTypeInput(e.target.value)}
        />

        <select
          value={genderInput}
          onChange={(e) => setGenderInput(e.target.value)}
        >
          <option value="">All Genders</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
          <option value="genderless">Genderless</option>
          <option value="unknown">Unknown</option>
        </select>

        <button type="submit">Search</button>
        <button type="button" onClick={clearFilters}>
          Clear Filters
        </button>
      </form>

      {noResults && (
        <div className="no-results">
          <h2>No Results Found</h2>
          <p>
            No characters match your current filters. Try adjusting your search
            criteria.
          </p>
          <button onClick={clearFilters}>Clear Filters</button>
        </div>
      )}

      {!noResults && characters.length < 10 && characters.length > 0 && (
        <p className="last-page-notice">
          Showing last {characters.length} character
          {characters.length !== 1 ? "s" : ""}
        </p>
      )}

      {!noResults && (
        <div className="character-grid">
          {characters.map((character) => (
            <Link
              to={`/characters/${character.id}`}
              key={character.id}
              className="character-card"
            >
              <div className="character-image-wrapper">
                <img
                  src={character.image}
                  alt={character.name}
                  className="character-image"
                />
                <span
                  className={`status-badge ${getStatusColor(character.status)}`}
                >
                  {character.status}
                </span>
              </div>

              <div className="character-info">
                <h2 className="character-name">{character.name}</h2>
                <p className="character-species">{character.species}</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!noResults && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/characters/page"
          searchParams={searchParams}
        />
      )}
    </div>
  );
}
