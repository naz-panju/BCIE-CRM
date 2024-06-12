import Layout from '@/Components/Common/Layout'
import DashboardIndex from '@/Components/Dashboard/DashboardIndex'
import { getSession } from 'next-auth/react'
import React from 'react'

function DashBoard() {
    return (
        <Layout >
            <DashboardIndex />
        </Layout>
    )
}

export default DashBoard

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
