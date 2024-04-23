import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLoggedInUserOrdersAsync, selectUserInfo, selectUserOrders } from '../userSlice';

export default function UserOrders() {
    const dispatch = useDispatch();
    const user = useSelector(selectUserInfo);
    const orders = useSelector(selectUserOrders);

    useEffect(() => {
        dispatch(fetchLoggedInUserOrdersAsync(user.id));
    }, [dispatch, user]);

    return (
        <div>
            <div className='flex flex-col w-full gap-5 py-5 px-2'>
                {orders.map((order, index) => (
                    <div key={index} className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 bg-white rounded-lg'>
                        <h2 className='text-4xl font-bold tracking-tight text-gray-900 pt-5 text-left'>Order number - #{order.id}</h2>
                        <h4 className='text-xl font-bold tracking-tight text-red-600 mb-5 text-left'>Order status - {order.status}</h4>
                        <div className="border-t border-gray-200 py-6 sm:px-0">
                            <div className="flow-root">
                                <ul className="-my-6 divide-y divide-gray-200">
                                    {order.items.map((item) => (
                                        <li key={item.id} className="flex py-6">
                                            <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>

                                            <div className="ml-4 flex flex-1 flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>
                                                            <a href={item.thumbnail}>{item.title}</a>
                                                        </h3>
                                                        <p className="ml-4">${item.price - Math.round((item.price * item.discountPercentage / 100))}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
                                                </div>
                                                <div className="flex flex-1 items-end justify-between text-sm">
                                                    <div className="text-gray-500">
                                                        <label htmlFor="quantity" className="inline mr-5 text-sm font-medium leading-6 text-gray-900">Qty: {item.quantity}</label>
                                                    </div>

                                                    <div className="flex">
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 py-2 sm:px-0">
                            <div className="flex justify-between text-base font-medium text-gray-900 my-1">
                                <p className='text-xl font-bold tracking-tight text-green-600'>Subtotal</p>
                                <p className='text-xl font-bold tracking-tight text-green-600'>${order.totalAmount}</p>
                            </div>
                            <div className="flex justify-between text-base font-medium text-gray-900 my-1">
                                <p className='text-lg font-bold tracking-tight text-green-600'>Total Items in Cart</p>
                                <p className='text-lg font-bold tracking-tight text-green-600'>{order.totalItems}</p>
                            </div>
                        </div>
                        <h4 className='border-t border-gray-200 text-xl font-bold tracking-tight text-blue-600 mt-2 pt-3 text-left'>Shipping Address</h4>
                        <div className="flex justify-between gap-x-6 py-1">
                            <div className="flex min-w-0 gap-x-4">
                                <div className="min-w-0 flex-auto">
                                    <p className="text-md font-semibold leading-6 text-gray-900">{order.selectedAddress.name}</p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">Phone: {order.selectedAddress.phone}</p>
                                    <p className="mt-1 truncate text-xs leading-5 text-gray-500">Email: {order.selectedAddress.email}</p>
                                </div>
                            </div>
                            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                <p className="text-sm leading-6 text-gray-700">{order.selectedAddress.houseNumber} - {order.selectedAddress.locality}</p>
                                <p className="text-sm leading-6 text-gray-500">{order.selectedAddress.city}</p>
                                <p className="text-sm leading-6 text-gray-500">{order.selectedAddress.state} - {order.selectedAddress.pinCode}</p>
                            </div>
                        </div>
                        <h4 className='border-t border-gray-200 text-xl font-bold tracking-tight text-blue-600 mt-2 pt-3 text-left'>Payment Mode</h4>
                        <h4 className='text-md font-semibold leading-6 text-gray-900 mb-5'>Payment via {order.selectedPaymentMode[0].toUpperCase() + order.selectedPaymentMode.slice(1)}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}
