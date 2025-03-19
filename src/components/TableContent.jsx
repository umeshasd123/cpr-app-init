import { useEffect, useMemo, useState } from "react"
import MetrixTable from "./MetrixTable";

export default function TableContent() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("mockData.json")
            .then((response) => response.json())
            .then((data) => {
                if (data && data !== '') {
                    setTimeout(() => {
                        setTableData(data);
                        setLoading(false)
                    }, 1000);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);

    const columns = useMemo(() => [
        {
            accessorKey: "name", // Accessor key for the "name" field from data object
            header: "Name", // Column header
        },
        {
            accessorKey: "category",
            header: "Category"
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: (info) => `#${info.getValue().toFixed(30)}`, // Format price as currency
        },
        {
            accessorKey: "inStock",
            header: "In Stock",
        },
    ]
    );

    //preloader
    if (loading) {
        return <p>Please wait. Data loading....</p>
    }
    return <MetrixTable data={tableData} columns={columns} />;

    // return (
    //     <div>
    //         {tableData.map(item => <p key={item.id}>{item.id + ' - ' + item.name}</p>)}
    //     </div>
    // )
}

/*import React, { useMemo, useState } from 'react';
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table';

function Table({ columns, data }) {
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow, state, setGlobalFilter,
    } = useTable({ columns, data }, useGlobalFilter, useFilters, useSortBy);

    const { globalFilter } = state;
    console.log(getTableProps(), headerGroups);
    return (
        <>
            <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    <span>
                                        {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                                    </span>
                                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map((cell) => (
                                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                ))}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </>
    );
}

// Global Filter Component
function GlobalFilter({ filter, setFilter }) {
    const [value, setValue] = useState(filter);
    const onChange = useAsyncDebounce((value) => {
        setFilter(value || undefined);
    }, 200);

    return (
        <span>
            Search:{' '}
            <input
                value={value || ''}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
            />
        </span>
    );
}

// Column Filter Component
function DefaultColumnFilter({ column: { filterValue, preFilteredRows, setFilter } }) {
    const count = preFilteredRows.length;

    return (
        <input
            value={filterValue || ''}
            onChange={(e) => {
                setFilter(e.target.value || undefined);
            }}
            placeholder={`Search ${count} records...`}
        />
    );
}

function App() {
    const data = useMemo(
        () => [
            { col1: 'Hello', col2: 'World', col3: 1 },
            { col1: 'React', col2: 'Table', col3: 2 },
            { col1: 'Filter', col2: 'Sort', col3: 3 },
            { col1: 'Search', col2: 'Global', col3: 4 },
        ],
        []
    );

    const columns = useMemo(
        () => [
            {
                Header: 'Column 1',
                accessor: 'col1',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Column 2',
                accessor: 'col2',
                Filter: DefaultColumnFilter,
            },
            {
                Header: 'Column 3',
                accessor: 'col3',
                Filter: DefaultColumnFilter,
                filter: 'equals',
            },
        ],
        []
    );

    return <Table columns={columns} data={data} />;
}

export default App;*/