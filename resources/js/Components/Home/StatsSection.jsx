import React from 'react';

export default function StatsSection({ stats }) {
    const defaultStats = [
        { label: 'Jobs Posted', value: '5,234', icon: 'bx-briefcase', color: 'text-blue-600' },
        { label: 'Companies', value: '2,156', icon: 'bx-buildings', color: 'text-green-600' },
        { label: 'Candidates', value: '12,789', icon: 'bx-user', color: 'text-purple-600' },
        { label: 'Success Rate', value: '95%', icon: 'bx-trophy', color: 'text-yellow-600' }
    ];

    const displayStats = stats ? [
        { label: 'Jobs Posted', value: stats.totalJobs?.toLocaleString() || '0', icon: 'bx-briefcase', color: 'text-blue-600' },
        { label: 'Companies', value: stats.totalCompanies?.toLocaleString() || '0', icon: 'bx-buildings', color: 'text-green-600' },
        { label: 'Candidates', value: stats.totalCandidates?.toLocaleString() || '0', icon: 'bx-user', color: 'text-purple-600' },
        { label: 'Success Rate', value: `${stats.successRate || 0}%`, icon: 'bx-trophy', color: 'text-yellow-600' }
    ] : defaultStats;

    return (
        <section className="stats-section py-16 bg-blue-600 dark:bg-blue-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayStats.map((stat, index) => (
                        <div key={index} className="stat-item text-center text-white">
                            <div className="stat-icon mb-4">
                                <i className={`bx ${stat.icon} text-4xl ${stat.color} bg-white bg-opacity-20 rounded-full p-4`}></i>
                            </div>
                            <div className="stat-number text-3xl lg:text-4xl font-bold mb-2">
                                {stat.value}
                            </div>
                            <div className="stat-label text-blue-100">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}