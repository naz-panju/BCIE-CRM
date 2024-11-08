import AlumniIndex from '@/Components/Alumni/AlumniIndex'
import ApplicantsIndex from '@/Components/Applicants/ApllicantsIndex'
import Layout from '@/Components/Common/Layout'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function Applicants() {


    const session = useSession()
    const router = useRouter()


    useEffect(() => {

        if (session?.data?.user?.role?.id == 6) {
            router.push('/404')
        }

    }, [session])

    return (
        <Layout>
            <AlumniIndex />
        </Layout>
    )
}

export default Applicants

// export async function getServerSideProps(context) {
//     const session = await getSession(context)

//     if (!session) {
//         return {
//             redirect: {
//                 destination: '/login',
//                 permanent: false,
//             },
//         };
//     }
//     if (session?.user?.role?.id == 6) {
//         return {
//             notFound: true,
//         };
//     }
//     return {
//         props: { session },
//     };
// }
