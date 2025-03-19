import { useMemo } from "react";

// Custom filter for number columns
const numberFilter = (row, columnId, filterValue) => {
    const rowValue = row.getValue(columnId);
    if (filterValue === "") return true;
    return rowValue !== undefined && rowValue.toString().includes(filterValue);
};

const useMetrixModel = () => {
    return useMemo(() => [
        {
            id: 'select',
            size: 20,
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllPageRowsSelected()}
                    onChange={table.getToggleAllPageRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
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
            filterOptions: ['initiated', 'successful', 'failed'],
            cell: ({ getValue }) => {
                const status = getValue();
                const color = status === 'failed' ? 'red' : status === 'successful' ? 'green' : '#cf5700';
                return <span style={{ color }}>{status}</span>;
            }
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
            size: 250
        }, {
            accessorKey: "message_type",
            header: "Message Type",
            size: 100,
            enableFilter: true,
        }
    ], []
    );
}

export default useMetrixModel;