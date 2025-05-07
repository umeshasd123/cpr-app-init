
import { getCoreRowModel, flexRender, useReactTable, getFilteredRowModel, getSortedRowModel, getExpandedRowModel } from "@tanstack/react-table";
import React, { useCallback, useMemo, useState } from "react";
import SearchableDomainsTable from "./SearchableDomainsTable";

export default function MetrixTable({ data, columns, resendAction, fetchData, params, setParams, expandedData, onRowExpand }) {
    const [sorting, setSorting] = useState([]);
    const [rowSelection, setRowSelection] = useState({});
    const [expanded, setExpanded] = useState({});
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
    const [searchParams, setSearchParams] = useState(params);

    const totalPages = Math.ceil(params.total / params.limit);

    const pageLimitArray = [20, 30, 50, 80, 100];

    // Initialize the table instance with data, columns, and row model
    const tableRef = useReactTable({
        data, // The data to be displayed in the table
        columns, // Column definitions
        state: {
            sorting,
            rowSelection,
            expanded
        },
        getCoreRowModel: getCoreRowModel(), // Method to compute rows based on core data
        getFilteredRowModel: getFilteredRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onRowSelectionChange: setRowSelection,
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,

        manualPagination: true,
        pageCount: totalPages,
        getSubRows: row => row.subRows || []
    });

    /* It collects the selected rows */
    const selectedRows = tableRef.getRowModel().rows.filter((row) => row.getIsSelected());

    // const resetFilters = () => {
    //     return tableRef.resetColumnFilters()
    // }

    /* This function collects the selected rows and calls the resendAction function with their IDs */
    function resendHandle() {
        const selectedIds = selectedRows.map(i => i.original.ref_id);
        resendAction(selectedIds)
    }

    /* Handle search action
     It updates the search parameters and fetches data if on the first page*/
    const handleSearch = () => {
        setParams(prev => ({ ...prev, page: 1 }))// Reset to the first page
        if (params.page === 1) {
            fetchData(); // Fetch data only if on the first page            
        }
        setShowAdvancedSearch(false); // Hide the advanced search dropdown after search
        setSearchParams(params);
    };

    /* This function resets the advanced filter parameters to their initial state  */
    const resetAdvancedFilter = () => {
        setParams(prev => ({ ...prev, status: '', type: '', fromDate: '', toDate: '' }));
    }

    return (
        <div>
            <div className="table-top">
                <div className="table-top-left">
                    <div className="search">
                        <input type="text" value={params.search} placeholder="Search..." className="global-search"
                            onChange={(e) => setParams(prev => ({ ...prev, search: e.target.value }))} />
                        <button className="adv-search-btn" type="button" onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}></button>
                        {showAdvancedSearch && (
                            <div className="advanced-search-dropdown">
                                <div className="filter-group">
                                    <label className="filter-label">Status:</label>
                                    <select className="filter-input" onChange={(e) => setParams(prev => ({ ...prev, status: e.target.value }))} value={params?.status}>
                                        <option value="">All</option>
                                        <option value="initiated">initiated</option>
                                        <option value="failed">failed</option>
                                        <option value="successful">successful</option>
                                        <option value="error">error</option>
                                        <option value="retry">retry</option>
                                        <option value="transformation">Transformation</option>
                                    </select>
                                </div>
                                <div className="filter-group">
                                    <label className="filter-label">Message Type</label>
                                    <select className="filter-input" onChange={(e) => setParams(prev => ({ ...prev, type: e.target.value }))} value={params?.type}>
                                        <option value="">All</option>
                                        <option value="">Type 1</option>
                                        <option value="">Type 2</option>
                                    </select>
                                </div>
                                <div className="filter-group-wrap">
                                    <div className="filter-group">
                                        <label className="filter-label">Date From</label>
                                        <input type="date" id="from-date"
                                            onChange={(e) => setParams(prev => ({ ...prev, fromDate: e.target.value }))} value={params?.fromDate || ""}
                                            max={params.toDate || ""} />
                                    </div>
                                    <div className="filter-group">
                                        <label htmlFor="to-date">To </label>
                                        <input type="date" id="to-date"
                                            onChange={(e) => setParams(prev => ({ ...prev, toDate: e.target.value }))} value={params?.toDate || ""}
                                            min={params.fromDate || ""} />
                                    </div>
                                </div>
                                <div className="button-group">
                                    <button onClick={resetAdvancedFilter} type="button">Clear</button>
                                    <button onClick={handleSearch} type="button" className="primary">Search</button>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="reset-btn" type="button" onClick={handleSearch}>Search</button>
                    {/* <button className="reset-btn" type="button" onClick={resetFilters}>Reset Filter</button> */}
                </div>
                <div className="tags">
                    {Object.entries(searchParams)?.map(([key, value]) => {
                        if (!['page', 'limit', 'total', 'search'].includes(key) && searchParams[key] !== '') {
                            return (<span key={key}>{key + ': ' + value}</span>);
                        }
                        return null;
                    })}
                </div>

                <button className="act-btn" type="button" onClick={resendHandle} disabled={!selectedRows?.length}>Retry</button>
            </div>

            <div className="table-wrapper">
                <table className="metrix-table" cellPadding='0' cellSpacing='0'>
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
                                {/* <tr className="column-filter-wrap">
                                    {headerGroup.headers.map((header) => (
                                        <td colSpan={header.colSpan} key={header.id}>
                                            <ColFilter columnRef={header} />
                                        </td>
                                    ))}
                                </tr> */}
                            </React.Fragment>
                        ))}
                    </thead>
                    <tbody>
                        {/* Render table rows */}
                        {tableRef.getRowModel().rows.map((row) => (
                            <React.Fragment key={row.id}>
                                <tr>
                                    {row.getVisibleCells().map((cell, i) => (
                                        <td key={i}>
                                            {cell.column.id === 'expander' ?
                                                <button
                                                    className={`expand-btn ${row.getIsExpanded() ? 'expanded' : ''}`}
                                                    onClick={() => {
                                                        row.toggleExpanded();
                                                        if (!row.getIsExpanded()) {
                                                            onRowExpand(row.original.ref_id)
                                                        }
                                                    }}>
                                                    {row.getIsExpanded() ? '-' : '+'}
                                                </button> : flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                        </td>
                                    ))}
                                </tr>
                                {row.getIsExpanded() && (
                                    <tr>
                                        <td colSpan={tableRef.getVisibleFlatColumns().length}>
                                            <div className="expanded-area">
                                                <strong>Searchable Domains</strong>
                                                <SearchableDomainsTable data={expandedData[row.original.ref_id]}/>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Table Footer */}
            <div className="table-footer">
                <div className="table-info">
                    <select value={params.limit} onChange={(e) => setParams(prev => ({ ...prev, limit: e.target.value }))}>
                        {pageLimitArray.map((size) => (<option key={size} value={size}>Show {size}</option>))}
                    </select>
                    <p>Showing {(params.page - 1) * params.limit + 1} to {Math.min(params.page * params.limit, totalPages * params.limit)} of {totalPages * params.limit} entries</p>
                </div>

                <Pagination {...params} setParams={setParams} totalPages={totalPages} />
            </div>

        </div >
    );
}

/* This function handles the column filter for the table. It checks if the column has a filter 
enabled and renders the appropriate filter input based on the filter type. */
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

/* Pagination component to handle page navigation and display */
const Pagination = ({ page, setParams, totalPages }) => {
    const MAX_PAGE_DISPLAY = 12;
    const createPageArray = useCallback(() => {
        if (totalPages <= MAX_PAGE_DISPLAY) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const pages = [1];
        const leftEdge = MAX_PAGE_DISPLAY - 4;
        const rightEdge = totalPages - leftEdge;

        if (page <= leftEdge) {
            pages.push(...Array.from({ length: MAX_PAGE_DISPLAY - 3 }, (_, i) => i + 2));
            pages.push("ellipsis");
        } else if (page >= rightEdge) {
            pages.push("ellipsis");
            pages.push(...Array.from({ length: MAX_PAGE_DISPLAY - 3 }, (_, i) => totalPages - (MAX_PAGE_DISPLAY - 3) + i));
        } else {
            pages.push("ellipsis");
            pages.push(...Array.from({ length: 7 }, (_, i) => page - 3 + i));
            pages.push("ellipsis");
        }

        pages.push(totalPages);
        return pages;
    }, [page, totalPages]);

    const pages = useMemo(() => createPageArray(), [createPageArray]);

    const handlePageChange = useCallback((newPage) => {
        setParams(prev => ({ ...prev, page: newPage }));
    }, [setParams]);

    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;

    return (
        <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={isFirstPage}>{'<'}</button>
            {pages.map((item, index) => (
                item === "ellipsis" ? (
                    <span key={`ellipsis-${index}`} className="ellipsis">...</span>
                ) : (
                    <button
                        key={`page-${item}`}
                        onClick={() => handlePageChange(item)}
                        disabled={page === item}
                        className={page === item ? "active" : undefined}
                    >
                        {item}
                    </button>
                )
            ))}
            <button onClick={() => handlePageChange(page + 1)} disabled={isLastPage}>{'>'}</button>
        </div>
    );
};

