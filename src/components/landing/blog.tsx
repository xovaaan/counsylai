"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogs = [
    {
        title: "The Future of Legal Tech in South Asia",
        excerpt: "How AI is bridging the gap in legal accessibility and efficiency across the region.",
        date: "Jan 12, 2026",
        category: "Industry Trends",
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "5 Common Pitfalls in Employment Contracts",
        excerpt: "What to look for when reviewing standard employment agreements in 2026.",
        date: "Jan 08, 2026",
        category: "Legal Advice",
        image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
    },
    {
        title: "Understanding the New Cyber Security Act",
        excerpt: "A deep dive into the implications of the latest digital security regulations.",
        date: "Dec 29, 2025",
        category: "Regulatory",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800"
    }
];

export function BlogSection() {
    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                            Latest Insights
                        </h2>
                        <p className="text-lg text-slate-600 max-w-xl">
                            Stay ahead of the curve with our analysis of legal trends and technology.
                        </p>
                    </div>
                    <Button variant="outline" className="hidden md:flex">View all articles</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog, i) => (
                        <div key={i} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300">
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={blog.image}
                                    alt={blog.title}
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-bold uppercase tracking-wider rounded-full">
                                        {blog.category}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6">
                                <p className="text-xs text-slate-400 font-medium mb-3">{blog.date}</p>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {blog.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-6 line-clamp-2">
                                    {blog.excerpt}
                                </p>
                                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:gap-2 transition-all cursor-pointer">
                                    Read Article <ArrowRight className="w-4 h-4 ml-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Button variant="outline">View all articles</Button>
                </div>
            </div>
        </section>
    );
}
