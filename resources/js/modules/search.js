/**
 * Search Module - Advanced job search functionality with filters and AJAX
 */

class JobSearch {
    constructor() {
        this.searchForm = document.querySelector('.job-search-form');
        this.searchInput = document.querySelector('.search-input');
        this.locationInput = document.querySelector('.location-input');
        this.categorySelect = document.querySelector('.category-select');
        this.filtersContainer = document.querySelector('.search-filters');
        this.resultsContainer = document.querySelector('.search-results');
        this.loadingIndicator = document.querySelector('.loading-indicator');
        this.searchHistory = this.getSearchHistory();

        this.init();
    }

    init() {
        this.setupSearchForm();
        this.setupAutoComplete();
        this.setupFilters();
        this.setupAdvancedSearch();
        this.setupSearchHistory();
        this.setupSortOptions();
        this.setupViewToggle();
    }

    setupSearchForm() {
        if (this.searchForm) {
            this.searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.performSearch();
            });

            // Real-time search with debouncing
            if (this.searchInput) {
                let searchTimeout;
                this.searchInput.addEventListener('input', () => {
                    clearTimeout(searchTimeout);
                    searchTimeout = setTimeout(() => {
                        if (this.searchInput.value.length > 2) {
                            this.performSearch(true);
                        }
                    }, 300);
                });
            }
        }
    }

    setupAutoComplete() {
        if (this.searchInput) {
            let autocompleteTimeout;
            this.searchInput.addEventListener('input', () => {
                clearTimeout(autocompleteTimeout);
                autocompleteTimeout = setTimeout(() => {
                    this.showAutoComplete();
                }, 200);
            });

            // Hide autocomplete when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.search-input-container')) {
                    this.hideAutoComplete();
                }
            });
        }

        if (this.locationInput) {
            let locationTimeout;
            this.locationInput.addEventListener('input', () => {
                clearTimeout(locationTimeout);
                locationTimeout = setTimeout(() => {
                    this.showLocationSuggestions();
                }, 200);
            });
        }
    }

    async showAutoComplete() {
        const query = this.searchInput.value.trim();
        if (query.length < 2) {
            this.hideAutoComplete();
            return;
        }

        try {
            const response = await fetch(`/api/jobs/search?q=${encodeURIComponent(query)}&autocomplete=true`);
            const suggestions = await response.json();

            this.renderAutoComplete(suggestions);
        } catch (error) {
            console.error('Error fetching autocomplete suggestions:', error);
        }
    }

    renderAutoComplete(suggestions) {
        let autocompleteContainer = document.querySelector('.autocomplete-container');

        if (!autocompleteContainer) {
            autocompleteContainer = document.createElement('div');
            autocompleteContainer.className = 'autocomplete-container';
            this.searchInput.parentNode.appendChild(autocompleteContainer);
        }

        if (suggestions.length === 0) {
            this.hideAutoComplete();
            return;
        }

        const html = suggestions.map(suggestion => `
            <div class="autocomplete-item" data-value="${suggestion.value}">
                <i class="bx bx-search"></i>
                <span class="suggestion-text">${suggestion.text}</span>
                <span class="suggestion-type">${suggestion.type}</span>
            </div>
        `).join('');

        autocompleteContainer.innerHTML = html;
        autocompleteContainer.classList.add('active');

        // Add click handlers
        autocompleteContainer.querySelectorAll('.autocomplete-item').forEach(item => {
            item.addEventListener('click', () => {
                this.searchInput.value = item.dataset.value;
                this.hideAutoComplete();
                this.performSearch();
            });
        });
    }

    hideAutoComplete() {
        const autocompleteContainer = document.querySelector('.autocomplete-container');
        if (autocompleteContainer) {
            autocompleteContainer.classList.remove('active');
        }
    }

    async showLocationSuggestions() {
        const query = this.locationInput.value.trim();
        if (query.length < 2) return;

        try {
            const response = await fetch(`/api/locations/search?q=${encodeURIComponent(query)}`);
            const locations = await response.json();

            this.renderLocationSuggestions(locations);
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
        }
    }

    renderLocationSuggestions(locations) {
        let container = document.querySelector('.location-suggestions');

        if (!container) {
            container = document.createElement('div');
            container.className = 'location-suggestions';
            this.locationInput.parentNode.appendChild(container);
        }

        const html = locations.map(location => `
            <div class="location-item" data-value="${location.name}">
                <i class="bx bx-map"></i>
                <span>${location.name}</span>
                <span class="location-count">${location.jobs_count} jobs</span>
            </div>
        `).join('');

        container.innerHTML = html;
        container.classList.add('active');

        container.querySelectorAll('.location-item').forEach(item => {
            item.addEventListener('click', () => {
                this.locationInput.value = item.dataset.value;
                container.classList.remove('active');
                this.performSearch();
            });
        });
    }

    setupFilters() {
        const filterInputs = document.querySelectorAll('.filter-input');
        filterInputs.forEach(input => {
            input.addEventListener('change', () => {
                this.performSearch();
            });
        });

        // Salary range filter
        const salaryRange = document.querySelector('.salary-range');
        if (salaryRange) {
            salaryRange.addEventListener('input', this.debounce(() => {
                this.updateSalaryDisplay();
                this.performSearch();
            }, 300));
        }

        // Clear filters button
        const clearFiltersBtn = document.querySelector('.clear-filters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    setupAdvancedSearch() {
        const advancedToggle = document.querySelector('.advanced-search-toggle');
        const advancedFilters = document.querySelector('.advanced-filters');

        if (advancedToggle && advancedFilters) {
            advancedToggle.addEventListener('click', () => {
                advancedFilters.classList.toggle('active');
                advancedToggle.textContent = advancedFilters.classList.contains('active')
                    ? 'Hide Advanced Filters'
                    : 'Advanced Filters';
            });
        }
    }

    async performSearch(isRealTime = false) {
        const formData = new FormData(this.searchForm);
        const searchParams = new URLSearchParams(formData);

        // Add current page if not real-time search
        if (!isRealTime) {
            searchParams.set('page', 1);
        }

        this.showLoading();

        try {
            const response = await fetch(`/api/jobs/search?${searchParams.toString()}`);
            const data = await response.json();

            this.renderResults(data);
            this.updateResultsCount(data.total);
            this.updatePagination(data);

            // Save to search history if not real-time
            if (!isRealTime) {
                this.saveSearchHistory(formData);
            }

            // Update URL without refreshing page
            if (!isRealTime) {
                this.updateURL(searchParams);
            }

        } catch (error) {
            console.error('Search error:', error);
            this.showError('An error occurred while searching. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    renderResults(data) {
        if (!this.resultsContainer) return;

        if (data.jobs.length === 0) {
            this.resultsContainer.innerHTML = `
                <div class="no-results">
                    <i class="bx bx-search-alt"></i>
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                    <button class="btn btn-primary clear-filters">Clear Filters</button>
                </div>
            `;
            return;
        }

        const currentView = document.querySelector('.view-toggle .active')?.dataset.view || 'grid';

        if (currentView === 'list') {
            this.renderListView(data.jobs);
        } else {
            this.renderGridView(data.jobs);
        }
    }

    renderGridView(jobs) {
        const html = jobs.map(job => `
            <div class="job-card" data-job-id="${job.id}">
                <div class="job-card-header">
                    <div class="company-logo">
                        <img src="${job.company.logo || '/assets/img/company-logo/default.png'}" alt="${job.company.name}">
                    </div>
                    <div class="job-meta">
                        ${job.is_featured ? '<span class="badge featured">Featured</span>' : ''}
                        ${job.is_urgent ? '<span class="badge urgent">Urgent</span>' : ''}
                    </div>
                </div>
                <div class="job-card-body">
                    <h3><a href="/jobs/${job.slug}">${job.title}</a></h3>
                    <p class="company-name">${job.company.name}</p>
                    <p class="job-location"><i class="bx bx-map"></i> ${job.location}</p>
                    <p class="job-type"><i class="bx bx-time"></i> ${job.job_type}</p>
                    <p class="salary-range"><i class="bx bx-dollar"></i> ${job.salary_range}</p>
                </div>
                <div class="job-card-footer">
                    <span class="posted-date">${job.posted_ago}</span>
                    <div class="job-actions">
                        <button class="btn-save" data-job-id="${job.id}">
                            <i class="bx bx-heart"></i>
                        </button>
                        <a href="/jobs/${job.slug}" class="btn btn-primary">Apply Now</a>
                    </div>
                </div>
            </div>
        `).join('');

        this.resultsContainer.innerHTML = html;
        this.setupJobCardActions();
    }

    renderListView(jobs) {
        const html = jobs.map(job => `
            <div class="job-list-item" data-job-id="${job.id}">
                <div class="job-info">
                    <div class="company-logo">
                        <img src="${job.company.logo || '/assets/img/company-logo/default.png'}" alt="${job.company.name}">
                    </div>
                    <div class="job-details">
                        <h3><a href="/jobs/${job.slug}">${job.title}</a></h3>
                        <p class="company-name">${job.company.name}</p>
                        <div class="job-meta">
                            <span><i class="bx bx-map"></i> ${job.location}</span>
                            <span><i class="bx bx-time"></i> ${job.job_type}</span>
                            <span><i class="bx bx-dollar"></i> ${job.salary_range}</span>
                        </div>
                    </div>
                </div>
                <div class="job-actions">
                    <div class="job-badges">
                        ${job.is_featured ? '<span class="badge featured">Featured</span>' : ''}
                        ${job.is_urgent ? '<span class="badge urgent">Urgent</span>' : ''}
                    </div>
                    <span class="posted-date">${job.posted_ago}</span>
                    <button class="btn-save" data-job-id="${job.id}">
                        <i class="bx bx-heart"></i>
                    </button>
                    <a href="/jobs/${job.slug}" class="btn btn-primary">Apply Now</a>
                </div>
            </div>
        `).join('');

        this.resultsContainer.innerHTML = html;
        this.setupJobCardActions();
    }

    setupJobCardActions() {
        const saveButtons = document.querySelectorAll('.btn-save');
        saveButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSaveJob(btn.dataset.jobId, btn);
            });
        });
    }

    async toggleSaveJob(jobId, button) {
        try {
            const response = await fetch(`/jobs/${jobId}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });

            const result = await response.json();

            if (result.saved) {
                button.classList.add('saved');
                button.innerHTML = '<i class="bx bxs-heart"></i>';
            } else {
                button.classList.remove('saved');
                button.innerHTML = '<i class="bx bx-heart"></i>';
            }
        } catch (error) {
            console.error('Error saving job:', error);
        }
    }

    setupViewToggle() {
        const viewToggleButtons = document.querySelectorAll('.view-toggle button');
        viewToggleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                viewToggleButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const view = btn.dataset.view;
                this.resultsContainer.className = `search-results ${view}-view`;

                // Re-render current results in new view
                this.performSearch();
            });
        });
    }

    setupSortOptions() {
        const sortSelect = document.querySelector('.sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => {
                this.performSearch();
            });
        }
    }

    showLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.add('active');
        }
    }

    hideLoading() {
        if (this.loadingIndicator) {
            this.loadingIndicator.classList.remove('active');
        }
    }

    showError(message) {
        // Create or update error message
        let errorContainer = document.querySelector('.search-error');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'search-error';
            this.resultsContainer.parentNode.insertBefore(errorContainer, this.resultsContainer);
        }

        errorContainer.innerHTML = `
            <div class="alert alert-danger">
                <i class="bx bx-error"></i>
                <span>${message}</span>
                <button class="close-error">×</button>
            </div>
        `;

        errorContainer.querySelector('.close-error').addEventListener('click', () => {
            errorContainer.remove();
        });
    }

    updateSalaryDisplay() {
        const salaryRange = document.querySelector('.salary-range');
        const salaryDisplay = document.querySelector('.salary-display');

        if (salaryRange && salaryDisplay) {
            const value = parseInt(salaryRange.value);
            salaryDisplay.textContent = `$${value.toLocaleString()}+`;
        }
    }

    clearAllFilters() {
        const filterInputs = document.querySelectorAll('.filter-input');
        filterInputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                input.checked = false;
            } else {
                input.value = '';
            }
        });

        this.performSearch();
    }

    saveSearchHistory(formData) {
        const searchTerm = formData.get('search');
        const location = formData.get('location');

        if (searchTerm || location) {
            const searchItem = {
                search: searchTerm,
                location: location,
                timestamp: Date.now()
            };

            this.searchHistory.unshift(searchItem);
            this.searchHistory = this.searchHistory.slice(0, 10); // Keep only last 10 searches

            localStorage.setItem('jobSearchHistory', JSON.stringify(this.searchHistory));
        }
    }

    getSearchHistory() {
        try {
            return JSON.parse(localStorage.getItem('jobSearchHistory')) || [];
        } catch {
            return [];
        }
    }

    updateURL(searchParams) {
        const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
        window.history.pushState({}, '', newUrl);
    }

    updateResultsCount(total) {
        const countElement = document.querySelector('.results-count');
        if (countElement) {
            countElement.textContent = `${total.toLocaleString()} jobs found`;
        }
    }

    updatePagination(data) {
        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer || data.last_page <= 1) return;

        let html = '<div class="pagination">';

        // Previous button
        if (data.current_page > 1) {
            html += `<button class="page-btn" data-page="${data.current_page - 1}">Previous</button>`;
        }

        // Page numbers
        for (let i = Math.max(1, data.current_page - 2); i <= Math.min(data.last_page, data.current_page + 2); i++) {
            html += `<button class="page-btn ${i === data.current_page ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }

        // Next button
        if (data.current_page < data.last_page) {
            html += `<button class="page-btn" data-page="${data.current_page + 1}">Next</button>`;
        }

        html += '</div>';
        paginationContainer.innerHTML = html;

        // Add click handlers
        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.dataset.page);
                this.goToPage(page);
            });
        });
    }

    goToPage(page) {
        const formData = new FormData(this.searchForm);
        formData.set('page', page);
        const searchParams = new URLSearchParams(formData);

        this.performSearch();
        this.updateURL(searchParams);

        // Scroll to top of results
        this.resultsContainer.scrollIntoView({ behavior: 'smooth' });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize job search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.job-search-form')) {
        new JobSearch();
    }
});

export default JobSearch;