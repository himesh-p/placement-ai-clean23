import React, { useState, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const MEDALS = ['🥇', '🥈', '🥉'];

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/leaderboard').then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-3xl mx-auto">
      <div className="h-10 w-48 shimmer rounded-xl mb-6" />
      {[1,2,3,4,5].map(i => <div key={i} className="card h-20 shimmer mb-3" />)}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text)' }}>College Leaderboard</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Ranked by combined Skill + Resume + Practice scores
          {data?.currentUserRank > 0 && <span> • Your rank: <strong style={{ color: '#4f6ef7' }}>#{data.currentUserRank}</strong></span>}
        </p>
      </div>

      {/* Top 3 podium */}
      {data?.leaderboard?.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-8">
          {[1, 0, 2].map(pos => {
            const s = data.leaderboard[pos];
            if (!s) return null;
            const heights = { 0: 'h-32', 1: 'h-24', 2: 'h-20' };
            return (
              <div key={pos} className="flex flex-col items-center">
                <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full mb-2 ring-2"
                  style={{ ringColor: pos === 0 ? '#fbbf24' : pos === 1 ? '#9ca3af' : '#d97706' }} />
                <div className="text-sm font-semibold truncate w-24 text-center" style={{ color: 'var(--text)' }}>{s.name.split(' ')[0]}</div>
                <div className="text-lg">{MEDALS[pos]}</div>
                <div className={`w-20 ${heights[pos]} rounded-t-xl flex items-start justify-center pt-2 font-bold text-white text-sm`}
                  style={{ background: pos === 0 ? 'linear-gradient(135deg, #fbbf24, #d97706)' : pos === 1 ? 'linear-gradient(135deg, #9ca3af, #6b7280)' : 'linear-gradient(135deg, #d97706, #92400e)' }}>
                  {s.totalScore}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <div className="space-y-3">
        {data?.leaderboard?.map((s, i) => {
          const isCurrentUser = s.name === user?.name;
          return (
            <div key={s.id} className={`card p-4 transition-all ${isCurrentUser ? 'ring-2 ring-primary-500' : ''}`}
              style={isCurrentUser ? { borderColor: '#4f6ef7', background: 'rgba(79,110,247,0.04)' } : {}}>
              <div className="flex items-center gap-4">
                <div className="w-8 text-center font-display font-bold text-lg flex-shrink-0"
                  style={{ color: i < 3 ? ['#fbbf24', '#9ca3af', '#d97706'][i] : 'var(--text-muted)' }}>
                  {i < 3 ? MEDALS[i] : `#${i + 1}`}
                </div>
                <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm flex items-center gap-2" style={{ color: 'var(--text)' }}>
                    {s.name}
                    {isCurrentUser && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7' }}>You</span>}
                  </div>
                  <div className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{s.collegeName?.split(',')[0]}</div>
                </div>
                <div className="flex gap-4 text-center flex-shrink-0">
                  <div>
                    <div className="text-xs font-bold" style={{ color: '#4f6ef7' }}>{s.skillScore}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Skills</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: '#10b981' }}>{s.resumeScore}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Resume</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold" style={{ color: '#f59e0b' }}>{s.practiceScore}%</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Practice</div>
                  </div>
                  <div className="w-14">
                    <div className="font-display font-bold" style={{ color: 'var(--text)' }}>{s.totalScore}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Total</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {(!data?.leaderboard || data.leaderboard.length === 0) && (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">🏆</div>
            <p style={{ color: 'var(--text-muted)' }}>No ranking data yet. Complete your profile to appear on the leaderboard!</p>
          </div>
        )}
      </div>
    </div>
  );
}
