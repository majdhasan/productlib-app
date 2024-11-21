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
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './MyBookings.css';

const MyBookings: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(''); // For login
  const [bookingId, setBookingId] = useState<string>(''); // For lookup
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'login' | 'lookup'>('login'); // Toggle between tabs
  const [loggedInUser, setLoggedInUser] = useState<any>(null); // Logged-in user details
  const history = useHistory();

  // Check if a user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, []);

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
  
      // Store the user details in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      setLoggedInUser(user); // Update logged-in user state
  
      // Set the tab to something valid (e.g., 'login' or navigate directly)
      setActiveTab('login');
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
      // Navigate to the confirmation page with the booking ID
      history.push(`/confirmation/${booking.id}`);
    } catch (error) {
      setErrorMessage('An error occurred during lookup. Please try again.');
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setLoggedInUser(null); // Clear user state
    setActiveTab('login'); // Switch to login tab
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Bookings</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loggedInUser ? (
          <div>
            <h2>Welcome, {loggedInUser.email}</h2>
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              Logout
            </IonButton>
            {/* Display user's bookings here */}
            <p>Your bookings will appear here.</p>
          </div>
        ) : (
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
                <IonButton expand="block" onClick={handleLogin}>
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
                <IonButton expand="block" onClick={handleLookup}>
                  Lookup Booking
                </IonButton>
              </div>
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
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default MyBookings;
