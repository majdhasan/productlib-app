import React, { useEffect, useState } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonBadge,
} from '@ionic/react';
import { useAppContext } from '../../context/AppContext';
import { UserAPI } from '../../services/apiService';
import './MyOrders.css';
import { translations } from '../../translations';
import OrderListItem from '../../components/OrderListItemComponent/OrderListItem';

// Helper functions to format date
const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0'); // Ensures 2 digits for the day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensures 2 digits for the month
    const year = date.getFullYear(); // Gets the full year
    return `${day}.${month}.${year}`; // Formats as DD.MM.YYYY
};

const groupOrdersByDate = (orders: any[], language: string) => {
    return orders.reduce((grouped: Record<string, any[]>, order: any) => {
        const dateKey = formatDate(order.createdAt);
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        grouped[dateKey].push(order);
        return grouped;
    }, {});
};

const MyOrders: React.FC = () => {
    const { user, language, orderSubmitted, setOrderSubmitted, setIsLoading } = useAppContext();
    const [orders, setOrders] = useState<any[]>([]);

    const labels = translations[language];

    const fetchOrders = async () => {
        setIsLoading(true);
        try {
            const fetchedOrders = await UserAPI.fetchUserOrders(user.id);
            const sortedOrders = fetchedOrders.sort(
                (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            setOrders(sortedOrders);
        } catch (error) {
            // TODO add toast message
            console.error('Error fetching orders:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            setIsLoading(false);
            setOrders([]);
            return;
        }

        fetchOrders();
    }, [user, setIsLoading]);

    useEffect(() => {
        if (orderSubmitted) {
            fetchOrders();
            setOrderSubmitted(false);
        }
    }, [orderSubmitted, setIsLoading]);

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
                                    <OrderListItem
                                        key={order.id}
                                        order={order}
                                        labels={labels}
                                        language={language}
                                    />
                                ))}
                            </IonList>
                        </div>
                    ))
                ) : (
                    <IonText color="medium" className="ion-text-center">
                        <h2>{user ? labels.noOrdersFound : labels.notLoggedIn}</h2>
                    </IonText>
                )}
            </IonContent>
        </IonPage>
    );
};

export default MyOrders;
