import LeadDetail from '@/Components/LeadDetails/LeadDetail'
import Layout from '@/Components/Common/Layout'
import React, { useEffect } from 'react'
import { getSession } from 'next-auth/react'
import { LeadApi } from '@/data/Endpoints/Lead'
import axios from 'axios'


function Slug() {

    return (
        <Layout>
            <LeadDetail />
        </Layout>

    )
}

export default Slug



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
    else {

        const { slug } = context.params;

        const apiToken = session.user.token;

        const config = {
            headers: {
                'Authorization': `Bearer ${apiToken}`
            }
        };
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_API_PATH}leads/view/${slug}`, config);
            // Perform a check to see if the slug exists in your API
            // const isValidSlug = await checkIfSlugExists(slug);

            // // If the slug doesn't exist, return a 404 error
            if (!response?.data?.data) {
                return {
                    notFound: true,
                };
            }
        } catch (error) {
            if (error?.response?.status == 400) {
                return {
                    notFound: true,
                };
            }
        }


        // Continue with your logic if the session exists and the slug is valid
    }
    return {
        props: { session },
    };
}
