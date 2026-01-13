import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12 border-t border-zinc-900 bg-zinc-950 text-center">
      <p className="text-zinc-600 text-sm">
        Prompt Maker &copy; {new Date().getFullYear()}
      </p>
      <p className="text-zinc-700 text-xs mt-2">
        Made by Mohtasham Raza
      </p>
    </footer>
  );
};
