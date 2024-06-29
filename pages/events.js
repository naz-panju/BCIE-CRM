import Layout from '@/Components/Common/Layout'
import EventsIndex from '@/Components/Events/EventsIndex'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function Events() {

    const session = useSession()
    const router = useRouter()
  
  
    useEffect(() => {
  
      if (session && (session?.user?.role?.id == 5 || session?.user?.role?.id === 6)) {
            router.push('/404')
        }
  
    }, [session])

    return (
        <Layout>
            <EventsIndex />
        </Layout>
    )
}

export default Events

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
//     if (session?.user?.role?.id == 5 || session?.user?.role?.id == 6) {
//         return {
//             notFound: true,
//         };
//     }
//     return {
//         props: { session },
//     };
//   }
  