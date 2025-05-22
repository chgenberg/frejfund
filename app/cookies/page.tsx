"use client";
import Image from 'next/image';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#16475b] to-[#133a4a] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">Cookie Policy</h1>
        
        <div className="space-y-6">
          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">What are cookies?</h2>
            <p className="leading-relaxed">Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience and understand how you use our services.</p>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">How we use cookies</h2>
            <p className="leading-relaxed">We use cookies to:</p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>Remember your preferences and settings</li>
              <li>Analyze how you use our website</li>
              <li>Improve our services and user experience</li>
              <li>Provide personalized content and recommendations</li>
            </ul>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">Types of cookies we use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-[#16475b]">Essential cookies</h3>
                <p className="text-gray-700">Required for the website to function properly. These cannot be disabled.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#16475b]">Analytics cookies</h3>
                <p className="text-gray-700">Help us understand how visitors interact with our website.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#16475b]">Functionality cookies</h3>
                <p className="text-gray-700">Remember your preferences and settings to provide a better experience.</p>
              </div>
            </div>
          </section>

          <section className="bg-white/50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold mb-4 text-[#16475b]">How to manage cookies</h2>
            <p className="leading-relaxed">Our cookie banner appears on your first visit. You can change or withdraw your consent at any time via "Cookie Settings" in the footer or in your browser.</p>
          </section>
        </div>
      </div>
    </div>
  );
} 