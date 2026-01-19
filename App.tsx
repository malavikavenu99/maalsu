
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';
import GroupDashboard from './components/GroupDashboard';
import { UserRole, AuthState } from './types';
import { storageService } from './services/storageService';
import { IEEE_COLORS } from './constants';
import { Lock, Users, ShieldCheck } from 'lucide-react';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null });
  const [loginMode, setLoginMode] = useState<'ADMIN' | 'GROUP'>('GROUP');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');

  // Persist session
  useEffect(() => {
    const savedAuth = localStorage.getItem('ieee_session');
    if (savedAuth) {
      setAuth(JSON.parse(savedAuth));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (loginMode === 'ADMIN') {
      const currentAdminPwd = storageService.getAdminPassword();
      if (password === currentAdminPwd) {
        const adminSession = { user: { id: 'admin-1', name: 'Event Admin', role: UserRole.ADMIN } };
        setAuth(adminSession);
        localStorage.setItem('ieee_session', JSON.stringify(adminSession));
      } else {
        setError('Invalid admin password');
      }
    } else {
      const data = storageService.getData();
      const group = data.groups.find(g => g.accessCode === accessCode);
      if (group) {
        const groupSession = { user: { id: group.id, name: group.name, role: UserRole.GROUP } };
        setAuth(groupSession);
        localStorage.setItem('ieee_session', JSON.stringify(groupSession));
      } else {
        setError('Invalid group access code');
      }
    }
  };

  const handleLogout = () => {
    setAuth({ user: null });
    localStorage.removeItem('ieee_session');
    setAccessCode('');
    setPassword('');
    setError('');
  };

  if (!auth.user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-[#00629B] p-8 text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl mx-auto mb-4 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-2xl font-bold">IEEE Event System</h1>
            <p className="text-white/70 mt-1">Please authenticate to continue</p>
          </div>
          
          <div className="p-8">
            <div className="flex p-1 bg-slate-100 rounded-lg mb-8">
              <button
                onClick={() => { setLoginMode('GROUP'); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  loginMode === 'GROUP' ? 'bg-white text-[#00629B] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Users size={16} /> Team
              </button>
              <button
                onClick={() => { setLoginMode('ADMIN'); setError(''); }}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                  loginMode === 'ADMIN' ? 'bg-white text-[#00629B] shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Lock size={16} /> Admin
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {loginMode === 'ADMIN' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Admin Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00629B] outline-none transition-all"
                    placeholder="••••••••"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Team Access Code</label>
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#00629B] outline-none transition-all font-mono"
                    placeholder="IEEE-XXX"
                  />
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 flex items-center gap-2 animate-pulse">
                  <div className="w-1 h-1 bg-red-600 rounded-full" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#00629B] text-white py-3 rounded-xl font-bold hover:bg-[#004165] transition-all transform active:scale-[0.98] shadow-lg shadow-blue-900/10"
              >
                Sign In
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400">
                Authorized IEEE Personnel Only • v1.3.0
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout auth={auth} onLogout={handleLogout}>
      {auth.user.role === UserRole.ADMIN ? (
        <AdminDashboard />
      ) : (
        <GroupDashboard groupId={auth.user.id} />
      )}
    </Layout>
  );
};

export default App;
