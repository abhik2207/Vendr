import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link, Navigate } from 'react-router-dom';
import { deleteItemFromCartAsync, selectCartItemsStatus, selectCartLoaded, selectItems, updateCartAsync } from './cartSlice';

import { MutatingDots } from 'react-loader-spinner';
import Modal from '../common/Modal';

export default function Cart() {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(true);
  const [openModal, setOpenModal] = useState(null);

  const loadingStatus = useSelector(selectCartItemsStatus);
  const cartLoaded = useSelector(selectCartLoaded);

  const items = useSelector(selectItems);
  const totalAmount = items.reduce((amount, item) => {
    let itemPrice = item.product.discountedPrice;
    return itemPrice * item.quantity + amount;
  }, 0);
  const totalItems = items.reduce((total, item) => item.quantity + total, 0);

  const handleQuantity = (e, item) => {
    dispatch(updateCartAsync({ id: item.id, quantity: e.target.value }));
  }

  const handleRemove = (e, itemId) => {
    dispatch(deleteItemFromCartAsync(itemId));
  }

  return (
    <>
      {!items.length && cartLoaded && <Navigate to='/' replace={true} />}
      <div className='mx-auto my-24 max-w-7xl px-4 sm:px-6 lg:px-8 bg-white rounded-lg'>

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

        <h2 className='text-4xl font-bold tracking-tight text-gray-900 mb-5 pt-5 text-center'>Cart</h2>
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
                      <p className="mt-1 text-sm text-gray-500">{item.product.brand[0].toUpperCase() + item.product.brand.slice(1)}</p>
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
                          message={`Are you sure you want to remove ${item.product.title} from the cart?`}
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
            <Link to="/checkout"
              href="/"
              className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Checkout
            </Link>
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
    </>
  );
}
