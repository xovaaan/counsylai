import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SAMPLE_CLAUSES = [
    {
        name: "Standard Termination Clause",
        category: "Termination",
        jurisdiction: "Bangladesh",
        description: "Standard termination clause with notice period",
        content: `Either party may terminate this Agreement by providing {{noticePeriod}} days written notice to the other party. Upon termination, all obligations under this Agreement shall cease, except for those provisions that by their nature are intended to survive termination, including but not limited to confidentiality, indemnification, and dispute resolution clauses.`,
        variables: ["noticePeriod"],
    },
    {
        name: "Termination for Cause",
        category: "Termination",
        jurisdiction: "Bangladesh",
        description: "Immediate termination for material breach",
        content: `Either party may terminate this Agreement immediately upon written notice if the other party: (a) commits a material breach of any term of this Agreement and fails to cure such breach within {{curePeriod}} days of receiving written notice; (b) becomes insolvent or subject to bankruptcy proceedings; or (c) ceases to conduct business in the normal course.`,
        variables: ["curePeriod"],
    },
    {
        name: "Mutual Confidentiality",
        category: "Confidentiality",
        jurisdiction: "Bangladesh",
        description: "Two-way confidentiality obligations",
        content: `Each party agrees to maintain in strict confidence all Confidential Information disclosed by the other party. "Confidential Information" means any information marked as confidential or that reasonably should be understood to be confidential given the nature of the information and circumstances of disclosure. Neither party shall disclose Confidential Information to third parties without prior written consent, except to employees, contractors, and advisors who have a legitimate need to know and are bound by confidentiality obligations.`,
        variables: [],
    },
    {
        name: "Payment Terms - Net 30",
        category: "Payment",
        jurisdiction: "Bangladesh",
        description: "Standard 30-day payment terms",
        content: `{{payerName}} shall pay {{payeeName}} the sum of {{amount}} BDT within thirty (30) days of receiving a valid invoice. Invoices shall be sent to {{billingAddress}}. Late payments shall accrue interest at the rate of {{interestRate}}% per month or the maximum rate permitted by law, whichever is less.`,
        variables: ["payerName", "payeeName", "amount", "billingAddress", "interestRate"],
    },
    {
        name: "Milestone-Based Payment",
        category: "Payment",
        jurisdiction: "Bangladesh",
        description: "Payment tied to project milestones",
        content: `Payment shall be made according to the following milestones: (a) {{milestone1Percentage}}% upon signing this Agreement; (b) {{milestone2Percentage}}% upon completion of {{milestone2Description}}; (c) {{milestone3Percentage}}% upon final delivery and acceptance. Each payment shall be made within {{paymentDays}} days of milestone completion.`,
        variables: ["milestone1Percentage", "milestone2Percentage", "milestone3Percentage", "milestone2Description", "paymentDays"],
    },
    {
        name: "Limitation of Liability",
        category: "Liability",
        jurisdiction: "Bangladesh",
        description: "Cap on liability exposure",
        content: `TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION. THE TOTAL LIABILITY OF EITHER PARTY SHALL NOT EXCEED {{liabilityCapAmount}} BDT OR THE AMOUNT PAID UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, WHICHEVER IS GREATER.`,
        variables: ["liabilityCapAmount"],
    },
    {
        name: "IP Ownership - Work for Hire",
        category: "Intellectual Property",
        jurisdiction: "Bangladesh",
        description: "Client owns all created IP",
        content: `All work product, deliverables, and intellectual property created by {{contractor}} in the course of performing services under this Agreement shall be deemed "work made for hire" and shall be the sole and exclusive property of {{client}}. To the extent any such work does not qualify as work made for hire, {{contractor}} hereby assigns all right, title, and interest in such work to {{client}}.`,
        variables: ["contractor", "client"],
    },
    {
        name: "Arbitration in Dhaka",
        category: "Dispute Resolution",
        jurisdiction: "Bangladesh",
        description: "Arbitration clause for Bangladesh",
        content: `Any dispute arising out of or relating to this Agreement shall be resolved through binding arbitration in Dhaka, Bangladesh, in accordance with the Arbitration Act, 2001. The arbitration shall be conducted by a single arbitrator mutually agreed upon by the parties. The arbitrator's decision shall be final and binding. Each party shall bear its own costs, and the parties shall share equally the arbitrator's fees.`,
        variables: [],
    },
    {
        name: "Force Majeure",
        category: "Force Majeure",
        jurisdiction: "Bangladesh",
        description: "Excuse for non-performance due to unforeseen events",
        content: `Neither party shall be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to acts of God, war, terrorism, civil unrest, labor disputes, epidemics, government actions, or failures of telecommunications or internet services. The affected party shall promptly notify the other party and use reasonable efforts to mitigate the impact. If the force majeure event continues for more than {{forceMajeurePeriod}} days, either party may terminate this Agreement without liability.`,
        variables: ["forceMajeurePeriod"],
    },
    {
        name: "Mutual Indemnification",
        category: "Indemnification",
        jurisdiction: "Bangladesh",
        description: "Two-way indemnification clause",
        content: `Each party (the "Indemnifying Party") shall indemnify, defend, and hold harmless the other party (the "Indemnified Party") from and against any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from: (a) the Indemnifying Party's breach of this Agreement; (b) the Indemnifying Party's negligence or willful misconduct; or (c) the Indemnifying Party's violation of applicable laws.`,
        variables: [],
    },
    {
        name: "Governing Law - Bangladesh",
        category: "Governing Law",
        jurisdiction: "Bangladesh",
        description: "Bangladesh law governs the agreement",
        content: `This Agreement shall be governed by and construed in accordance with the laws of Bangladesh, including but not limited to the Contract Act, 1872, without regard to its conflict of law provisions. The parties submit to the exclusive jurisdiction of the courts of Dhaka, Bangladesh for any disputes arising under this Agreement.`,
        variables: [],
    },
    {
        name: "Non-Compete Clause",
        category: "Non-Compete",
        jurisdiction: "Bangladesh",
        description: "Restriction on competitive activities",
        content: `During the term of this Agreement and for a period of {{nonCompetePeriod}} months thereafter, {{restrictedParty}} shall not, directly or indirectly, engage in any business that competes with {{protectedParty}}'s business within {{geographicScope}}. This restriction applies to acting as an employee, consultant, owner, partner, or in any other capacity with a competing business.`,
        variables: ["nonCompetePeriod", "restrictedParty", "protectedParty", "geographicScope"],
    },
    {
        name: "Warranty of Services",
        category: "Warranties",
        jurisdiction: "Bangladesh",
        description: "Service provider warranties",
        content: `{{serviceProvider}} warrants that: (a) all services will be performed in a professional and workmanlike manner in accordance with industry standards; (b) {{serviceProvider}} has the necessary skills, qualifications, and resources to perform the services; (c) the services and deliverables will not infringe any third-party intellectual property rights; and (d) {{serviceProvider}} will comply with all applicable laws and regulations in performing the services.`,
        variables: ["serviceProvider"],
    },
];

async function seedClauses() {
    console.log("Starting clause seeding...");

    try {
        // Create a system user for public clauses
        const systemUserId = "system";
        const systemOrgId = "public";

        for (const clause of SAMPLE_CLAUSES) {
            await prisma.clauseTemplate.create({
                data: {
                    organizationId: systemOrgId,
                    name: clause.name,
                    category: clause.category,
                    jurisdiction: clause.jurisdiction,
                    description: clause.description,
                    content: clause.content,
                    variables: clause.variables,
                    isPublic: true,
                    createdBy: systemUserId,
                },
            });
            console.log(`✓ Created clause: ${clause.name}`);
        }

        console.log(`\n✅ Successfully seeded ${SAMPLE_CLAUSES.length} clauses!`);
    } catch (error) {
        console.error("❌ Error seeding clauses:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedClauses();
