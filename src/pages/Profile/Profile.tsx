import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption
} from '@ionic/react';
import LoginComponent from '../../components/LoginComponent/LoginComponent';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../translations';

const ProfilePage: React.FC = () => {
  const { user, setUser, setCart, language, setLanguage } = useAppContext();
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const labels = translations[language];

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/profile/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, dateOfBirth,preferredLanguage: language, }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile.');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCart(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {user ? (
          <>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">{labels.firstName}</IonLabel>
                <IonInput value={firstName} onIonChange={(e) => setFirstName(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{labels.lastName}</IonLabel>
                <IonInput value={lastName} onIonChange={(e) => setLastName(e.detail.value!)} />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{labels.dateOfBirth}</IonLabel>
                <IonInput
                  type="date"
                  value={dateOfBirth}
                  onIonChange={(e) => setDateOfBirth(e.detail.value!)}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{labels.selectLanguage}</IonLabel>
                <IonSelect value={language} onIonChange={(e) => setLanguage(e.detail.value)}>
                  <IonSelectOption value="en">English</IonSelectOption>
                  <IonSelectOption value="ar">العربية</IonSelectOption>
                  <IonSelectOption value="he">עברית</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonList>

            <IonButton expand="block" onClick={handleUpdateProfile}>
              Update Profile
            </IonButton>
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              Logout
            </IonButton>
          </>
        ) : (
          <>
            <IonSegment
              value={activeTab}
              onIonChange={(e) => setActiveTab(e.detail.value as 'login' | 'signup')}
            >
              <IonSegmentButton value="login">
                <IonLabel>Login</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="signup">
                <IonLabel>Sign Up</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <div className="tab-content-container">
              {activeTab === 'login' && <LoginComponent />}
              {activeTab === 'signup' && (
                <div>
                  {/* Placeholder for signup form */}
                  <p>Signup form goes here.</p>
                </div>
              )}
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
