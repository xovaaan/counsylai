"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Download, Save, ArrowLeft, ArrowRight, Sparkles, Check } from "lucide-react";
import { generateContractFromTemplate, getGeneratedContracts, updateContractStatus } from "@/lib/actions/contract-actions";
import { useSearchParams } from "next/navigation";

const SAMPLE_TEMPLATES = {
    NDA: {
        id: "nda-template",
        name: "Standard Non-Disclosure Agreement",
        type: "NDA",
        variables: ["disclosingParty", "receivingParty", "effectiveDate", "term", "governingLaw"],
        sections: [
            {
                title: "Parties",
                content: "This Non-Disclosure Agreement (\"Agreement\") is entered into on {{effectiveDate}} between {{disclosingParty}} (\"Disclosing Party\") and {{receivingParty}} (\"Receiving Party\")."
            },
            {
                title: "Definition of Confidential Information",
                content: "\"Confidential Information\" means any information disclosed by the Disclosing Party to the Receiving Party, either directly or indirectly, in writing, orally, or by inspection of tangible objects, including without limitation documents, business plans, source code, software, documentation, financial information, and customer lists."
            },
            {
                title: "Obligations of Receiving Party",
                content: "The Receiving Party agrees to: (a) hold and maintain the Confidential Information in strict confidence; (b) not disclose the Confidential Information to third parties without prior written consent; (c) use the Confidential Information solely for the purpose of evaluating or engaging in discussions concerning a potential business relationship."
            },
            {
                title: "Term",
                content: "This Agreement shall remain in effect for a period of {{term}} from the Effective Date, unless earlier terminated by either party with thirty (30) days written notice."
            },
            {
                title: "Governing Law",
                content: "This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}, without regard to its conflict of law provisions."
            }
        ]
    },
    Employment: {
        id: "employment-template",
        name: "Employment Contract",
        type: "Employment",
        variables: ["employerName", "employeeName", "position", "startDate", "salary", "probationPeriod", "noticePeriod"],
        sections: [
            {
                title: "Parties and Position",
                content: "This Employment Agreement is made on {{startDate}} between {{employerName}} (\"Employer\") and {{employeeName}} (\"Employee\"). The Employee is hired for the position of {{position}}."
            },
            {
                title: "Compensation",
                content: "The Employee shall receive a salary of {{salary}} per annum, payable in monthly installments. The salary is subject to applicable tax deductions."
            },
            {
                title: "Probation Period",
                content: "The Employee shall be on probation for a period of {{probationPeriod}} from the start date. During this period, either party may terminate employment with one week's notice."
            },
            {
                title: "Notice Period",
                content: "After successful completion of probation, either party may terminate this agreement by providing {{noticePeriod}} written notice to the other party."
            },
            {
                title: "Confidentiality",
                content: "The Employee agrees to maintain strict confidentiality of all proprietary information, trade secrets, and business operations of the Employer during and after employment."
            }
        ]
    },
    "Service Agreement": {
        id: "service-template",
        name: "Service Agreement",
        type: "Service Agreement",
        variables: ["clientName", "providerName", "services", "startDate", "fee", "paymentTerms"],
        sections: [
            {
                title: "Parties and Services",
                content: "This Service Agreement is entered into on {{startDate}} between {{clientName}} (\"Client\") and {{providerName}} (\"Service Provider\"). The Service Provider agrees to provide the following services: {{services}}."
            },
            {
                title: "Fees and Payment",
                content: "The Client agrees to pay the Service Provider a fee of {{fee}} for the services rendered. Payment terms: {{paymentTerms}}."
            },
            {
                title: "Term and Termination",
                content: "This Agreement shall commence on {{startDate}} and continue until completion of services or termination by either party with 30 days written notice."
            },
            {
                title: "Warranties",
                content: "The Service Provider warrants that all services will be performed in a professional and workmanlike manner in accordance with industry standards."
            }
        ]
    }
};

