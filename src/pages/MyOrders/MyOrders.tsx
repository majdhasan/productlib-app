import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonAlert,
    IonThumbnail,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { UserAPI } from '../../services/apiService';
import './MyOrders.css';
import { translations } from '../../translations';


// Helper functions to format date and time
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

const MyOrders: React.FC = () => {
    const { user, language } = useAppContext(); // Access the user from AppContext
    const [orders, setOrders] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const history = useHistory();

    const labels = translations[language];

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            // Clear orders when the user logs out
            setOrders([]);
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            if (!user) {
                return;
            }

            const fetchedOrders = await UserAPI.fetchUserOrders(user.id);
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setErrorMessage('Failed to load orders. Please try again later.');
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await fetchOrders();
        event.detail.complete();
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{labels.myOrders}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent pullingText={labels.pullToRefresh} refreshingSpinner="bubbles" />
                </IonRefresher>
    
                {orders.length > 0 ? (
                    <IonList>
                        {orders.map((order: any) => (
                            <IonItem
                                key={order.id}
                                button
                                onClick={() => history.push(`/confirmation/${order.id}`)}
                            >
                                <IonLabel>
                                    <h2>{`${labels.orderNumber} ${order.id}`}</h2>
                                    <p>
                                        <strong>{labels.statusOrdered}</strong>{' '}
                                        {order.cart.status === 'ORDERED'
                                            ? labels.statusOrdered
                                            : labels.statusPending}
                                    </p>
                                    <p>
                                        <strong>{labels.createdAt}</strong> {formatDate(order.createdAt)}{' '}
                                        {formatTime(order.createdAt)}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        {order.cart.items.map((item: any) => (
                                            <IonThumbnail key={item.id}>
                                                <img
                                                    // src={`http://localhost:8080/images/${item.product.image}`}
                                                    src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`}
                                                    alt={item.product.name}
                                                    style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </IonThumbnail>
                                        ))}
                                    </div>
                                </IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                ) : (
                    <IonText color="medium" className="ion-text-center">
                        <h2>{user ? labels.noOrdersFound : labels.notLoggedIn}</h2>
                    </IonText>
                )}
    
                {errorMessage && (
                    <IonAlert
                        isOpen={!!errorMessage}
                        onDidDismiss={() => setErrorMessage(null)}
                        header={labels.errorHeader}
                        message={labels.errorLoadingOrders}
                        buttons={[labels.ok]}
                    />
                )}
            </IonContent>
        </IonPage>
    );
    
};

export default MyOrders;
