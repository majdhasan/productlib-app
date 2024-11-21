import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonButton, IonLabel } from '@ionic/react';
import { useUser } from '../../context/UserContext';
import { useHistory } from 'react-router-dom';

const Login: React.FC = () => {
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ id: data.id, email: data.email }); // Save user context
        history.push('/my-bookings'); // Redirect to My Bookings
      } else {
        console.error('Login failed');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLabel>Email</IonLabel>
        <IonInput
          value={email}
          onIonChange={(e) => setEmail(e.detail.value!)}
          placeholder="Enter your email"
        />
        <IonLabel>Password</IonLabel>
        <IonInput
          type="password"
          value={password}
          onIonChange={(e) => setPassword(e.detail.value!)}
          placeholder="Enter your password"
        />
        <IonButton expand="block" onClick={handleLogin}>
          Log In
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Login;
