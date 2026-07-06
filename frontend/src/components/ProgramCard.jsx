import React from 'react';
import { BookOpen, Star, ArrowRight } from 'lucide-react';

export default function ProgramCard({ title, description, category }) {
  return (
    <div className="group relative bg-white p-8 rounded-2xl border border-slate-200/70 shadow-md transition-all duration-300 hover:-translate-y-1.5 hover:shadow-premium hover:border-brand-green-main/30 overflow-hidden flex flex-col justify-between h-full">
      {/* Golden top border on hover */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-brand-gold-main scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left" />
      
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="p-3 bg-brand-green-light rounded-xl text-brand-green-main transition-colors duration-300 group-hover:bg-brand-green-main group-hover:text-white shadow-sm">
            <BookOpen className="w-6 h-6" />
          </div>
          {category && (
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold-main bg-brand-gold-light px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              {category}
            </span>
          )}
        </div>
        
        <h3 className="font-sans text-xl font-semibold text-text-title mb-3 transition-colors duration-300 group-hover:text-brand-green-main">
          {title}
        </h3>
        
        <p className="font-sans text-sm text-text-body leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <div className="inline-flex items-center gap-1.5 text-brand-green-main group-hover:text-brand-green-dark text-xs font-bold uppercase tracking-wider mt-auto pt-2">
        <span>Pelajari Selengkapnya</span>
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
      </div>
    </div>
  );
}
