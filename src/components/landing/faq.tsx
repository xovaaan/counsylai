"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Is my data secure and confidential?",
        answer: "Absolutely. We offer enterprise-grade security with end-to-end encryption. Your client data is isolated and never used to train our public models without explicit consent. We comply with major data protection regulations."
    },
    {
        question: "Can Counsyl replace a junior associate?",
        answer: "Counsyl is designed to augment your team, not replace them. It handles the repetitive research and initial drafting tasks, allowing your associates to focus on higher-level strategy and client interaction."
    },
    {
        question: "Which jurisdictions do you support?",
        answer: "Our primary specialization is Bangladesh law, including the latest statutes and high court precedents. However, we also support major Common Law jurisdictions (UK, India) for comparative research."
    },
    {
        question: "How accurate is the AI legal research?",
        answer: "We prioritize reducing hallucinations by grounding every answer in verifying documents. Every claim is cited with a source you can verify. However, as with all AI tools, professional review is required."
    },
    {
        question: "Do you offer a free trial?",
        answer: "Yes, we offer a 14-day free trial with full access to our Research and Contract Review features so you can experience the value firsthand."
    }
];

export function FAQ() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-slate-600">
                        Everything you need to know about integrating Counsyl into your firm.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border-slate-200">
                            <AccordionTrigger className="text-left text-lg font-medium text-slate-900 hover:text-blue-600 hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-slate-600 leading-relaxed pb-6">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