export default function GenerateContractPage() {
    const searchParams = useSearchParams();
    const typeParam = searchParams?.get("type") || "NDA";

    const [step, setStep] = useState(1);
    const [selectedType, setSelectedType] = useState(typeParam);
    const [variables, setVariables] = useState<Record<string, string>>({});
    const [generatedContract, setGeneratedContract] = useState<any>(null);
    const [generating, setGenerating] = useState(false);
    const [savedContracts, setSavedContracts] = useState<any[]>([]);

    useEffect(() => {
        loadSavedContracts();
    }, []);

    const loadSavedContracts = async () => {
        const result = await getGeneratedContracts();
        if (result.success) {
            setSavedContracts(result.data || []);
        }
    };

    const currentTemplate = SAMPLE_TEMPLATES[selectedType as keyof typeof SAMPLE_TEMPLATES];

    const handleGenerateContract = async () => {
        if (!currentTemplate) return;

        // Validate all variables are filled
        const missingVars = currentTemplate.variables.filter((v) => !variables[v]);
        if (missingVars.length > 0) {
            alert(`Please fill in: ${missingVars.join(", ")}`);
            return;
        }

        setGenerating(true);
        try {
            const result = await generateContractFromTemplate(
                currentTemplate.id,
                {
                    ...variables,
                    contractTitle: `${currentTemplate.name} - ${variables[currentTemplate.variables[0]] || "Draft"}`,
                }
            );

            if (result.success) {
                setGeneratedContract(result.data);
                setStep(3);
                loadSavedContracts();
            } else {
                alert("Failed to generate contract: " + result.error);
            }
        } catch (error) {
            alert("Failed to generate contract");
        }
        setGenerating(false);
    };

    const handleDownload = () => {
        if (!generatedContract) return;

        const blob = new Blob([generatedContract.content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${generatedContract.title}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleMarkAsFinal = async () => {
        if (!generatedContract) return;

        const result = await updateContractStatus(generatedContract.id, "final");
        if (result.success) {
            setGeneratedContract({ ...generatedContract, status: "final" });
            loadSavedContracts();
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-primary">Generate Contract</h1>
                <p className="text-muted-foreground underline underline-offset-4 decoration-primary/10">
                    AI-powered contract generation wizard
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-4">
                {[
                    { num: 1, label: "Select Type" },
                    { num: 2, label: "Fill Details" },
                    { num: 3, label: "Review & Export" },
                ].map((s) => (
                    <div key={s.num} className="flex items-center gap-2">
                        <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= s.num
                                    ? "bg-primary text-white"
                                    : "bg-slate-200 text-slate-500"
                                }`}
                        >
                            {step > s.num ? <Check className="w-5 h-5" /> : s.num}
                        </div>
                        <span className={`text-sm font-medium ${step >= s.num ? "text-primary" : "text-slate-500"}`}>
                            {s.label}
                        </span>
                        {s.num < 3 && <ArrowRight className="w-4 h-4 text-slate-300 ml-2" />}
                    </div>
                ))}
            </div>

            {/* Step 1: Select Type */}
            {step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Select Contract Type</CardTitle>
                        <CardDescription>Choose the type of contract you want to generate</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Select value={selectedType} onValueChange={setSelectedType}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(SAMPLE_TEMPLATES).map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {currentTemplate && (
                            <div className="p-4 bg-slate-50 rounded-lg border">
                                <p className="font-medium mb-2">{currentTemplate.name}</p>
                                <p className="text-sm text-muted-foreground mb-3">
                                    This template includes {currentTemplate.sections.length} sections
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {currentTemplate.sections.map((section, i) => (
                                        <Badge key={i} variant="secondary">
                                            {section.title}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button onClick={() => setStep(2)} className="w-full">
                            Next: Fill Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Step 2: Fill Variables */}
            {step === 2 && currentTemplate && (
                <Card>
                    <CardHeader>
                        <CardTitle>Fill Contract Details</CardTitle>
                        <CardDescription>Provide the required information for your {selectedType}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentTemplate.variables.map((variable) => (
                                <div key={variable} className="space-y-2">
                                    <label className="text-sm font-medium capitalize">
                                        {variable.replace(/([A-Z])/g, " $1").trim()}
                                    </label>
                                    <Input
                                        placeholder={`Enter ${variable.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                                        value={variables[variable] || ""}
                                        onChange={(e) =>
                                            setVariables({ ...variables, [variable]: e.target.value })
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button onClick={handleGenerateContract} disabled={generating} className="flex-1">
                                {generating ? (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                        Generating Contract...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Contract
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Step 3: Review & Export */}
            {step === 3 && generatedContract && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{generatedContract.title}</CardTitle>
                                    <CardDescription>
                                        Generated on {new Date(generatedContract.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <Badge variant={generatedContract.status === "final" ? "success" : "secondary"}>
                                    {generatedContract.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-white border rounded-lg p-6 max-h-[600px] overflow-y-auto">
                                <pre className="whitespace-pre-wrap text-sm font-sans text-slate-700">
                                    {generatedContract.content}
                                </pre>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button className="w-full" onClick={handleDownload}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Download as Text
                                </Button>
                                {generatedContract.status === "draft" && (
                                    <Button className="w-full" variant="outline" onClick={handleMarkAsFinal}>
                                        <Check className="w-4 h-4 mr-2" />
                                        Mark as Final
                                    </Button>
                                )}
                                <Button
                                    className="w-full"
                                    variant="outline"
                                    onClick={() => {
                                        setStep(1);
                                        setVariables({});
                                        setGeneratedContract(null);
                                    }}
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    Generate Another
                                </Button>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Contract Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div>
                                    <span className="font-medium">Type:</span> {generatedContract.type}
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span> {generatedContract.status}
                                </div>
                                <div>
                                    <span className="font-medium">Created:</span>{" "}
                                    {new Date(generatedContract.createdAt).toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}

            {/* Saved Contracts */}
            {savedContracts.length > 0 && step === 1 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Contracts</CardTitle>
                        <CardDescription>Your previously generated contracts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {savedContracts.slice(0, 5).map((contract) => (
                                <div
                                    key={contract.id}
                                    className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors cursor-pointer"
                                    onClick={() => {
                                        setGeneratedContract(contract);
                                        setStep(3);
                                    }}
                                >
                                    <div>
                                        <p className="font-medium text-sm">{contract.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(contract.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <Badge variant={contract.status === "final" ? "success" : "secondary"}>
                                        {contract.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
