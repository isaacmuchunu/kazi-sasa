import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { formatDistanceToNow } from 'date-fns';

export default function Messages({ conversations = [], selectedConversation = null }) {
    const [activeTab, setActiveTab] = useState('inbox');
    const [selectedMessage, setSelectedMessage] = useState(selectedConversation);

    const { data, setData, post, processing, errors, reset } = useForm({
        message: '',
    });

    const handleSendMessage = (e) => {
        e.preventDefault();
        post(`/account/messages/${selectedMessage.id}/send`, {
            onSuccess: () => {
                reset();
            },
        });
    };

    const inboxMessages = conversations.filter(conv => conv.type === 'received');
    const sentMessages = conversations.filter(conv => conv.type === 'sent');
    const currentMessages = activeTab === 'inbox' ? inboxMessages : sentMessages;

    return (
        <AppLayout>
            <Head title="Messages" />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Messages</h1>
                        <p className="text-xl text-blue-100">
                            Communicate with employers and stay updated on your applications.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-3 h-[700px]">
                                {/* Conversations List */}
                                <div className="lg:col-span-1 border-r border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
                                    {/* Tabs */}
                                    <div className="flex border-b border-gray-200 dark:border-gray-700">
                                        <button
                                            onClick={() => setActiveTab('inbox')}
                                            className={`flex-1 px-4 py-4 font-medium transition-colors ${
                                                activeTab === 'inbox'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-b-2 border-blue-600'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <i className="bx bx-inbox"></i>
                                                Inbox
                                                {inboxMessages.length > 0 && (
                                                    <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                                                        {inboxMessages.length}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('sent')}
                                            className={`flex-1 px-4 py-4 font-medium transition-colors ${
                                                activeTab === 'sent'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-b-2 border-blue-600'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <i className="bx bx-send"></i>
                                                Sent
                                            </div>
                                        </button>
                                    </div>

                                    {/* Conversations */}
                                    <div className="overflow-y-auto flex-1">
                                        {currentMessages.length > 0 ? (
                                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {currentMessages.map((conversation) => (
                                                    <button
                                                        key={conversation.id}
                                                        onClick={() => setSelectedMessage(conversation)}
                                                        className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                                                            selectedMessage?.id === conversation.id
                                                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                                                : ''
                                                        }`}
                                                    >
                                                        <div className="flex items-start gap-3">
                                                            <img
                                                                src={conversation.company?.logo || '/assets/img/company-placeholder.png'}
                                                                alt={conversation.company?.name}
                                                                className="w-12 h-12 rounded-full object-cover"
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between mb-1">
                                                                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">
                                                                        {conversation.company?.name}
                                                                    </h4>
                                                                    {conversation.unread && (
                                                                        <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></span>
                                                                    )}
                                                                </div>
                                                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-1 truncate">
                                                                    {conversation.job_title}
                                                                </p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                                    {conversation.last_message}
                                                                </p>
                                                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                                    {formatDistanceToNow(new Date(conversation.updated_at))} ago
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="p-8 text-center">
                                                <i className={`bx ${activeTab === 'inbox' ? 'bx-inbox' : 'bx-send'} text-6xl text-gray-300 mb-4`}></i>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    No {activeTab === 'inbox' ? 'inbox' : 'sent'} messages
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Message Thread */}
                                <div className="lg:col-span-2 flex flex-col">
                                    {selectedMessage ? (
                                        <>
                                            {/* Message Header */}
                                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={selectedMessage.company?.logo || '/assets/img/company-placeholder.png'}
                                                        alt={selectedMessage.company?.name}
                                                        className="w-14 h-14 rounded-full object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                                            {selectedMessage.company?.name}
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300">
                                                            {selectedMessage.job_title}
                                                        </p>
                                                    </div>
                                                    <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 p-2">
                                                        <i className="bx bx-dots-vertical-rounded text-2xl"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Messages */}
                                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                                {selectedMessage.messages?.map((msg, index) => (
                                                    <div
                                                        key={index}
                                                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div
                                                            className={`max-w-[70%] ${
                                                                msg.sender === 'me'
                                                                    ? 'bg-blue-600 text-white'
                                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                                            } rounded-lg p-4`}
                                                        >
                                                            <p className="text-sm mb-1">{msg.content}</p>
                                                            <p
                                                                className={`text-xs ${
                                                                    msg.sender === 'me'
                                                                        ? 'text-blue-100'
                                                                        : 'text-gray-500 dark:text-gray-400'
                                                                }`}
                                                            >
                                                                {formatDistanceToNow(new Date(msg.created_at))} ago
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Message Input */}
                                            <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                                                <form onSubmit={handleSendMessage} className="flex gap-3">
                                                    <input
                                                        type="text"
                                                        value={data.message}
                                                        onChange={(e) => setData('message', e.target.value)}
                                                        placeholder="Type your message..."
                                                        className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                                        disabled={processing}
                                                    />
                                                    <button
                                                        type="submit"
                                                        disabled={processing || !data.message.trim()}
                                                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                                                    >
                                                        {processing ? (
                                                            <i className="bx bx-loader-alt bx-spin"></i>
                                                        ) : (
                                                            <>
                                                                <i className="bx bx-send"></i>
                                                                Send
                                                            </>
                                                        )}
                                                    </button>
                                                </form>
                                                {errors.message && (
                                                    <p className="text-red-500 text-sm mt-2">{errors.message}</p>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center p-8">
                                            <div className="text-center">
                                                <i className="bx bx-message-dots text-8xl text-gray-300 mb-4"></i>
                                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                                    No Conversation Selected
                                                </h3>
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    Select a conversation from the list to view messages
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Messaging Tips */}
                        <div className="mt-8 bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                💬 Messaging Best Practices
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-400 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="bx bx-time"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                            Respond Promptly
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Reply to employer messages within 24 hours
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="bx bx-check-shield"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                            Stay Professional
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Use proper grammar and maintain professionalism
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <i className="bx bx-conversation"></i>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                                            Be Clear
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">
                                            Keep messages concise and to the point
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </AppLayout>
    );
}