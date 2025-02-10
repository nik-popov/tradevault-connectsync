import React from 'react';
import { Box, Text, Button, VStack } from "@chakra-ui/react";
import { createFileRoute } from '@tanstack/react-router';
import { FiArrowRight, FiShield, FiGlobe, FiZap } from 'react-icons/fi';

const PromoContent = () => {

    const features = [
      {
        icon: <FiGlobe className="w-8 h-8 text-blue-500" />,
        title: "Global Coverage",
        description: "Access to residential IPs from 195+ locations worldwide"
      },
      {
        icon: <FiZap className="w-8 h-8 text-blue-500" />,
        title: "Lightning Fast",
        description: "Industry-leading connection speeds with 99.9% uptime"
      },
      {
        icon: <FiShield className="w-8 h-8 text-blue-500" />,
        title: "Secure & Private",
        description: "Enterprise-grade security with IP rotation and authentication"
      }
    ];
  
    return (
      <div className="w-full px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">
            Unlock Premium Residential Proxies
          </h1>
          <p className="text-lg text-gray-600 mb-12">
            Get instant access to our global network of residential IPs with unlimited bandwidth
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
  
          <div className="bg-blue-50 rounded-xl p-8 mb-12">
            <h2 className="text-2xl font-bold mb-4">Start Your Free Trial Today</h2>
            <p className="text-gray-600 mb-6">
              Experience unlimited access to all features for 7 days, no credit card required
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
              Start Free Trial
              <FiArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
  
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">Basic Plan</h3>
              <p className="text-3xl font-bold mb-4">$49<span className="text-lg text-gray-500">/mo</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <FiArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  5 concurrent connections
                </li>
                <li className="flex items-center">
                  <FiArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  50GB monthly traffic
                </li>
                <li className="flex items-center">
                  <FiArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  Basic support
                </li>
              </ul>
              <button className="w-full py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                Choose Basic
              </button>
            </div>
  
            <div className="p-6 rounded-lg border-2 border-blue-600 bg-blue-50">
              <div className="inline-block px-3 py-1 bg-blue-600 text-white text-sm rounded-full mb-4">
                MOST POPULAR
              </div>
              <h3 className="text-xl font-semibold mb-4">Premium Plan</h3>
              <p className="text-3xl font-bold mb-4">$99<span className="text-lg text-gray-500">/mo</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-center">
                  <FiArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  Unlimited concurrent connections
                </li>
                <li className="flex items-center">
                  <FiArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  Unlimited monthly traffic
                </li>
                <li className="flex items-center">
                  <FiArrowRight className="w-4 h-4 text-blue-500 mr-2" />
                  24/7 priority support
                </li>
              </ul>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Choose Premium
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

// Add the required Route export for TanStack Router
export const Route = createFileRoute('/_layout/proxies/components/PromoContent')({
  component: PromoContent
});

export default PromoContent;
