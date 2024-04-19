import React from 'react';
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import { createUserAsync, selectLoggedInUser } from '../authSlice';

import { Link, Navigate } from "react-router-dom";

export default function Signup() {
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();
    console.log({ errors });

    const user = useSelector(selectLoggedInUser);

    return (
        <>
            {user && <Navigate to='/' replace={true}></Navigate>}
            <div className='h-screen w-full bg-white'>
                {/* {user?.email} */}
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Create an account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form noValidate className="space-y-6" action="#" method="POST" onSubmit={handleSubmit((data) => {
                            dispatch(createUserAsync({ email: data.email, password: data.password }));
                            console.log(data);
                        })}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        {...register('email',
                                            {
                                                required: "Please enter an email address",
                                                pattern: { value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi, message: 'Please enter a valid email address' }
                                            }
                                        )}
                                        type="email"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        {...register('password',
                                            {
                                                required: "Please enter a password",
                                                pattern: { value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm, message: '-> Password must contain at least 8 characters\n-> Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\nPassword may or may not contain special characters' }
                                            }
                                        )}
                                        type="password"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.password && <p className='text-red-500 text-xs'>{errors.password.message}</p>}
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Confirm Password</label>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="confirmPassword"
                                        {...register('confirmPassword',
                                            {
                                                required: "Please re-enter enter the password",
                                                validate: (value, formValues) => value === formValues.password || 'Both passwords do not match'
                                            }
                                        )}
                                        type="password"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.confirmPassword && <p className='text-red-500 text-xs'>{errors.confirmPassword.message}</p>}
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign Up</button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Already have an account?{' '}
                            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
