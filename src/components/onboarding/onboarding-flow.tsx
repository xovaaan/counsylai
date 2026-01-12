"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/actions";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingFlowProps {
    userId: string;
    email: string;
}

export function OnboardingFlow({ userId, email }: OnboardingFlowProps) {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        dateOfBirth: "",
        firmName: "",
        country: "",
        firmSize: "",
        professionalEmail: "",
        website: "",
        referralSource: "",
        painPoints: "",
    });

    const questions = [
        {
            key: "name",
            label: "What is your full name?",
            type: "text",
            placeholder: "e.g. John Doe"
        },
        {
            key: "dateOfBirth",
            label: "What is your date of birth?",
            type: "date",
            placeholder: ""
        },
        {
            key: "firmName",
            label: "What is your firm's name?",
            type: "text",
            placeholder: "e.g. Smith & Partners"
        },
        {
            key: "country",
            label: "Which country are you based in?",
            type: "select",
            options: ["Bangladesh", "United Kingdom", "United States", "India", "Singapore", "Canada", "Other"]
        },
        {
            key: "firmSize",
            label: "How large is your firm?",
            type: "select",
            options: ["Solo Practitioner", "Small (2-10)", "Medium (11-50)", "Large (50+)", "Corporate Legal Dept"]
        },
        {
            key: "professionalEmail",
            label: "Professional Email Address",
            type: "email",
            description: "We'll use this for official correspondence.",
            placeholder: "john@lawfirm.com"
        },
        {
            key: "website",
            label: "Firm Website",
            type: "url",
            placeholder: "https://"
        },
        {
            key: "referralSource",
            label: "How did you hear about us?",
            type: "select",
            options: ["LinkedIn", "Colleague", "Search Engine", "Conference", "Advertisement", "Other"]
        },
        {
            key: "painPoints",
            label: "Which part costs your time most?",
            type: "select",
            options: ["Legal Research", "Contract Review", "Drafting Documents", "Client Management", "Administrative Tasks", "Compliance Checks"]
        }
    ];

    const currentQuestion = questions[step];
    const isLastStep = step === questions.length - 1;

    const handleNext = async () => {
        if (!formData[currentQuestion.key as keyof typeof formData]) {
            // Simple validation: strictly require answer
            // Ideally show error toast
            return;
        }

        if (isLastStep) {
            setLoading(true);
            try {
                await completeOnboarding({
                    ...formData,
                    userId,
                    email,
                    dateOfBirth: new Date(formData.dateOfBirth)
                });
                router.push("/dashboard");
                router.refresh();
            } catch (error) {
                console.error("Onboarding failed", error);
                setLoading(false);
            }
        } else {
            setStep(s => s + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(s => s - 1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && currentQuestion.type !== 'textarea') {
            handleNext();
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2070')] bg-cover bg-center">
            {/* Glassmorphism Blur Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"></div>

            <div className="relative z-10 w-full max-w-xl px-4">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white/90 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 md:p-12 text-center"
                    >
                        <div className="mb-8">
                            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                <span>Step {step + 1} of {questions.length}</span>
                                <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-blue-600"
                                    initial={{ width: `${(step / questions.length) * 100}%` }}
                                    animate={{ width: `${((step + 1) / questions.length) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">
                            {currentQuestion.label}
                        </h2>

                        {currentQuestion.description && (
                            <p className="text-slate-500 mb-6 -mt-4">{currentQuestion.description}</p>
                        )}

                        <div className="mb-8 text-left">
                            {currentQuestion.type === 'text' || currentQuestion.type === 'email' || currentQuestion.type === 'url' ? (
                                <Input
                                    autoFocus
                                    type={currentQuestion.type}
                                    placeholder={currentQuestion.placeholder}
                                    value={formData[currentQuestion.key as keyof typeof formData]}
                                    onChange={(e) => setFormData({ ...formData, [currentQuestion.key]: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                    className="h-14 text-lg bg-white border-slate-200 focus:border-blue-500 transition-all font-medium"
                                />
                            ) : currentQuestion.type === 'date' ? (
                                <Input
                                    autoFocus
                                    type="date"
                                    value={formData[currentQuestion.key as keyof typeof formData]}
                                    onChange={(e) => setFormData({ ...formData, [currentQuestion.key]: e.target.value })}
                                    onKeyDown={handleKeyDown}
                                    className="h-14 text-lg bg-white border-slate-200 focus:border-blue-500 transition-all font-medium"
                                />
                            ) : currentQuestion.type === 'select' ? (
                                <Select
                                    value={formData[currentQuestion.key as keyof typeof formData]}
                                    onValueChange={(val) => setFormData({ ...formData, [currentQuestion.key]: val })}
                                >
                                    <SelectTrigger className="h-14 text-lg bg-white border-slate-200">
                                        <SelectValue placeholder="Select an option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currentQuestion.options?.map((opt) => (
                                            <SelectItem key={opt} value={opt} className="text-base py-3">
                                                {opt}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : null}
                        </div>

                        <div className="flex gap-4">
                            {step > 0 && (
                                <Button
                                    variant="outline"
                                    size="lg"
                                    onClick={handleBack}
                                    className="flex-1 h-12 text-base"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                </Button>
                            )}
                            <Button
                                size="lg"
                                onClick={handleNext}
                                disabled={loading || !formData[currentQuestion.key as keyof typeof formData]}
                                className="flex-1 h-12 text-base bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                {loading ? "Wrapping up..." : isLastStep ? "Finish" : "Next"}
                                {!loading && !isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
                            </Button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
