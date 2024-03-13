import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, getSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { BranchesApi } from "@/data/Endpoints/Listing";
import Layout from "@/Components/Common/Layout";
import { Button } from "@mui/material";
import { AcUnit } from "@mui/icons-material";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const { data: session, status } = useSession();



  useEffect(() => {
    // Redirect to the new home page
    window.location.href = '/lead';
  }, []);
  // useEffect(() => {
  //   if (status === "authenticated") {
  //     // fecthTask()
  //   }
  // }, [status])

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