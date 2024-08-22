import Layout from '@/Components/Common/Layout';
import { NotificationApi } from '@/data/Endpoints/Notification';
import { DeleteOutline } from '@mui/icons-material';
import { Grid } from '@mui/material';
import { red } from '@mui/material/colors';
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1)
    const [loadMore, setloadMore] = useState(false)

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = (noLoad) => {
        if (!noLoad) {
            setLoading(true);
        }
        NotificationApi.list().then((response) => {
            if (response?.status === 200) {
                setNotifications(response?.data);
            } else {
                console.error('Failed to fetch notifications');
            }
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        });
    };

    const fetchLoadMoreNotifications = (noLoad) => {
        if (!noLoad) {
            setLoading(true);
        }
        NotificationApi.list().then((response) => {
            if (response?.status === 200) {
                setNotifications(notifications.concat(response?.data?.data));
                // setNotifications(response?.data);
            } else {
                console.error('Failed to fetch notifications');
            }
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching notifications:', error);
            setLoading(false);
        });
    };
    const [deletingId, setDeletingId] = useState(null);
    const handleDelete = (id) => {
        setDeletingId(id);
        setTimeout(() => {
            const index = notifications?.data?.findIndex(obj => obj?.id === id);
            if (index !== -1) {
                const newList = {
                    ...notifications,
                    data: [
                        ...notifications.data.slice(0, index),
                        ...notifications.data.slice(index + 1)
                    ]
                };

                // console.log(newList);
                setNotifications(newList);
            }
        }, 500); // Wait for the fade-out transition to complete
        // Optionally make an API call to update the server-side data
        NotificationApi.delete({ id: id }).then((response) => {
            if (response?.status == 200 || response?.status == 201) {
                fetchNotifications(true)
                // setlist(response?.data);
            } else {
                toast.error(response?.response?.data?.message || 'Invalid Request')
            }
        });
    };

    console.log(notifications);


    return (
        <Layout>
            <div style={styles.container}>
                <h1 style={styles.title}>Notifications</h1>
                {loading ? (
                    <p style={styles.loading}>Loading notifications...</p>
                ) : (
                    <ul style={styles.list}>
                        {notifications?.data?.length > 0 ? (
                            <>
                                {notifications?.data?.map((notification, index) => (
                                    // <li key={index} style={styles.listItem}>
                                    <Grid container key={index} className={`p-5 border border-3 fade ${deletingId === notification.id ? 'out' : ''}`}>
                                        <Grid item md={11}><p style={styles.notificationMessage}>{notification.description}</p></Grid>
                                        <Grid item md={1}> <DeleteOutline onClick={() => handleDelete(notification?.id)} sx={{ color: red[400], cursor: 'pointer' }} fontSize='small' /></Grid>
                                    </Grid>
                                    // </li>
                                ))}
                                {
                                    (notifications?.data?.length < notifications?.meta?.total) &&
                                    <div className='loadmore-btn-block p-2'>
                                        {/* <CachedIcon />Load More */}
                                        <button onClick={fetchLoadMoreNotifications} className='loadmore-btn' >  {loadMore ? 'Loading' : 'Load More'} </button>
                                    </div>
                                }
                            </>
                        ) : (
                            <p style={styles.noNotifications}>No notifications available.</p>
                        )}
                    </ul>
                )}
            </div>
        </Layout>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '28px',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#1976d2',
    },
    loading: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#555',
    },
    list: {
        listStyleType: 'none',
        padding: '0',
    },
    listItem: {
        padding: '15px',
        borderBottom: '1px solid #ddd',
    },
    notificationTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#333',
    },
    notificationMessage: {
        fontSize: '16px',
        color: '#555',
        margin: '10px 0',
    },
    notificationDate: {
        fontSize: '14px',
        color: '#999',
    },
    noNotifications: {
        textAlign: 'center',
        fontSize: '18px',
        color: '#999',
    },
};

export default NotificationsPage;
