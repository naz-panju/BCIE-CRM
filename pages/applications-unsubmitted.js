import ApplicationUnsubmittedIndex from '@/Components/ApplicationUnsubmitted/ApllicationIndex'
import Layout from '@/Components/Common/Layout'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function Application() {

    const session = useSession()
    const router = useRouter()


    useEffect(() => {

        if (session?.data?.user?.role?.id == 5) {
            router.push('/404')
        }

    }, [session])

    return (
        <Layout>
            <ApplicationUnsubmittedIndex />
        </Layout>
    )
}

export default Application


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
//     if (session?.user?.role?.id == 5) {
//         return {
//             notFound: true,
//         };
//     }
//     return {
//         props: { session },
//     };
// }
