import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />
            <main className="pt-32 pb-20 container mx-auto px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Simple Pricing</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-16">
                    Transparent plans for solo practitioners and large firms alike.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {['Starter', 'Professional', 'Enterprise'].map((plan, i) => (
                        <div key={plan} className={`relative p-8 rounded-2xl bg-white border ${i === 1 ? 'border-blue-500 shadow-xl ring-1 ring-blue-500' : 'border-slate-200 shadow-sm'} flex flex-col`}>
                            {i === 1 && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>}
                            <h3 className="text-xl font-bold mb-2">{plan}</h3>
                            <div className="text-4xl font-bold mb-6">${i * 50 + 49}<span className="text-lg font-normal text-slate-400">/mo</span></div>
                            <ul className="space-y-4 mb-8 text-left flex-1">
                                {[1, 2, 3, 4].map(k => (
                                    <li key={k} className="flex items-center text-sm text-slate-600">
                                        <Check className="w-4 h-4 text-green-500 mr-2" /> Feature included
                                    </li>
                                ))}
                            </ul>
                            <Button className={`w-full ${i === 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-800'}`}>Choose {plan}</Button>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
