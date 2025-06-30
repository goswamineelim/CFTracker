import React, { useEffect, useState } from "react"
import { DataTable } from "@/components/data-table"
import { columns } from "@/components/columns" // your column definitions
import { useTaskStore } from "../store/useTaskStore"
import {Button} from "@/components/ui/button"

export default function Problems() {
    const problems = useTaskStore(state => state.problems); // ✅ proper subscription
    const getProblems = useTaskStore(state => state.getProblems);
    useEffect(() => {
        getProblems();
    }, [])
    return (
        <>
            <div className="p-4 sm:p-2 w-full max-w-full overflow-x-auto">
                <h1 className="text-lg sm:text-base xs:text-sm font-bold mb-4">Your Problem List</h1>
                <div className="w-full max-w-full overflow-x-auto">
                  <DataTable columns={columns} data={Object.values(problems)} />
                </div>
            </div>
        </>
    )
}
