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
            size: 10,
            header: ({ table }) => {
                const selectableRows = table.getRowModel().rows.filter(
                    (row) => row.original.status === "failed" || row.original.status === 'FAILD'
                );
                const allSelected = selectableRows.every((row) => row.getIsSelected());
                return <input type="checkbox" checked={allSelected} onChange={(e) => {
                    selectableRows.forEach((row) => row.toggleSelected(e.target.checked));
                }} />
            },
            cell: ({ row }) => {
                const statusVal = row.original['STATUS'] ?? '';
                if (statusVal === 'failed' || statusVal === 'FAILD') {
                    return <input type="checkbox" checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()} />
                }
            },
        }, {
            accessorKey: "REF_ID", // Accessor key for the "name" field from data object
            header: "Ref ID", // Column header
            enableFilter: true,
            size: 80,
            filterFn: numberFilter
        }, {
            accessorKey: "DESCRIPTION",
            header: "Description",
            enableFilter: true,
            size: 250
        }, {
            accessorKey: "EVENT_ID",
            header: "Event ID",
            size: 70
        }, {
            accessorKey: "CREATIONDATE",
            header: "Creation Date",
            size: 100
        }, {
            accessorKey: "SOURCE_NAME",
            header: "Source Name",
            size: 200,
            enableFilter: true,
        }, {
            accessorKey: "STATUS",
            header: "Status",
            enableFilter: true,
            filterType: 'select',
            filterOptions: ['initiated', 'successful', 'failed', 'error', 'retry', 'transformation'],
            cell: ({ getValue }) => {
                const status = getValue();
                const color = { failed: 'red', error: 'red', successful: 'green' }[status] || '#cf5700';
                return <span style={{ color }}>{status}</span>;
            }
        }, {
            accessorKey: "MESSAGE_TYPE",
            header: "Message Type",
            size: 100,
            enableFilter: true,
        }, {
            accessorKey: "PRIMARY_FINDER",
            header: "Primary Finder",
            size: 100
        }, {
            accessorKey: "SECONDARY_FINDER",
            header: "Secondary Finder",
            size: 100
        }, {
            accessorKey: "TERTIORY_FINDER",
            header: "Tertiory Finder",
            size: 100
        }, {
            accessorKey: "HOST_NAME",
            header: "Host Name",
            size: 150
        }, {
            accessorKey: "actions", // Accessor key for the "name" field from data object
            header: "", // Column header
            size: 60,
            cell: ({ row }) => {
                const statusVal = row.original['STATUS'] ?? '';
                if (statusVal === 'failed' || statusVal === 'FAILD') {
                    return <button className="action-btn" onClick={() => handleResend(row)}>Retry</button>
                }
            }
        },
    ], [handleResend]);
}

export default useMetrixModel;