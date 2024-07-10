import "@/styles/globals.css";
import "@/styles/Editor.css";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
// import { LocalizationProvider } from "@mui/x-date-pickers";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import 'react-phone-input-2/lib/style.css';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useEffect } from "react";
import { ListingApi } from "@/data/Endpoints/Listing";


export default function App({ Component, pageProps: { session, ...pageProps } }) {

  // console.log(pageProps);
  useEffect(() => {

    const session=sessionStorage.getItem('size')
    if(!session){
      ListingApi.maxFileSize().then((response)=>{
        sessionStorage.setItem('size',response?.data?.size)
      })
    }
    
  }, [])

  https://bcie.spider.ws/uploads/settings/fav65cc656288dd0.ico
  

  return <SessionProvider session={session}>
    <Toaster />
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Component {...pageProps} />
    </LocalizationProvider>
  </SessionProvider>
}
