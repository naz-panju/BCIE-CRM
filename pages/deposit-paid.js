import Layout from '@/Components/Common/Layout'
import DepositPaidIndex from '@/Components/Deposit Paid/DepositPaid'
import EventsIndex from '@/Components/Events/EventsIndex'
import { getSession } from 'next-auth/react'
import React from 'react'

function Events() {
    return (
        <Layout>
            <DepositPaidIndex />
        </Layout>
    )
}

export default Events

// export async function getServerSideProps(context) {
//     const session = await getSession(context)
  
//     if (!session) {
//       return {
//         redirect: {
//           destination: '/login',
//           permanent: false,
//         },
//       };
//     }
//     return {
//       props: { session },
//     };
//   }
