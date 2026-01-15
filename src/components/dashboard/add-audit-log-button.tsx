"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddAuditLogForm } from "./add-audit-log-form";

export function AddAuditLogButton() {
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Audit Log
            </Button>
            {showForm && <AddAuditLogForm onClose={() => setShowForm(false)} />}
        </>
    );
}
