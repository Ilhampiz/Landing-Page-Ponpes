import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { runningTextItems } from "../constants/runningText";

function RunningText() {
    const [text, setText] = useState('');

    useEffect(() => {
        const fetchRunningText = async () => {
            try {
                const res = await api.get('/settings');
                if (res.data && res.data.running_text) {
                    setText(res.data.running_text);
                }
            } catch (err) {
                console.error('Error fetching running text:', err);
            }
        };
        fetchRunningText();
    }, []);

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
