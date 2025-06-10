import '../assets/styles/SearchableDomainsTable.css';
import {dateConverter} from '../utils/index.js';

export default function SearchableDomainsTable({ data }) {
    return (
        <div className="expanded-table">
            {(data && data?.length > 0) ?
                <table cellPadding='0' cellSpacing='0'>
                    <thead>
                        <tr>
                            <th>Search Id</th>
                            <th>Unique Identifier</th>
                            <th>Item Name</th>
                            <th>Item Value</th>
                            <th>Primary Type</th>
                            <th>Item Order</th>
                            <th>Insertion Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((obj, i) => (
                            <tr key={i}>
                                <td>{obj['SEARCH_ID']}</td>
                                <td>{obj['UNIQUE_IDENTIFIER']}</td>
                                <td>{obj['ITEM_NAME']}</td>
                                <td>{obj['ITEM_VALUE']}</td>
                                <td>{obj['PRIMARY_TYPE']}</td>
                                <td>{obj['ITEM_ORDER']}</td>
                                <td>{dateConverter(obj['INSERTION_TIME'])}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            : 'Loading...'}
        </div>
    )
}