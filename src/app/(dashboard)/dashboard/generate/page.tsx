"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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
    },
    "Consulting Agreement": {
        id: "consulting-template",
        name: "Consulting Agreement",
        type: "Consulting Agreement",
        variables: ["clientName", "consultantName", "consultingServices", "startDate", "hourlyRate", "term", "governingLaw"],
        sections: [
            {
                title: "Parties and Services",
                content: "This Consulting Agreement is entered into on {{startDate}} between {{clientName}} (\"Client\") and {{consultantName}} (\"Consultant\"). The Consultant agrees to provide consulting services as follows: {{consultingServices}}."
            },
            {
                title: "Compensation",
                content: "The Client agrees to pay the Consultant at the rate of {{hourlyRate}} per hour for services rendered. Payment shall be made within 30 days of invoice receipt."
            },
            {
                title: "Term",
                content: "This Agreement shall commence on {{startDate}} and continue for a period of {{term}}, unless earlier terminated in accordance with the terms herein."
            },
            {
                title: "Independent Contractor",
                content: "The Consultant is an independent contractor and not an employee of the Client. The Consultant shall be responsible for all taxes and benefits."
            },
            {
                title: "Confidentiality",
                content: "The Consultant agrees to maintain strict confidentiality of all Client information and not to disclose any confidential information to third parties."
            },
            {
                title: "Governing Law",
                content: "This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}."
            }
        ]
    },
    "Software License": {
        id: "software-license-template",
        name: "Software License Agreement",
        type: "Software License",
        variables: ["licensorName", "licenseeName", "softwareName", "effectiveDate", "licenseFee", "term", "governingLaw"],
        sections: [
            {
                title: "Parties and Software",
                content: "This Software License Agreement is entered into on {{effectiveDate}} between {{licensorName}} (\"Licensor\") and {{licenseeName}} (\"Licensee\"). The Licensor grants a license to use the software: {{softwareName}}."
            },
            {
                title: "License Grant",
                content: "Subject to the terms of this Agreement, Licensor grants Licensee a non-exclusive, non-transferable license to use the Software for Licensee's internal business purposes."
            },
            {
                title: "License Fee",
                content: "Licensee agrees to pay Licensor a license fee of {{licenseFee}} for the right to use the Software. Payment is due upon execution of this Agreement."
            },
            {
                title: "Term",
                content: "This License shall commence on {{effectiveDate}} and continue for a period of {{term}}, unless earlier terminated in accordance with this Agreement."
            },
            {
                title: "Restrictions",
                content: "Licensee shall not: (a) copy, modify, or create derivative works of the Software; (b) reverse engineer or decompile the Software; (c) sublicense or transfer the Software to third parties."
            },
            {
                title: "Governing Law",
                content: "This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}."
            }
        ]
    },
    "Lease Agreement": {
        id: "lease-template",
        name: "Lease Agreement",
        type: "Lease Agreement",
        variables: ["landlordName", "tenantName", "propertyAddress", "startDate", "monthlyRent", "securityDeposit", "term", "governingLaw"],
        sections: [
            {
                title: "Parties and Property",
                content: "This Lease Agreement is entered into on {{startDate}} between {{landlordName}} (\"Landlord\") and {{tenantName}} (\"Tenant\") for the property located at {{propertyAddress}}."
            },
            {
                title: "Term",
                content: "The term of this Lease shall commence on {{startDate}} and continue for a period of {{term}}, unless earlier terminated in accordance with this Agreement."
            },
            {
                title: "Rent",
                content: "Tenant agrees to pay Landlord monthly rent of {{monthlyRent}}, due on the first day of each month. Rent shall be paid to the address specified by Landlord."
            },
            {
                title: "Security Deposit",
                content: "Tenant has deposited with Landlord the sum of {{securityDeposit}} as security for the faithful performance of Tenant's obligations under this Lease."
            },
            {
                title: "Use of Property",
                content: "Tenant shall use the Property solely for residential purposes and shall not use the Property for any illegal or commercial purposes."
            },
            {
                title: "Maintenance and Repairs",
                content: "Landlord shall maintain the Property in good repair. Tenant shall be responsible for minor repairs and maintenance, and shall notify Landlord promptly of any needed repairs."
            },
            {
                title: "Governing Law",
                content: "This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}."
            }
        ]
    },
    "Partnership Agreement": {
        id: "partnership-template",
        name: "Partnership Agreement",
        type: "Partnership Agreement",
        variables: ["partner1Name", "partner2Name", "partnershipName", "effectiveDate", "capitalContribution1", "capitalContribution2", "profitShare1", "profitShare2", "governingLaw"],
        sections: [
            {
                title: "Parties and Partnership",
                content: "This Partnership Agreement is entered into on {{effectiveDate}} between {{partner1Name}} and {{partner2Name}} (collectively, \"Partners\") to form a partnership under the name {{partnershipName}}."
            },
            {
                title: "Business Purpose",
                content: "The Partnership is formed for the purpose of conducting business operations as agreed upon by the Partners from time to time."
            },
            {
                title: "Capital Contributions",
                content: "Partner 1 ({{partner1Name}}) shall contribute {{capitalContribution1}} and Partner 2 ({{partner2Name}}) shall contribute {{capitalContribution2}} as initial capital to the Partnership."
            },
            {
                title: "Profit and Loss Sharing",
                content: "Profits and losses of the Partnership shall be shared as follows: Partner 1 ({{partner1Name}}) - {{profitShare1}}%, Partner 2 ({{partner2Name}}) - {{profitShare2}}%."
            },
            {
                title: "Management",
                content: "All Partners shall have equal rights in the management and conduct of Partnership business. Major decisions shall require unanimous consent of all Partners."
            },
            {
                title: "Withdrawal and Dissolution",
                content: "A Partner may withdraw from the Partnership upon 90 days written notice. The Partnership may be dissolved by mutual agreement of all Partners or as otherwise provided by law."
            },
            {
                title: "Governing Law",
                content: "This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}."
            }
        ]
    },
    "Purchase Agreement": {
        id: "purchase-template",
        name: "Purchase Agreement",
        type: "Purchase Agreement",
        variables: ["buyerName", "sellerName", "itemDescription", "purchasePrice", "effectiveDate", "deliveryDate", "paymentTerms", "governingLaw"],
        sections: [
            {
                title: "Parties and Item",
                content: "This Purchase Agreement is entered into on {{effectiveDate}} between {{sellerName}} (\"Seller\") and {{buyerName}} (\"Buyer\") for the purchase and sale of: {{itemDescription}}."
            },
            {
                title: "Purchase Price",
                content: "The total purchase price for the Item is {{purchasePrice}}. Payment terms: {{paymentTerms}}."
            },
            {
                title: "Delivery",
                content: "Seller shall deliver the Item to Buyer on or before {{deliveryDate}}. Risk of loss shall pass to Buyer upon delivery."
            },
            {
                title: "Title and Warranties",
                content: "Seller warrants that Seller has good and marketable title to the Item, free from liens and encumbrances. Seller warrants the Item to be in good working condition."
            },
            {
                title: "Default",
                content: "If Buyer fails to make payment when due, Seller may terminate this Agreement and retain any deposits paid. If Seller fails to deliver, Buyer may seek specific performance or damages."
            },
            {
                title: "Governing Law",
                content: "This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}."
            }
        ]
    },
    "Loan Agreement": {
        id: "loan-template",
        name: "Loan Agreement",
        type: "Loan Agreement",
        variables: ["lenderName", "borrowerName", "loanAmount", "interestRate", "effectiveDate", "repaymentTerm", "monthlyPayment", "governingLaw"],
        sections: [
            {
                title: "Parties and Loan",
                content: "This Loan Agreement is entered into on {{effectiveDate}} between {{lenderName}} (\"Lender\") and {{borrowerName}} (\"Borrower\"). Lender agrees to lend Borrower the principal amount of {{loanAmount}}."
            },
            {
                title: "Interest Rate",
                content: "The loan shall bear interest at an annual rate of {{interestRate}}%, calculated on the outstanding principal balance."
            },
            {
                title: "Repayment",
                content: "Borrower agrees to repay the loan in {{repaymentTerm}} equal monthly installments of {{monthlyPayment}} each, beginning one month from the Effective Date."
            },
            {
                title: "Prepayment",
                content: "Borrower may prepay the loan in whole or in part at any time without penalty. Any prepayment shall be applied first to accrued interest, then to principal."
            },
            {
                title: "Default",
                content: "If Borrower fails to make any payment when due, Lender may declare the entire outstanding balance immediately due and payable. Borrower shall be liable for all costs of collection, including attorney's fees."
            },
            {
                title: "Governing Law",
                content: "This Agreement shall be governed by and construed in accordance with the laws of {{governingLaw}}."
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
                },
                undefined,
                currentTemplate // Pass template data directly
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

    const handleDownload = async () => {
        if (!generatedContract) return;

        try {
            // Dynamic import of jsPDF to avoid SSR issues
            const { jsPDF } = await import("jspdf");
            const doc = new jsPDF();

            // Set up page dimensions
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 20;
            const maxWidth = pageWidth - 2 * margin;
            let yPosition = margin;
            const lineHeight = 7;

            // Helper to add a new page if needed
            const checkNewPage = (requiredSpace: number) => {
                if (yPosition + requiredSpace > pageHeight - margin) {
                    doc.addPage();
                    yPosition = margin;
                }
            };

            // Helper to add text with word wrap
            const addText = (text: string, fontSize: number = 11, isBold: boolean = false) => {
                doc.setFontSize(fontSize);
                doc.setFont("helvetica", isBold ? "bold" : "normal");
                
                // Remove markdown formatting for PDF
                const cleanText = text.replace(/\*\*/g, "");
                const lines = doc.splitTextToSize(cleanText, maxWidth);
                
                checkNewPage(lines.length * lineHeight);
                
                lines.forEach((line: string) => {
                    doc.text(line, margin, yPosition);
                    yPosition += lineHeight;
                });
            };

            // Add title
            doc.setFontSize(20);
            doc.setFont("helvetica", "bold");
            const titleLines = doc.splitTextToSize(generatedContract.title, maxWidth);
            checkNewPage(titleLines.length * 10);
            titleLines.forEach((line: string) => {
                doc.text(line, margin, yPosition);
                yPosition += 10;
            });
            yPosition += 5;

            // Add metadata
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            addText(`Contract Type: ${generatedContract.type}`, 10);
            addText(`Generated: ${new Date(generatedContract.createdAt).toLocaleDateString()}`, 10);
            yPosition += 10;

            // Parse and format contract content
            const content = generatedContract.content;
            const sections = content.split(/\n\n+/);

            sections.forEach((section: string) => {
                if (!section.trim()) return;

                // Check if it's a signature section
                if (section.includes("Signatures") || section.includes("Signature")) {
                    const [title, ...contentParts] = section.split("\n");
                    const sectionTitle = title.trim();
                    const sectionContent = contentParts.join("\n").trim();

                    // Add section title
                    yPosition += 10;
                    addText(sectionTitle, 14, true);
                    yPosition += 5;

                    // Process signature content
                    if (sectionContent) {
                        const lines = sectionContent.split("\n");
                        let currentParty = "";
                        
                        lines.forEach((line: string) => {
                            if (!line.trim()) {
                                yPosition += 3;
                                return;
                            }
                            
                            // Check if it's a party name (not a signature line)
                            if (line.trim() && !line.includes("_") && !line.includes("Signature") && !line.includes("Print Name") && !line.includes("Date") && !line.includes("IN WITNESS")) {
                                // It's a party name
                                currentParty = line.trim();
                                yPosition += 5;
                                addText(currentParty, 12, true);
                                yPosition += 8;
                            } else if (line.includes("_")) {
                                // It's a signature line
                                const label = line.replace(/[_\s]/g, "").trim() || "Signature";
                                if (label === "Signature" || label === "PrintName" || label === "Date") {
                                    // Draw signature line
                                    checkNewPage(15);
                                    const labelText = label === "PrintName" ? "Print Name" : label;
                                    doc.setFontSize(10);
                                    doc.setFont("helvetica", "normal");
                                    doc.text(labelText + ":", margin, yPosition);
                                    
                                    // Draw line
                                    const lineStartX = margin + 40;
                                    const lineEndX = pageWidth - margin;
                                    doc.setLineWidth(0.5);
                                    doc.line(lineStartX, yPosition - 2, lineEndX, yPosition - 2);
                                    
                                    yPosition += 10;
                                } else {
                                    addText(line, 11, false);
                                }
                            } else {
                                addText(line, 11, false);
                            }
                        });
                    }
                } else if (section.includes("=")) {
                    // Regular section with title
                    const [title, ...contentParts] = section.split("\n");
                    const sectionTitle = title.trim();
                    const sectionContent = contentParts.join("\n").trim();

                    // Add section title
                    yPosition += 5;
                    addText(sectionTitle, 14, true);
                    yPosition += 3;

                    // Add section content
                    if (sectionContent) {
                        const lines = sectionContent.split("\n");
                        lines.forEach((line: string) => {
                            if (line.trim()) {
                                // Handle bullet points
                                if (line.trim().startsWith("•")) {
                                    const bulletText = line.replace(/^•\s*/, "");
                                    addText(`• ${bulletText}`, 11, false);
                                } else {
                                    addText(line, 11, false);
                                }
                            }
                        });
                    }
                } else {
                    // Regular paragraph
                    const lines = section.split("\n");
                    lines.forEach((line: string) => {
                        if (line.trim()) {
                            if (line.trim().startsWith("•")) {
                                const bulletText = line.replace(/^•\s*/, "");
                                addText(`• ${bulletText}`, 11, false);
                            } else {
                                addText(line, 11, false);
                            }
                        }
                    });
                }
                yPosition += 5;
            });

            // Save PDF
            doc.save(`${generatedContract.title.replace(/[^a-z0-9]/gi, '_')}.pdf`);
        } catch (error) {
            console.error("Failed to generate PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        }
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
                            <SelectTrigger className="bg-white hover:bg-slate-100 focus:bg-slate-100">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.keys(SAMPLE_TEMPLATES).map((type) => (
                                    <SelectItem key={type} value={type} className="bg-white hover:bg-slate-100 focus:bg-slate-100">
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
                            {currentTemplate.variables.map((variable) => {
                                const isDateField = variable.toLowerCase().includes("date") || variable.toLowerCase() === "effectivedate";
                                const isGoverningLaw = variable.toLowerCase().includes("law") || variable.toLowerCase() === "governinglaw";
                                
                                if (isDateField) {
                                    return (
                                        <div key={variable} className="space-y-2">
                                            <Label className="text-sm font-medium capitalize">
                                                {variable.replace(/([A-Z])/g, " $1").trim()}
                                            </Label>
                                            <Input
                                                type="date"
                                                placeholder={`Select ${variable.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                                                value={variables[variable] || ""}
                                                onChange={(e) =>
                                                    setVariables({ ...variables, [variable]: e.target.value })
                                                }
                                                className="w-full"
                                            />
                                        </div>
                                    );
                                }
                                
                                if (isGoverningLaw) {
                                    const governingLawOptions = [
                                        "Bangladesh",
                                        "United States",
                                        "United Kingdom",
                                        "India",
                                        "Singapore",
                                        "Canada",
                                        "Australia",
                                        "Germany",
                                        "France",
                                        "Japan",
                                        "China",
                                        "United Arab Emirates",
                                        "Saudi Arabia",
                                        "Other"
                                    ];
                                    
                                    return (
                                        <div key={variable} className="space-y-2">
                                            <Label className="text-sm font-medium capitalize">
                                                {variable.replace(/([A-Z])/g, " $1").trim()}
                                            </Label>
                                            <Select
                                                value={variables[variable] || ""}
                                                onValueChange={(value) =>
                                                    setVariables({ ...variables, [variable]: value })
                                                }
                                            >
                                                <SelectTrigger className="bg-white hover:bg-slate-100 focus:bg-slate-100">
                                                    <SelectValue placeholder={`Select ${variable.replace(/([A-Z])/g, " $1").toLowerCase()}`} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {governingLawOptions.map((law) => (
                                                        <SelectItem key={law} value={law} className="bg-white hover:bg-slate-100 focus:bg-slate-100">
                                                            {law}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    );
                                }
                                
                                return (
                                    <div key={variable} className="space-y-2">
                                        <Label className="text-sm font-medium capitalize">
                                            {variable.replace(/([A-Z])/g, " $1").trim()}
                                        </Label>
                                        <Input
                                            placeholder={`Enter ${variable.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                                            value={variables[variable] || ""}
                                            onChange={(e) =>
                                                setVariables({ ...variables, [variable]: e.target.value })
                                            }
                                        />
                                    </div>
                                );
                            })}
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
                                <div className="prose prose-sm max-w-none">
                                    {generatedContract.content.split(/\n\n+/).map((section: string, idx: number) => {
                                        if (!section.trim()) return null;
                                        
                                        // Check if it's a signature section
                                        if (section.includes("Signatures") || section.includes("Signature")) {
                                            const [title, ...contentParts] = section.split("\n");
                                            const sectionTitle = title.trim();
                                            const sectionContent = contentParts.join("\n").trim();
                                            
                                            return (
                                                <div key={idx} className="mb-8 mt-8">
                                                    <h3 className="text-lg font-bold text-slate-900 mb-4 border-b border-slate-200 pb-2">
                                                        {sectionTitle}
                                                    </h3>
                                                    {sectionContent && (
                                                        <div className="text-slate-700 space-y-6">
                                                            {sectionContent.split("\n").map((line: string, lineIdx: number) => {
                                                                if (!line.trim()) return <div key={lineIdx} className="h-2" />;
                                                                
                                                                // Check if it's a party name
                                                                if (line.trim() && !line.includes("_") && !line.includes("Signature") && !line.includes("Print Name") && !line.includes("Date") && !line.includes("IN WITNESS")) {
                                                                    return (
                                                                        <div key={lineIdx} className="mt-6">
                                                                            <h4 className="font-semibold text-slate-900 mb-4">{line.trim()}</h4>
                                                                        </div>
                                                                    );
                                                                }
                                                                
                                                                // Check if it's a signature line
                                                                if (line.includes("_")) {
                                                                    const label = line.replace(/[_\s]/g, "").trim() || "Signature";
                                                                    const displayLabel = label === "Signature" ? "Signature" : 
                                                                                        label === "PrintName" ? "Print Name" : 
                                                                                        label === "Date" ? "Date" : label;
                                                                    return (
                                                                        <div key={lineIdx} className="flex items-center gap-4 mb-2">
                                                                            <span className="text-sm font-medium text-slate-600 w-24">{displayLabel}:</span>
                                                                            <div className="flex-1 border-b-2 border-slate-300 h-8"></div>
                                                                        </div>
                                                                    );
                                                                }
                                                                
                                                                // Regular text
                                                                return (
                                                                    <p key={lineIdx} className="mb-2 leading-relaxed text-slate-700 italic">
                                                                        {line}
                                                                    </p>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        
                                        // Check if it's a section title (has underline)
                                        if (section.includes("=")) {
                                            const [title, ...contentParts] = section.split("\n");
                                            const sectionTitle = title.trim();
                                            const sectionContent = contentParts.join("\n").trim();
                                            
                                            return (
                                                <div key={idx} className="mb-6">
                                                    <h3 className="text-lg font-bold text-slate-900 mb-3 border-b border-slate-200 pb-2">
                                                        {sectionTitle}
                                                    </h3>
                                                    {sectionContent && (
                                                        <div className="text-slate-700 space-y-2">
                                                            {sectionContent.split("\n").map((line: string, lineIdx: number) => {
                                                                if (!line.trim()) return null;
                                                                
                                                                // Check for bullet points
                                                                if (line.trim().startsWith("•")) {
                                                                    return (
                                                                        <div key={lineIdx} className="flex items-start ml-4">
                                                                            <span className="text-slate-600 mr-2">•</span>
                                                                            <span className="flex-1">{line.replace(/^•\s*/, "")}</span>
                                                                        </div>
                                                                    );
                                                                }
                                                                
                                                                // Check for bold text
                                                                if (line.includes("**")) {
                                                                    const parts = line.split(/(\*\*.*?\*\*)/);
                                                                    return (
                                                                        <p key={lineIdx} className="mb-2">
                                                                            {parts.map((part, partIdx) => {
                                                                                if (part.startsWith("**") && part.endsWith("**")) {
                                                                                    return (
                                                                                        <strong key={partIdx} className="font-semibold text-slate-900">
                                                                                            {part.replace(/\*\*/g, "")}
                                                                                        </strong>
                                                                                    );
                                                                                }
                                                                                return <span key={partIdx}>{part}</span>;
                                                                            })}
                                                                        </p>
                                                                    );
                                                                }
                                                                
                                                                return (
                                                                    <p key={lineIdx} className="mb-2 leading-relaxed">
                                                                        {line}
                                                                    </p>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        
                                        // Regular paragraph
                                        return (
                                            <div key={idx} className="mb-4">
                                                {section.split("\n").map((line: string, lineIdx: number) => {
                                                    if (!line.trim()) return null;
                                                    
                                                    if (line.trim().startsWith("•")) {
                                                        return (
                                                            <div key={lineIdx} className="flex items-start ml-4 mb-1">
                                                                <span className="text-slate-600 mr-2">•</span>
                                                                <span className="flex-1">{line.replace(/^•\s*/, "")}</span>
                                                            </div>
                                                        );
                                                    }
                                                    
                                                    if (line.includes("**")) {
                                                        const parts = line.split(/(\*\*.*?\*\*)/);
                                                        return (
                                                            <p key={lineIdx} className="mb-2">
                                                                {parts.map((part, partIdx) => {
                                                                    if (part.startsWith("**") && part.endsWith("**")) {
                                                                        return (
                                                                            <strong key={partIdx} className="font-semibold text-slate-900">
                                                                                {part.replace(/\*\*/g, "")}
                                                                            </strong>
                                                                        );
                                                                    }
                                                                    return <span key={partIdx}>{part}</span>;
                                                                })}
                                                            </p>
                                                        );
                                                    }
                                                    
                                                    return (
                                                        <p key={lineIdx} className="mb-2 leading-relaxed text-slate-700">
                                                            {line}
                                                        </p>
                                                    );
                                                })}
                                            </div>
                                        );
                                    })}
                                </div>
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
                                    Download as PDF
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
