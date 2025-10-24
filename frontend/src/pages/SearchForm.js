import React, { useState, useEffect } from "react";
import { Search as SearchIcon, ChevronDown as ChevronDownIcon, Calendar as CalendarIcon } from "lucide-react";
import "./SearchForm.css";

export const SearchForm = ({ onSearchResults }) => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // No default date - let users select their own date

  // Function to get current date in YYYY-MM-DD format
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleSearch = async () => {
    if (!fromLocation && !toLocation) {
      alert("Please select at least one location (From or To)");
      return;
    }

    // Validate date - prevent selecting past dates
    const selectedDateObj = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    if (selectedDateObj < today) {
      alert("Please select today's date or a future date");
      return;
    }

    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (fromLocation) params.append('from', fromLocation);
      if (toLocation) params.append('to', toLocation);
      if (selectedDate) params.append('date', selectedDate);

      const response = await fetch(`http://localhost:8081/api/routes/search/passenger?${params}`);
      const data = await response.json();

      if (data.success) {
        console.log("Search results:", data.data);
        if (onSearchResults) {
          onSearchResults(data.data);
        }
      } else {
        alert("Search failed: " + data.message);
      }
    } catch (error) {
      console.error("Search error:", error);
      alert("Search failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="search-form">
      <div className="search-form__container">
        {/* From Location */}
        <div className="search-form__field">
          <select 
            className="search-form__select" 
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
          >
            <option value="" disabled>From</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            <option value="galle">Galle</option>
            <option value="negombo">Negombo</option>
            <option value="jaffna">Jaffna</option>
            <option value="trincomalee">Trincomalee</option>
          </select>
          <ChevronDownIcon className="search-form__icon" size={16} />
        </div>

        {/* To Location */}
        <div className="search-form__field">
          <select 
            className="search-form__select" 
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
          >
            <option value="" disabled>To</option>
            <option value="colombo">Colombo</option>
            <option value="kandy">Kandy</option>
            <option value="galle">Galle</option>
            <option value="negombo">Negombo</option>
            <option value="jaffna">Jaffna</option>
            <option value="trincomalee">Trincomalee</option>
          </select>
          <ChevronDownIcon className="search-form__icon" size={16} />
        </div>

        {/* Date */}
        <div className="search-form__field">
          <input 
            type="date" 
            className="search-form__date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getCurrentDate()}
          />
          <CalendarIcon className="search-form__icon" size={16} />
        </div>

        {/* Search Button */}
        <div className="search-form__field">
          <button className="search-form__button" onClick={handleSearch} disabled={isLoading}>
            <SearchIcon size={18} />
            <span>{isLoading ? "Searching..." : "Search"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
