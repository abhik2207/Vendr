import React from 'react';
import Navbar from '../features/navbar/Navbar';
import AdminQuery from '../features/admin/components/AdminQuery';

function AdminQueryPage() {
    return (
        <div>
            <Navbar>
                <AdminQuery />
            </Navbar>
        </div>
    )
}

export default AdminQueryPage;
