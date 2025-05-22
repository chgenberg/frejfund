'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-4 py-12">
      <Image
        src="/bakgrund.png"
        alt="Background"
        fill
        className="object-cover -z-10"
        priority
      />
      <div className="w-full max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#16475b] mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our services? We're here to help! Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </div>

        <div className="w-full mt-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/90 rounded-2xl shadow-md border border-gray-100 p-6">
            <label className="font-semibold text-[#16475b]" htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
              placeholder="Your name"
            />
            <label className="font-semibold text-[#16475b]" htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
              placeholder="your@email.com"
            />
            <label className="font-semibold text-[#16475b]" htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white min-h-[100px]"
              placeholder="Write your message here..."
            />
            <button
              type="submit"
              className="mt-2 bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#133a4a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16475b]/40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 