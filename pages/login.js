import LoginForm from '@/Components/Login Form/LoginForm'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

function Login() {

  // const router=useRouter()

  // const { data: session, status } = useSession();
  // console.log(router);
  // console.log(session);

  // useEffect(() => {
  
  // }, [])
  
  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="brand-name">BCIE CRM</h1>
        <LoginForm />
        
      </div>
    </div>
  )
}

export default Login

// export async function getServerSideProps(context) {
//   const session = await getSession(context)
//   // console.log('yyy', session);

//   if (session) {
//     return {
//       // redirect: {
//       //   destination: '/',
//       //   permanent: false,
//       // },
//     };
//   }
//   return {
//     props: { session },
//   };
// }