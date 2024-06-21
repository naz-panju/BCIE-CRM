import LeadIndex from '@/Components/Lead/Lead'
import Layout from '@/Components/Common/Layout'
import React from 'react'
import WithdrawnLeads from '@/Components/Withdraws/withDrawIndex'

function Index() {
  return (
    <Layout>
      <WithdrawnLeads />
    </Layout>
  )
}

export default Index


// export async function getServerSideProps(context) {
//   const session = await getSession(context)

//   console.log('session',session);

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