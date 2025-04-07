import { useMemo } from "react";

// Custom filter for number columns
const numberFilter = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);
    if (filterValue === "") return true;
    return rowValue !== undefined && rowValue.toString().includes(filterValue);
};

const useMetrixModel = (handleResend) => {
    return useMemo(() => [
        {
            id: 'expander', // Use an expander column
            header:'',
            size: 20,
        },
        {
            id: 'select',
            size: 20,
            header: ({ table }) => {
                const selectableRows = table.getRowModel().rows.filter(
                    (row) => row.original.status === "failed"
                );
                const allSelected = selectableRows.every((row) => row.getIsSelected());
                return <input type="checkbox" checked={allSelected} onChange={(e) => {
                    selectableRows.forEach((row) => row.toggleSelected(e.target.checked));
                }} />
            },
            cell: ({ row }) => {
                const statusVal = row.original['status'] ?? '';
                if (statusVal === 'failed') {
                    return <input type="checkbox" checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()} />
                }
            },
        }, {
            accessorKey: "ref_id", // Accessor key for the "name" field from data object
            header: "Ref ID", // Column header
            enableFilter: true,
            size: 80,
            filterFn: numberFilter
        }, {
            accessorKey: "description",
            header: "Description",
            enableFilter: true,
            size: 250
        }, {
            accessorKey: "event_id",
            header: "Event ID",
            size: 70
        }, {
            accessorKey: "creationdate",
            header: "Creation Date",
            size: 100
        }, {
            accessorKey: "source_name",
            header: "Source Name",
            size: 200,
            enableFilter: true,
        }, {
            accessorKey: "status",
            header: "Status",
            enableFilter: true,
            filterType: 'select',
            filterOptions: ['initiated', 'successful', 'failed', 'error', 'retry'],
            cell: ({ getValue }) => {
                const status = getValue();
                const color = { failed: 'red', error: 'red', successful: 'green' }[status] || '#cf5700';
                return <span style={{ color }}>{status}</span>;
            }
        }, {
            accessorKey: "message_type",
            header: "Message Type",
            size: 100,
            enableFilter: true,
        }, {
            accessorKey: "primary_finder",
            header: "Primary Finder",
            size: 100
        }, {
            accessorKey: "secondary_finder",
            header: "Secondary Finder",
            size: 100
        }, {
            accessorKey: "tertiory_finder",
            header: "Tertiory Finder",
            size: 100
        }, {
            accessorKey: "host_name",
            header: "Host Name",
            size: 150
        }, {
            accessorKey: "actions", // Accessor key for the "name" field from data object
            header: "", // Column header
            size: 60,
            cell: ({ row }) => {
                const statusVal = row.original['status'] ?? '';
                if (statusVal === 'failed') {
                    return <button className="action-btn" onClick={() => handleResend(row)}>Retry</button>
                }
            }
        },
    ], [handleResend]);
}

export default useMetrixModel;