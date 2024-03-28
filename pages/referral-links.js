import Layout from '@/Components/Common/Layout'
import EventsIndex from '@/Components/Events/EventsIndex'
import ReferralIndex from '@/Components/Referrals/ReferralIndex'
import { getSession } from 'next-auth/react'
import React from 'react'

function Referral() {
    return (
        <Layout>
            <ReferralIndex />
        </Layout>
    )
}

export default Referral

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
