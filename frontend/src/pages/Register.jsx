import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, User, ArrowRight, Warehouse, AlertCircle } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [errMessage, setErrMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrMessage('All fields are required');
      return;
    }
    if (formData.password.length < 6) {
      setErrMessage('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setErrMessage(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-slate-100 px-4 select-none relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/60 p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-emerald-500 rounded-xl text-slate-950 font-bold mb-3 shadow-lg shadow-emerald-500/20">
            <Warehouse size={28} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Create Account</h2>
          <p className="text-slate-400 text-xs mt-1">Get started with stock management</p>
        </div>

        {errMessage && (
          <div className="flex items-center space-x-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-lg text-sm mb-6 animate-shake">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all text-sm"
                placeholder="Min. 6 characters"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center space-x-2 py-3.5 mt-2 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all text-sm"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Redirect */}
        <div className="mt-8 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
