import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component
 * Wraps elements and animates them when they enter the viewport using Intersection Observer.
 */
export default function ScrollReveal({ children, className = "", delay = 0 }) {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true);
                    if (ref.current) {
                        observer.unobserve(ref.current);
                    }
                }
            },
            {
                threshold: 0.05,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out transform ${
                isIntersecting 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-[0.98]'
            } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
}
