import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import apiService from '../../services/api';

const CategoryFilter = ({ onFilterChange, selectedCategory, selectedType }) => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const jobTypes = [
    { label: 'All Types', value: '' },
    { label: 'Full Time', value: 'full_time' },
    { label: 'Part Time', value: 'part_time' },
    { label: 'Contract', value: 'contract' },
    { label: 'Internship', value: 'internship' },
    { label: 'Remote', value: 'remote' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiService.getCategories();
        setCategories(response?.data?.data || []);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayCategories = showAll ? filteredCategories : filteredCategories.slice(0, 8);

  const handleCategoryChange = (categoryId) => {
    if (onFilterChange) {
      onFilterChange({ category: categoryId === selectedCategory ? '' : categoryId });
    }
  };

  const handleTypeChange = (type) => {
    if (onFilterChange) {
      onFilterChange({ type });
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FunnelIcon className="h-5 w-5 text-indigo-600" />
          Filters
        </h3>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          {showAll ? 'Show Less' : 'Show All'}
        </button>
      </div>

      {/* Job Type Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Job Type</h4>
        <div className="space-y-2">
          {jobTypes.map((type) => (
            <label
              key={type.value}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name="jobType"
                value={type.value}
                checked={selectedType === type.value}
                onChange={() => handleTypeChange(type.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
              <span className="ml-3 text-sm text-gray-700">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Categories Filter */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
        
        {/* Search Categories */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {displayCategories.map((category) => (
              <label
                key={category.id}
                className="flex items-center p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={Number(selectedCategory) === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <div className="ml-3 flex-1">
                  <div className="text-sm text-gray-900">{category.name}</div>
                  <div className="text-xs text-gray-500">
                    {category.jobs_count || 0} jobs
                  </div>
                </div>
              </label>
            ))}
          </div>
        )}

        {!loading && searchTerm && filteredCategories.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No categories found matching "{searchTerm}"
          </div>
        )}
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          if (onFilterChange) {
            onFilterChange({ category: '', type: '' });
            setSearchTerm('');
          }
        }}
        className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
};

export default CategoryFilter;
