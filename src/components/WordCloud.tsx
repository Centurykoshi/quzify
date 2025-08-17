"use client";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useMemo } from "react";

type props = { 
    formattedTopics: { text: string; value: number }[];
}; 

interface WordPosition {
    text: string;
    size: number;
    x: number;
    y: number;
    rotation: number;
    color: string;
}

const WordCloud = ({ formattedTopics }: props) => { 
    const theme = useTheme();
    const router = useRouter();
    const wordPositions = useMemo(() => {
        if (!formattedTopics.length) return [];

        const maxValue = Math.max(...formattedTopics.map(t => t.value));
        const minValue = Math.min(...formattedTopics.map(t => t.value));
        
        // Color palettes for different themes
        // const darkColors = [
        //     '#ffffff', '#e2e8f0', '#cbd5e1', '#94a3b8', '#64748b',
        //     '#fbbf24', '#f59e0b', '#d97706', '#fb7185', '#f43f5e',
        //     '#60a5fa', '#3b82f6', '#2563eb', '#10b981', '#059669',
        //     '#a78bfa', '#8b5cf6', '#7c3aed'
        // ];
        
        // const lightColors = [
        //     '#1e293b', '#334155', '#475569', '#64748b', '#0f172a',
        //     '#dc2626', '#b91c1c', '#991b1b', '#7c2d12', '#9a3412',
        //     '#1d4ed8', '#1e40af', '#1e3a8a', '#059669', '#047857',
        //     '#7c3aed', '#6d28d9', '#5b21b6'
        // ];

        // const colors = theme.theme === 'dark' ? darkColors : lightColors;

        return formattedTopics.map((topic, index) => {
            // Calculate font size based on value (12px to 48px)
            const normalizedValue = (topic.value - minValue) / (maxValue - minValue || 1);
            const fontSize = 12 + (normalizedValue * 36);

            // Generate random position
            const x = Math.random() * 80 + 10; // 10% to 90% of container width
            const y = Math.random() * 80 + 10; // 10% to 90% of container height

            // Generate random rotation (-45 to 45 degrees, with bias toward 0)
            const rotationChance = Math.random();
            let rotation = 0;
            if (rotationChance < 0.2) { // 20% chance of rotation
                rotation = (Math.random() - 0.5) * 90; // -45 to 45 degrees
            }

            // // Pick random color
            // const color = colors[Math.floor(Math.random() * colors.length)];

            return {
                text: topic.text,
                size: fontSize,
                x,
                y,
                rotation,
            };
        });
    }, [formattedTopics, theme.theme]);

    const handleWordClick = (word: string) => {
        router.push("/Quiz?topic=" + word);
    };

    return (
        <div className="relative w-full h-[400px] overflow-hidden rounded-lg border bg-background/50">
            {wordPositions.map((word, index) => (
                <button
                    key={`${word.text}-${index}`}
                    onClick={() => handleWordClick(word.text)}
                    className="absolute transition-all duration-200 hover:scale-110 hover:z-10 cursor-pointer border-none bg-transparent p-1 rounded"
                    style={{
                        left: `${word.x}%`,
                        top: `${word.y}%`,
                        fontSize: `${word.size}px`,
                        
                        transform: `translate(-50%, -50%) rotate(${word.rotation}deg)`,
                        fontWeight: word.size > 30 ? 'bold' : word.size > 20 ? '600' : 'normal',
                        fontFamily: 'Georgia, serif',
                        textShadow: theme.theme === 'dark' 
                            ? '1px 1px 2px rgba(0,0,0,0.8)' 
                            : '1px 1px 2px rgba(255,255,255,0.8)',
                        lineHeight: 1,
                        whiteSpace: 'nowrap',
                        userSelect: 'none'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                    }}
                >
                    {word.text}
                </button>
            ))}
            
            {/* Gradient overlay for better visual effect */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: theme.theme === 'dark' 
                        ? 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)'
                        : 'radial-gradient(circle at center, transparent 0%, rgba(255,255,255,0.1) 100%)'
                }}
            />
        </div>
    );
};

export default WordCloud;
