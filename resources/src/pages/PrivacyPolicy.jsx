import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-gray-600 mb-6">
                At Kazi Sasa, we are committed to protecting your privacy and personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our job board platform.
              </p>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Information We Collect</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                    <p className="text-gray-600 mb-2">We collect the following personal information:</p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-600">
                      <li>Name, email address, and phone number</li>
                      <li>Physical location and address</li>
                      <li>Date of birth</li>
                      <li>Professional information (work history, education, skills)</li>
                      <li>Resume and cover letter documents</li>
                      <li>Profile photo and other images</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Usage Data</h3>
                    <p className="text-gray-600">
                      Information about how you use our service, including pages visited, time spent, and interactions.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Device and Browser Information</h3>
                    <p className="text-gray-600">
                      IP address, browser type, operating system, and device identifiers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">How We Use Your Information</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>To provide and maintain our job board services</li>
                  <li>To match job seekers with relevant job opportunities</li>
                  <li>To communicate with you about applications and job opportunities</li>
                  <li>To improve our services and develop new features</li>
                  <li>To ensure platform security and prevent fraudulent activities</li>
                  <li>To send you important notices, updates, and marketing communications (with consent)</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Information Sharing</h2>
                <p className="text-gray-600 mb-4">We may share your information in the following circumstances:</p>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">With Employers</h3>
                    <p className="text-gray-600">
                      When you apply for a job, we share your profile information and resume with the prospective employer. You can control what information is visible in your profile settings.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">With Service Providers</h3>
                    <p className="text-gray-600">
                      We work with trusted third-party service providers to help operate our service, including payment processing, email delivery, and analytics.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Legal Requirements</h3>
                    <p className="text-gray-600">
                      We may disclose your information if required by law or to protect our rights, property, or safety, or that of our users or the public.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate technical and organizational measures to protect your personal data:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>SSL encryption for data transmission</li>
                  <li>Secure data storage with access controls</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Limited employee access to personal data</li>
                  <li>Mandatory security training for staff members</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Your Rights</h2>
                <p className="text-gray-600 mb-4">Under Kenyan data protection laws, you have the right to:</p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>Access and obtain a copy of your personal data</li>
                  <li>Correct inaccurate or incomplete personal data</li>
                  <li>Request deletion of your personal data (subject to legal requirements)</li>
                  <li>Object to processing of your personal data</li>
                  <li>Request restriction of processing</li>
                  <li>Data portability (transfer your data to another service)</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  To exercise these rights, please contact us at privacy@kazisasa.co.ke.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cookies and Tracking</h2>
                <p className="text-gray-600 mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li><strong>Essential Cookies:</strong> Required for the service to function</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how users interact with our service</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to show relevant advertisements (with consent)</li>
                </ul>
                <p className="text-gray-600 mt-4">
                  You can control cookie settings through your browser preferences.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Data Retention</h2>
                <p className="text-gray-600 mb-4">
                  We retain your personal data only as long as necessary to fulfill the purposes for which it was collected, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-gray-600">
                  <li>While your account is active</li>
                  <li>For the period required by law or regulation</li>
                  <li>For the duration of any legitimate business purpose</li>
                </ul>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
                <p className="text-gray-600">
                  Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you become aware that a child has provided us with personal data, please contact us immediately.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
                <p className="text-gray-600">
                  Your personal data is processed in Kenya. If we transfer data outside Kenya, we ensure appropriate safeguards are in place under Kenyan data protection laws.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
                <p className="text-gray-600">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
              </div>

              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h2>
                <p className="text-gray-600 mb-4">
                  If you have any questions about this Privacy Policy or want to exercise your data rights, please contact us:
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">Email: privacy@kazisasa.co.ke</p>
                  <p className="text-gray-600">Phone: +254 712 345 678</p>
                  <p className="text-gray-600">Address: 101 E 129th St, East Chicago, IN 46312, US</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-sm text-gray-500">
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

export default PrivacyPolicy;
