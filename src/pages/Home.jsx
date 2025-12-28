
import React from "react";

export default function Home() {
 return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-white to-white">
      <div className="max-w-3xl w-full text-center">
        
        {/* Decorative Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 mb-6 animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
            Now Live
          </span>
        </div>

        {/* Hero Typography */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Blaze Commerce</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl mx-auto leading-relaxed">
          The next generation of shopping. Discover premium products or start selling to our global community today.
        </p>

        {/* Visual Guide / Interaction Hint */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 text-white font-medium shadow-xl shadow-slate-200">
            <span>Explore Products</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </div>
          
          <div className="text-sm font-medium text-slate-400 italic">
            Use the navigation above to get started
          </div>
        </div>

        {/* Subtle Decorative Elements */}
        <div className="mt-16 grid grid-cols-3 gap-8 opacity-40 grayscale group-hover:grayscale-0 transition-all">
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
          <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        </div>

      </div>
    </div>
  );
}
