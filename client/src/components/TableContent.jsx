import { useEffect, useState } from "react"
import MetrixTable from "./MetrixTable";
import '../assets/styles/TableContent.css';
import useMetrixModel from "./tableConfig";

export default function TableContent() {
    const [tableData, setTableData] = useState([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        fetch("http://localhost:5000/metrix-data")
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

    const columns = useMetrixModel();

    //preloader
    if (isLoading) {
        return <p className="loader">Please wait. Data loading....</p>
    }

    return <MetrixTable data={tableData} columns={columns} />;
}