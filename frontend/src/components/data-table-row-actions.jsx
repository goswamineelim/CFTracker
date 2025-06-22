import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash, ExternalLink } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check } from "lucide-react"
import { useTaskStore } from "../store/useTaskStore"

export function DataTableRowActions({ row }) {
  const data = row.original
  const markProblemAsSolved = useTaskStore(state => state.markProblemAsSolved);
  const deleteProblems = useTaskStore(state => state.deleteProblems);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open row menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="">
        <a
          href={data.problemLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer hover:bg-muted"
        >
          <ExternalLink className="h-4 w-4 text-gray-500 transition group-hover:translate-x-1 group-hover:text-blue-600" />
          Solve
        </a>
        <DropdownMenuItem onClick={() => markProblemAsSolved(row.original)}>
          <Check
            className={`text-emerald-500`}
            size={32}
            strokeWidth={2.5}
          />
          Mark As Solved
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log("Edit", data)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() =>  deleteProblems(row.original)}>
          <Trash className="mr-2 h-4 w-4 text-red-500" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
