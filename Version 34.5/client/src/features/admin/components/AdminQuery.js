import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllQueriesAsync, selectAllQueries } from '../../query/querySlice';

function AdminQuery() {
    const dispatch = useDispatch();
    const queries = useSelector(selectAllQueries);

    useEffect(() => {
        dispatch(fetchAllQueriesAsync());
    }, [dispatch]);

    return (
        <div>
            <div className="overflow-x-auto mt-2">
                <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden rounded-lg">
                    <div className="w-full">
                        <div className="bg-white shadow-md">
                            <table className="w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-3 text-left w-1/3">Email address</th>
                                        <th className="py-3 px-3 text-left w-2/3">Query</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {queries.map((queryIterator, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-3 text-left whitespace-nowrap w-1/3">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-md">{queryIterator.userEmail}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-left  w-2/3">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-md">{queryIterator.query}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminQuery;
