import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal Component — Enhanced
 * Supports directional animations: 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade'
 */
export default function ScrollReveal({
    children,
    className = '',
    delay = 0,
    direction = 'up',
    duration = 700,
    once = true,
}) {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.unobserve(el);
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold: 0.07, rootMargin: '0px 0px -48px 0px' }
        );

        observer.observe(el);
        return () => observer.unobserve(el);
    }, [once]);

    const transforms = {
        up:    { hidden: 'translate3d(0,40px,0)',   visible: 'translate3d(0,0,0)'   },
        down:  { hidden: 'translate3d(0,-30px,0)',  visible: 'translate3d(0,0,0)'   },
        left:  { hidden: 'translate3d(-48px,0,0)',  visible: 'translate3d(0,0,0)'   },
        right: { hidden: 'translate3d(48px,0,0)',   visible: 'translate3d(0,0,0)'   },
        zoom:  { hidden: 'scale3d(0.88,0.88,1)',    visible: 'scale3d(1,1,1)'       },
        fade:  { hidden: 'translate3d(0,0,0)',      visible: 'translate3d(0,0,0)'   },
    };

    const t = transforms[direction] || transforms.up;

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? t.visible : t.hidden,
                transition: `opacity ${duration}ms ${delay}ms cubic-bezier(.25,.8,.25,1),
                             transform ${duration}ms ${delay}ms cubic-bezier(.25,.8,.25,1)`,
                willChange: 'opacity, transform',
            }}
        >
            {children}
        </div>
    );
}
