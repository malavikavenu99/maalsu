
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { aiService } from '../services/aiService';
import { Group, AppData } from '../types';
import { Trophy, Clock, ShieldCheck, ChevronUp, ChevronDown, Sparkles, Loader2 } from 'lucide-react';

interface GroupDashboardProps {
  groupId: string;
}

const GroupDashboard: React.FC<GroupDashboardProps> = ({ groupId }) => {
  const [data, setData] = useState<AppData>(storageService.getData());
  const [motivation, setMotivation] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);
  const group = data.groups.find(g => g.id === groupId);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(storageService.getData());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getAiSpark = async () => {
    if (!group) return;
    setLoadingAi(true);
    const msg = await aiService.generateMotivation(group.name, group.score);
    setMotivation(msg);
    setLoadingAi(false);
  };

  if (!group) return <div>Group not found</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Main Score Card */}
      <div className="bg-[#00629B] text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-sm font-semibold uppercase tracking-widest opacity-80 mb-2">Welcome, Team</h1>
          <h2 className="text-4xl font-black mb-6">{group.name}</h2>
          
          <div className="flex items-end gap-2">
            <span className="text-6xl font-black">{group.score}</span>
            <span className="text-lg font-medium opacity-80 mb-2">Points</span>
          </div>
        </div>
        
        <Trophy className="absolute right-[-20px] bottom-[-20px] w-64 h-64 opacity-10 rotate-12" />
      </div>

      {/* AI Motivation Section */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#00629B]">
            <Sparkles size={20} className="animate-pulse" />
            <h3 className="font-bold uppercase tracking-wider text-xs">AI Performance Spark</h3>
          </div>
          <button 
            onClick={getAiSpark}
            disabled={loadingAi}
            className="text-xs font-semibold text-[#00629B] hover:text-[#004165] flex items-center gap-1 transition-colors disabled:opacity-50"
          >
            {loadingAi ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {motivation ? 'Refresh Insight' : 'Get Motivation'}
          </button>
        </div>
        
        {motivation ? (
          <p className="text-slate-700 italic font-medium leading-relaxed">
            "{motivation}"
          </p>
        ) : (
          <p className="text-slate-400 text-sm italic">
            Click the spark icon to get an AI-generated boost based on your current standing!
          </p>
        )}
      </div>

      {/* History Log */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Clock size={18} className="text-[#00629B]" /> Recent Performance History
          </h3>
          <span className="text-xs text-slate-400">Updates in real-time</span>
        </div>
        
        <div className="divide-y divide-slate-100">
          {group.logs.length > 0 ? (
            group.logs.map((log) => (
              <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${log.newScore > log.oldScore ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {log.newScore > log.oldScore ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      Score {log.newScore > log.oldScore ? 'Increased' : 'Adjusted'}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{log.newScore} pts</p>
                  <p className="text-xs text-slate-400">from {log.oldScore}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-slate-400">
              <Clock size={40} className="mx-auto mb-4 opacity-20" />
              <p>No score updates recorded yet.</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
        <ShieldCheck size={18} />
        <p>This is a secure private view. Only your team can see these details.</p>
      </div>
    </div>
  );
};

export default GroupDashboard;
