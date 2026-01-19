
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Group, AppData } from '../types';
import { Plus, Trash2, Edit2, History, Download, Settings, Users, Save, X, Key } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AppData>(storageService.getData());
  const [activeTab, setActiveTab] = useState<'teams' | 'settings' | 'logs'>('teams');
  
  // Team Management State
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<{name: string, accessCode: string, score: number}>({name: '', accessCode: '', score: 0});
  
  // Settings State
  const [adminPassword, setAdminPassword] = useState(storageService.getAdminPassword());
  const [newPassword, setNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(storageService.getData());
      setAdminPassword(storageService.getAdminPassword());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleAddGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      storageService.addGroup(newGroupName);
      setNewGroupName('');
      setData(storageService.getData());
    }
  };

  const handleStartEdit = (group: Group) => {
    setEditingGroupId(group.id);
    setEditFields({ name: group.name, accessCode: group.accessCode, score: group.score });
  };

  const handleSaveEdit = (groupId: string) => {
    if (!editFields.name || !editFields.accessCode) return;
    storageService.updateGroup(groupId, { name: editFields.name, accessCode: editFields.accessCode });
    storageService.updateScore(groupId, editFields.score, 'Admin');
    setEditingGroupId(null);
    setData(storageService.getData());
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setPwdMsg('Password must be at least 4 characters.');
      return;
    }
    storageService.setAdminPassword(newPassword);
    setAdminPassword(newPassword);
    setNewPassword('');
    setPwdMsg('Password updated successfully!');
    setTimeout(() => setPwdMsg(''), 3000);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      storageService.deleteGroup(id);
      setData(storageService.getData());
    }
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IEEE_Event_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Total Groups</h3>
          <p className="text-3xl font-bold text-slate-900">{data.groups.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Highest Score</h3>
          <p className="text-3xl font-bold text-[#00629B]">
            {data.groups.length > 0 ? Math.max(...data.groups.map(g => g.score)) : 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Average Score</h3>
          <p className="text-3xl font-bold text-slate-900">
            {data.groups.length > 0 ? (data.groups.reduce((acc, g) => acc + g.score, 0) / data.groups.length).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-8">
        <button
          onClick={() => setActiveTab('teams')}
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'teams' ? 'text-[#00629B]' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2">
            <Users size={18} /> Team Management
          </div>
          {activeTab === 'teams' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00629B]" />}
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'settings' ? 'text-[#00629B]' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} /> System Settings
          </div>
          {activeTab === 'settings' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00629B]" />}
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'logs' ? 'text-[#00629B]' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <div className="flex items-center gap-2">
            <History size={18} /> Activity Logs
          </div>
          {activeTab === 'logs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00629B]" />}
        </button>
      </div>

      {activeTab === 'teams' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <form onSubmit={handleAddGroup} className="flex w-full sm:w-auto gap-2">
              <input
                type="text"
                placeholder="New Team Name..."
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00629B] focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="bg-[#00629B] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#004165] transition-colors whitespace-nowrap"
              >
                <Plus size={20} /> Add Team
              </button>
            </form>

            <button
              onClick={exportData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              <Download size={18} /> Export Data
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 font-semibold text-slate-700">Team Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Access Code</th>
                  <th className="px-6 py-4 font-semibold text-slate-700">Score</th>
                  <th className="px-6 py-4 font-semibold text-slate-700 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.groups.map((group) => (
                  <tr key={group.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      {editingGroupId === group.id ? (
                        <input
                          type="text"
                          value={editFields.name}
                          onChange={(e) => setEditFields({...editFields, name: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="font-medium text-slate-900">{group.name}</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingGroupId === group.id ? (
                        <input
                          type="text"
                          value={editFields.accessCode}
                          onChange={(e) => setEditFields({...editFields, accessCode: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm font-mono"
                        />
                      ) : (
                        <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono text-[#00629B]">{group.accessCode}</code>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingGroupId === group.id ? (
                        <input
                          type="number"
                          value={editFields.score}
                          onChange={(e) => setEditFields({...editFields, score: Number(e.target.value)})}
                          className="w-24 px-2 py-1 border rounded text-sm"
                        />
                      ) : (
                        <span className="text-xl font-bold text-[#00629B]">{group.score}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {editingGroupId === group.id ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(group.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                            >
                              <Save size={18} />
                            </button>
                            <button
                              onClick={() => setEditingGroupId(null)}
                              className="p-1.5 text-slate-400 hover:bg-slate-100 rounded"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleStartEdit(group)}
                              className="p-1.5 text-slate-400 hover:text-[#00629B] hover:bg-slate-100 rounded"
                              title="Edit Team"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(group.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete Team"
                            >
                              <Trash2 size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-xl space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 text-[#00629B] rounded-lg">
                <Key size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Admin Authentication</h3>
                <p className="text-sm text-slate-500">Manage your administrative access credentials.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Password</p>
                <p className="text-sm font-mono text-slate-900">
                  {adminPassword.replace(/./g, '*')} 
                  <span className="ml-2 text-xs text-slate-400 italic">(Hidden for security)</span>
                </p>
              </div>

              <form onSubmit={handleUpdatePassword} className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Set New Admin Password</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password..."
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00629B] outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#00629B] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#004165] transition-colors"
                  >
                    Update
                  </button>
                </div>
                {pwdMsg && (
                  <p className={`text-sm ${pwdMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                    {pwdMsg}
                  </p>
                )}
              </form>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-800 text-sm flex gap-3">
            <div className="mt-0.5"><Key size={16} /></div>
            <p>Ensure you keep the admin password secure. If changed, any existing active admin sessions will need to re-authenticate if they log out.</p>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="font-bold text-slate-800 flex items-center gap-2">
              <History className="text-[#00629B]" /> System Activity Log
            </h2>
          </div>
          <div className="max-h-[500px] overflow-y-auto p-4 space-y-2">
            {data.activityLogs.map((log, i) => (
              <div key={i} className="text-sm py-2 border-b border-slate-100 last:border-0 text-slate-600 flex justify-between">
                <span>{log}</span>
              </div>
            ))}
            {data.activityLogs.length === 0 && (
              <p className="text-center py-8 text-slate-400 italic">No activity logs recorded.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
