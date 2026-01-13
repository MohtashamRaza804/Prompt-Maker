import React, { useState, useEffect } from 'react';
import { generatePromptFromImage } from './geminiService';
import { PromptResult, HistoryItem, ViewState } from './types';
import { Uploader } from './components/Uploader';
import { PromptDisplay } from './components/PromptDisplay';
import { HistorySidebar } from './components/HistorySidebar';
import { Footer } from './components/Footer';
import { Menu, Github, Sparkles, Book, Lock, Shield } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('prompt_maker_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history on change
  useEffect(() => {
    localStorage.setItem('prompt_maker_history', JSON.stringify(history));
  }, [history]);

  const handleImageSelected = async (base64: string, mimeType: string) => {
    setLoading(true);
    setResult(null);
    try {
      const data = await generatePromptFromImage(base64, mimeType);
      
      const newItem: HistoryItem = {
        ...data,
        id: crypto.randomUUID(),
        // Store a tiny thumbnail? For now just store the full prompt data. 
        // Ideally we'd resize the image client-side for a thumb, but to keep code simple we'll just skip the image storage 
        // to respect "Privacy-first: images are not permanently stored". 
        // We won't store the base64 image in history.
      };

      setResult(data);
      setHistory(prev => [newItem, ...prev].slice(0, 50)); // Keep last 50
    } catch (error) {
      alert("Failed to generate prompt. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (confirm("Clear all history?")) {
      setHistory([]);
    }
  };

  const renderContent = () => {
    if (view === ViewState.ABOUT) {
      return (
        <div className="max-w-2xl mx-auto text-zinc-300 space-y-6 animate-in fade-in">
          <h2 className="text-3xl font-bold text-white mb-6">About Prompt Maker</h2>
          <p>Prompt Maker is an open-source tool designed to bridge the gap between visual inspiration and AI generation.</p>
          <p>It uses advanced Vision Language Models (Gemini) to analyze images and deconstruct them into their core components: subject, lighting, composition, and style.</p>
          <div className="p-4 bg-zinc-900 rounded-xl border border-zinc-800">
            <h3 className="font-semibold text-white mb-2">Privacy First</h3>
            <p className="text-sm text-zinc-400">Your images are processed in real-time and are not permanently stored on our servers. We believe in creativity without surveillance.</p>
          </div>
        </div>
      );
    }
    if (view === ViewState.PRIVACY || view === ViewState.TERMS) {
        return (
            <div className="max-w-2xl mx-auto text-zinc-300 space-y-6 animate-in fade-in">
              <h2 className="text-3xl font-bold text-white mb-6">Legal</h2>
              <p>This is a demo application. No personal data is collected.</p>
              <p>Images are sent to Google Gemini API for processing and are subject to Google's data processing terms.</p>
            </div>
        );
    }

    return (
      <div className="space-y-12">
        <div className="text-center space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
              Image to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">Prompt</span>
            </h1>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Upload any image to reverse-engineer its style, lighting, and composition. 
              Get optimized prompts for SDXL, Midjourney, and Gemini.
            </p>
        </div>

        <Uploader onImageSelected={handleImageSelected} isLoading={loading} />

        {result && <PromptDisplay result={result} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-zinc-200">
      {/* Navbar */}
      <nav className="border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => setView(ViewState.HOME)} className="flex items-center gap-2 font-bold text-xl text-white hover:opacity-80 transition-opacity">
            <Sparkles className="text-indigo-500" />
            <span>Prompt Maker</span>
          </button>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-6 text-sm font-medium text-zinc-400">
              <button onClick={() => setView(ViewState.HOME)} className={`hover:text-white transition-colors ${view === ViewState.HOME ? 'text-white' : ''}`}>Create</button>
              <button onClick={() => setView(ViewState.ABOUT)} className={`hover:text-white transition-colors ${view === ViewState.ABOUT ? 'text-white' : ''}`}>About</button>
            </div>
            
            <div className="flex items-center gap-3">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 text-zinc-400 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <button 
                onClick={() => setIsHistoryOpen(true)}
                className="p-2 text-zinc-400 hover:text-white transition-colors relative"
              >
                <Menu size={20} />
                {history.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full"></span>}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
        {renderContent()}
      </main>

      <Footer />
      
      <HistorySidebar 
        history={history} 
        isOpen={isHistoryOpen} 
        onClose={() => setIsHistoryOpen(false)}
        onSelect={(item) => {
            setResult(item);
            setView(ViewState.HOME);
        }}
        onClear={handleClearHistory}
      />
    </div>
  );
}
