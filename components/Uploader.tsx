import React, { useState, useCallback } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface UploaderProps {
  onImageSelected: (base64: string, mimeType: string) => void;
  isLoading: boolean;
}

export const Uploader: React.FC<UploaderProps> = ({ onImageSelected, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert("Please upload an image file.");
      return;
    }
    // Limit to 4MB for safety/speed
    if (file.size > 4 * 1024 * 1024) {
        alert("Image too large. Please use an image under 4MB.");
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64Data = result.split(',')[1];
      onImageSelected(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  }, [onImageSelected]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    if (e.clipboardData.files?.[0]) {
      handleFile(e.clipboardData.files[0]);
    }
  }, [handleFile]);

  const clearImage = () => {
    setPreview(null);
  };

  if (preview) {
    return (
      <div className="relative w-full max-w-xl mx-auto rounded-xl overflow-hidden border border-zinc-700 shadow-2xl bg-zinc-900 group">
        <img src={preview} alt="Upload preview" className="w-full h-auto max-h-[400px] object-contain" />
        {isLoading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center backdrop-blur-sm z-10">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-white font-medium animate-pulse">Analyzing...</p>
            </div>
        )}
        {!isLoading && (
            <button 
                onClick={clearImage}
                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-500/80 text-white rounded-full transition-colors backdrop-blur-md opacity-0 group-hover:opacity-100"
            >
                <X size={20} />
            </button>
        )}
      </div>
    );
  }

  return (
    <div
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      // @ts-ignore - paste event is valid on div with tabindex
      onPaste={handlePaste}
      tabIndex={0}
      className={`
        relative w-full max-w-xl mx-auto p-12 border-2 border-dashed rounded-2xl transition-all duration-300 outline-none
        flex flex-col items-center justify-center text-center cursor-pointer group
        ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-zinc-600'
        }
      `}
    >
      <input 
        type="file" 
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        accept="image/*"
      />
      
      <div className={`p-4 rounded-full mb-4 transition-colors ${isDragging ? 'bg-indigo-500 text-white' : 'bg-zinc-800 text-zinc-400 group-hover:text-white group-hover:bg-zinc-700'}`}>
        <Upload size={32} />
      </div>
      
      <h3 className="text-xl font-semibold text-white mb-2">
        Upload an image
      </h3>
      <p className="text-zinc-400 max-w-xs mx-auto mb-4">
        Drag & drop, paste from clipboard, or click to browse.
      </p>
      
      <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono bg-zinc-950/50 px-3 py-1 rounded-full border border-zinc-800">
        <ImageIcon size={12} />
        <span>Supports JPG, PNG, WEBP</span>
      </div>
    </div>
  );
};
