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
    IonBadge,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { UserAPI } from '../../services/apiService';
import './MyOrders.css';
import { translations } from '../../translations';

enum OrderStatus {
    SUBMITTED = 'Submitted',
    APPROVED = 'Approved',
    READY_FOR_PICKUP = 'Ready for Pickup',
    IN_DELIVERY = 'In Delivery',
    SUCCESSFUL = 'Successful',
    FAILED = 'Failed',
}

// Helper functions to format date
const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0'); // Ensures 2 digits for the day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensures 2 digits for the month
    const year = date.getFullYear(); // Gets the full year
    return `${day}.${month}.${year}`; // Formats as DD.MM.YYYY
};

const formatTime = (timestamp: string, language: string): string => {
    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
    };
    return new Date(timestamp).toLocaleTimeString(language, options);
};

const groupOrdersByDate = (orders: any[], language: string) => {
    return orders.reduce((grouped: Record<string, any[]>, order: any) => {
        const dateKey = formatDate(order.createdAt, language);
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        grouped[dateKey].push(order);
        return grouped;
    }, {});
};

const MyOrders: React.FC = () => {
    const { user, language } = useAppContext();
    const [orders, setOrders] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const history = useHistory();

    const labels = translations[language];

    useEffect(() => {
        if (user) {
            fetchOrders();
        } else {
            setOrders([]); // Clear orders when the user logs out
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            if (!user) {
                return;
            }

            const fetchedOrders = await UserAPI.fetchUserOrders(user.id);
            const sortedOrders = fetchedOrders.sort(
                (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(sortedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setErrorMessage('Failed to load orders. Please try again later.');
        }
    };

    const handleRefresh = async (event: CustomEvent) => {
        await fetchOrders();
        event.detail.complete();
    };

    const groupedOrders = groupOrdersByDate(orders, language);

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

                {Object.keys(groupedOrders).length > 0 ? (
                    Object.keys(groupedOrders).map((date) => (
                        <div key={date} className="orders-group">
                            <IonBadge className="date-badge">{date}</IonBadge>
                            <IonList>
                                {groupedOrders[date].map((order: any) => (
                                    <IonItem
                                        key={order.id}
                                        button
                                        onClick={() => history.push(`/confirmation/${order.id}`)}
                                    >
                                        <IonLabel>
                                            <h2 className="order-header">
                                                {`${labels.orderNumber}${order.id}`}
                                                <IonBadge className="status-badge">
                                                    {labels[`status${order.status}` as keyof typeof labels] || labels.unknownStatus}
                                                </IonBadge>
                                            </h2>
                                            <p>
                                                <strong>{labels.createdAt}:</strong> {formatTime(order.createdAt, language)}
                                            </p>
                                            <div className="order-items">
                                                {order.cart.items.map((item: any) => (
                                                    <IonThumbnail key={item.id}>
                                                        <img
                                                            src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`}
                                                            alt={item.product.name}
                                                            className="item-thumbnail"
                                                        />
                                                    </IonThumbnail>
                                                ))}
                                            </div>
                                        </IonLabel>
                                    </IonItem>
                                ))}
                            </IonList>
                        </div>
                    ))
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
