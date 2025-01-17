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
  IonModal,
  IonInput,
  IonButtons,
  IonIcon
} from '@ionic/react';
import { eyeOffOutline, eyeOutline } from 'ionicons/icons';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../translations';
import LoginComponent from '../../components/LoginComponent/LoginComponent';
import SignUpComponent from '../../components/SignUpComponent/SignUpComponent';
import './Profile.css';
import { UserAPI } from '../../services/apiService';

const ProfilePage: React.FC = () => {
  const { user, setUser, setCart, language, setLanguage, activeProfileTab, setActiveProfileTab, setToastColor, setToastMessage, setShowToast } = useAppContext();
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


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

  const handleChangePassword = () => {
    setShowModal(true);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setToastMessage(labels.passwordsDoNotMatch);
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    if (newPassword.length < 6) {
      setToastMessage(labels.passwordTooShort);
      setToastColor('danger');
      setShowToast(true);
      return;
    }

    if (newPassword === currentPassword) {
      setToastMessage(labels.newPasswordSameAsCurrent);
      setToastColor('danger');
      setShowToast(true);
      return
    }

    try {
      await UserAPI.changePassword(user.id, currentPassword, newPassword)
      setToastColor('success');
      setToastMessage(labels.passwordChangeSuccess);
      setShowToast(true);
      setShowModal(false);
    }
    catch (error: any) {
      setToastMessage(labels.passwordChangeFailed + ": " + error.message);
      setToastColor('danger');
      setShowToast(true);
    }
    finally {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
            <IonButton onClick={handleChangePassword}>
              {labels.changePassword}
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
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{labels.changePassword}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowModal(false)}>{labels.close}</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonItem>
              <IonLabel position="stacked">{labels.currentPassword}</IonLabel>
              <IonInput
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onIonChange={(e) => setCurrentPassword(e.detail.value!)}
              />
              <IonButton slot="end" fill="clear" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                <IonIcon icon={showCurrentPassword ? eyeOffOutline : eyeOutline} />
              </IonButton>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{labels.newPassword}</IonLabel>
              <IonInput
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onIonChange={(e) => setNewPassword(e.detail.value!)}
              />
              <IonButton slot="end" fill="clear" onClick={() => setShowNewPassword(!showNewPassword)}>
                <IonIcon icon={showNewPassword ? eyeOffOutline : eyeOutline} />
              </IonButton>
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">{labels.confirmPassword}</IonLabel>
              <IonInput
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onIonChange={(e) => setConfirmPassword(e.detail.value!)}
              />
              <IonButton slot="end" fill="clear" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                <IonIcon icon={showConfirmPassword ? eyeOffOutline : eyeOutline} />
              </IonButton>
            </IonItem>
            <IonButton expand="block" onClick={handlePasswordChange}>
              {labels.submit}
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
