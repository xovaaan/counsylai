import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { ShieldCheck, Lock, Server } from "lucide-react";

export default function SecurityPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-20 container mx-auto px-4">
                <div className="max-w-3xl mx-auto text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mb-6">
                        <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Enterprise-Grade Security</h1>
                    <p className="text-lg text-slate-600">
                        We maintain the highest standards of data protection and privacy for your sensitive legal documents.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <div className="text-center">
                        <Lock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">End-to-End Encryption</h3>
                        <p className="text-slate-600">All data is encrypted in transit and at rest using banking-grade standards.</p>
                    </div>
                    <div className="text-center">
                        <Server className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">Isolated Instances</h3>
                        <p className="text-slate-600">Client data is logically separated and never mixed with other organizations.</p>
                    </div>
                    <div className="text-center">
                        <ShieldCheck className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="font-bold text-xl mb-2">Compliance Ready</h3>
                        <p className="text-slate-600">Built to comply with GDPR and local digital security acts.</p>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
