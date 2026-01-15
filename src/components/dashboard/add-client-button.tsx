"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { AddClientForm } from "./add-client-form";

export function AddClientButton() {
    const [showForm, setShowForm] = useState(false);

    return (
        <>
            <Button onClick={() => setShowForm(true)}>
                <UserPlus className="w-4 h-4 mr-2" />
                Add New Client
            </Button>
            {showForm && <AddClientForm onClose={() => setShowForm(false)} />}
        </>
    );
}
