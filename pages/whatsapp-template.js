import Layout from '@/Components/Common/Layout'
import EventsIndex from '@/Components/Events/EventsIndex'
import WhatsappTemplateIndex from '@/Components/WhatsappTemplate/WhatsAppTemplateIndex'
import { getSession } from 'next-auth/react'
import React from 'react'

function WhatsAppTemplate() {
  return (
    <Layout>
      <WhatsappTemplateIndex />
    </Layout>
  )
}

export default WhatsAppTemplate

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

  if (session?.user?.role?.id !== 3 && session?.data?.user?.role?.id !== 4) {
    return {
      notFound: true,
    };
  }

  return {
    props: { session },
  };
}
