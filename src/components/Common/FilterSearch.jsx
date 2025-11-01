import { useState } from "react";
import "../../css/filterSearch.css";

export default function FilterSearch({ 
  filterOptions, 
  currentFilters, 
  onFilterChange, 
  onClearFilters 
}) {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0].value);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onFilterChange({
        ...currentFilters,
        [selectedFilter]: inputValue.trim()
      });
      setInputValue("");
    }
  };

  const handleSelectChange = (filterKey, value) => {
    onFilterChange({
      ...currentFilters,
      [filterKey]: value
    });
  };

  const getCurrentFilterOption = () => {
    return filterOptions.find(opt => opt.value === selectedFilter);
  };

  const currentOption = getCurrentFilterOption();

  return (
    <div className="filter-search-container">
      <form onSubmit={handleSubmit} className="filter-form">
        <div className="filter-inputs">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="filter-dropdown"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {currentOption.type === 'text' ? (
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Search by ${currentOption.label.toLowerCase()}...`}
              className="filter-input"
            />
          ) : (
            <select
              value={currentFilters[selectedFilter] || ''}
              onChange={(e) => handleSelectChange(selectedFilter, e.target.value)}
              className="filter-select"
            >
              {currentOption.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {currentOption.type === 'text' && (
            <button type="submit" className="filter-button">
              Search
            </button>
          )}
        </div>

        {Object.values(currentFilters).some(val => val) && (
          <button 
            type="button" 
            onClick={onClearFilters} 
            className="clear-button"
          >
            Clear All Filters
          </button>
        )}
      </form>

      <div className="quick-filters">
        {filterOptions
          .filter(opt => opt.type === 'select')
          .map((option) => (
            <div key={option.value} className="quick-filter-group">
              <span className="quick-filter-label">{option.label}:</span>
              {option.options.slice(1).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSelectChange(option.value, opt.value)}
                  className={`quick-filter-btn ${
                    currentFilters[option.value] === opt.value ? 'active' : ''
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ))}
      </div>
    </div>
  );
}