import LeadIndex from '@/Components/Lead/Lead'
import Layout from '@/Components/Common/Layout'
import React, { useEffect } from 'react'
import { getSession, useSession } from 'next-auth/react'
import UnAssignedLeads from '@/Components/UnAssignedLeads/UnAssignedLeads'
import { useRouter } from 'next/router'

function Index() {

    
  const session = useSession()
  const router = useRouter()


  useEffect(() => {

      if (session?.data?.user?.role?.id == 6) {
          router.push('/404')
      }

  }, [session])


  return (
    <Layout>
      <UnAssignedLeads />
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