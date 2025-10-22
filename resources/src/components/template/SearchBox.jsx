import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import apiService from '../../services/api';

const SearchBox = ({ 
  onSearch, 
  placeholder = 'Search jobs, companies, or keywords...', 
  showAutoComplete = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (searchTerm && showAutoComplete) {
      const timeoutId = setTimeout(() => {
        fetchSuggestions(searchTerm);
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm, showAutoComplete]);

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setLoading(true);
    try {
      // Fetch both jobs and companies as suggestions
      const [jobsResponse, companiesResponse] = await Promise.all([
        apiService.getJobs({ search: query, per_page: 5 }),
        apiService.getCompanies({ search: query, per_page: 3 })
      ]);

      const jobSuggestions = jobsResponse?.data?.data?.map(job => ({
        type: 'job',
        title: job.title,
        subtitle: job.company?.name,
        id: job.id,
        url: `/jobs/${job.id}`
      })) || [];

      const companySuggestions = companiesResponse?.data?.data?.map(company => ({
        type: 'company',
        title: company.name,
        subtitle: `${company.jobs_count || 0} jobs`,
        id: company.id,
        url: `/companies/${company.id}`
      })) || [];

      setSuggestions([...jobSuggestions, ...companySuggestions]);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        searchTerm.trim(),
        ...recentSearches.filter(s => s !== searchTerm.trim())
      ].slice(0, 5); // Keep only 5 recent searches
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    }

    if (onSearch) {
      onSearch(searchTerm);
    }
    
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    
    // Navigate to the suggestion URL
    if (suggestion.url) {
      window.location.href = suggestion.url;
    }
  };

  const handleRecentSearchClick = (search) => {
    setSearchTerm(search);
    if (onSearch) {
      onSearch(search);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const getIconForType = (type) => {
    switch(type) {
      case 'job':
        return <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <span className="text-blue-600 text-xs font-bold">J</span>
        </div>;
      case 'company':
        return <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-purple-600 text-xs font-bold">C</span>
        </div>;
      default:
        return null;
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <MagnifyingGlassIcon 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" 
            aria-hidden="true" 
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => setSearchTerm(searchTerm)}
            placeholder={placeholder}
            className={`w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500 ${className}`}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Auto-complete suggestions */}
        {showSuggestions && showAutoComplete && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
            {/* Loading state */}
            {loading && (
              <div className="p-4 text-center text-gray-500">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-sm">Searching...</span>
              </div>
            )}

            {/* Suggestions */}
            {!loading && suggestions.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Suggestions
                </div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.id}-${index}`}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      {getIconForType(suggestion.type)}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {suggestion.subtitle}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {suggestion.type}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Recent searches */}
            {!loading && suggestions.length === 0 && recentSearches.length > 0 && (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </div>
                {recentSearches.map((search, index) => (
                  <button
                    key={`recent-${index}`}
                    type="button"
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* No results */}
            {!loading && suggestions.length === 0 && recentSearches.length === 0 && (
              <div className="p-4 text-center text-gray-500 text-sm">
                No suggestions found
              </div>
            )}
          </div>
        )}
      </form>

      {/* Click outside to close suggestions */}
      {showSuggestions && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSuggestions(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default SearchBox;
