import React from 'react';
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordRequestAsync, selectAuthError, selectMailSent } from '../authSlice';

export default function ForgotPassword() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const mailSent = useSelector(selectMailSent);

    const error = useSelector(selectAuthError);

    return (
        <>
            <div className='h-screen w-full bg-white'>
                <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                        <img className="mx-auto h-10 w-auto" src="/navbar-icon.png" alt="Your Company" />
                        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Enter your email address to reset password</h2>
                    </div>

                    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <form noValidate className="space-y-6" action="#" method="POST" onSubmit={handleSubmit((data) => {
                            console.log('Email sent at : ' + data.email);
                            dispatch(resetPasswordRequestAsync(data.email));
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
                                    {mailSent && <p className='text-green-500 text-xs'>Mail sent successfully</p>}
                                    {error && <p className='text-green-500 text-xs'>Mail sent successfully</p>}
                                </div>
                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Send email</button>
                            </div>
                        </form>

                        <p className="mt-10 text-center text-sm text-gray-500">
                            Want to login instead?{' '}
                            <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Log in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
