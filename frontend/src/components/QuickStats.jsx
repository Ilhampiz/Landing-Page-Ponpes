import React from 'react';
import { Calendar, GraduationCap, BookOpen, Users } from 'lucide-react';

export default function QuickStats() {
    const stats = [
        {
            value: '10+',
            label: 'Tahun Mengabdi',
            icon: Calendar,
            colorClass: 'text-brand-green-main bg-brand-green-light',
        },
        {
            value: '500+',
            label: 'Santri Aktif',
            icon: GraduationCap,
            colorClass: 'text-brand-gold-main bg-brand-gold-light',
        },
        {
            value: '250+',
            label: 'Alumni Tahfidz',
            icon: BookOpen,
            colorClass: 'text-brand-green-main bg-brand-green-light',
        },
        {
            value: '40+',
            label: 'Ustadz & Ustadzah',
            icon: Users,
            colorClass: 'text-brand-gold-main bg-brand-gold-light',
        },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16 md:-mt-20">
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-100/80 shadow-premium grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div 
                            key={index} 
                            className={`flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left p-2 rounded-2xl transition-all duration-300 hover:bg-slate-50/50 ${
                                index > 0 
                                    ? 'border-t sm:border-t-0 sm:border-l border-slate-100 pt-6 sm:pt-2 sm:pl-6' 
                                    : 'sm:pl-2'
                            }`}
                        >
                            <div className={`p-3.5 rounded-xl shrink-0 ${stat.colorClass} shadow-sm transition-transform duration-300 hover:scale-110`}>
                                <IconComponent className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-sans text-2xl md:text-3xl font-bold text-text-title tracking-tight leading-none">
                                    {stat.value}
                                </span>
                                <span className="font-sans text-xs md:text-sm font-medium text-text-body mt-2">
                                    {stat.label}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
