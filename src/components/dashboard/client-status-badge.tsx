"use client";

import { Badge } from "@/components/ui/badge";

interface ClientStatusBadgeProps {
    status: string;
}

export function ClientStatusBadge({ status }: ClientStatusBadgeProps) {
    const getVariant = () => {
        switch (status.toLowerCase()) {
            case "active":
                return "default"; // Green/success style
            case "working":
                return "secondary"; // Blue style
            case "pending":
                return "outline"; // Yellow/warning style
            case "not active":
                return "secondary"; // Gray style
            default:
                return "secondary";
        }
    };

    const getColorClass = () => {
        switch (status.toLowerCase()) {
            case "active":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "working":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "pending":
                return "bg-amber-100 text-amber-700 border-amber-200";
            case "not active":
                return "bg-slate-100 text-slate-600 border-slate-200";
            default:
                return "bg-slate-100 text-slate-600 border-slate-200";
        }
    };

    return (
        <Badge className={`text-[10px] py-0 capitalize border ${getColorClass()}`}>
            {status}
        </Badge>
    );
}
