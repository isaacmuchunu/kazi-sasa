import React from 'react';

function HeaderNew() {
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="text-2xl font-bold text-gray-900">Kazi Sasa</div>
                    <nav className="flex items-center space-x-8">
                        <a href="/" className="text-gray-700 hover:text-blue-600">Home</a>
                        <a href="/jobs" className="text-gray-700 hover:text-blue-600">Jobs</a>
                        <a href="/about" className="text-gray-700 hover:text-blue-600">About</a>
                    </nav>
                </div>
            </div>
        </header>
    );
}

export default HeaderNew;