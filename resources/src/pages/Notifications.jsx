import React, { useState } from 'react';
import { CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, BellIcon } from '@heroicons/react/24/outline';

const Notifications = () => {
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Job Application Accepted',
      message: 'Congratulations! Your application for Graphic Designer position at TechCorp has been accepted.',
      time: '2 hours ago',
      read: false,
      icon: CheckCircleIcon,
      color: 'green'
    },
    {
      id: 2,
      type: 'info',
      title: 'New Job Match',
      message: 'We found 5 new jobs that match your profile and skills.',
      time: '5 hours ago',
      read: false,
      icon: InformationCircleIcon,
      color: 'blue'
    },
    {
      id: 3,
      type: 'warning',
      title: 'Profile Completion',
      message: 'Your profile is 75% complete. Adding more details can help you get more job interviews.',
      time: '1 day ago',
      read: true,
      icon: ExclamationTriangleIcon,
      color: 'yellow'
    },
    {
      id: 4,
      type: 'info',
      title: 'New Message',
      message: 'You received a new message from HR Manager at StartupXYZ.',
      time: '2 days ago',
      read: true,
      icon: BellIcon,
      color: 'blue'
    },
    {
      id: 5,
      type: 'success',
      title: 'Profile Verified',
      message: 'Your profile has been successfully verified with a blue checkmark.',
      time: '3 days ago',
      read: true,
      icon: CheckCircleIcon,
      color: 'green'
    }
  ];

  const tabs = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'read', label: 'Read', count: notifications.filter(n => n.read).length }
  ];

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'unread') return !notification.read;
    if (activeTab === 'read') return notification.read;
    return true;
  });

  const markAsRead = (id) => {
    // In a real app, this would make an API call
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // In a real app, this would make an API call
    console.log('Mark all as read');
  };

  const deleteNotification = (id) => {
    // In a real app, this would make an API call
    console.log('Delete notification:', id);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600">Stay updated with your job search and application status</p>
        </div>

        {/* Page Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <button
            onClick={markAllAsRead}
            className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
          >
            Mark all as read
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <BellIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up! Check back later for new updates.</p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-white rounded-lg shadow-sm border ${
                  !notification.read ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200'
                } p-6 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full bg-${notification.color}-100 flex items-center justify-center flex-shrink-0`}>
                      <notification.icon className={`h-5 w-5 text-${notification.color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">New</span>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{notification.message}</p>
                      <p className="text-sm text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700">Email notifications for new job matches</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700">Push notifications for application updates</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                defaultChecked
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="ml-3 text-sm text-gray-700">Weekly job recommendations digest</span>
            </label>
          </div>
          <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
