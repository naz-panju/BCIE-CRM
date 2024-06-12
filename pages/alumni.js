import AlumniIndex from '@/Components/Alumni/AlumniIndex'
import ApplicantsIndex from '@/Components/Applicants/ApllicantsIndex'
import Layout from '@/Components/Common/Layout'
import { getSession } from 'next-auth/react'
import React from 'react'

function Applicants() {
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
