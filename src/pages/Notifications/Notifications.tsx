import React from 'react';
import {IonContent, IonHeader, IonList, IonPage, IonText, IonTitle, IonToolbar, useIonViewDidEnter} from '@ionic/react';
import { translations } from '../../translations';
import { useAppContext } from '../../context/AppContext';
import { NotificationsAPI } from '../../services/apiService';
import NotificationItem from './NotificationItem';
import './Notifications.css'; // Import the CSS file

const Notifications: React.FC = () => {
    const { language, notifications, setNotifications } = useAppContext();
    const labels = translations[language];

    const sortedNotifications = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const markNotificationsRead = async () => {
        try {
            setTimeout(async () => {
                const data = await NotificationsAPI.markNotificationsRead();
                setNotifications(data);
            }, 4000); // Delay by 5 seconds
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useIonViewDidEnter(() => {
        markNotificationsRead();
    });

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{labels.notifications}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {sortedNotifications.length > 0 ? (
                    <IonList>
                        {sortedNotifications.map(notification => (
                            <NotificationItem key={notification.id} notification={notification} />
                        ))}
                    </IonList>
                ) : (
                    <IonText color="medium" className="ion-text-center">
                        <h2>{labels.noNotifications}</h2>
                    </IonText>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Notifications;