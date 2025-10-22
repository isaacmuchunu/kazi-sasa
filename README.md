# Kazi Sasa - Kenyan Job Board Platform

A modern, full-stack job board platform designed specifically for the Kenyan job market. Built with **Laravel 12** backend and **React 18** frontend, featuring real-time authentication, comprehensive job listings, and professional user profiles.

## 🚀 Features

### 🏢 **For Employers**
- Post and manage job listings
- Advanced candidate search and filtering
- Company profiles with verification
- Application tracking and management
- Analytics dashboard

### 👥 **For Job Seekers**
- Browse and search for jobs
- Create professional profiles
- Apply to multiple positions
- Save favorite jobs
- Track application status
- Email notifications for matching jobs

### 🔐 **Authentication & Security**
- Secure JWT-based authentication
- Role-based access control (candidates/employers)
- Password reset functionality
- Profile verification system

### 📱 **Modern UI/UX**
- Responsive design for all devices
- Progressive Web App (PWA) features
- Real-time notifications
- Advanced search and filtering
- Interactive dashboard with statistics

## 🛠️ Technology Stack

### Backend
- **Laravel 12** - PHP Framework
- **SQLite** - Database (development)
- **MySQL/PostgreSQL** - Database (production)
- **JWT Authentication** - Token-based auth
- **Eloquent ORM** - Database operations
- **Laravel Sanctum** - API authentication

### Frontend
- **React 18** - JavaScript Library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Heroicons** - Icon library
- **Vite** - Build tool and development server
- **Axios** - HTTP client

### Development Tools
- **PHP Composer** - Dependency management
- **NPM** - Node.js package manager
- **Laravel Mix/Vite** - Asset compilation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **PHP 8.2+** with required extensions:
  - PDO
  - Mbstring
  - OpenSSL
  - Tokenizer
  - XML
  - Ctype
  - JSON
  - bcmath
  - BCMath

- **Composer 2.0+**
- **Node.js 18+** and **NPM 9+**
- **Git**

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/isaacmuchunu/kazi-sasa.git
cd kazi-sasa
```

### 2. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install
```

### 3. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure your database in .env
# For development, SQLite is pre-configured:
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite

# Create the SQLite database file
touch database/database.sqlite
```

### 4. Database Setup

```bash
# Run migrations
php artisan migrate

# Seed the database with sample data
php artisan db:seed
```

### 5. Frontend Build

```bash
# Compile frontend assets
npm run build

# For development with hot reload
npm run dev
```

### 6. Start the Development Server

```bash
# Start Laravel development server
php artisan serve

# Or in parallel with npm (recommended for development)
php artisan serve & npm run dev
```

Open your browser and navigate to:
- **Frontend:** `http://localhost:8000`
- **API Documentation:** Available at `/api/documentation`

## 📁 Project Structure

```
kazi-sasa/
├── app/
│   ├── Http/Controllers/Api/     # API Controllers
│   ├── Http/Requests/Api/         # Form Requests
│   ├── Models/                     # Eloquent Models
│   ├── Policies/                   # Authorization Policies
├── database/
│   ├── migrations/                 # Database Migrations
│   ├── seeders/                    # Database Seeders
│   └── factories/                  # Model Factories
├── resources/src/
│   ├── components/                 # React Components
│   ├── contexts/                   # React Contexts
│   ├── hooks/                      # Custom React Hooks
│   ├── pages/                      # React Pages
│   ├── services/                   # API Services
│   └── utils/                      # Utility Functions
├── storage/                        # File Storage
└── public/                         # Public Assets
```

## 🔐 Sample Accounts

The application comes with pre-seeded sample accounts for testing:

### Employer Accounts
- **Email:** `employer@kazisasa.com`
- **Password:** `password`
- **Email:** `sarah@techcorp.co.ke`
- **Password:** `password`

### Candidate Account
- **Email:** `candidate@kazisasa.com`
- **Password:** `password`

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/logout` | User logout |
| GET | `/api/auth/me` | Get current user info |

### Job Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/jobs` | Get all jobs |
| GET | `/api/jobs/{id}` | Get job details |
| POST | `/api/jobs/{id}/apply` | Apply to job |
| GET | `/api/jobs/search` | Search jobs |

### Company Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| GET | `/api/companies` | Get all companies |
| GET | `/api/companies/{id}` | Get company details |
| POST | `/api/companies` | Create company |
| PUT | `/api/companies/{id}` | Update company |

## 🧪 Testing

### Running Tests

```bash
# Run all tests
php artisan test

# Run PHPUnit with coverage
php artisan test --coverage

# Run specific test suite
php artisan test --filter JobTest
```

### Database Testing

```bash
# Refresh database and run migrations
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=JobSeeder
```

## 📦 Deployment

### Production Deployment

1. **Environment Setup:**
   ```bash
   cp .env.example .env
   # Configure production variables
   ```

2. **Install Dependencies:**
   ```bash
   composer install --optimize-autoloader --no-dev
   npm ci --only=production
   ```

3. **Application Setup:**
   ```bash
   php artisan key:generate --force
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

### Environment Variables

```env
# Application
APP_NAME="Kazi Sasa"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kazi_sasa
DB_USERNAME=username
DB_PASSWORD=password

# Queue
QUEUE_CONNECTION=database

# Mail
MAIL_MAILER=smtp
MAIL_HOST=mailhog
MAIL_PORT=1025
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

## 🔧 Configuration

### Customization Options

#### 1. **Authentication**
- Modify `config/auth.php` for custom guards
- Adjust token expiration in `config/sanctum.php`

#### 2. **File Uploads**
- Configure storage in `config/filesystems.php`
- Set maximum upload size in `php.ini`

#### 3. **Email Configuration**
- Set up mail driver in `.env`
- Configure SMTP settings for production

#### 4. **CORS Settings**
- Modify `config/cors.php` for API access
- Update allowed origins and methods

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add some amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Code Style

- Follow **PSR-12** coding standards
- Use **ESLint** and **Prettier** for frontend code
- Write **PHPUnit tests** for new features
- Comment complex business logic

## 📝 Changelog

### Version 1.0.0 - Current Release

**✨ Added:**
- Complete authentication system with JWT
- Full React frontend with routing
- Database seeding with sample data
- API endpoints for all major features
- Comprehensive UI components
- Blog and support pages
- Company and job management
- Application tracking system

**🔧 Fixed:**
- Authentication context conflicts
- Missing page components
- Foreign key constraints in models
- API service integration issues

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

## 🆘 Support & Feedback

### Getting Help

- **Documentation:** Check the `/help` page in the application
- **Issues:** Report bugs on [GitHub Issues](https://github.com/isaacmuchunu/kazi-sasa/issues)
- **Discussions:** Join our [GitHub Discussions](https://github.com/isaacmuchunu/kazi-sasa/discussions)

### Contact Information

- **Email:** `contact@kazisasa.co.ke`
- **Phone:** `+254 712 345 678`
- **Location:** Nairobi, Kenya

## 🌟 Acknowledgments

Special thanks to:

- **Laravel Community** for the excellent framework
- **React Team** for the powerful library
- **Tailwind CSS** for the utility-first CSS framework
- **Kenyan Tech Community** for inspiration and feedback

---

**Built with ❤️ for the Kenyan job market**
