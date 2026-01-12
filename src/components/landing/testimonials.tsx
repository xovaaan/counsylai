"use client";

import Image from "next/image";

const testimonials = [
    {
        name: "Sarah Jennings",
        role: "Senior Partner, Jennings & Co",
        text: "Counsyl has completely transformed our due diligence process. What used to take days now takes hours.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
    },
    {
        name: "Michael Chen",
        role: "Legal Counsel, TechFlow",
        text: "The accuracy of the Bangladesh law citations is impressive. It's like having a senior researcher always available.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael"
    },
    {
        name: "Priya Das",
        role: "Associate, Dhaka Law Chambers",
        text: "Reviewing contracts is so much safer now. The AI catches clauses I might have missed during late nights.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
    },
    {
        name: "James Wilson",
        role: "Director, Global Trade Ltd",
        text: "Finally, a legal tech tool that actually understands the nuances of international trade law.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James"
    },
    {
        name: "Fatima Ahmed",
        role: "Partner, Ahmed Associates",
        text: "The efficiency gains are undeniable. Client satisfaction has gone up because we respond so much faster.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima"
    },
    {
        name: "Robert Fox",
        role: "General Counsel, MediaGroup",
        text: "Security was our main concern, and Counsyl's enterprise-grade protection checked all the boxes.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert"
    },
    {
        name: "Anita Roy",
        role: "Litigation Specialist",
        text: "Researching case precedents is a breeze. The interface is intuitive and the results are pinpoint accurate.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anita"
    },
    {
        name: "David Kim",
        role: "Start-up Founder",
        text: "As a founder, I need quick answers on compliance. Counsyl gives me the confidence to make decisions.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=David"
    },
    {
        name: "Elena Rodriguez",
        role: "Compliance Officer",
        text: "Tracking regulatory changes used to be a nightmare. Now it's automated and seamless.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena"
    },
    {
        name: "Thomas Wright",
        role: "Real Estate Attorney",
        text: "Land disputes are complex, but the specialized knowledge base for property law is outstanding.",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas"
    }
];

export function Testimonials() {
    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="container mx-auto px-4 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                    Trusted by top legal minds
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Join hundreds of firms leveraging Counsyl to deliver superior legal services.
                </p>
            </div>

            <div className="relative w-full">
                {/* Gradients for fade effect */}
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

                <div className="flex gap-6 animate-scroll whitespace-nowrap py-4">
                    {/* Double map for infinite loop illusion */}
                    {[...testimonials, ...testimonials].map((t, i) => (
                        <div
                            key={i}
                            className="w-[350px] md:w-[400px] shrink-0 p-6 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow whitespace-normal"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100">
                                    <img src={t.image} alt={t.name} className="object-cover w-full h-full" />
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">{t.name}</p>
                                    <p className="text-xs text-slate-500">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 leading-relaxed italic">"{t.text}"</p>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
        </section>
    );
}
