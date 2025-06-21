import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { useTaskStore } from "../store/useTaskStore"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { useState } from "react"

export function DataTableToolbar({ table }) {
    const [open, setOpen] = useState(false)
    const [link, setLink] = useState("")

    const { problems, addProblem } = useTaskStore()

    const isFiltered = table.getState().columnFilters.length > 0

    const handleSubmit = () => {
        if (!link.trim()) return;
        addProblem(link)
        setLink("")
        setOpen(false)
    }

    const allTags = Array.from(
        new Set(
            Array.isArray(problems.data)
                ? problems.data.flatMap((p) => p.tags ?? [])
                : []
        )
    )

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter by name..."
                    value={table.getColumn("Name")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table.getColumn("Name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {table.getColumn("status") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("status")}
                        title="Status"
                        options={[
                            { label: "Solved", value: "solved" },
                            { label: "Unsolved", value: "unsolved" },
                        ]}
                    />
                )}

                {table.getColumn("tags") && allTags.length > 0 && (
                    <DataTableFacetedFilter
                        column={table.getColumn("tags")}
                        title="Tags"
                        options={allTags.map((tag) => ({
                            label: tag,
                            value: tag,
                        }))}
                    />
                )}

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-1 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Dialog Trigger + Content */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setOpen(true)}
                    >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add Problem</span>
                    </Button>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Problem</DialogTitle>
                        <DialogDescription>
                            Paste the Codeforces problem link you want to add.
                        </DialogDescription>
                    </DialogHeader>
                    <Input
                        placeholder="https://codeforces.com/problemset/problem/1234/A"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <DialogFooter>
                        <Button onClick={handleSubmit}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DataTableViewOptions table={table} />
        </div>
    )
}
