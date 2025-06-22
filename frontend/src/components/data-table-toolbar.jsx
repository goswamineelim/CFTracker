import { useEffect, useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewOptions } from "@/components/data-table-view-options"
import { useTaskStore } from "../store/useTaskStore"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { RotateCcw } from "lucide-react"

export function DataTableToolbar({ table }) {
    const [open, setOpen] = useState(false)
    const [link, setLink] = useState("")
    const [allTags, setAllTags] = useState([])

    const problems = useTaskStore((state) => state.problems)
    const addProblem = useTaskStore((state) => state.addProblem)
    const refresh = useTaskStore((state) => state.refresh)
    const isRefreshing = useTaskStore((state) => state.isRefreshing)

    const isFiltered = table.getState().columnFilters.length > 0

    const handleSubmit = () => {
        if (!link.trim()) return
        addProblem(link)
        setLink("")
        setOpen(false)
    }
    useEffect(() => {
        refresh();
    }, [])
    useEffect(() => {
        if (!problems || !Array.isArray(problems)) return

        const tagsSet = new Set()
        for (const problem of problems) {
            if (Array.isArray(problem.tags)) {
                for (const tag of problem.tags) {
                    tagsSet.add(tag)
                }
            }
        }

        setAllTags(Array.from(tagsSet))
        console.log("Tags : " + allTags)
    }, [problems])

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Filter by name..."
                    value={table.getColumn("name")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="h-8 w-[150px] lg:w-[250px]"
                />

                {table.getColumn("problemState") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("problemState")}
                        title="State"
                        options={[
                            { label: "Solved", value: "solved" },
                            { label: "Unsolved", value: "unsolved" },
                        ]}
                    />
                )}

                {table.getColumn("tags") && (
                    <DataTableFacetedFilter
                        column={table.getColumn("tags")}
                        title="Tags"
                        options={
                            allTags.length > 0
                                ? allTags.map((tag) => ({
                                    label: tag,
                                    value: tag,
                                }))
                                : []
                        }
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
                <Button onClick={refresh} size = "icon" variant="outline" className="h-8 w-8 gap-2">
                    <RotateCcw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>

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
                    <DialogFooter className="flex justify-between">
                        <Button onClick={handleSubmit}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DataTableViewOptions table={table} />
        </div>
    )
}
