import React from 'react';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordAsync, selectAuthError, selectPasswordReset } from '../authSlice';

export default function ResetPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const passwordReset = useSelector(selectPasswordReset);

    const query = new URLSearchParams(window.location.search);
    const token = query.get('token');
    const email = query.get('email');

    const error = useSelector(selectAuthError);

    return (
        <>
            {(email && token) ? <div className='h-screen w-full bg-white'>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-10 w-auto" src="/navbar-icon.png" alt="Your Company" />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Reset your password</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form noValidate className="space-y-6" action="#" method="POST" onSubmit={handleSubmit((data) => {
                            dispatch(resetPasswordAsync({email, token, password: data.password}));
                        })}>
                            <div>
                                <div className="flex items-center justify-between">
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">New password</label>
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
                                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Confirm new password</label>
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
                                    {passwordReset && <p className='text-green-500 text-xs'>Password reset successfully</p>}
                                    {error && <p className='text-red-500 text-xs'>{error}</p>}
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Reset password</button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Want to login instead?{' '}
                            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Log in</Link>
                        </p>
                    </div>
                </div>
            </div> : 
            <p>Link was expired</p>}
        </>
    );
}
