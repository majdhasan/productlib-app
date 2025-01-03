import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonSelect,
  IonSelectOption,
  IonSegment,
  IonSegmentButton,
} from '@ionic/react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../translations';
import LoginComponent from '../../components/LoginComponent/LoginComponent';
import SignUpComponent from '../../components/SignUpComponent/SignUpComponent';
import './Profile.css';

const ProfilePage: React.FC = () => {
  const { user, setUser, setCart, language, setLanguage, setToastColor, setToastMessage, setShowToast } = useAppContext();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  const labels = translations[language];

  const handleLogout = () => {
    setUser(null);
    setCart(null);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{labels.profileTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="profile-container">
        {user ? (
          <>
            <IonList>
              <IonItem className="profile-item">
                <IonLabel position="stacked">{labels.firstName}</IonLabel>
                <IonLabel className="view-mode">{user.firstName}</IonLabel>
              </IonItem>
              <IonItem className="profile-item">
                <IonLabel position="stacked">{labels.lastName}</IonLabel>
                <IonLabel className="view-mode">{user.lastName}</IonLabel>
              </IonItem>
              <IonItem className="profile-item">
                <IonLabel position="stacked">{labels.email}</IonLabel>
                <IonLabel className="view-mode">{user.email}</IonLabel>
              </IonItem>
              <IonItem className="profile-item">
                <IonLabel position="stacked">{labels.phoneNumber}</IonLabel>
                <IonLabel className="view-mode">{user.phoneNumber}</IonLabel>
              </IonItem>
            </IonList>
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              {labels.logout}
            </IonButton>
          </>
        ) : (
          <>
            <IonSegment
              value={activeTab}
              onIonChange={(e) => setActiveTab(e.detail.value as 'login' | 'signup')}
            >
              <IonSegmentButton value="login">
                <IonLabel>{labels.login}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="signup">
                <IonLabel>{labels.signup}</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <div className="tab-content-container">
              {activeTab === 'login' && <LoginComponent />}
              {activeTab === 'signup' && <SignUpComponent />}
            </div>
          </>
        )}

        <div className="application-settings">
          <IonList>
            <IonItem>
              <IonLabel className="application-settings-header">{labels.applicationSettings}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>{labels.selectLanguage}</IonLabel>
              <IonSelect value={language} onIonChange={(e) => setLanguage(e.detail.value)}>
                <IonSelectOption value="en">English</IonSelectOption>
                <IonSelectOption value="ar">العربية</IonSelectOption>
                <IonSelectOption value="he">עברית</IonSelectOption>
              </IonSelect>
            </IonItem>
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
