/**
 * Navigation Module - Modern mobile navigation and menu functionality
 */

class Navigation {
    constructor() {
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupStickyHeader();
        this.setupDropdowns();
        this.setupUserMenu();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navigationMenu = document.querySelector('.navigation-menu');
        const menuOverlay = document.querySelector('.menu-overlay');

        if (mobileMenuBtn && navigationMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });

            // Close menu when clicking overlay
            if (menuOverlay) {
                menuOverlay.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            }

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.mobile-menu-btn') && !e.target.closest('.navigation-menu')) {
                    this.closeMobileMenu();
                }
            });

            // Handle escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        const navigationMenu = document.querySelector('.navigation-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const body = document.body;

        if (navigationMenu.classList.contains('active')) {
            this.closeMobileMenu();
        } else {
            navigationMenu.classList.add('active');
            mobileMenuBtn.classList.add('active');
            body.classList.add('menu-open');
        }
    }

    closeMobileMenu() {
        const navigationMenu = document.querySelector('.navigation-menu');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const body = document.body;

        if (navigationMenu) {
            navigationMenu.classList.remove('active');
        }
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.remove('active');
        }
        body.classList.remove('menu-open');
    }

    setupStickyHeader() {
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 0;
        let lastScrollTop = 0;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (header) {
                if (scrollTop > headerHeight) {
                    header.classList.add('sticky');

                    // Hide header on scroll down, show on scroll up
                    if (scrollTop > lastScrollTop && scrollTop > headerHeight * 2) {
                        header.classList.add('header-hidden');
                    } else {
                        header.classList.remove('header-hidden');
                    }
                } else {
                    header.classList.remove('sticky', 'header-hidden');
                }
            }

            lastScrollTop = scrollTop;
        });
    }

    setupDropdowns() {
        const dropdownTriggers = document.querySelectorAll('.dropdown-trigger');

        dropdownTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = trigger.nextElementSibling;

                if (dropdown && dropdown.classList.contains('dropdown-menu')) {
                    this.toggleDropdown(dropdown);
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }

    toggleDropdown(dropdown) {
        const isActive = dropdown.classList.contains('active');

        // Close all other dropdowns
        this.closeAllDropdowns();

        // Toggle current dropdown
        if (!isActive) {
            dropdown.classList.add('active');
        }
    }

    closeAllDropdowns() {
        const activeDropdowns = document.querySelectorAll('.dropdown-menu.active');
        activeDropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }

    setupUserMenu() {
        const userMenuTrigger = document.querySelector('.user-menu-trigger');
        const userMenu = document.querySelector('.user-menu');

        if (userMenuTrigger && userMenu) {
            userMenuTrigger.addEventListener('click', (e) => {
                e.preventDefault();
                userMenu.classList.toggle('active');
            });

            // Close user menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.user-menu-container')) {
                    userMenu.classList.remove('active');
                }
            });
        }
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Navigation();
});

export default Navigation;