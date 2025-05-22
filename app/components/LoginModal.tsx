"use client";
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';

let openLoginModal: (() => void) | null = null;
export function useLoginModal() {
  return () => {
    if (openLoginModal) openLoginModal();
  };
}

export default function LoginModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });

  const { login, register } = useAuth();

  useEffect(() => {
    openLoginModal = () => {
      setOpen(true);
      setTab('login');
      setFormData({ email: '', password: '', name: '' });
    };
    return () => { openLoginModal = null; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (tab === 'login') {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      setOpen(false);
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white/95 rounded-3xl shadow-2xl border border-white/20 px-8 py-10 max-w-sm w-full flex flex-col items-center animate-fade-in relative">
        <button
          className="absolute top-4 right-4 text-[#16475b] text-2xl font-bold hover:text-[#0d2a36] focus:outline-none"
          onClick={() => setOpen(false)}
          aria-label="Stäng"
        >
          ×
        </button>
        <div className="flex gap-4 mb-6">
          <button
            className={`font-bold text-lg px-2 pb-1 border-b-2 transition-all uppercase tracking-widest ${tab === 'login' ? 'text-[#16475b] border-[#16475b]' : 'text-gray-400 border-transparent'}`}
            onClick={() => { setTab('login'); }}
          >
            LOGIN
          </button>
          <button
            className={`font-bold text-lg px-2 pb-1 border-b-2 transition-all uppercase tracking-widest ${tab === 'register' ? 'text-[#16475b] border-[#16475b]' : 'text-gray-400 border-transparent'}`}
            onClick={() => { setTab('register'); }}
          >
            REGISTER
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {tab === 'register' && (
            <div>
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
            </div>
          )}
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
          <label className="font-semibold text-[#16475b]" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="rounded-xl border border-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-gray-800 bg-white"
            placeholder="••••••••"
          />
          <button
            type="submit"
            className="mt-4 bg-[#16475b] text-white font-bold rounded-full px-8 py-3 shadow-lg hover:bg-[#133a4a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#16475b]/40 text-lg tracking-widest uppercase"
            disabled={loading}
          >
            {loading ? (tab === 'login' ? 'Logging in...' : 'Registering...') : (tab === 'login' ? 'LOGIN' : 'REGISTER')}
          </button>
        </form>
      </div>
    </div>
  );
} 