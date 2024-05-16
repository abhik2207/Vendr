import React from 'react';
import Navbar from '../features/navbar/Navbar';
import ContactUs from '../features/query/ContactUs';

function ContactUsPage() {
    return (
        <div>
            <Navbar>
                <ContactUs />
            </Navbar>
        </div>
    )
}

export default ContactUsPage;
