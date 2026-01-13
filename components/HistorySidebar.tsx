import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, ChevronRight } from 'lucide-react';

interface HistorySidebarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onSelect, onClear, isOpen, onClose }) => {
  return (
    <>
        {/* Backdrop */}
        {isOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
        )}
        
        {/* Sidebar */}
        <div className={`
            fixed top-0 right-0 h-full w-80 bg-zinc-950 border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out
            flex flex-col shadow-2xl
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
            <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Clock size={20} /> History
                </h2>
                <button 
                    onClick={onClose}
                    className="p-2 hover:bg-zinc-800 rounded-full text-zinc-400"
                >
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {history.length === 0 && (
                    <div className="text-center text-zinc-500 mt-10">
                        <p>No history yet.</p>
                        <p className="text-xs mt-2">Generate prompts to see them here.</p>
                    </div>
                )}
                {history.map((item) => (
                    <div 
                        key={item.id} 
                        onClick={() => { onSelect(item); onClose(); }}
                        className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:border-indigo-500/50 hover:bg-zinc-800 transition-all cursor-pointer group"
                    >
                        <div className="flex gap-3">
                            {item.thumbnail && (
                                <img src={item.thumbnail} alt="" className="w-12 h-12 rounded bg-zinc-950 object-cover" />
                            )}
                            <div className="overflow-hidden">
                                <p className="text-zinc-300 text-sm font-medium truncate mb-1">
                                    {item.mainPrompt}
                                </p>
                                <p className="text-zinc-500 text-xs">
                                    {new Date(item.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
                <button 
                    onClick={onClear}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm font-medium"
                >
                    <Trash2 size={16} /> Clear History
                </button>
            </div>
        </div>
    </>
  );
};
