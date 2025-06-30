import { Badge } from "@/components/ui/badge"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

export const columns = [
  {
    accessorKey: "ID",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => {
      const { contestID, problemIndex } = row.original || {}
      return (
        <div className="w-20 md:w-24">
          {contestID}{problemIndex}
        </div>
      )
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="flex space-x-2">
        <span className="max-w-xs md:max-w-lg truncate font-medium">
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
        <div className="flex flex-wrap gap-1 max-w-xs md:max-w-md">
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
    accessorKey: "problemRating",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Rating" />
    ),
    cell: ({ row }) => {
      const rating = row.getValue("problemRating");

      const getRatingClass = (rating) => {
        if (!rating) return "text-gray-500"; // unrated
        if (rating < 1200) return "text-gray-600";     // Newbie
        if (rating < 1400) return "text-green-600";    // Pupil
        if (rating < 1600) return "text-cyan-600";     // Specialist
        if (rating < 1900) return "text-blue-600";     // Expert
        if (rating < 2100) return "text-purple-700";   // Candidate Master
        if (rating < 2300) return "text-orange-600";   // Master
        if (rating < 2400) return "text-orange-500";   // IM
        if (rating < 2600) return "text-red-600";      // GM
        if (rating < 3000) return "text-red-700";      // IGM
        return "text-red-900";                         // LGM
      };

      const colorClass = getRatingClass(rating);

      return (
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md border border-gray-300 ${colorClass}`}>
          {rating ? rating : "Unrated"}
        </span>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
