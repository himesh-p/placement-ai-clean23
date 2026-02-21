import React, { useState, useRef, useEffect } from 'react';
import { API } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';

const SUGGESTIONS = ['Resume tips', 'Interview preparation', 'DSA practice strategy', 'Career roadmap', 'TCS placement tips', 'How to get internship'];

export default function ChatbotPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'bot',
      text: `Hello ${user?.name?.split(' ')[0]}! 👋 I'm your AI Career Assistant. I can help you with:\n\n• Placement preparation tips\n• Resume improvement advice  \n• Interview guidance\n• Roadmap recommendations\n• Company-specific tips\n\nWhat would you like to know today?`,
      time: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/chatbot/message', { message: text });
      setMessages(m => [...m, { id: Date.now() + 1, role: 'bot', text: data.message, time: new Date(), suggestions: data.suggestions }]);
    } catch (err) {
      setMessages(m => [...m, { id: Date.now() + 1, role: 'bot', text: "I'm having trouble connecting right now. Please try again!", time: new Date() }]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="card p-4 mb-4 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>🤖</div>
        <div>
          <div className="font-display font-bold" style={{ color: 'var(--text)' }}>AI Career Assistant</div>
          <div className="flex items-center gap-2 text-xs" style={{ color: '#10b981' }}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Online and ready to help
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 px-1 pb-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} gap-3 animate-fade-in`}>
            {msg.role === 'bot' && (
              <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm"
                style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', color: 'white' }}>🤖</div>
            )}
            <div className="max-w-[80%]">
              <div className={`chat-bubble ${msg.role}`}>{msg.text}</div>
              <div className="text-xs mt-1 px-2" style={{ color: 'var(--text-muted)', textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                {formatTime(msg.time)}
              </div>
              {msg.suggestions && msg.role === 'bot' && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {msg.suggestions.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                      style={{ background: 'rgba(79,110,247,0.1)', color: '#4f6ef7', border: '1px solid rgba(79,110,247,0.2)' }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-sm"
              style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)', color: 'white' }}>🤖</div>
            <div className="chat-bubble bot flex items-center gap-1" style={{ padding: '14px 18px' }}>
              {[0,1,2].map(i => (
                <div key={i} className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: '#4f6ef7', animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick suggestions */}
      <div className="flex flex-wrap gap-2 mb-3">
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
            onMouseEnter={e => { e.target.style.borderColor = '#4f6ef7'; e.target.style.color = '#4f6ef7'; }}
            onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.color = 'var(--text-muted)'; }}>
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3 flex-shrink-0">
        <input
          value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send(input)}
          placeholder="Ask me anything about placements, resume, interviews..."
          className="flex-1 px-4 py-3.5 rounded-xl text-sm outline-none"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
          onFocus={e => e.target.style.borderColor = '#4f6ef7'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button onClick={() => send(input)} disabled={loading || !input.trim()}
          className="px-5 py-3.5 rounded-xl text-white font-semibold disabled:opacity-50 transition-all"
          style={{ background: 'linear-gradient(135deg, #4f6ef7, #7c3aed)' }}>
          {loading ? '...' : '→'}
        </button>
      </div>
    </div>
  );
}
