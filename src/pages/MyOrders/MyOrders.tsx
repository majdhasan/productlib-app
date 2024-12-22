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
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonAlert,
    IonThumbnail,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './MyOrders.css';

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
    const [orders, setOrders] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const history = useHistory();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const storedUser = localStorage.getItem('user');
            if (!storedUser) {
                setErrorMessage('You need to log in to view orders.');
                return;
            }

            const user = JSON.parse(storedUser);
            const response = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch orders.');
            }

            const data = await response.json();
            setOrders(data);
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
                    <IonTitle>My Orders</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                    <IonRefresherContent pullingText="Pull to refresh" refreshingSpinner="bubbles" />
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
                                    <h2>Order #{order.id}</h2>
                                    <p>
                                        <strong>Status:</strong> {order.cart.status === 'ORDERED' ? 'Ordered' : 'Pending'}
                                    </p>
                                    <p>
                                        <strong>Created At:</strong> {formatDate(order.createdAt)}{' '}
                                        {formatTime(order.createdAt)}
                                    </p>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                        {order.cart.items.map((item: any) => (
                                            <IonThumbnail key={item.id}>
                                                <img
                                                    src={`http://localhost:8080/images/${item.product.image}`}
                                                    alt={item.product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
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
                        <h2>No orders found.</h2>
                    </IonText>
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

export default MyOrders;
