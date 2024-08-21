import React from 'react';

const ThankYouPage = () => {
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Thank You!</h1>
                <p style={styles.message}>Your submission has been received.We will connect shortly.</p>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#e3f2fd',  // Light blue background
    },
    card: {
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '36px',
        marginBottom: '20px',
        color: '#1976d2',  // Darker blue for the title
    },
    message: {
        fontSize: '18px',
        marginBottom: '30px',
        color: '#546e7a',  // Slate blue for the message
    },
    button: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#1976d2',  // Blue button
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    }
};

export default ThankYouPage;
