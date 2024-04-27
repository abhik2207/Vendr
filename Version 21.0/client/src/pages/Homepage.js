import React from 'react';
import Navbar from '../features/navbar/Navbar';
import ProductList from '../features/product/components/ProductList';
import Footer from '../features/common/Footer';

function Homepage() {
    return (
        <div>
            <Navbar>
                <ProductList />
            </Navbar>
            <Footer />
        </div>
    )
}

export default Homepage;
