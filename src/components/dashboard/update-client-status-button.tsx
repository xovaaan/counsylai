"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateClientStatus } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface UpdateClientStatusButtonProps {
    clientId: string;
    currentStatus: string;
}

export function UpdateClientStatusButton({ clientId, currentStatus }: UpdateClientStatusButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return;
        
        setLoading(true);
        try {
            const result = await updateClientStatus(clientId, newStatus);
            if (result.success) {
                router.refresh();
            } else {
                alert("Failed to update status: " + result.error);
            }
        } catch (error: any) {
            alert("Failed to update status: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Select
            value={currentStatus}
            onValueChange={handleStatusChange}
            disabled={loading}
        >
            <SelectTrigger className="w-[120px] h-8 text-xs bg-white hover:bg-slate-100 focus:bg-slate-100">
                {loading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                    <SelectValue />
                )}
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="active" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Active</SelectItem>
                <SelectItem value="working" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Working</SelectItem>
                <SelectItem value="pending" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Pending</SelectItem>
                <SelectItem value="not active" className="bg-white hover:bg-slate-100 focus:bg-slate-100">Not Active</SelectItem>
            </SelectContent>
        </Select>
    );
}
