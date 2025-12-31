import React from 'react';
import { CubeIcon, ShieldCheckIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

const Cookies = () => {
  const cookieTypes = [
    {
      icon: CubeIcon,
      title: "Essential Cookies",
      description: "These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms.",
      required: true,
      examples: ["Authentication", "Security", "Shopping Cart"]
    },
    {
      icon: ShieldCheckIcon,
      title: "Performance Cookies",
      description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site.",
      required: false,
      examples: ["Google Analytics", "Hotjar", "Mixpanel"]
    },
    {
      icon: AdjustmentsHorizontalIcon,
      title: "Functional Cookies",
      description: "These cookies enable the website to provide enhanced functionality and personalisation. They may be set by us or by third party providers whose services we have added to our pages.",
      required: false,
      examples: ["Language preferences", "Remember login", "Personalized content"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-8">
            <div className="text-center mb-8">
              <CubeIcon className="mx-auto h-16 w-16 text-indigo-600 mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Understanding how Kazi Sasa uses cookies and similar technologies to enhance your experience
              </p>
            </div>

            <div className="prose max-w-none">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">What are cookies?</h2>
                <p className="text-gray-600 mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit a website. They allow websites to recognize your device and store information about your preferences or past actions.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How we use cookies</h2>
                <p className="text-gray-600 mb-4">
                  Kazi Sasa uses cookies and similar technologies to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Remember your login information and keep you signed in</li>
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our website and improve our services</li>
                  <li>Show you relevant job recommendations</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                  <li>Ensure the security of our website</li>
                  <li>Provide personalized content and features</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of cookies we use</h2>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  {cookieTypes.map((cookie, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <cookie.icon className="h-8 w-8 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{cookie.title}</h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              cookie.required 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {cookie.required ? 'Required' : 'Optional'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{cookie.description}</p>
                          <div className="flex flex-wrap gap-2">
                            {cookie.examples.map((example, idx) => (
                              <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                {example}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-party cookies</h2>
                <p className="text-gray-600 mb-4">
                  We use various third-party services that may place their own cookies on your device:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Analytics and Performance</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• Google Analytics - Website traffic analysis</li>
                    <li>• Hotjar - User behavior tracking</li>
                  </ul>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Social Media and Advertising</h4>
                  <ul className="space-y-1 text-gray-600 text-sm">
                    <li>• LinkedIn - Professional networking and advertising</li>
                    <li>• Facebook - Social media integration</li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing cookie preferences</h2>
                <p className="text-gray-600 mb-4">
                  You can control cookies in several ways:
                </p>
                <div className="space-y-4">
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Browser Settings</h4>
                    <p className="text-gray-600 text-sm">
                      Most web browsers allow you to control cookies through their settings. You can:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600 text-sm mt-2">
                      <li>Block all cookies</li>
                      <li>Accept only first-party cookies</li>
                      <li>Delete cookies when you close your browser</li>
                      <li>View and delete individual cookies</li>
                    </ul>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <h4 className="font-semibold text-gray-900 mb-1">Cookie Preference Center</h4>
                    <p className="text-gray-600 text-sm">
                      When you first visit our website, you'll see a cookie banner where you can:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-gray-600 text-sm mt-2">
                      <li>Accept all cookies</li>
                      <li>Accept only essential cookies</li>
                      <li>Customize your preferences</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookie lifespan</h2>
                <p className="text-gray-600 mb-4">
                  Cookies have different lifespans:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Session Cookies</h4>
                    <p className="text-gray-600 text-sm">
                      These are temporary cookies that are deleted when you close your browser.
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Persistent Cookies</h4>
                    <p className="text-gray-600 text-sm">
                      These remain on your device for a set period or until you delete them.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Blocking cookies</h2>
                <p className="text-gray-600 mb-4">
                  Please be aware that blocking some types of cookies may affect your experience on our website. Some features may not work properly, and you may not be able to access certain services or content.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your rights</h2>
                <p className="text-gray-600 mb-4">
                  Under data protection laws, you have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Know what cookies are being used</li>
                  <li>Control what cookies are placed on your device</li>
                  <li>Withdraw consent at any time</li>
                  <li>Request information about how we process your data</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to this policy</h2>
                <p className="text-gray-600">
                  We may update this Cookie Policy from time to time to reflect changes in our practices, legal requirements, or for other operational reasons. We will notify you of any significant changes by posting the updated policy on our website.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about our use of cookies, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Email: privacy@kazisasa.co.ke</p>
                  <p className="text-gray-600">Phone: +254 712 345 678</p>
                  <p className="text-gray-600">Address: 101 E 129th St, East Chicago, IN 46312, US</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <p className="text-sm text-gray-500 text-center">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
