import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";

export default function SolutionsPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            <main className="pt-32 pb-20 container mx-auto px-4">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-12 text-center">Solutions</h1>
                <div className="grid gap-12 max-w-4xl mx-auto">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="w-full md:w-1/2 h-64 bg-slate-100 rounded-2xl"></div>
                            <div className="w-full md:w-1/2">
                                <h3 className="text-2xl font-bold mb-4">Solution for Practice Area {i}</h3>
                                <p className="text-slate-600">Detailed explanation of how Counsyl solves specific problems in this domain.</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}
