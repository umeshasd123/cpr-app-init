
import { getCoreRowModel, flexRender, useReactTable, getFilteredRowModel, getSortedRowModel } from "@tanstack/react-table";
import React, { useState } from "react";

export default function MetrixTable({ data, columns }) {
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});

    // Initialize the table instance with data, columns, and row model
    const tableRef = useReactTable({
        data, // The data to be displayed in the table
        columns, // Column definitions
        state: {
            globalFilter,
            sorting,
            rowSelection
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(), // Method to compute rows based on core data
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
    });

    const selectedRows = tableRef.getRowModel().rows.filter((row) => row.getIsSelected());
    const resendAction = () => alert(selectedRows.map(i => i.original.ref_id).join(','));
    const resetFilters = () => {
        console.log(tableRef);
        return tableRef.resetColumnFilters()
    }

    return (
        <div>
            <div className="table-top">
                <div className="search">
                    <input type="text" value={globalFilter} placeholder="Search..." className="global-search"
                        onChange={(e) => setGlobalFilter(e.target.value)} />
                    <button className="reset-btn" type="button" onClick={resetFilters}>Reset Filter</button>
                </div>
                <button className="act-btn" type="button" onClick={resendAction} disabled={!selectedRows?.length}>Resend</button>
            </div>

            <div className="table-wrapper">
                <table className="metrix-table">
                    <thead>
                        {tableRef.getHeaderGroups().map((headerGroup) => (
                            <React.Fragment key={headerGroup.id}>
                                <tr>
                                    {headerGroup.headers.map((header) => (
                                        <th colSpan={header.colSpan} key={header.id}
                                            onDoubleClick={header.column.getToggleSortingHandler()}
                                            style={{ minWidth: `${header.getSize()}px` }}
                                            className={{ asc: "order-asc", desc: "order-dsc" }[header.column.getIsSorted()] ?? null}>
                                            {/* Render header content or leave blank if it's a placeholder */}
                                            {header.isPlaceholder ? null : flexRender(
                                                header.column.columnDef.header, // Header definition
                                                header.getContext() // Context for the header
                                            )}
                                        </th>
                                    ))}
                                </tr>
                                <tr className="column-filter-wrap">
                                    {headerGroup.headers.map((header) => (
                                        <td colSpan={header.colSpan} key={header.id}>
                                            <ColFilter columnRef={header} />
                                        </td>
                                    ))}
                                </tr>
                            </React.Fragment>
                        ))}
                    </thead>
                    <tbody>
                        {/* Render table rows */}
                        {tableRef.getRowModel().rows.map((row) => (
                            <tr key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id}>
                                        {/* Render each cell's content */}
                                        {flexRender(
                                            cell.column.columnDef.cell, // Cell definition
                                            cell.getContext() // Context for the cell
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const ColFilter = ({ columnRef }) => {
    const header = columnRef;
    const filterType = header.column.columnDef.filterType;
    if (header.column.columnDef.enableFilter) {
        let result;
        switch (filterType) {
            case 'select': {
                const options = header.column.columnDef.filterOptions ?? [];
                result = <select onChange={(e) => header.column.setFilterValue(e.target.value)}                        >
                    <option value="">All</option>
                    {options.map((optVal, i) => <option key={i} value={optVal}>{optVal.charAt(0).toUpperCase() + optVal.slice(1)}</option>)}
                </select>;
                break;
            }

            default:
                result = <input type="text" placeholder={`Search ${header.column.columnDef.header}`}
                    value={(header.column.getFilterValue()) ?? ""}
                    onChange={(e) => header.column.setFilterValue(e.target.value)}
                />
        }
        return result;
    } else {
        return null
    }

}