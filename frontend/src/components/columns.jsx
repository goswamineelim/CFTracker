// columns.jsx or columns.tsx

import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns = [
  {
    accessorKey: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {row.original.contestID + row.original.problemIndex}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-[500px] truncate font-medium">
          {row.getValue("name")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "problemState",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const state = row.getValue("problemState")
      const isSolved = state === "solved"

      return (
        <Badge variant={isSolved ? "default" : "outline"}>
          {isSolved ? "Solved" : "Unsolved"}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
    enableColumnFilter: true,
    enableSorting: true,
  },
  {
    accessorKey: "tags",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tags" />
    ),
    cell: ({ row }) => {
      const tags = row.getValue("tags") ?? []
      return (
        <div className="flex flex-wrap gap-1 max-w-[300px]">
          {tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, filterValue) => {
      const tags = row.getValue(id) ?? []
      return filterValue.some((value) => tags.includes(value))
    },
    enableColumnFilter: true,
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
