import React, { useEffect, useState } from 'react';

import Image from "next/image";
import LogoIcon from '@/styles/logo65cc654bac92a.png';
import Logo from '@/styles/logo65cc655649912.png';

import { ArchiveOutlined, CrisisAlertOutlined, DescriptionOutlined, Email, EmailOutlined, EventOutlined, GroupOutlined, Groups2, Groups2Outlined, LinkOutlined, MenuOpen, NoteAltOutlined, Person2Outlined, PersonOutline, SettingsApplications, WhatsApp } from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { Menu } from '@mui/material';

const Sidebar = () => {

    const session = useSession()

    const { data } = session

    const [isExpanded, setIsExpanded] = useState(false);

    const router = useRouter()

    const handleMouseEnter = () => {
        setIsExpanded(true);
    };

    const handleMouseLeave = () => {
        setIsExpanded(false);
    };

    let SideBarOptions = [
        {
            title: 'Lead Manager',
            icon: PersonOutline,
            href: '/lead'
        },
        // {
        //     title: 'Applicants',
        //     icon: Groups2Outlined,
        //     href: '/applicants'
        // },
        {
            title: 'Archives',
            icon: ArchiveOutlined,
            href: '/archive'
        },
        {
            title: 'Alumni',
            icon: GroupOutlined,
            href: '/alumni'
        },
        {
            title: 'Applications',
            icon: DescriptionOutlined,
            href: '/applications'
        },
        {
            title: 'Task Manager',
            icon: NoteAltOutlined,
            href: '/task'
        },
        {
            title: 'Email Templates',
            icon: EmailOutlined,
            href: '/email-template'
        },
        {
            title: 'WhatsApp Templates',
            icon: WhatsApp,
            href: '/whatsapp-template'
        },
        {
            title: 'Events',
            icon: EventOutlined,
            href: '/events'
        },
        {
            title: 'Goals & Targets',
            icon: CrisisAlertOutlined,
            href: '/goals-and-targets'
        },
        {
            title: 'Referral Links',
            icon: LinkOutlined,
            href: '/referral-links'
        },
    ]

    // if (data?.user?.role?.id === 3) {
    //     SideBarOptions = SideBarOptions.filter(option => option.title !== 'WhatsApp Templates' && option.title !== 'Email Templates');
    // }


    // const filterUrl = (url) => {
    //     const urls = url.split("/").filter(Boolean); // Split the string by "/", then remove empty strings from the resulting array
    //     const firstUrl = '/' + urls[0];

    //     return firstUrl;
    // }

    const [isBodyClassAdded, setIsBodyClassAdded] = useState(false);

    const [sideBarActive, setSideBarActive] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedSettings = localStorage.getItem('settings');
            return storedSettings ? JSON.parse(storedSettings).sidebar : false;
        }
        return false;
    });

    const handleButtonClick = () => {
        // Toggle the state to add or remove the class
        setSideBarActive(!sideBarActive)
        localStorage.setItem('settings', JSON.stringify({ sidebar: !sideBarActive }));
        setIsBodyClassAdded((prev) => !prev);
    };

    useEffect(() => {
        if (sideBarActive) {
            document.body.classList.add('body-active');
        } else {
            document.body.classList.remove('body-active');
        }

        // Cleanup: remove the class when the component is unmounted
        return () => {
            document.body.classList.remove('body-active');
        };
    }, [sideBarActive]);

    return (




        <nav id="sidebar" className={`sidebar sidebar-mask active ${isExpanded ? 'active' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="sidebar__inner scrollCustom">
                <div className="site-logo onlyDesktop">
                   {/* <a href="#" className="inbl valigntop logo">
                        <Image src={LogoIcon} alt='LogoIcon' width={30} className='tiny-sidebar' />
                        <Image src={Logo} alt='LogoIcon' width={145} className='max-sidebar' />
                    </a>*/} 

                    <div className='logo-text-wrap'>

                    <svg xmlns="http://www.w3.org/2000/svg" width="49" height="15" viewBox="0 0 49 15" fill="none">
  <path d="M37.125 14.6921V0.30835H49.0018V2.95906H40.0017V6.16458H48.6731V8.81529H40.0017V12.0208H49.0018V14.6921H37.125Z" fill="white"/>
  <path d="M34.5232 0.30835V14.6921H31.6465V0.30835H34.5232Z" fill="white"/>
  <path d="M17.0701 7.52063C17.0701 10.2946 19.166 12.2467 22.0839 12.2467C24.1592 12.2467 25.7825 11.2809 26.5839 9.71929H29.625C28.7415 12.9453 25.7825 15.0002 22.0839 15.0002C17.5838 15.0002 14.1934 11.7947 14.1934 7.52063C14.1934 3.18497 17.5633 0 22.0839 0C25.7825 0 28.7209 2.05482 29.625 5.28088H26.5839C25.8031 3.69867 24.1798 2.75345 22.0839 2.75345C19.1455 2.75345 17.0701 4.68498 17.0701 7.52063Z" fill="white"/>
  <path d="M0 14.6921V0.30835H7.27405C10.2535 0.30835 12.2673 1.78782 12.2673 4.06866C12.2673 5.48649 11.3837 6.65773 10.0275 7.31528C11.8152 7.91117 12.9248 9.10297 12.9248 10.6852C12.9248 13.0893 10.5207 14.6921 7.27405 14.6921H0ZM9.5138 4.52072C9.5138 3.47277 8.56859 2.77413 7.27405 2.77413H2.87674V6.22622H7.27405C8.48639 6.22622 9.5138 5.50704 9.5138 4.52072ZM10.0275 10.418C10.0275 9.2468 9.0001 8.60981 7.27405 8.60981H2.87674V12.2057H7.27405C8.93845 12.2057 10.0275 11.5276 10.0275 10.418Z" fill="white"/>
</svg>
<div className='logo_sub'>Students Management Portal</div>
</div>

<div className='logo-text-small'>
BCIE
    </div>


                    
                </div>

                <ul className="list-unstyled components mainList" id="menuList">

                    {
                        SideBarOptions?.map((obj, index) => (

                            <li className={router?.route == obj?.href ? 'sidebar-selected' : ''} key={index}><Link href={obj?.href}><i><obj.icon fontSize='small' /></i><span>{obj?.title}</span></Link></li>
                        ))
                    }
                    {/* <li><a href='#'><i><DashboardOutlined fontSize='small' /></i><span>Dashboard</span></a></li>
                    <li><a href='#'><i><AccountBalanceOutlined fontSize='small' /></i><span>FormDesk</span></a></li>
                    <li><a href='#'><i><PersonOutline fontSize='small' /></i><span>Leads Manager</span></a></li>
                    <li><a href='#'><i><NoteAltOutlined fontSize='small' /></i><span>Application Manager</span></a></li>
                    <li><a href='#'><i><CampaignOutlined fontSize='small' /></i><span>Marketing</span></a></li>
                    <li><a href='#'><i><LeaderboardOutlined fontSize='small' /></i><span>Campaign Manager</span></a></li>
                    <li><a href='#'><i><HelpOutline fontSize='small' /></i><span>Query Manager</span></a></li>
                    <li><a href='#'><i><PaidOutlined fontSize='small' /></i><span>Payment Manager</span></a></li>
                    <li><a href='#'><i><PieChartOutline fontSize='small' /></i><span>Settings</span></a></li> */}
                    {/* <li><a href='#'><i><FontAwesomeIcon icon={faHouseChimney} /></i><span>Settings</span></a></li> */}
                </ul>
            </div>
        </nav>


    )
}

export default Sidebar;
