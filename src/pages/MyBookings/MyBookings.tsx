import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonButton,
    IonLabel,
    IonItem,
    IonList,
    IonAlert,
    IonSegment,
    IonSegmentButton,
    IonText,
    IonRefresher,
    IonRefresherContent,
    useIonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './MyBookings.css';

// Helper function to format timestamps
const formatDate = (timestamp: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };
    return new Date(timestamp).toLocaleDateString(undefined, options);
};

const formatTime = (timestamp: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(timestamp).toLocaleTimeString(undefined, options);
};

const MyBookings: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>(''); // For login
    const [bookingId, setBookingId] = useState<string>(''); // For lookup
    const [bookings, setBookings] = useState<any[]>([]); // State for bookings
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'login' | 'lookup'>('login'); // Toggle between tabs
    const history = useHistory();
    const [presentToast] = useIonToast();
    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false); // State for logout prompt


    useEffect(() => {
        fetchBookings();
    }, []);

    // Fetch bookings based on the logged-in user's ID
    const fetchBookings = async () => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        setEmail(user.email);

        try {
            const response = await fetch(`http://localhost:8080/api/bookings/user/${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await fetchBookings();
        event.detail.complete(); // Notify Ionic that the refresh is complete
    };

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Login failed. Please check your credentials.');
                return;
            }

            const user = await response.json();
            localStorage.setItem('user', JSON.stringify(user));
            setEmail(user.email); // Set email after login
            setPassword(''); // Clear password field
            setShowLogoutPrompt(false); // Reset logout prompt state
            fetchBookings(); // Fetch bookings after login

            // Show success toast
            presentToast({
                message: 'Login successful!',
                duration: 2000,
                position: 'bottom',
            });
        } catch (error) {
            setErrorMessage('An error occurred during login. Please try again.');
            console.error(error);
        }
    };

    const handleLookup = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/bookings/lookup?email=${email}&bookingId=${bookingId}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to lookup booking.');
                return;
            }

            const booking = await response.json();
            history.push(`/confirmation/${booking.id}`); // Navigate to confirmation page
        } catch (error) {
            setErrorMessage('An error occurred during lookup. Please try again.');
            console.error(error);
        }
    };


    const handleLogout = () => {
        setShowLogoutPrompt(true); // Show logout confirmation
    };

    const confirmLogout = () => {
        localStorage.removeItem('user');
        setEmail('');
        setBookings([]);
        setShowLogoutPrompt(false); // Reset logout prompt state

        // Show success toast
        presentToast({
            message: 'Logout successful!',
            duration: 2000,
            position: 'bottom',
        });
    };

    const cancelLogout = () => {
        setShowLogoutPrompt(false); // Cancel logout prompt
    };

    const groupBookingsByDate = (): { [key: string]: any[] } => {
        // Sort bookings by startTime in descending order (newest to oldest)
        const sortedBookings = [...bookings].sort(
            (a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );

        // Group sorted bookings by date
        return sortedBookings.reduce((grouped: { [key: string]: any[] }, booking) => {
            const date = formatDate(booking.startTime); // Format the date for grouping
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(booking);
            return grouped;
        }, {});
    };


    const groupedBookings = groupBookingsByDate();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Bookings</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {!localStorage.getItem('user') ? (
                    <>
                        <IonSegment
                            value={activeTab}
                            onIonChange={(e) => setActiveTab(e.detail.value as 'login' | 'lookup')}
                        >
                            <IonSegmentButton value="login">
                                <IonLabel>Login</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="lookup">
                                <IonLabel>Lookup</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>

                        {activeTab === 'login' && (
                            <div>
                                <IonList>
                                    <IonItem>
                                        <IonLabel position="stacked">Email</IonLabel>
                                        <IonInput
                                            value={email}
                                            placeholder="Enter your email"
                                            onIonChange={(e) => setEmail(e.detail.value!)}
                                        />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="stacked">Password</IonLabel>
                                        <IonInput
                                            type="password"
                                            value={password}
                                            placeholder="Enter your password"
                                            onIonChange={(e) => setPassword(e.detail.value!)}
                                        />
                                    </IonItem>
                                </IonList>
                                <IonButton expand="block" type="button" onClick={handleLogin}>
                                    Login
                                </IonButton>
                            </div>
                        )}

                        {activeTab === 'lookup' && (
                            <div>
                                <IonList>
                                    <IonItem>
                                        <IonLabel position="stacked">Email</IonLabel>
                                        <IonInput
                                            value={email}
                                            placeholder="Enter your email"
                                            onIonChange={(e) => setEmail(e.detail.value!)}
                                        />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="stacked">Booking ID</IonLabel>
                                        <IonInput
                                            value={bookingId}
                                            placeholder="Enter your booking ID"
                                            onIonChange={(e) => setBookingId(e.detail.value!)}
                                        />
                                    </IonItem>
                                </IonList>
                                <IonButton expand="block" type="button" onClick={handleLookup}>
                                    Lookup Booking
                                </IonButton>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <h2>Welcome, {email}</h2>
                        <IonButton color="danger" expand="block" onClick={handleLogout}>
                            Logout
                        </IonButton>


                        {/* Logout confirmation */}
                        <IonAlert
                            isOpen={showLogoutPrompt}
                            onDidDismiss={cancelLogout}
                            header="Logout"
                            message="Are you sure you want to log out?"
                            buttons={[
                                {
                                    text: 'Cancel',
                                    role: 'cancel',
                                    handler: cancelLogout,
                                },
                                {
                                    text: 'Logout',
                                    role: 'confirm',
                                    handler: confirmLogout,
                                },
                            ]}
                        />

                        {/* Pull-to-refresh functionality */}
                        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                            <IonRefresherContent
                                pullingText="Pull to refresh"
                                refreshingSpinner="bubbles"
                            ></IonRefresherContent>
                        </IonRefresher>

                        {Object.keys(groupedBookings).length > 0 ? (
                            Object.entries(groupedBookings).map(([date, bookings]) => (
                                <div key={date}>
                                    <IonText color="primary">
                                        <h3 className="date-bubble">{date}</h3>
                                    </IonText>
                                    <IonList className="booking-list">
                                        {bookings.map((booking) => (
                                            <IonItem
                                                key={booking.id}
                                                button
                                                onClick={() => history.push(`/confirmation/${booking.id}`)}
                                            >
                                                <IonLabel>
                                                    <h3>{booking.service.name}</h3>
                                                    <p>
                                                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                                                    </p>
                                                    <p className={booking.isPaid ? "paid-status" : "unpaid-status"}>
                                                        {booking.isPaid ? "Paid" : "Unpaid"}
                                                    </p>
                                                </IonLabel>
                                            </IonItem>
                                        ))}
                                    </IonList>
                                </div>
                            ))
                        ) : (
                            <div className="empty-bookings">
                                <IonText color="medium">
                                    <p>No bookings found. Start exploring and book your favorite service!</p>
                                </IonText>
                            </div>
                        )}
                    </>
                )}

                {errorMessage && (
                    <IonAlert
                        isOpen={!!errorMessage}
                        onDidDismiss={() => setErrorMessage(null)}
                        header="Error"
                        message={errorMessage}
                        buttons={['OK']}
                    />
                )}
            </IonContent>
        </IonPage>
    );
};

export default MyBookings;