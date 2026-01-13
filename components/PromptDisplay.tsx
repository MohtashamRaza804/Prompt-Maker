import React, { useState } from 'react';
import { PromptResult } from '../types';
import { Copy, Check, Share2, Download, Tag, Zap, Camera, Palette, Sliders, Layers } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';

interface PromptDisplayProps {
  result: PromptResult;
}

export const PromptDisplay: React.FC<PromptDisplayProps> = ({ result }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'universal' | 'sdxl' | 'midjourney' | 'gemini'>('universal');

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const chartData = [
    { subject: 'Lighting', A: result.attributes.lighting, fullMark: 100 },
    { subject: 'Complexity', A: result.attributes.complexity, fullMark: 100 },
    { subject: 'Vibrancy', A: result.attributes.vibrancy, fullMark: 100 },
    { subject: 'Realism', A: result.attributes.realism, fullMark: 100 },
    { subject: 'Artistic', A: result.attributes.artistic, fullMark: 100 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Top Section: Main Prompt & Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Prompt */}
        <div className="md:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="text-yellow-400" size={20} />
              Generated Prompt
            </h2>
            <button 
              onClick={() => copyToClipboard(result.mainPrompt, 'main')}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
              title="Copy Prompt"
            >
              {copiedSection === 'main' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>
          <p className="text-zinc-300 leading-relaxed font-light text-lg">
            {result.mainPrompt}
          </p>
          
          <div className="mt-6 pt-6 border-t border-zinc-800">
             <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag size={14} /> Tags
             </h3>
             <div className="flex flex-wrap gap-2">
                {result.tags.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-full transition-colors border border-zinc-700">
                        #{tag}
                    </span>
                ))}
             </div>
          </div>
        </div>

        {/* Radar Chart */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-xl flex flex-col items-center justify-center relative">
          <h3 className="absolute top-4 left-4 text-sm font-semibold text-zinc-500 uppercase tracking-wider">Analysis</h3>
          <div className="w-full h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid stroke="#3f3f46" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Attributes"
                  dataKey="A"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Negative Prompt */}
      <div className="bg-zinc-900/50 border border-red-900/20 rounded-xl p-4 flex items-start gap-4">
         <div className="p-2 bg-red-500/10 rounded-lg text-red-400 mt-1">
            <Layers size={18} />
         </div>
         <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider mb-1">Negative Prompt</h3>
            <p className="text-zinc-400 text-sm font-mono">{result.negativePrompt}</p>
         </div>
         <button 
              onClick={() => copyToClipboard(result.negativePrompt, 'negative')}
              className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors"
            >
              {copiedSection === 'negative' ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
         </button>
      </div>

      {/* Model Tabs */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="flex border-b border-zinc-800 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('universal')}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'universal' ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
                Variations
            </button>
            <button 
                onClick={() => setActiveTab('sdxl')}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'sdxl' ? 'border-blue-500 text-white bg-blue-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
                Stable Diffusion XL
            </button>
            <button 
                onClick={() => setActiveTab('midjourney')}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'midjourney' ? 'border-purple-500 text-white bg-purple-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
                Midjourney
            </button>
            <button 
                onClick={() => setActiveTab('gemini')}
                className={`px-6 py-4 text-sm font-medium transition-colors border-b-2 flex-shrink-0 ${activeTab === 'gemini' ? 'border-teal-500 text-white bg-teal-500/5' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
            >
                Gemini
            </button>
        </div>

        <div className="p-6 min-h-[300px]">
            {activeTab === 'universal' && (
                <div className="space-y-6">
                    {Object.entries(result.variations).map(([key, value]) => (
                        <div key={key} className="group">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{key}</span>
                                <button 
                                    onClick={() => copyToClipboard(value, `var-${key}`)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                >
                                    {copiedSection === `var-${key}` ? 'Copied' : 'Copy'} <Copy size={12} />
                                </button>
                             </div>
                             <p className="text-zinc-300 text-sm bg-zinc-950/50 p-3 rounded-lg border border-zinc-800/50">{value}</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'sdxl' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                    <div className="p-4 bg-zinc-950 rounded-xl border border-blue-900/30">
                        <div className="flex justify-between items-start gap-4">
                            <code className="text-blue-200 text-sm font-mono break-all whitespace-pre-wrap">{result.modelAdvice.sdxl}</code>
                            <button 
                                onClick={() => copyToClipboard(result.modelAdvice.sdxl, 'sdxl')}
                                className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white flex-shrink-0"
                            >
                                {copiedSection === 'sdxl' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                        <Sliders size={12} />
                        <span>Includes recommended steps, CFG scale, and sampler for SDXL based on image style.</span>
                    </div>
                </div>
            )}

            {activeTab === 'midjourney' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                     <div className="p-4 bg-zinc-950 rounded-xl border border-purple-900/30">
                        <div className="flex justify-between items-start gap-4">
                            <code className="text-purple-200 text-sm font-mono break-all whitespace-pre-wrap">/imagine prompt: {result.modelAdvice.midjourney}</code>
                            <button 
                                onClick={() => copyToClipboard(result.modelAdvice.midjourney, 'mj')}
                                className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white flex-shrink-0"
                            >
                                {copiedSection === 'mj' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                        <Camera size={12} />
                        <span>Optimized for V6. Includes aspect ratio (--ar) and stylization (--s).</span>
                    </div>
                </div>
            )}

             {activeTab === 'gemini' && (
                <div className="space-y-4 animate-in fade-in duration-300">
                     <div className="p-4 bg-zinc-950 rounded-xl border border-teal-900/30">
                        <div className="flex justify-between items-start gap-4">
                            <code className="text-teal-200 text-sm font-mono break-all whitespace-pre-wrap">{result.modelAdvice.gemini}</code>
                            <button 
                                onClick={() => copyToClipboard(result.modelAdvice.gemini, 'gemini')}
                                className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white flex-shrink-0"
                            >
                                {copiedSection === 'gemini' ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                            </button>
                        </div>
                    </div>
                    <div className="text-xs text-zinc-500 flex items-center gap-2">
                        <Palette size={12} />
                        <span>Natural language format optimized for Gemini 3 and Imagen 3.</span>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};
