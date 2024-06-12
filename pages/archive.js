import ArchiveIndex from '@/Components/Archive/ArchiveIndex'
import Layout from '@/Components/Common/Layout'
import { getSession } from 'next-auth/react'
import React from 'react'

function Archive() {
    return (
        <Layout>
            <ArchiveIndex />
        </Layout>
    )
}

export default Archive

export async function getServerSideProps(context) {
    const session = await getSession(context)
  
    if (!session) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }
    return {
      props: { session },
    };
  }
