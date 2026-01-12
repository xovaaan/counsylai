"use client";

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface RichTextRendererProps {
    content: string;
    sources: { title: string; link: string }[];
}

export function RichTextRenderer({ content, sources }: RichTextRendererProps) {
    // Simple paragraph splitter
    const paragraphs = content.split('\n\n').filter(Boolean);

    const renderSegment = (text: string) => {
        // Regex to match citations like [1], [2]
        const parts = text.split(/(\[\d+\])/g);

        return parts.map((part, index) => {
            const match = part.match(/\[(\d+)\]/);
            if (match) {
                const sourceIndex = parseInt(match[1]) - 1;
                const source = sources[sourceIndex];

                if (source) {
                    return (
                        <a
                            key={index}
                            href={source.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center min-w-[1.2rem] h-5 px-1 mx-0.5 text-[0.65rem] font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-full align-top hover:bg-blue-100 hover:text-blue-700 transition-colors cursor-pointer select-none no-underline"
                            title={source.title}
                        >
                            {match[1]}
                        </a>
                    );
                }
            }

            // Basic markdown styling for bold/italic if user wants "no markdown" but we want readable text
            // We'll strip common markdown symbols but keep formating if possible, or just return text
            // User said "no markdown", so we'll just render text cleaner.
            // Let's handle bold at least because AI adds it.
            const boldParts = part.split(/\*\*(.*?)\*\*/g);
            if (boldParts.length > 1) {
                return boldParts.map((bp, i) => (i % 2 === 1 ? <strong key={`${index}-${i}`} className="font-semibold text-slate-800">{bp}</strong> : bp));
            }

            return part;
        });
    };

    return (
        <div className="space-y-4 font-sans text-base leading-relaxed text-slate-700">
            {paragraphs.map((para, i) => (
                <p key={i} className="mb-2 last:mb-0">
                    {renderSegment(para)}
                </p>
            ))}
        </div>
    );
}

export function GeminiLoader() {
    return (
        <div className="space-y-4 w-full max-w-2xl mx-auto p-4">
            {/* Abstract shimmering lines */}
            {[1, 2, 3].map((i) => (
                <div key={i} className="relative overflow-hidden">
                    <div className="h-4 bg-slate-100 rounded-md w-full mb-2 blur-[2px] opacity-60"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
            ))}
            <div className="flex gap-2 items-center text-xs text-blue-500 font-medium animate-pulse pt-2">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Analyzing legal precedents...
            </div>
        </div>
    );
}
