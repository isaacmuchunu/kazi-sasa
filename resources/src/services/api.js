// API Service for Kazi Sasa Job Board
const DEFAULT_API_BASE = '/api/v1';

const resolveBaseUrl = () => {
  const metaBase = document
    .querySelector('meta[name="api-base-url"]')
    ?.getAttribute('content');
  if (metaBase && metaBase.length > 0) {
    return metaBase.replace(/\/$/, '');
  }
  const appUrl = document
    .querySelector('meta[name="app-url"]')
    ?.getAttribute('content');
  if (appUrl && appUrl.length > 0) {
    return `${appUrl.replace(/\/$/, '')}${DEFAULT_API_BASE}`;
  }
  return DEFAULT_API_BASE;
};

class ApiService {
  constructor() {
    this.baseUrl = resolveBaseUrl();
  }

  // Generic fetch method
  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      ...options,
    };

    // Add Authorization header if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : null;
      
      if (!response.ok) {
        const message = data?.message || response.statusText || 'API request failed';
        throw new Error(message);
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Job endpoints
  async getJobs(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/jobs${queryParams ? `?${queryParams}` : ''}`;
    return this.fetch(endpoint);
  }

  async getJob(id) {
    return this.fetch(`/jobs/${id}`);
  }

  async getRelatedJobs(id) {
    return this.fetch(`/jobs/${id}/related`);
  }

  async searchJobs(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/search/jobs${queryParams ? `?${queryParams}` : ''}`;
    return this.fetch(endpoint);
  }

  // Category endpoints
  async getCategories(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/categories${queryParams ? `?${queryParams}` : ''}`;
    return this.fetch(endpoint);
  }

  // Company endpoints
  async getCompanies(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/companies${queryParams ? `?${queryParams}` : ''}`;
    return this.fetch(endpoint);
  }

  async getCompany(id) {
    return this.fetch(`/companies/${id}`);
  }

  async getCompanyJobs(id, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/companies/${id}/jobs${queryParams ? `?${queryParams}` : ''}`;
    return this.fetch(endpoint);
  }

  // Search endpoints
  async searchLocations(query) {
    return this.fetch(`/search/locations?q=${query}`);
  }

  async searchCategories(query) {
    return this.fetch(`/search/categories?q=${query}`);
  }

  // Authenticated endpoints (require user to be logged in)
  async applyForJob(jobId, data = {}) {
    return this.fetch(`/jobs/${jobId}/apply`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      },
    });
  }

  async saveJob(jobId) {
    return this.fetch(`/jobs/${jobId}/save`, {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      },
    });
  }

  async unsaveJob(jobId) {
    return this.fetch(`/jobs/${jobId}/unsave`, {
      method: 'DELETE',
      headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content'),
      },
    });
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return this.fetch('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async getSavedJobs(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/user/saved-jobs${queryParams ? `?${queryParams}` : ''}`;
    return this.fetch(endpoint);
  }

  async getAppliedJobs(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = `/user/applied-jobs${queryParams ? `?${queryParams}` : ''}`;
    return this.fetch(endpoint);
  }

  // New API methods for enhanced functionality
  async getDashboardStats() {
    return this.fetch('/statistics/dashboard');
  }

  async getGlobalStats() {
    return this.fetch('/statistics/global');
  }

  async getJobStats() {
    return this.fetch('/statistics/jobs');
  }

  async getDashboardActivity(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.fetch(`/dashboard/activity${queryParams ? `?${queryParams}` : ''}`);
  }

  async getRecommendations(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.fetch(`/dashboard/recommendations${queryParams ? `?${queryParams}` : ''}`);
  }

  async updateProfile(data) {
    return this.fetch('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return this.fetch('/upload/resume', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove content-type to let browser set it for FormData
    });
  }

  async uploadLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    return this.fetch('/upload/logo', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove content-type to let browser set it for FormData
    });
  }

  async uploadDocument(file, type = 'document') {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    return this.fetch('/upload/document', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return this.fetch('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {},
    });
  }

  async getMessages(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.fetch(`/messages${queryParams ? `?${queryParams}` : ''}`);
  }

  async sendMessage(data) {
    return this.fetch('/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessage(id) {
    return this.fetch(`/messages/${id}`);
  }

  async getConversations() {
    return this.fetch('/conversations');
  }

  async getNotifications(params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.fetch(`/notifications${queryParams ? `?${queryParams}` : ''}`);
  }

  async markNotificationRead(id) {
    return this.fetch(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsRead() {
    return this.fetch('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async getNotificationCount() {
    return this.fetch('/notifications/count');
  }

  async updateNotificationSettings(data) {
    return this.fetch('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Review methods
  async createReview(data) {
    return this.fetch('/reviews', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateReview(id, data) {
    return this.fetch(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteReview(id) {
    return this.fetch(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // Blog methods
  async addComment(blogId, data) {
    return this.fetch(`/blog/${blogId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getComments(blogId) {
    const queryParams = new URLSearchParams(params).toString();
    return this.fetch(`/blog/${blogId}/comments${queryParams ? `?${queryParams}` : ''}`);
  }

  // Blog methods
  async addComment(blogId, data) {
    return this.fetch(`/blog/${blogId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getBlogComments(blogId, params = {}) {
    const queryParams = new URLSearchParams(params).toString();
    return this.fetch(`/blog/${blogId}/comments${queryParams ? `?${queryParams}` : ''}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;