import React from 'react';
import { Calendar, GraduationCap, BookOpen, Users } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function QuickStats() {
    const { settings: globalSettings } = useSettings();
    const settings = globalSettings || {};

    const stats = [
        {
            value: settings.stats_santri || '500+',
            label: 'Santri Aktif',
            icon: GraduationCap,
            colorClass: 'text-brand-green-main bg-brand-green-light',
        },
        {
            value: settings.stats_asatidzah || '40+',
            label: 'Ustadz & Ustadzah',
            icon: Users,
            colorClass: 'text-brand-gold-main bg-brand-gold-light',
        },
        {
            value: settings.stats_alumni || '250+',
            label: 'Alumni Tahfidz',
            icon: BookOpen,
            colorClass: 'text-brand-green-main bg-brand-green-light',
        },
        {
            value: settings.stats_tahun || '10+',
            label: 'Tahun Mengabdi',
            icon: Calendar,
            colorClass: 'text-brand-gold-main bg-brand-gold-light',
        },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-10 md:-mt-14">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
                {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                        <div 
                            key={index} 
                            className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200/60 shadow-lg flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                        >
                            {/* Icon Wrapper */}
                            <div className={`p-2.5 rounded-xl shrink-0 ${stat.colorClass} shadow-sm transition-transform duration-300 hover:scale-105 mb-3`}>
                                <IconComponent className="w-5.5 h-5.5" />
                            </div>
                            
                            {/* Value */}
                            <span className="font-sans text-2xl md:text-3xl font-extrabold text-brand-green-dark tracking-tight leading-none">
                                {stat.value}
                            </span>
                            
                            {/* Label */}
                            <span className="font-sans text-[10px] md:text-xs font-semibold text-slate-500 mt-2 uppercase tracking-wider">
                                {stat.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
