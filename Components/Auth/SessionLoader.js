import React from 'react';
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
// import { setToken } from "@/data/config/http";

const SessionLoader = ({ children }) => {
    const router = useRouter()
    const session = useSession()

    // console.log(session);

    if (session.status === 'loading') {
        return <div className="loading" />
    }

    // if (session.status === 'authenticated') {
    //     setToken(session.data.user.token)
    //     localStorage.setItem('token',session.data.user.token)
    // }
    if (typeof window !== 'undefined' && session.status === 'authenticated' && session.data?.user?.token) {
        // setToken(session.data.user.token);
        localStorage.setItem('token', session.data.user.token);
    }


    if (router.pathname === '/login' && session.status === 'authenticated') {
        router.push('/')
    }

    if (session.status === "unauthenticated") {
        signIn();
    }

    return <>{children}</>

};

export default SessionLoader;