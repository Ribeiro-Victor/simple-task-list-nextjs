'use client';

import { useEffect } from "react";

type ToastProps = {
    type: 'success' | 'error';
    message: string;
    duration?: number;
    onClose?: () => void;
};

export default function Toast({ type, message, duration = 3000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose?.();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const backgroundColor = type === 'success' ? '#d4edda' : '#f8d7da';
    const textColor = type === 'success' ? '#155724' : '#721c24';

    return (
        <div
            className="fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg transition-opacity duration-300"
            style={{ backgroundColor, color: textColor }}
        >
            {message}
        </div>
    );
}
