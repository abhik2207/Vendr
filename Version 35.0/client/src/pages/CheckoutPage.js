import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { deleteItemFromCartAsync, selectItems, updateCartAsync } from '../features/cart/cartSlice';
import { useForm } from 'react-hook-form';
import { updateUserAsync } from '../features/user/userSlice';
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../features/order/orderSlice';
import { selectUserInfo } from '../features/user/userSlice';

import Modal from '../features/common/Modal';
import { MutatingDots } from 'react-loader-spinner';

function CheckoutPage() {
    const dispatch = useDispatch();

    // eslint-disable-next-line no-unused-vars
    const [open, setOpen] = useState(true);
    const [openModal, setOpenModal] = useState(null);

    const currentOrder = useSelector(selectCurrentOrder);
    const loadingStatus = useSelector(selectOrderStatus);

    const items = useSelector(selectItems);
    const totalAmount = items.reduce((amount, item) => {
        let itemPrice = item.product.discountedPrice;
        return itemPrice * item.quantity + amount;
    }, 0);
    const totalItems = items.reduce((total, item) => item.quantity + total, 0);

    const handleQuantity = (e, item) => {
        dispatch(updateCartAsync({ id: item.id, quantity: +e.target.value }));
    }
    const handleRemove = (e, itemId) => {
        dispatch(deleteItemFromCartAsync(itemId));
    }

    // eslint-disable-next-line no-unused-vars
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const userInfo = useSelector(selectUserInfo);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cash');

    const handleAddress = (e) => {
        setSelectedAddress(userInfo.addresses[e.target.value]);
    }
    const handlePaymentMethod = (e) => {
        setSelectedPaymentMethod(e.target.value);
    }

    const handleOrder = () => {
        const order = {
            items: items,
            totalAmount: totalAmount,
            totalItems: totalItems,
            user: userInfo.id,
            selectedPaymentMode: selectedPaymentMethod,
            selectedAddress: selectedAddress,
            status: 'pending'
        };
        dispatch(createOrderAsync(order));
    }

    return (
        <>
            {!items.length && <Navigate to='/' replace={true} />}
            {currentOrder && currentOrder.selectedPaymentMode === 'cash' && <Navigate to={`/order-success/${currentOrder.id}`} replace={true} />}
            {/* {currentOrder && currentOrder.selectedPaymentMode==='card' && <Navigate to={`/order-success/${currentOrder.id}`} replace={true} />} */}
            {/* {currentOrder && currentOrder.selectedPaymentMode==='card' && <Navigate to={`/stripe-checkout`} replace={true} />} */}
            {currentOrder && currentOrder.selectedPaymentMode === 'card' && <Navigate to={`/payment-gateway`} replace={true} />}

            {userInfo && <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {loadingStatus === 'loading' &&
                    <div className='w-full flex justify-center items-center'>
                        <MutatingDots
                            visible={true}
                            height="100"
                            width="100"
                            color="#4464f2"
                            secondaryColor="#4464f2"
                            radius="12.5"
                            ariaLabel="mutating-dots-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                        />'
                    </div>}
                {loadingStatus === 'idle' && <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                    <div className='lg:col-span-3'>
                        <form noValidate className='bg-white px-5 my-6 py-6 rounded-lg' onSubmit={handleSubmit((data) => {
                            dispatch(updateUserAsync({ ...userInfo, addresses: [...userInfo.addresses, data] }));
                            reset();
                        })}>
                            <div className="space-y-12">
                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-3xl font-semibold leading-7 text-gray-900">Personal Information</h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">Use a permanent address where you can receive mail.</p>

                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                        <div className="sm:col-span-6">
                                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                                                Full name
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('name', { required: 'Please enter your name' })}
                                                    id="name"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                                Email address
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="email"
                                                    {...register('email', { required: 'Please enter your email address' })}
                                                    type="email"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                                                Phone number
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    id="phone"
                                                    {...register('phone', { required: 'Please enter your email address' })}
                                                    type="tel"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="houseNumber" className="block text-sm font-medium leading-6 text-gray-900">
                                                House Number
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('houseNumber', { required: 'Please enter your house number' })}
                                                    id="houseNumber"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-3">
                                            <label htmlFor="locality" className="block text-sm font-medium leading-6 text-gray-900">
                                                Locality
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('locality', { required: 'Please enter your Locality' })}
                                                    id="locality"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2 sm:col-start-1">
                                            <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">
                                                City
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('city', { required: 'Please enter your country' })}
                                                    id="city"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">
                                                State / Province
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('state', { required: 'Please enter your state' })}
                                                    id="state"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label htmlFor="pinCode" className="block text-sm font-medium leading-6 text-gray-900">
                                                PIN / Postal code
                                            </label>
                                            <div className="mt-2">
                                                <input
                                                    type="text"
                                                    {...register('pinCode', { required: 'Please enter your PIN code' })}
                                                    id="pinCode"
                                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-end gap-x-6">
                                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900 px-3 py-2 rounded-md bg-gray-100">
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                    >
                                        Add address
                                    </button>
                                </div>

                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-base font-semibold leading-7 text-gray-900">Address</h2>
                                    <p className="mt-1 text-sm leading-6 text-gray-600">
                                        Choose from existing saved addresses.
                                    </p>

                                    <ul className="divide-y divide-gray-300">
                                        {userInfo.addresses.map((address, index) => (
                                            <li key={index} className="flex justify-between gap-x-6 py-5">
                                                <div className="flex min-w-0 gap-x-4">
                                                    <input
                                                        id={address.city}
                                                        name="address"
                                                        type="radio"
                                                        onChange={handleAddress}
                                                        value={index}
                                                        className="h-4 w-4 border-gray-400 text-indigo-600 focus:ring-indigo-600 mt-1 cursor-pointer"
                                                    />
                                                    <div className="min-w-0 flex-auto">
                                                        <p className="text-sm font-semibold leading-6 text-gray-900">{address.name}</p>
                                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">Phone: {address.phone}</p>
                                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">Email: {address.email}</p>
                                                    </div>
                                                </div>
                                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                                    <p className="text-sm leading-6 text-gray-700">{address.houseNumber} - {address.locality}</p>
                                                    <p className="text-sm leading-6 text-gray-500">{address.city}</p>
                                                    <p className="text-sm leading-6 text-gray-500">{address.state} - {address.pinCode}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-10 space-y-10">
                                        <fieldset>
                                            <legend className="text-sm font-semibold leading-6 text-gray-900">Payment Method</legend>
                                            <p className="mt-1 text-sm leading-6 text-gray-600">Choose how you would like to pay.</p>
                                            <div className="mt-6 space-y-6">
                                                <div className="flex items-center gap-x-3">
                                                    <input
                                                        id="cash"
                                                        name="payment"
                                                        type="radio"
                                                        onChange={handlePaymentMethod}
                                                        value='cash'
                                                        checked={selectedPaymentMethod === 'cash'}
                                                        className="h-4 w-4 border-gray-400 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                                    />
                                                    <label htmlFor="cash" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Cash Payment
                                                    </label>
                                                </div>
                                                <div className="flex items-center gap-x-3">
                                                    <input
                                                        id="card"
                                                        name="payment"
                                                        type="radio"
                                                        onChange={handlePaymentMethod}
                                                        value='card'
                                                        checked={selectedPaymentMethod === 'card'}
                                                        className="h-4 w-4 border-gray-400 text-indigo-600 focus:ring-indigo-600 cursor-pointer"
                                                    />
                                                    <label htmlFor="card" className="block text-sm font-medium leading-6 text-gray-900">
                                                        Card Payment
                                                    </label>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>


                        </form>
                    </div>
                    <div className='lg:col-span-2'>
                        <div className='mx-auto m-6 max-w-7xl px-4 sm:px-0 lg:px-0 bg-white rounded-lg'>
                            <h2 className='text-3xl font-bold tracking-tight text-gray-900 pt-5 text-left mx-4'>Cart</h2>
                            <p className="mt-1 text-xs leading-6 text-gray-600 px-4 mb-5">Review your cart for one last time</p>
                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                <div className="flow-root">
                                    <ul className="-my-6 divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <li key={item.id} className="flex py-6">
                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                    <img
                                                        src={item.product.thumbnail}
                                                        alt={item.product.title}
                                                        className="h-full w-full object-cover object-center"
                                                    />
                                                </div>

                                                <div className="ml-4 flex flex-1 flex-col">
                                                    <div>
                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                            <h3>
                                                                <a href={item.product.thumbnail}>{item.product.title}</a>
                                                            </h3>
                                                            <p className="ml-4">${item.product.discountedPrice}</p>
                                                        </div>
                                                        <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                                                    </div>
                                                    <div className="flex flex-1 items-end justify-between text-sm">
                                                        <div className="text-gray-500">
                                                            <label htmlFor="quantity" className="inline mr-5 text-sm font-medium leading-6 text-gray-900">Qty {item.quantity}</label>
                                                            <select name="quantity" id="quantity" className='text-sm' onChange={(e) => handleQuantity(e, item)} value={item.quantity}>
                                                                <option value="1">1</option>
                                                                <option value="2">2</option>
                                                                <option value="3">3</option>
                                                                <option value="4">4</option>
                                                                <option value="5">5</option>
                                                            </select>
                                                        </div>

                                                        <div className="flex">
                                                            <Modal
                                                                title={'Remove item'}
                                                                message={`Are you sure you want to remove ${item.title} from the cart?`}
                                                                dangerOption='Remove'
                                                                cancelOption='Cancel'
                                                                dangerAction={(e) => handleRemove(e, item.id)}
                                                                cancelAction={(e) => setOpenModal(-1)}
                                                                showModal={openModal === item.id}
                                                            />

                                                            <button
                                                                onClick={(e) => setOpenModal(item.id)}
                                                                type="button"
                                                                className="font-medium text-indigo-400 hover:text-indigo-600"
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                                <div className="flex justify-between text-base font-medium text-gray-900 my-2">
                                    <p>Subtotal</p>
                                    <p>${totalAmount}</p>
                                </div>
                                <div className="flex justify-between text-base font-medium text-gray-900 my-2">
                                    <p>Total Items in Cart</p>
                                    <p>{totalItems}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
                                <div className="mt-6">
                                    <div
                                        onClick={handleOrder}
                                        className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 cursor-pointer"
                                    >
                                        Confirm Order
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                                    <p>
                                        or{' '}
                                        <Link to="/">
                                            <button
                                                type="button"
                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                                onClick={() => setOpen(false)}
                                            >
                                                Continue Shopping
                                                <span aria-hidden="true"> &rarr;</span>
                                            </button>
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>}
        </>
    )
}

export default CheckoutPage;
