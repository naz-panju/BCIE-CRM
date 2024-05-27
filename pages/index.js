import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, getSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { BranchesApi } from "@/data/Endpoints/Listing";
import Layout from "@/Components/Common/Layout";
import { Button } from "@mui/material";
import { AcUnit } from "@mui/icons-material";
import axios from "axios";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const session = useSession();
  const router = useRouter()

  console.log(session);

  useEffect(() => {

    if (session?.data?.user?.role?.id == 3) {
      router.push('/lead');
    } else if (session?.data?.user?.role?.id == 4) {
      router.push('/lead');
    } else if (session?.data?.user?.role?.id == 5) {
      router.push('/lead');
    } else if (session?.data?.user?.role?.id == 6) {
      router.push('/applications-unsubmitted');
    }
    // Redirect to the new home page
  }, []);


}


export async function getServerSideProps(context) {
  const session = await getSession(context)
  // console.log('yyy', session);

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