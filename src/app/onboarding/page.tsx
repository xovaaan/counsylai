"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "@/lib/actions/onboarding-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

export default function OnboardingPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        firmName: "",
        professionalEmail: "",
        firmSize: "",
        referralSource: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleNext = () => {
        if (step === 1) {
            if (!formData.firstName || !formData.lastName || !formData.professionalEmail) {
                setError("Please fill in all fields");
                return;
            }
        } else if (step === 2) {
            if (!formData.firmName || !formData.firmSize) {
                setError("Please fill in all fields");
                return;
            }
        }
        setError("");
        setStep(step + 1);
    };

    const handleSubmit = async () => {
        if (!formData.referralSource) {
            setError("Please select a referral source");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const result = await completeOnboarding(formData);

            if (result.success) {
                // Short delay for better UX
                setTimeout(() => {
                    router.push("/dashboard");
                }, 1000);
            } else {
                setError(result.error || "Something went wrong");
                setIsLoading(false);
            }
        } catch (err) {
            setError("Failed to submit. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px]" />

            <div className="relative z-10 w-full max-w-md p-6">
                <div className="backdrop-blur-xl bg-white/60 border border-white/20 shadow-2xl rounded-2xl p-8 overflow-hidden">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-[#1a1f2c] rounded-xl flex items-center justify-center shadow-lg">
                                <span className="text-white font-serif font-bold italic text-xl">C</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-serif font-semibold text-[#1a1f2c] mb-2">
                            Welcome to Counsyl
                        </h1>
                        <p className="text-sm text-slate-500">
                            Let's set up your firm's profile.
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${step >= i ? "bg-[#1a1f2c]" : "bg-slate-200"
                                    }`}
                            />
                        ))}
                    </div>

                    <form onSubmit={(e) => e.preventDefault()}>
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                className="bg-white/50 border-slate-200 focus:bg-white transition-all"
                                                placeholder="John"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                className="bg-white/50 border-slate-200 focus:bg-white transition-all"
                                                placeholder="Doe"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="professionalEmail">Professional Email</Label>
                                        <Input
                                            id="professionalEmail"
                                            name="professionalEmail"
                                            type="email"
                                            value={formData.professionalEmail}
                                            onChange={handleInputChange}
                                            className="bg-white/50 border-slate-200 focus:bg-white transition-all"
                                            placeholder="john@legal-firm.com"
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="firmName">Firm Name</Label>
                                        <Input
                                            id="firmName"
                                            name="firmName"
                                            value={formData.firmName}
                                            onChange={handleInputChange}
                                            className="bg-white/50 border-slate-200 focus:bg-white transition-all"
                                            placeholder="Doe & Partners Legal"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="firmSize">Firm Size</Label>
                                        <Select
                                            value={formData.firmSize}
                                            onValueChange={(value) => handleSelectChange("firmSize", value)}
                                        >
                                            <SelectTrigger className="bg-white/50 border-slate-200">
                                                <SelectValue placeholder="Select size" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="solo" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Solo Practitioner</SelectItem>
                                                <SelectItem value="small" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Small (2-10)</SelectItem>
                                                <SelectItem value="medium" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Medium (11-50)</SelectItem>
                                                <SelectItem value="large" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Large (50+)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="referralSource">How did you hear about us?</Label>
                                        <Select
                                            value={formData.referralSource}
                                            onValueChange={(value) => handleSelectChange("referralSource", value)}
                                        >
                                            <SelectTrigger className="bg-white/50 border-slate-200">
                                                <SelectValue placeholder="Select source" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="linkedin" className="bg-white hover:bg-slate-100 focus:bg-slate-100">LinkedIn</SelectItem>
                                                <SelectItem value="google" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Google Search</SelectItem>
                                                <SelectItem value="colleague" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Colleague / Friend</SelectItem>
                                                <SelectItem value="advertisement" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Advertisement</SelectItem>
                                                <SelectItem value="other" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {error && (
                            <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
                        )}

                        <div className="mt-8 flex gap-3">
                            {step > 1 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(step - 1)}
                                    className="flex-1 bg-white/50"
                                    disabled={isLoading}
                                >
                                    Back
                                </Button>
                            )}

                            {step < 3 ? (
                                <Button
                                    type="button"
                                    onClick={handleNext}
                                    className="flex-1 bg-[#1a1f2c] hover:bg-[#2a3142]"
                                >
                                    Next <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="flex-1 bg-[#1a1f2c] hover:bg-[#2a3142]"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Setting up...
                                        </>
                                    ) : (
                                        <>
                                            Complete Setup <CheckCircle2 className="w-4 h-4 ml-2" />
                                        </>
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-400 mt-6">
                    © 2026 Counsyl AI. Localized for Global.
                </p>
            </div>
        </div>
    );
}
