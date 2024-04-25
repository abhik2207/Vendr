import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ITEMS_PER_PAGE } from '../../../app/constants';
import { fetchAllOrdersAsync, selectAllOrders, selectTotalOrders, updateOrderAsync } from '../../order/orderSlice';
import { EyeIcon, PencilIcon, ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import Pagination from '../../common/Pagination';

function AdminOrders() {
    const [page, setPage] = useState(1);
    const dispatch = useDispatch();

    const orders = useSelector(selectAllOrders);
    const totalOrders = useSelector(selectTotalOrders);

    const [sort, setSort] = useState({});
    const [sortOrder, setSortOrder] = useState('asc');

    const [editableOrderId, setEditableOrderId] = useState(-1);

    const handlePage = (page) => {
        // console.log({ page });
        setPage(page);
    }

    const handleShow = (order) => {
        console.log(order);
    }

    const handleUpdateStatus = (e, order) => {
        const updatedOrder = { ...order, status: e.target.value };
        dispatch(updateOrderAsync(updatedOrder));
        setEditableOrderId(-1);
    }

    const handleEdit = (order) => {
        setEditableOrderId(order.id);
    }

    const chooseColor = (status) => {
        if (status === 'pending') {
            return 'bg-gray-200 text-gray-600';
        }
        else if (status === 'confirmed') {
            return 'bg-yellow-200 text-yellow-600';
        }
        else if (status === 'dispatched') {
            return 'bg-purple-200 text-purple-600';
        }
        else if (status === 'shipped') {
            return 'bg-blue-200 text-blue-600';
        }
        else if (status === 'delivered') {
            return 'bg-green-200 text-green-600';
        }
        else if (status === 'cancelled') {
            return 'bg-red-200 text-red-600';
        }
        else {
            return 'bg-gray-200 text-gray-600';
        }
    }

    const handleSort = (field, order) => {
        // const sortObject = sortOptions.order === 'desc' ? `-${sortOptions.sort}` : sortOptions.sort;
        // const newSort = { _sort: sortObject };
        // console.log('SO: ', sortOptions);
        // console.log('NS: ', newSort);

        // const sortObject = order === 'asc' ? field : `-${field}`;
        // const newSort = { _sort: sortObject };
        // console.log('SO: ', sortObject);
        // console.log('NS: ', newSort);

        if (order === 'asc') {
            console.log('asc wala block')
            const newSort = { _sort: field };
            console.log(newSort);
            setSort(newSort);
            setSortOrder('desc');
        }
        else if (order === 'desc') {
            console.log('desc wala block')
            const newSort = { _sort: `-${field}` };
            console.log(newSort);
            setSort(newSort);
            setSortOrder('asc');
        }
        else {
            console.log('Incorrect order');
        }
    }

    useEffect(() => {
        // -- My method -- 
        // const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };

        // -- Coder dost method -- 
        const pagination = { _page: page, _per_page: ITEMS_PER_PAGE };

        // Same for both
        console.log(pagination);
        dispatch(fetchAllOrdersAsync({ sort, pagination }));
    }, [dispatch, page, sort]);

    return (
        <div>
            <div className="overflow-x-auto mt-2">
                <div className="bg-gray-100 flex items-center justify-center font-sans overflow-hidden rounded-lg">
                    <div className="w-full">
                        <div className="bg-white shadow-md">
                            <table className="min-w-max w-full table-auto">
                                <thead>
                                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                        <th className="py-3 px-6 text-left cursor-pointer flex items-center" onClick={(e) => handleSort('id', sortOrder === 'asc' ? 'asc' : 'desc')}>Order ID {
                                            sort._sort === 'id' || sort._sort === '-id' ? (
                                                sortOrder === 'desc' ?
                                                    <ArrowDownIcon className='w-5 h-5 text-green-600 mb-1 ml-1' /> :
                                                    <ArrowUpIcon className='w-5 h-5 text-red-600 mb-1 ml-1' />
                                            ) : ''}</th>
                                        <th className="py-3 px-6 text-left">Items</th>
                                        <th className="py-3 px-6 text-center cursor-pointer flex items-center" onClick={(e) => handleSort('totalAmount', sortOrder === 'asc' ? 'asc' : 'desc')}>Amount {
                                            sort._sort === 'totalAmount' || sort._sort === '-totalAmount' ? (
                                                sortOrder === 'desc' ?
                                                    <ArrowDownIcon className='w-5 h-5 text-green-600 mb-1 ml-1' /> :
                                                    <ArrowUpIcon className='w-5 h-5 text-red-600 mb-1 ml-1' />
                                            ) : ''}</th>
                                        <th className="py-3 px-6 text-center">Mode</th>
                                        <th className="py-3 px-6 text-center">Shipping address</th>
                                        <th className="py-3 px-6 text-center">Status</th>
                                        <th className="py-3 px-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-600 text-sm font-light">
                                    {orders.map((order, index) => (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <span className="font-medium text-lg">#{order.id}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                {order.items.map((item, index) => (
                                                    <div key={index} className="flex items-center py-1">
                                                        <div className="mr-2">
                                                            <img
                                                                className="w-8 h-8 rounded-full"
                                                                src={item.thumbnail}
                                                                alt=""
                                                            />
                                                        </div>
                                                        <span className='font-medium'>{item.title} - ${item.price - Math.round(item.price * item.discountPercentage / 100)} - ({item.quantity})</span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <p className='text-md text-green-500 font-bold'>${order.totalAmount}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex items-center justify-center">
                                                    <p className='text-md text-blue-500 font-bold'>{order.selectedPaymentMode[0].toUpperCase() + order.selectedPaymentMode.slice(1)}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex items-center justify-center flex-col">
                                                    <p className='text-sm font-bold'>{order.selectedAddress.name}</p>
                                                    <p className='text-sm font-normal'>{order.selectedAddress.houseNumber} - {order.selectedAddress.locality}</p>
                                                    <p className='text-sm font-normal'>{order.selectedAddress.city} - {order.selectedAddress.state} - {order.selectedAddress.pinCode}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                {order.id === editableOrderId ?
                                                    (
                                                        <select name="status" id="status" onChange={e => handleUpdateStatus(e, order)} value={order.status}>
                                                            <option value="pending">Pending</option>
                                                            <option value="confirmed">Confirmed</option>
                                                            <option value="dispatched">Dispatched</option>
                                                            <option value="shipped">Shipped</option>
                                                            <option value="delivered">Delivered</option>
                                                            <option value="cancelled">Cancelled</option>
                                                        </select>
                                                    ) :
                                                    (
                                                        <span className={`${chooseColor(order.status)} font-medium py-1 px-3 rounded-full text-xs`}>
                                                            {order.status[0].toUpperCase() + order.status.slice(1)}
                                                        </span>
                                                    )}
                                            </td>
                                            <td className="py-3 px-6 text-center">
                                                <div className="flex item-center justify-center">
                                                    <div className="w-8 mr-2 transform hover:text-purple-500 hover:scale-120">
                                                        <button onClick={e => handleShow(order)} className='cursor-pointer'>
                                                            <EyeIcon className='w-6 h-6' />
                                                        </button>
                                                    </div>
                                                    <div className="w-8 mr-2 transform hover:text-purple-500 hover:scale-120">
                                                        <button onClick={e => handleEdit(order)} className='cursor-pointer'>
                                                            <PencilIcon className='w-6 h-6' />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <Pagination page={page} setPage={setPage} handlePage={handlePage} totalItems={totalOrders} />
            </div>
        </div>
    )
}

export default AdminOrders;
