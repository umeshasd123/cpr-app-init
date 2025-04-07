import { useEffect, useState } from "react"
import MetrixTable from "./MetrixTable";
import '../assets/styles/TableContent.css';
import useMetrixModel from "./tableConfig";

export default function TableContent() {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [searchParams, setParams] = useState({
        search: '', //The search query string.
        page: 1, //The current page number.
        limit: 20, //The number of items per page.
        total: 0 //The total number of records available.
    });
    const [expandedData, setExpandedData] = useState({});
    
    const columns = useMetrixModel(handleResend);

    // This function is called to fetch data from the server.
    const fetchData = async () => {
        setLoading(true);
        const params = new URLSearchParams({ ...searchParams });
        fetch(`http://localhost:5000/metrix-data?${params}`)
            .then((response) => response.json())
            .then((data) => {
                if (data && data !== '') {
                    setTimeout(() => {
                        setTableData(data.data);
                        setParams(prev => ({ ...prev, total: data.total }));
                        setLoading(false)
                    }, 100);
                }
            })
            .catch((error) => console.error("Error fetching data:", error));
    };

    useEffect(() => {
        fetchData();
    }, [searchParams.page, searchParams.limit]);

     // This is loading state that shows a message while data is being fetched.
    if (isLoading) {
        return <p className="loader">Please wait. Data loading....</p>
    }

    // This function is called when a row is expanded to fetch additional data for that row.
    const handleRowExpand = async (refId) => {
        if (expandedData[refId]) return;
        try {
            const response = await fetch(`http://localhost:5000/api/getattributes?refId=${refId}`);
            const ref_id_obj = await response.json();
            
            if (response.ok) {
                console.log(expandedData);
                setExpandedData(prev => ({ ...prev, [refId]: JSON.stringify(ref_id_obj) }));
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    }

    return <MetrixTable
        data={tableData}
        columns={columns}
        resendAction={resendAction}
        fetchData={fetchData}
        params={searchParams}
        setParams={setParams}
        expandedData={expandedData}
        onRowExpand={handleRowExpand} />;
}


function handleResend(rowData) {
    const refId = rowData.original['ref_id'];
    resendAction([refId])
}

/* Function to handle resend action
 This function sends a POST request to the server with the selected IDs.*/
async function resendAction(selectedIds) {
    console.log(selectedIds);
    if (Array.isArray(selectedIds) && selectedIds.length > 0) {
        try {
            const response = await fetch("http://localhost:5000/api/resend", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(selectedIds),
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data);
                alert(data.message);
            } else {
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Request failed:", error);
        }
    }
}