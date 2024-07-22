import LeadIndex from '@/Components/Lead/Lead'
import Layout from '@/Components/Common/Layout'
import React from 'react'
import { getSession } from 'next-auth/react'
import TaskIndex from '@/Components/Task/Task'

function Index() {
  return (
    <Layout>
      <TaskIndex />
    </Layout>
  )
}

export default Index


// export async function getServerSideProps(context) {
//   const session = await getSession(context)

//   if (!session) {
//     return {
//       redirect: {
//         destination: '/login',
//         permanent: false,
//       },
//     };
//   }
//   return {
//     props: { session },
//   };
// }