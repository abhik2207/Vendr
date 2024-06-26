import React from 'react'
import { useSelector } from 'react-redux';
import { selectLoggedInUser } from '../authSlice';
import { Navigate } from 'react-router-dom';
import { selectUserInfo } from '../../user/userSlice';

export default function ProtectedAdmin({ children }) {
    const user = useSelector(selectLoggedInUser);
    const userInfo = useSelector(selectUserInfo)

    if(!user) {
        return <Navigate to='/login' replace={true} />
    }
    if(user && userInfo.role !== 'admin') {
        return <Navigate to='/' replace={true} />
    }

    return children;
}
