/**
 * Bootstrap file for Laravel + React + Inertia.js application
 */

import axios from 'axios';

// Set up axios for Laravel API calls
window.axios = axios;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Set CSRF token for axios requests
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}
