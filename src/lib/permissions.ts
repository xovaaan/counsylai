export type Plan = "Starter" | "Professional" | "Enterprise";

// All features are now available to all plans
export const PLANS: Record<Plan, string[]> = {
    Starter: ["research", "summaries", "contracts", "compare", "clients", "documents", "logs", "knowledge-base", "private-ai"],
    Professional: ["research", "summaries", "contracts", "compare", "clients", "documents", "logs", "knowledge-base", "private-ai"],
    Enterprise: ["research", "summaries", "contracts", "compare", "clients", "documents", "logs", "knowledge-base", "private-ai"],
};

export function hasFeatureAccess(plan: Plan, feature: string): boolean {
    return PLANS[plan].includes(feature);
}
