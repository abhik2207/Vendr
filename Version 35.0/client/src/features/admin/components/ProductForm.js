import React, { useEffect, useState } from 'react';
import { clearSelectedProduct, createProductAsync, fetchProductByIdAsync, selectBrands, selectCategories, selectProductById, updateProductAsync } from '../../product/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import Modal from '../../common/Modal';

function ProductForm() {
    const categories = useSelector(selectCategories);
    const brands = useSelector(selectBrands);

    const dispatch = useDispatch();

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
    console.log(errors);

    const navigate = useNavigate();

    const params = useParams();
    const selectedProduct = useSelector(selectProductById);

    const [openModal, setOpenModal] = useState(null);

    const colors = [
        { name: 'White', class: 'bg-white', selectedClass: 'ring-gray-400', id: 'white' },
        { name: 'Gray', class: 'bg-gray-200', selectedClass: 'ring-gray-400', id: 'gray' },
        { name: 'Black', class: 'bg-gray-900', selectedClass: 'ring-gray-900', id: 'black' },
        { name: 'Red', class: 'bg-red-500', selectedClass: 'ring-red-900', id: 'red' },
        { name: 'Blue', class: 'bg-blue-500', selectedClass: 'ring-blue-900', id: 'blue' },
        { name: 'Green', class: 'bg-green-500', selectedClass: 'ring-green-900', id: 'green' },
        { name: 'Yellow', class: 'bg-yellow-500', selectedClass: 'ring-yellow-900', id: 'yellow' },
        { name: 'Creme', class: 'bg-amber-100', selectedClass: 'ring-amber-900', id: 'creme' },
        { name: '-', class: 'bg-white', selectedClass: 'ring-gray-400', id: 'std' }
    ];

    const sizes = [
        { name: 'XXS', inStock: true, id: 'xxs' },
        { name: 'XS', inStock: true, id: 'xs' },
        { name: 'S', inStock: true, id: 'sm' },
        { name: 'M', inStock: true, id: 'md' },
        { name: 'L', inStock: true, id: 'lg' },
        { name: 'XL', inStock: true, id: 'xl' },
        { name: '2XL', inStock: true, id: 'xxl' },
        { name: '-', inStock: true, id: 'std' }
    ];
    useEffect(() => {
        if (params.id) {
            dispatch(fetchProductByIdAsync(params.id));
        }
        else {
            dispatch(clearSelectedProduct());
        }
    }, [params.id, dispatch]);

    useEffect(() => {
        if (selectedProduct && params.id) {
            setValue('title', selectedProduct.title);
            setValue('description', selectedProduct.description);
            setValue('price', selectedProduct.price);
            setValue('discountPercentage', selectedProduct.discountPercentage);
            setValue('stock', selectedProduct.stock);
            setValue('brand', selectedProduct.brand);
            setValue('category', selectedProduct.category);
            setValue('thumbnail', selectedProduct.thumbnail);
            setValue('image1', selectedProduct.images[0]);
            setValue('image2', selectedProduct.images[1]);
            setValue('image3', selectedProduct.images[2]);
            setValue('image4', selectedProduct.images[3]);
            setValue('highlight1', selectedProduct.highlights[0]);
            setValue('highlight2', selectedProduct.highlights[1]);
            setValue('highlight3', selectedProduct.highlights[2]);
            setValue('highlight4', selectedProduct.highlights[3]);
            setValue('sizes', selectedProduct.sizes.map(size => size.id));
            setValue('colors', selectedProduct.colors.map(color => color.id));
        }
    }, [selectedProduct, params.id, setValue]);

    const handleDelete = () => {
        const product = { ...selectedProduct };
        product.deleted = true;
        dispatch(updateProductAsync(product));
    }

    return (
        <div>
            {brands && categories && <form noValidate action="#" method="POST" onSubmit={handleSubmit((data) => {                
                const product = { ...data };
                product.images = [product.image1, product.image2, product.image3, product.image4];
                product.highlights = [product.highlight1, product.highlight2, product.highlight3, product.highlight4];
                delete product['image1'];
                delete product['image2'];
                delete product['image3'];
                delete product['image4'];
                product.colors = product.colors.map(color => colors.find(clr => clr.id === color));
                product.sizes = product.sizes.map(size => sizes.find(sz => sz.id === size));
                product.price = +product.price;
                product.stock = +product.stock;
                product.discountPercentage = +product.discountPercentage;

                if (params.id) {
                    product.id = params.id;
                    product.rating = selectedProduct.rating;
                    dispatch(updateProductAsync(product));
                    reset();
                    navigate('/admin');
                }
                else {
                    product.rating = 0;
                    dispatch(createProductAsync(product));
                    reset();
                    navigate('/admin');
                }
            })}>
                <div className="space-y-12 bg-white p-10 rounded-lg">
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-2xl font-semibold leading-7 text-gray-900">Add a new Product</h2>
                        <p className="text-sm leading-6 text-gray-600">
                            Make sure to give detailed information about the new product.
                        </p>

                        {selectedProduct && selectedProduct.deleted ? <h2 className="text-red-500 text-lg mt-6 font-bold">This product is deleted</h2> : <h2 className="text-green-500 text-lg mt-6 font-bold">This product exists</h2>}

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-6">
                                <label htmlFor="title" className="block text-md font-medium leading-6 text-gray-900">
                                    Product title
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('title', { required: 'Title is required' })}
                                            id="title"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="col-span-full">
                                <label htmlFor="description" className="block text-md font-medium leading-6 text-gray-900">
                                    Description
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="description"
                                        {...register('description', { required: 'Description is required' })}
                                        rows={3}
                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        defaultValue={''}
                                    />
                                </div>
                                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few lines about your product.</p>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="brand" className="block text-md font-medium leading-6 text-gray-900">
                                    Product brand
                                </label>
                                <div className="mt-2">
                                    <select
                                        {...register('brand', { required: 'Brand is required' })}
                                        id="brand"
                                    >
                                        <option value="choose">Choose brand</option>
                                        {brands.map((brand, index) => (
                                            <option key={index} value={brand.value}>{brand.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="colors" className="block text-md font-medium leading-6 text-gray-900">
                                    Product Colors
                                </label>
                                <div className="mt-2">
                                        {colors.map((color) => (
                                            <div className='mr-6 inline-flex items-center gap-1' key={color.id}>
                                                <input
                                                    className='cursor-pointer'
                                                    {...register('colors')}
                                                    type='checkbox'
                                                    value={color.id}
                                                    /> {color.name}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="sizes" className="block text-md font-medium leading-6 text-gray-900">
                                    Product Sizes
                                </label>
                                <div className="mt-2">
                                        {sizes.map((size) => (
                                            <div className='mr-6 inline-flex items-center gap-1' key={size.id}>
                                                <input
                                                    className='cursor-pointer'
                                                    {...register('sizes')}
                                                    type='checkbox'
                                                    value={size.id}
                                                    /> {size.name}
                                            </div>
                                        ))}
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="category" className="block w-full text-md font-medium leading-6 text-gray-900">
                                    Product category
                                </label>
                                <div className="mt-2">
                                    <select
                                        {...register('category', { required: 'Category is required' })}
                                        id="category"
                                    >
                                        <option value="choose">Choose category</option>
                                        {categories.map((category, index) => (
                                            <option key={index} value={category.value}>{category.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="price" className="block text-md font-medium leading-6 text-gray-900">
                                    Price
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="number"
                                            {...register('price', { required: 'Price is required', min: 1, max: 100000 })}
                                            id="price"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="discountPercentage" className="block text-md font-medium leading-6 text-gray-900">
                                    Discount Percentage
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="number"
                                            {...register('discountPercentage', { required: 'Discount Percentage is required', min: 0, max: 100 })}
                                            id="discountPercentage"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="stock" className="block text-md font-medium leading-6 text-gray-900">
                                    Stock
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="number"
                                            {...register('stock', { required: 'Stock is required', min: 0 })}
                                            id="stock"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="thumbnail" className="block text-md font-medium leading-6 text-gray-900">
                                    Product thumbnail
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('thumbnail', { required: 'Thumbnail is required' })}
                                            id="thumbnail"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="image1" className="block text-md font-medium leading-6 text-gray-900">
                                    Image 1
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('image1', { required: 'Image 1 is required' })}
                                            id="image1"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="image2" className="block text-md font-medium leading-6 text-gray-900">
                                    Image 2
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('image2', { required: 'Image 2 is required' })}
                                            id="image2"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="image3" className="block text-md font-medium leading-6 text-gray-900">
                                    Image 3
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('image3', { required: 'Image 3 is required' })}
                                            id="image3"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="image4" className="block text-md font-medium leading-6 text-gray-900">
                                    Image 4
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('image4', { required: 'Image 4 is required' })}
                                            id="image4"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>




                            <div className="sm:col-span-3">
                                <label htmlFor="highlight1" className="block text-md font-medium leading-6 text-gray-900">
                                    Highlight 1
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('highlight1')}
                                            id="highlight1"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="highlight2" className="block text-md font-medium leading-6 text-gray-900">
                                    Highlight 2
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('highlight2')}
                                            id="highlight2"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="highlight3" className="block text-md font-medium leading-6 text-gray-900">
                                    Highlight 3
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('highlight3')}
                                            id="highlight3"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-3">
                                <label htmlFor="highlight4" className="block text-md font-medium leading-6 text-gray-900">
                                    Highlight 4
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
                                        <input
                                            type="text"
                                            {...register('highlight4')}
                                            id="highlight4"
                                            className="block flex-1 border-0 bg-transparent py-1 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900" onClick={() => {
                        navigate('/admin');
                    }}>
                        Cancel
                    </button>
                    {selectedProduct && !selectedProduct.deleted && <button
                        onClick={(e) => {
                            e.preventDefault();
                            setOpenModal(true);
                        }}
                        className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                        Delete
                    </button>}

                    {selectedProduct && <Modal
                        title={'Delete product'}
                        message={`Are you sure you want to delete ${selectedProduct.title}?`}
                        dangerOption='Delete'
                        cancelOption='Cancel'
                        dangerAction={handleDelete}
                        cancelAction={(e) => setOpenModal(null)}
                        showModal={openModal}
                    />}

                    <button
                        type="submit"
                        className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Save
                    </button>
                </div>
            </form>}
        </div>
    )
}

export default ProductForm;