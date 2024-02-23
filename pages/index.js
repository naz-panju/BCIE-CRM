import Image from "next/image";
import { Inter } from "next/font/google";
import { useSession, getSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { BranchesApi } from "@/data/Endpoints/test";
import Layout from "@/Components/Common/Layout";
import { Button } from "@mui/material";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  const { data: session, status } = useSession();

  const fecthTask = async () => {
    const response = await BranchesApi.get()
    console.log(response);
  }

  useEffect(() => {
    if (status === "authenticated") {
      fecthTask()
    }
  }, [status])

  return (
    <Layout>
     
        <Button sx={{mt:2}} variant="outlined" onClick={() => signOut()}>Signout</Button>
       
    </Layout>
  );
}


export async function getServerSideProps(context) {
  const session = await getSession(context)


  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
}