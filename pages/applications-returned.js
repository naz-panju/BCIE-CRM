import ApplicantsIndex from '@/Components/Applicants/ApllicantsIndex'
import ApplicationReturned from '@/Components/ApplicationReturned/ApllicationIndex'
import ApplicationIndex from '@/Components/Applications/ApllicationIndex'
import Layout from '@/Components/Common/Layout'
import { getSession } from 'next-auth/react'
import React from 'react'

function Application() {
    return (
        <Layout>
            <ApplicationReturned />
        </Layout>
    )
}

export default Application

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
