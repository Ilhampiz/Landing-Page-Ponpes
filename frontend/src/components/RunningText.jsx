import React from 'react';
import { useSettings } from '../context/SettingsContext';
import { runningTextItems } from "../constants/runningText";

function RunningText() {
    const { settings, loading } = useSettings();

    if (loading) {
        return <div className="h-[38px] bg-brand-green-dark border-b border-brand-gold-main/20" />;
    }

    const text = settings?.running_text || '';
    const items = text ? [text, text, text] : runningTextItems;

    return (
        <div className="bg-brand-green-dark text-white text-xs md:text-sm py-2.5 overflow-hidden whitespace-nowrap border-b border-brand-gold-main/20 relative z-40">
            <div className="inline-block animate-marquee">
                {items.map((item, idx) => (
                    <React.Fragment key={idx}>
                        <span className="font-sans font-medium tracking-wide">{item}</span>
                        {idx < items.length - 1 && (
                            <span className="mx-6 text-brand-gold-main font-bold select-none">•</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}

export default RunningText;
