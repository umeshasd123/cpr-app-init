
import { seReactTable, getCoreRowModel, flexRender, useReactTable, getFilteredRowModel } from "@tanstack/react-table";
import { useState } from "react";

export default function MetrixTable({ data, columns }) {
    const [globalFilter, setGlobalFilter] = useState("");
    // Initialize the table instance with data, columns, and row model
    const tableRef = useReactTable({
        data, // The data to be displayed in the table
        columns, // Column definitions
        state: {
            globalFilter
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(), // Method to compute rows based on core data
        getFilteredRowModel: getFilteredRowModel()
    });

    return (
        <div>
            <input type="text" value={globalFilter} placeholder="Search..."
                onChange={(e) => setGlobalFilter(e.target.value)}
                
                style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            />

            <table>
                <thead>
                    {tableRef.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th colSpan={header.colSpan} key={header.id}>
                                    {/* Render header content or leave blank if it's a placeholder */}
                                    {header.isPlaceholder ? null : flexRender(
                                        header.column.columnDef.header, // Header definition
                                        header.getContext() // Context for the header
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {/* Render table rows */}
                    {tableRef.getRowModel().rows.map((row) => (
                        <tr key={row.id}>{console.log(tableRef.getRowModel())}
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id}>
                                    {console.log(row.getVisibleCells())}
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
    );
}