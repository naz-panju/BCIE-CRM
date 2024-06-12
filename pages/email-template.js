import Layout from '@/Components/Common/Layout'
import EmailTemplateIndex from '@/Components/EmailTemplates/EmailTemplateIndex'
import { getSession } from 'next-auth/react'
import React from 'react'

function EmailTemplate() {
  return (
    <Layout>
      <EmailTemplateIndex />
    </Layout>
  )
}

export default EmailTemplate

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
