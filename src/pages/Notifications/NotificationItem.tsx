import React from 'react';
import { IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';

const NotificationItem: React.FC<{ notification: any }> = ({ notification }) => {
    const history = useHistory();

    const handleClick = () => {
        if (notification.orderId) {
            history.push(`/confirmation/${notification.orderId}`);
        }
    };

    return (
        <IonItem
            key={notification.id}
            className={notification.isRead ? 'read' : 'unread'}
            button={!!notification.orderId}
            onClick={handleClick}
        >
            {!notification.isRead && <div className="blue-dot"></div>}
            <IonLabel>
                <h2>{notification.title}</h2>
                <p>{notification.message}</p>
                <p>{new Date(notification.createdAt).toLocaleString()}</p>
            </IonLabel>
        </IonItem>
    );
};

export default NotificationItem;