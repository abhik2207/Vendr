import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo, selectUserStatus, updateUserAsync } from '../userSlice';
import { useForm } from 'react-hook-form';

import { toast } from 'react-toastify';
import { MutatingDots } from 'react-loader-spinner';

import Modal from '../../common/Modal';

export default function UserProfile() {
    const dispatch = useDispatch();
    const userInfo = useSelector(selectUserInfo);

    const loadingStatus = useSelector(selectUserStatus);

    // eslint-disable-next-line no-unused-vars
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

    const [selectedEditIndex, setSelectedEditIndex] = useState(-1);
    const [showAddAddressForm, setShowAddAddressForm] = useState(false);

    const [openModal, setOpenModal] = useState(null);

    const handleEdit = (addressUpdate, index) => {
        const newUser = { ...userInfo, addresses: [...userInfo.addresses] };
        newUser.addresses.splice(index, 1, addressUpdate);
        dispatch(updateUserAsync(newUser));
        setSelectedEditIndex(-1);

        toast.success('Address edited successfully!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

    const handleRemove = (e, index) => {
        const newUser = { ...userInfo, addresses: [...userInfo.addresses] };
        newUser.addresses.splice(index, 1);
        dispatch(updateUserAsync(newUser));

        toast.success('Address removed successfully!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

    const handleEditForm = (index) => {
        setSelectedEditIndex(index);
        setShowAddAddressForm(false);
        const address = userInfo.addresses[index];
        setValue('name', address.name);
        setValue('email', address.email);
        setValue('phone', address.phone);
        setValue('houseNumber', address.houseNumber);
        setValue('locality', address.locality);
        setValue('city', address.city);
        setValue('state', address.state);
        setValue('pinCode', address.pinCode);
    }

    const handleAdd = (address) => {
        const newUser = { ...userInfo, addresses: [...userInfo.addresses, address] };
        dispatch(updateUserAsync(newUser));
        setShowAddAddressForm(false);

        toast.success('Address added successfully!', {
            position: "bottom-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored"
        });
    }

    return (
        <div>
            <div className='flex flex-col min-h-screen w-full gap-5 py-5 px-2'>

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

                <div className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 bg-white rounded-lg'>
                    <h2 className='text-4xl font-bold tracking-tight text-gray-900 pt-5 mb-5 text-left'>Name: {userInfo.name ? userInfo.name : 'GUEST'}</h2>
                    <h4 className='text-xl font-bold tracking-tight text-red-600 mb-0 text-left'>Email address: {userInfo.email}</h4>
                    <h4 className='border-b border-gray-200 text-xl font-bold tracking-tight text-red-600 mb-2 pb-4 text-left'>Phone number: {userInfo.addresses.length > 0 ? `${userInfo.addresses[0].phone}` : 'Not added yet'}</h4>
                    {userInfo.role === 'admin' && <h4 className='border-b border-gray-200 text-xl font-bold tracking-tight text-green-600 mb-2 pb-4 text-left'>Role: {userInfo.role}</h4>}

                    <button
                        type="button"
                        onClick={() => {
                            setShowAddAddressForm(true);
                            setSelectedEditIndex(-1);
                        }}
                        className="my-6 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                    >
                        Add a new address
                    </button>
                    {showAddAddressForm && <form noValidate className='bg-white px-5 my-6 py-6 rounded-lg' onSubmit={handleSubmit((data) => {
                        handleAdd(data);
                        reset();
                    })}>
                        <div className="space-y-12">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-3xl font-semibold leading-7 text-gray-900">Edit your existing address</h2>
                                <p className="mt-1 text-sm leading-6 text-gray-600">Change the existing values and click on save.</p>

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
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        setShowAddAddressForm(false);
                                        setSelectedEditIndex(-1);
                                        reset();
                                    }}
                                    className="text-sm font-semibold leading-6 text-gray-900 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </form>}

                    {userInfo.addresses.length > 0 && <h4 className='border-t border-gray-200 text-xl font-bold tracking-tight text-blue-600 mt-2 pt-3 text-left'>Saved Addresses</h4>}
                    {userInfo.addresses.map((address, index) =>
                        <div key={index}>
                            {selectedEditIndex === index && <form noValidate className='bg-white px-5 my-6 py-6 rounded-lg' onSubmit={handleSubmit((data) => {
                                handleEdit(data, index);
                                reset();
                            })}>
                                <div className="space-y-12">
                                    <div className="border-b border-gray-900/10 pb-12">
                                        <h2 className="text-3xl font-semibold leading-7 text-gray-900">Edit your existing address</h2>
                                        <p className="mt-1 text-sm leading-6 text-gray-600">Change the existing values and click on save.</p>

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
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                setSelectedEditIndex(-1)
                                                setShowAddAddressForm(false);
                                                reset();
                                            }}

                                            className="text-sm font-semibold leading-6 text-gray-900 px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </form>}
                            <div key={index} className="flex justify-between gap-x-6 py-5">
                                <div className="flex min-w-0 gap-x-4">
                                    <div className="min-w-0 flex-auto">
                                        <p className="text-md font-semibold leading-6 text-gray-900">{address.name}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">Phone: {address.phone}</p>
                                        <p className="mt-1 truncate text-xs leading-5 text-gray-500">Email: {address.email}</p>
                                    </div>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end w-1/3">
                                    <p className="text-sm leading-6 text-gray-700">{address.houseNumber} - {address.locality}</p>
                                    <p className="text-sm leading-6 text-gray-500">{address.city}</p>
                                    <p className="text-sm leading-6 text-gray-500">{address.state} - {address.pinCode}</p>
                                </div>
                                <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                                    <button
                                        onClick={(e) => handleEditForm(index)}
                                        type="button"
                                        className="font-medium text-indigo-400 hover:text-indigo-600"
                                    >
                                        Edit
                                    </button>
                                    <Modal
                                        title={'Remove address'}
                                        message={`Are you sure you want to remove this address?`}
                                        dangerOption='Remove'
                                        cancelOption='Cancel'
                                        dangerAction={(e) => handleRemove(e, index)}
                                        cancelAction={(e) => setOpenModal(-1)}
                                        showModal={openModal === index}
                                    />
                                    <button
                                        onClick={(e) => setOpenModal(index)}
                                        type="button"
                                        className="font-medium text-indigo-400 hover:text-indigo-600"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
