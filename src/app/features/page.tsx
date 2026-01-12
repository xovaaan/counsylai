import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-20 container mx-auto px-4 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 mb-8">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Powerful Features</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
                    Explore the full suite of tools designed to optimize your legal practice.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
                    {/* Placeholder Grid */}
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="p-6 rounded-xl border border-slate-200">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg mb-4"></div>
                            <h3 className="font-bold text-lg mb-2">Feature {i}</h3>
                            <p className="text-slate-500 text-sm">Advanced capability description goes here. This helps automates workflows.</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
