import React from 'react';
import { Link } from 'react-router-dom';

const StarIcon = ({ size = 10 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ArrowRightIcon = ({ size = 10 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const TargetIcon = ({ size = 12 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

const CheckCircleIcon = ({ size = 13 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

import api from '../api/axios';

export default function ProgramCard({ title, description, focus_and_excellence, category, icon_or_image }) {
  const getImageUrl = (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      const baseURL = api.defaults.baseURL || 'http://localhost:8000/api';
      const baseDomain = baseURL.replace(/\/api$/, '');
      return `${baseDomain}${path}`;
  };
  const getIcon = (titleText) => {
    const text = (titleText || '').toLowerCase();
    if (text.includes('qur\'an') || text.includes('tahfidz') || text.includes('hafalan')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 21c-1.2-2.2-4.5-3-7-3h-2v-13h2c2.5 0 5.8.8 7 3 1.2-2.2 4.5-3 7-3h2v13h-2c-2.5 0-5.8.8-7 3z" />
          <path d="M12 6v15" />
        </svg>
      );
    }
    if (text.includes('kitab') || text.includes('diniyah') || text.includes('salaf') || text.includes('kajian')) {
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
          <path d="M6 6h10" />
          <path d="M6 10h10" />
        </svg>
      );
    }
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
      </svg>
    );
  };

  const renderFocusPoints = (text) => {
    if (!text) return null;
    const lines = text
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    return (
      <div className="mt-4 pt-4 border-t border-slate-100/80">
        <div className="flex items-center gap-1.5 mb-2.5 text-brand-green-main font-sans font-bold text-[11px] uppercase tracking-wider">
          <TargetIcon size={13} />
          <span>Fokus & Unggulan Pembelajaran</span>
        </div>
        <ul className="space-y-2">
          {lines.map((line, idx) => {
            const cleanLine = line.replace(/^[•\-\*]\s*/, '');
            return (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-sans leading-relaxed">
                <span className="text-emerald-600 mt-0.5 shrink-0">
                  <CheckCircleIcon size={13} />
                </span>
                <span>{cleanLine}</span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <div className="group relative bg-white border border-slate-200/80 p-8 rounded-3xl shadow-md transition-all duration-500 hover:-translate-y-2 hover:shadow-premium hover:border-brand-green-main/30 overflow-hidden flex flex-col justify-between h-full min-h-[360px]">
      {/* Glow highlight effect */}
      <div className="absolute top-0 left-0 w-full h-[5px] bg-brand-gold-main scale-x-0 transition-transform duration-500 group-hover:scale-x-100 origin-left z-20" />
      
      {/* Soft color ambient blur on hover */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-brand-green-light/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none z-0" />
      
      <div className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          {/* Icon Wrapper */}
          {icon_or_image ? (
            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-brand-green-light shadow-sm transition-all duration-500 group-hover:rotate-6 group-hover:scale-105">
                <img src={getImageUrl(icon_or_image)} alt={title} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="p-3 bg-brand-green-light text-brand-green-main rounded-2xl shadow-sm transition-all duration-500 group-hover:bg-brand-green-main group-hover:text-white group-hover:rotate-6 group-hover:scale-105">
              {getIcon(title)}
            </div>
          )}
          {category && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark bg-brand-gold-light/65 border border-brand-gold-main/20 px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <StarIcon size={10} />
              {category}
            </span>
          )}
        </div>
        
        <div className="flex flex-col gap-2.5">
          <h3 className="font-serif text-xl font-bold text-brand-green-dark tracking-tight transition-colors duration-300 relative pb-1 group-hover:text-brand-green-main w-fit">
            {title}
            {/* Title Underline Slide Effect */}
            <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-brand-gold-main transition-all duration-500 group-hover:w-full" />
          </h3>
          
          <p className="font-sans text-xs sm:text-sm text-slate-500 leading-relaxed">
            {description}
          </p>

          {renderFocusPoints(focus_and_excellence)}
        </div>
      </div>

      <div className="relative z-10 pt-6 border-t border-slate-100 mt-6">
        <Link 
          to="/program" 
          className="inline-flex items-center gap-3 text-brand-green-main font-sans font-bold hover:text-brand-green-dark text-xs uppercase tracking-wider no-underline group/cta"
        >
          <span>Pelajari Selengkapnya</span>
          {/* Arrow inside a circular border */}
          <div className="w-7 h-7 rounded-full border border-brand-green-main/30 flex items-center justify-center transition-all duration-300 group-hover/cta:bg-brand-green-main group-hover/cta:text-white group-hover/cta:border-brand-green-main shadow-sm">
            <ArrowRightIcon size={10} className="transition-transform duration-300 group-hover/cta:translate-x-0.5" />
          </div>
        </Link>
      </div>
    </div>
  );
}
