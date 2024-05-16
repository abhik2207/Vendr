import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectUserInfo } from '../user/userSlice';
import { createQueryAsync } from './querySlice';

function ContactUs() {
    // eslint-disable-next-line no-unused-vars
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const userInfo = useSelector(selectUserInfo);
    const dispatch = useDispatch();

    return (
        <form noValidate className='bg-white p-6 rounded-lg' onSubmit={handleSubmit((data) => {
            const queryObject = { userEmail: userInfo.email, query: data.query };
            dispatch(createQueryAsync(queryObject));
            reset();
        })}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">Tell us what is your issue</h2>
                    <p className="mt-1 text-sm leading-6 text-gray-600">
                        We will try to reach out to you as soon as possible.
                    </p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                            <label htmlFor="query" className="block text-sm font-medium leading-6 text-gray-900">
                                Your query
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="query"
                                    {...register('query', { required: 'Please enter your issue' })}
                                    rows={5}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    defaultValue={''}
                                    placeholder='Enter your issue here'
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <Link to='/' type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                </Link>
                <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

export default ContactUs;
