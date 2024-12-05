'use client';

import { useRef, useState, useLayoutEffect } from 'react';

export default function Month({ children }) {
    const ref = useRef(null);
    const [isOverFloating, setIsOverFloating] = useState(false);
    const parentHeight = (ref.current?.parentElement?.offsetHeight || 0) + 10;

    useLayoutEffect(() => {
        const currentRectBottom = ref.current?.getBoundingClientRect().bottom || 0;
        const { innerHeight } = window;
        setIsOverFloating(currentRectBottom > innerHeight);
    }, []);

    return (
        <div
            className="absolute rounded-[10px] p-3 z-50 mt-2 w-72 bg-white shadow-chatCard caption2 animate-dropdown"
            ref={ref}
            style={isOverFloating ? { bottom: parentHeight } : {}}
        >
            {children}
        </div>
    );
}
