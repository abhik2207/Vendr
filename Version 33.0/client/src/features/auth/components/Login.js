import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from "react-hook-form";

import { Link, Navigate } from "react-router-dom";
import { loginUserAsync, selectAuthError, selectLoggedInUser } from '../authSlice';

import { toast } from 'react-toastify';

export default function Login() {
    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors } } = useForm();
    console.log({ errors });

    const error = useSelector(selectAuthError);
    const user = useSelector(selectLoggedInUser);

    return (
        <>
            {user && <Navigate to='/' replace={true}></Navigate>}
            <div className='h-screen w-full bg-white'>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-16 w-auto" src="/navbar-icon.png" alt="Your Company" />
                        <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Sign in to your account</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form noValidate className="space-y-6" action="#" method="POST" onSubmit={handleSubmit((data) => {
                            dispatch(loginUserAsync({ email: data.email, password: data.password }));
                            console.log('DATA: ', data);
                            if(data) {
                                toast.success('Logged in successfully!', {
                                    position: "top-right",
                                    autoClose: 2000,
                                    hideProgressBar: false,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "colored"
                                });
                            }
                        })}>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                <div className="mt-2">
                                    <input
                                        id="email"
                                        {...register('email',
                                            {
                                                required: "Please enter your email address",
                                                // eslint-disable-next-line
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
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</Link>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <input
                                        id="password"
                                        {...register('password',
                                            {
                                                required: "Please enter your password"
                                            }
                                        )}
                                        type="password"
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                    {errors.password && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
                                </div>
                                {error && <p className='text-red-500 text-xs'>{error || error.message}</p>}
                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Log in</button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Does not have an account?{' '}
                            <Link to="/signup" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Sign up</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
