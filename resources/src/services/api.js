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

  getCSRFToken() {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
  }

  // Generic fetch method
  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRF-TOKEN': this.getCSRFToken(),
        ...options.headers,
      },
      ...options,
    };

    // Add Authorization header if token exists
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle FormData - let browser set Content-Type
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const data = contentType && contentType.includes('application/json')
        ? await response.json()
        : null;

      if (!response.ok) {
        const message = data?.message || response.statusText || 'API request failed';
        const error = new Error(message);
        error.response = { status: response.status, data };
        throw error;
      }

      return { data, status: response.status };
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Axios-compatible methods
  async get(endpoint, config = {}) {
    const { params, ...options } = config;
    let url = endpoint;
    if (params) {
      const queryParams = new URLSearchParams(params).toString();
      url = `${endpoint}${queryParams ? `?${queryParams}` : ''}`;
    }
    return this.fetch(url, { method: 'GET', ...options });
  }

  async post(endpoint, data = {}, config = {}) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.fetch(endpoint, { method: 'POST', body, ...config });
  }

  async put(endpoint, data = {}, config = {}) {
    return this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config
    });
  }

  async patch(endpoint, data = {}, config = {}) {
    return this.fetch(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...config
    });
  }

  async delete(endpoint, config = {}) {
    return this.fetch(endpoint, { method: 'DELETE', ...config });
  }

  // Job endpoints
  async getJobs(params = {}) {
    return this.get('/jobs', { params });
  }

  async getJob(id) {
    return this.get(`/jobs/${id}`);
  }

  async getRelatedJobs(id) {
    return this.get(`/jobs/${id}/related`);
  }

  async searchJobs(params = {}) {
    return this.get('/search/jobs', { params });
  }

  // Category endpoints
  async getCategories(params = {}) {
    return this.get('/categories', { params });
  }

  // Company endpoints
  async getCompanies(params = {}) {
    return this.get('/companies', { params });
  }

  async getCompany(id) {
    return this.get(`/companies/${id}`);
  }

  async getCompanyJobs(id, params = {}) {
    return this.get(`/companies/${id}/jobs`, { params });
  }

  // Candidate endpoints
  async getCandidates(params = {}) {
    return this.get('/candidates', { params });
  }

  async getCandidate(username) {
    return this.get(`/candidates/${username}`);
  }

  async getCandidateProfile() {
    return this.get('/candidate/profile');
  }

  async updateCandidateProfile(data) {
    return this.put('/candidate/profile', data);
  }

  // Search endpoints
  async searchLocations(query) {
    return this.get('/search/locations', { params: { q: query } });
  }

  async searchCategories(query) {
    return this.get('/search/categories', { params: { q: query } });
  }

  // Authenticated job endpoints
  async applyForJob(jobId, data = {}) {
    return this.post(`/jobs/${jobId}/apply`, data);
  }

  async saveJob(jobId) {
    return this.post(`/jobs/${jobId}/save`);
  }

  async unsaveJob(jobId) {
    return this.delete(`/jobs/${jobId}/unsave`);
  }

  async getSavedJobs(params = {}) {
    return this.get('/user/saved-jobs', { params });
  }

  async getAppliedJobs(params = {}) {
    return this.get('/user/applied-jobs', { params });
  }

  // Upload endpoints
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return this.post('/upload/image', formData);
  }

  async uploadResume(file) {
    const formData = new FormData();
    formData.append('resume', file);
    return this.post('/upload/resume', formData);
  }

  async uploadLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    return this.post('/upload/logo', formData);
  }

  async uploadDocument(file, type = 'document') {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    return this.post('/upload/document', formData);
  }

  // Dashboard & Statistics
  async getDashboardStats() {
    return this.get('/statistics/dashboard');
  }

  async getGlobalStats() {
    return this.get('/statistics/global');
  }

  async getJobStats() {
    return this.get('/statistics/jobs');
  }

  async getDashboardActivity(params = {}) {
    return this.get('/dashboard/activity', { params });
  }

  async getRecommendations(params = {}) {
    return this.get('/dashboard/recommendations', { params });
  }

  // User profile
  async getUserProfile() {
    return this.get('/user/profile');
  }

  async updateProfile(data) {
    return this.put('/user/profile', data);
  }

  async uploadProfileImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return this.post('/user/profile-image', formData);
  }

  async changePassword(data) {
    return this.post('/user/change-password', data);
  }

  async getUserStatistics() {
    return this.get('/user/statistics');
  }

  // Messages
  async getMessages(params = {}) {
    return this.get('/messages', { params });
  }

  async sendMessage(data) {
    return this.post('/messages', data);
  }

  async getMessage(id) {
    return this.get(`/messages/${id}`);
  }

  async getConversations() {
    return this.get('/conversations');
  }

  // Notifications
  async getNotifications(params = {}) {
    return this.get('/notifications', { params });
  }

  async getNotificationCount() {
    return this.get('/notifications/count');
  }

  async markNotificationRead(id) {
    return this.put(`/notifications/${id}/read`);
  }

  async markAllNotificationsRead() {
    return this.put('/notifications/read-all');
  }

  async updateNotificationSettings(data) {
    return this.put('/notifications/settings', data);
  }

  // Reviews
  async createReview(data) {
    return this.post('/reviews', data);
  }

  async updateReview(id, data) {
    return this.put(`/reviews/${id}`, data);
  }

  async deleteReview(id) {
    return this.delete(`/reviews/${id}`);
  }

  async getCompanyReviews(companyId, params = {}) {
    return this.get(`/companies/${companyId}/reviews`, { params });
  }

  async getCandidateReviews(candidateId, params = {}) {
    return this.get(`/candidates/${candidateId}/reviews`, { params });
  }

  // Blog
  async getBlogs(params = {}) {
    return this.get('/blog', { params });
  }

  async getBlog(slug) {
    return this.get(`/blog/${slug}`);
  }

  async getBlogCategories() {
    return this.get('/blog/categories');
  }

  async getBlogComments(blogId, params = {}) {
    return this.get(`/blog/${blogId}/comments`, { params });
  }

  async addBlogComment(blogId, data) {
    return this.post(`/blog/${blogId}/comments`, data);
  }

  // Employer endpoints
  async getEmployerCompany() {
    return this.get('/employer/company');
  }

  async createEmployerCompany(data) {
    return this.post('/employer/company', data);
  }

  async updateEmployerCompany(data) {
    return this.put('/employer/company', data);
  }

  async uploadCompanyLogo(file) {
    const formData = new FormData();
    formData.append('logo', file);
    return this.post('/employer/company/logo', formData);
  }

  async getEmployerDashboard() {
    return this.get('/employer/dashboard');
  }

  async getEmployerJobs(params = {}) {
    return this.get('/employer/jobs', { params });
  }

  async createEmployerJob(data) {
    return this.post('/employer/jobs', data);
  }

  async updateEmployerJob(id, data) {
    return this.put(`/employer/jobs/${id}`, data);
  }

  async deleteEmployerJob(id) {
    return this.delete(`/employer/jobs/${id}`);
  }

  // Application management
  async getJobApplications(jobId, params = {}) {
    return this.get(`/jobs/${jobId}/applications`, { params });
  }

  async getApplication(id) {
    return this.get(`/applications/${id}`);
  }

  async updateApplicationStatus(id, status) {
    return this.put(`/applications/${id}/status`, { status });
  }

  async shortlistApplication(id) {
    return this.post(`/applications/${id}/shortlist`);
  }

  async rejectApplication(id) {
    return this.post(`/applications/${id}/reject`);
  }

  async acceptApplication(id) {
    return this.post(`/applications/${id}/accept`);
  }

  async withdrawApplication(id) {
    return this.delete(`/applications/${id}/withdraw`);
  }

  // Newsletter
  async subscribeNewsletter(email) {
    return this.post('/newsletter/subscribe', { email });
  }

  async unsubscribeNewsletter(email) {
    return this.post('/newsletter/unsubscribe', { email });
  }
}

// Create and export a singleton instance
const api = new ApiService();
export default api;
