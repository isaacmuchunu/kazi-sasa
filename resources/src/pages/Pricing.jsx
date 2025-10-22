import React from 'react';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const Pricing = () => {
  const plans = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for job seekers getting started',
      features: [
        'Browse and apply to 5 jobs per month',
        'Basic profile creation',
        'Save up to 10 jobs',
        'Receive job notifications',
        'Basic search filters'
      ],
      limitations: [
        'No advanced analytics',
        'Limited profile visibility',
        'No direct messaging with employers'
      ],
      color: 'gray',
      buttonText: 'Current Plan',
      buttonStyle: 'bg-gray-100 text-gray-700 cursor-default'
    },
    {
      name: 'Professional',
      price: 'KES 1,999/month',
      description: 'For serious job seekers who want more opportunities',
      features: [
        'Unlimited job applications',
        'Advanced profile customization',
        'Save unlimited jobs',
        'Priority job notifications',
        'Advanced search filters',
        'Profile visibility boost',
        'Direct messaging with employers',
        'Application analytics'
      ],
      limitations: [],
      color: 'indigo',
      buttonText: 'Get Started',
      buttonStyle: 'bg-indigo-600 text-white hover:bg-indigo-700',
      popular: true
    },
    {
      name: 'Premium',
      price: 'KES 3,999/month',
      description: 'Maximum exposure and career advancement tools',
      features: [
        'Everything in Professional',
        'Resume review service',
        'Career coaching sessions',
        'Interview preparation',
        'Negotiation support',
        'Featured profile placement',
        'Priority employer matching',
        'Custom job alerts'
      ],
      limitations: [],
      color: 'purple',
      buttonText: 'Get Started',
      buttonStyle: 'bg-purple-600 text-white hover:bg-purple-700'
    }
  ];

  const employerPlans = [
    {
      name: 'Starter',
      price: 'KES 4,999/month',
      description: 'Essential tools for small businesses',
      features: [
        'Post up to 5 jobs per month',
        'Basic company profile',
        'Access to candidate database',
        'Application tracking',
        'Email support'
      ],
      color: 'gray',
      buttonText: 'Get Started',
      buttonStyle: 'bg-gray-600 text-white hover:bg-gray-700'
    },
    {
      name: 'Growth',
      price: 'KES 9,999/month',
      description: 'For growing companies hiring regularly',
      features: [
        'Post up to 20 jobs per month',
        'Enhanced company profile',
        'Advanced candidate search',
        'AI-powered matching',
        'Priority job placement',
        'Analytics dashboard',
        'Direct messaging with candidates',
        'Phone support'
      ],
      color: 'indigo',
      buttonText: 'Get Started',
      buttonStyle: 'bg-indigo-600 text-white hover:bg-indigo-700',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited job postings',
        'Dedicated account manager',
        'Custom integrations',
        'ATS integration',
        'Employer branding',
        'Bulk posting tools',
        'Advanced analytics',
        'API access',
        'Priority support'
      ],
      color: 'purple',
      buttonText: 'Contact Sales',
      buttonStyle: 'bg-purple-600 text-white hover:bg-purple-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple, transparent pricing that grows with your career or business
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 rounded-lg p-1 flex">
            <button className="px-6 py-2 bg-white text-gray-900 rounded-md font-medium shadow-sm">
              For Job Seekers
            </button>
            <button className="px-6 py-2 text-gray-600 rounded-md font-medium hover:text-gray-900">
              For Employers
            </button>
          </div>
        </div>

        {/* Job Seeker Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.popular ? 'border-2 border-indigo-500' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-8">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.price !== 'Free' && plan.price !== 'Custom' && (
                    <span className="text-gray-600">/month</span>
                  )}
                </div>
                <button className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>
              <div className="px-8 pb-8">
                <h4 className="font-medium text-gray-900 mb-4">Features included:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start">
                      <XMarkIcon className="h-5 w-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-400">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Can I change my plan later?</h3>
              <p className="text-sm text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-sm text-gray-600">Yes! All paid plans come with a 14-day free trial. No credit card required.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-sm text-gray-600">We accept M-Pesa, Visa, Mastercard, and bank transfers for Kenyan customers.</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-sm text-gray-600">Absolutely. There are no long-term contracts. You can cancel your subscription anytime.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-600 rounded-2xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers and employers who are already using Kazi Sasa to find the perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Start Free Trial
            </button>
            <button className="px-8 py-3 bg-indigo-700 text-white rounded-lg font-medium hover:bg-indigo-800 transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
