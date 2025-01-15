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
import { UserAPI } from '../../services/apiService';

const ProfilePage: React.FC = () => {
  const { user, setUser, setCart, language, setLanguage, activeProfileTab, setActiveProfileTab, setToastColor, setToastMessage, setShowToast } = useAppContext();

  const labels = translations[language];

  const handleLogout = () => {
    const confirmed = window.confirm(labels.logoutConfirmation || 'Are you sure you want to log out?');
    if (confirmed) {
      setUser(null);
      setCart(null);
      localStorage.removeItem('token');

      setToastColor('success');
      setToastMessage(labels.logoutSuccess);
      setShowToast(true);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(labels.deleteAccountConfirmation);
    if (confirmed) {
      try {
        await UserAPI.deleteUser(user.id);

        setUser(null);
        setCart(null);
        localStorage.removeItem('token');

        setToastColor('success');
        setToastMessage(labels.deleteAccountSuccess);
        setShowToast(true);

      } catch (error: any) {
        setToastMessage(labels.deletingAccountFailed + ": " + error.message);
        setToastColor('danger');
        setShowToast(true);
      }
    };
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{labels.profileTitle}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
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
            <IonButton color="danger" onClick={handleDeleteAccount}>
              {labels.deleteAccount}
            </IonButton>
            <IonButton color="danger" onClick={handleLogout}>
              {labels.logout}
            </IonButton>
          </>
        ) : (
          <>
            <IonSegment
              value={activeProfileTab}
              onIonChange={(e) => setActiveProfileTab(e.detail.value as 'login' | 'signup')}
            >
              <IonSegmentButton
                value="login"
                className={activeProfileTab === 'login' ? 'active-tab' : ''}
              >
                <IonLabel>{labels.login}</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton
                value="signup"
                className={activeProfileTab === 'signup' ? 'active-tab' : ''}
              >
                <IonLabel>{labels.signup}</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            <div className="tab-content-container">
              {activeProfileTab === 'login' && <LoginComponent />}
              {activeProfileTab === 'signup' && <SignUpComponent />}
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
