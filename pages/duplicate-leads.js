import Layout from '@/Components/Common/Layout'
import React, { useEffect } from 'react'
import WithdrawnLeads from '@/Components/Withdraws/withDrawIndex'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DuplicateLeads from '@/Components/DuplicateLeads/duplicateIndex'

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
      <DuplicateLeads />
    </Layout>
  )
}

export default Index


// export async function getServerSideProps(context) {
//   const session = await getSession(context)

//   if (!session) {
//       return {
//           redirect: {
//               destination: '/login',
//               permanent: false,
//           },
//       };
//   }
//   if (session?.user?.role?.id == 6) {
//       return {
//           notFound: true,
//       };
//   }
//   return {
//       props: { session },
//   };
// }