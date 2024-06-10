import LoginForm from '@/Components/Login Form/LoginForm'
import { getSession, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import Image from 'next/image';
import HmSl1 from "@/img/log.png";

function Login() {

  // const router=useRouter()

  // const { data: session, status } = useSession();
  // console.log(router);
  // console.log(session);

  // useEffect(() => {

  // }, [])

  return (
    <div className="login-page-sec d-flex align-items-center">

      <div className='log-left'>
        <div className='log-left-cap'>
          <svg xmlns="http://www.w3.org/2000/svg" width="49" height="15" viewBox="0 0 49 15" fill="none">
            <path d="M37.125 14.6921V0.30835H49.0018V2.95906H40.0017V6.16458H48.6731V8.81529H40.0017V12.0208H49.0018V14.6921H37.125Z" fill="white" />
            <path d="M34.5232 0.30835V14.6921H31.6465V0.30835H34.5232Z" fill="white" />
            <path d="M17.0701 7.52063C17.0701 10.2946 19.166 12.2467 22.0839 12.2467C24.1592 12.2467 25.7825 11.2809 26.5839 9.71928H29.625C28.7415 12.9453 25.7825 15.0002 22.0839 15.0002C17.5838 15.0002 14.1934 11.7947 14.1934 7.52063C14.1934 3.18497 17.5633 0 22.0839 0C25.7825 0 28.7209 2.05482 29.625 5.28088H26.5839C25.8031 3.69867 24.1798 2.75345 22.0839 2.75345C19.1455 2.75345 17.0701 4.68498 17.0701 7.52063Z" fill="white" />
            <path d="M0 14.6921V0.30835H7.27405C10.2535 0.30835 12.2673 1.78782 12.2673 4.06866C12.2673 5.48649 11.3837 6.65773 10.0275 7.31528C11.8152 7.91117 12.9248 9.10297 12.9248 10.6852C12.9248 13.0893 10.5207 14.6921 7.27405 14.6921H0ZM9.5138 4.52072C9.5138 3.47277 8.56859 2.77413 7.27405 2.77413H2.87674V6.22622H7.27405C8.48639 6.22622 9.5138 5.50704 9.5138 4.52072ZM10.0275 10.418C10.0275 9.2468 9.0001 8.60981 7.27405 8.60981H2.87674V12.2057H7.27405C8.93845 12.2057 10.0275 11.5276 10.0275 10.418Z" fill="white" />
          </svg>

          <h3>
            Simplifying Educational Processes.
          </h3>
        </div>
        <Image unoptimized src={HmSl1.src} alt={"banner image"} width={343} height={457} />
      </div>


      <div className='log-right'>
        <div className='log-rht-cntr'>
          <h4>Management Portal</h4>


          <h1 className="brand-name">Welcome Back</h1>
          <p>To continue, please enter your email and password </p>
          <LoginForm />

          <h5><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5.59961 19.9203L7.12357 18.7012L7.13478 18.6926C7.45249 18.4384 7.61281 18.3101 7.79168 18.2188C7.95216 18.1368 8.12328 18.0771 8.2998 18.0408C8.49877 18 8.70603 18 9.12207 18H17.8031C18.921 18 19.4806 18 19.908 17.7822C20.2843 17.5905 20.5905 17.2842 20.7822 16.9079C21 16.4805 21 15.9215 21 14.8036V7.19691C21 6.07899 21 5.5192 20.7822 5.0918C20.5905 4.71547 20.2837 4.40973 19.9074 4.21799C19.4796 4 18.9203 4 17.8002 4H6.2002C5.08009 4 4.51962 4 4.0918 4.21799C3.71547 4.40973 3.40973 4.71547 3.21799 5.0918C3 5.51962 3 6.08009 3 7.2002V18.6712C3 19.7369 3 20.2696 3.21846 20.5433C3.40845 20.7813 3.69644 20.9198 4.00098 20.9195C4.35115 20.9191 4.76744 20.5861 5.59961 19.9203Z" stroke="#848484" strokeWidth="2" strokeLinecap="round" stroke-linejoin="round" />
          </svg> Report Error.</h5>

        </div>
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