import { useEffect, useState } from "react"
import { X, Plus, Eye, MoreHorizontal, RotateCcw, Settings2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu"
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
import { DataTableViewOptions } from "@/components/data-table-view-options"
import ReactDOM from "react-dom"

export function DataTableToolbar({ table }) {
    const [open, setOpen] = useState(false)
    const [link, setLink] = useState("")
    const [allTags, setAllTags] = useState([])
    const [viewOptionsOpen, setViewOptionsOpen] = useState(false)
    const [showColumnPopover, setShowColumnPopover] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null)

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
    useEffect(() => {
        function handleClickOutside(e) {
            const popover = document.getElementById('column-popover');
            const moreOptions = document.querySelector('[data-slot="dropdown-menu-content"]');
            if (
                showColumnPopover &&
                anchorEl &&
                !anchorEl.contains(e.target) &&
                !popover?.contains(e.target) &&
                !moreOptions?.contains(e.target)
            ) {
                setShowColumnPopover(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showColumnPopover, anchorEl]);

    return (
      <>
        {/* Toolbar for all screens, compact on mobile */}
        <div className="flex items-center justify-between w-full flex-wrap gap-2 md:gap-0">
          <div className="flex flex-1 items-center space-x-2 min-w-0">
            <Input
              placeholder="Filter by name..."
              value={table.getColumn("name")?.getFilterValue() ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="h-8 w-24 text-xs md:w-36 md:text-sm lg:w-60"
            />
            {table.getColumn("problemState") && (
              <DataTableFacetedFilter
                column={table.getColumn("problemState")}
                title="State"
                options={[
                  { label: "Solved", value: "solved" },
                  { label: "Unsolved", value: "unsolved" },
                ]}
                className="text-xs md:text-sm"
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
                className="text-xs md:text-sm"
              />
            )}
            {isFiltered && (
              <Button
                variant="ghost"
                onClick={() => table.resetColumnFilters()}
                className="h-8 px-2 text-xs md:text-sm lg:px-3"
              >
                Reset
                <X className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
          {/* More Options button for all screens, only visible on mobile */}
          <div className="flex md:hidden items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <span className="sr-only">More Options</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Plus className="h-4 w-4 mr-2 text-black" />
                  <span className="text-black">Add Problem</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={refresh}>
                  <RotateCcw className={`h-4 w-4 mr-2 text-black ${isRefreshing ? "animate-spin" : ""}`} />
                  <span className="text-black">Refresh</span>
                </DropdownMenuItem>
                <div className="flex flex-col">
                  <div className="flex items-center h-8 px-2 py-0 font-normal rounded-sm cursor-default select-none !bg-transparent !hover:bg-transparent !focus:bg-transparent gap-2">
                    <Settings2 className="h-4 w-4 mr-2" />
                    View
                  </div>
                  <div className="border-b mb-1" />
                  {table
                    .getAllColumns()
                    .filter(
                      (column) =>
                        typeof column.accessorFn !== "undefined" && column.getCanHide()
                    )
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize !bg-transparent !hover:bg-transparent !focus:bg-transparent !active:bg-transparent text-foreground"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* Dialog for Add Problem */}
            <Dialog open={open} onOpenChange={setOpen}>
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
          </div>
          {/* Add Problem, Refresh, and View for md+ screens */}
          <div className="hidden md:flex items-center gap-2">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="h-8 w-8"
                  size="icon"
                  onClick={() => setOpen(true)}
                >
                  <Plus className="h-4 w-4 text-black" />
                  <span className="sr-only">Add Problem</span>
                </Button>
              </DialogTrigger>
              <Button onClick={refresh} size = "icon" className="h-8 w-8 gap-2">
                <RotateCcw className={`h-4 w-4 text-black ${isRefreshing ? "animate-spin" : ""}`} />
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
            {/* View button for desktop */}
            <DataTableViewOptions table={table} />
          </div>
        </div>
        {/* Hidden DataTableViewOptions trigger for mobile */}
        {viewOptionsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40" onClick={() => setViewOptionsOpen(false)}>
            <div className="bg-white rounded-lg p-4 w-64 max-w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center mb-2">
                <Settings2 className="mr-2 h-4 w-4" />
                <span className="font-semibold">Toggle columns</span>
              </div>
              <div className="flex flex-col gap-2">
                {table
                  .getAllColumns()
                  .filter(
                    (column) =>
                      typeof column.accessorFn !== "undefined" && column.getCanHide()
                  )
                  .map((column) => (
                    <label key={column.id} className="flex items-center gap-2 text-sm capitalize">
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={(e) => column.toggleVisibility(e.target.checked)}
                      />
                      {column.id}
                    </label>
                  ))}
              </div>
              <button className="mt-4 w-full py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm font-medium" onClick={() => setViewOptionsOpen(false)}>Close</button>
            </div>
          </div>
        )}
      </>
    )
}
