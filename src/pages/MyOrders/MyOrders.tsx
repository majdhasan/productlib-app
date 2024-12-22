import React, { useState, useEffect } from 'react';
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonRefresher,
    IonRefresherContent,
    IonAlert,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonInput,
    IonSegment,
    IonSegmentButton,
    useIonToast,
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import './MyOrders.css';

// Helper function to format timestamps
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
    const [email, setEmail] = useState<string>('');
    const [orderId, setOrderId] = useState<string>(''); // For lookup
    const [orders, setOrders] = useState<any[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'login' | 'lookup'>('login'); // Toggle between login and lookup tabs
    const history = useHistory();
    const [presentToast] = useIonToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleLoginSuccess = (user: any) => {
        localStorage.setItem('user', JSON.stringify(user));
        // Fetch orders or refresh the page
        fetchOrders();
    };

    const fetchOrders = async () => {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) return;

        const user = JSON.parse(storedUser);
        setEmail(user.email);

        try {
            const response = await fetch(`http://localhost:8080/api/orders/user/${user.id}`);
            if (!response.ok) {
                throw new Error("Failed to fetch orders");
            }
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    };


    const handleRefresh = async (event: CustomEvent) => {
        await fetchOrders();
        event.detail.complete();
    };

    const handleLookup = async () => {
        try {
            const response = await fetch(
                `http://localhost:8080/api/orders/lookup?email=${email}&orderId=${orderId}`
            );

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || 'Failed to lookup order.');
                return;
            }

            const order = await response.json();
            history.push(`/confirmation/${order.id}`); // Navigate to confirmation page
        } catch (error) {
            setErrorMessage('An error occurred during lookup. Please try again.');
            console.error(error);
        }
    };

    const groupOrdersByDate = (): { [key: string]: any[] } => {
        const sortedOrders = [...orders].sort(
            (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
        );

        return sortedOrders.reduce((grouped: { [key: string]: any[] }, order) => {
            const date = formatDate(order.time);
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(order);
            return grouped;
        }, {});
    };

    const groupedOrders = groupOrdersByDate();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>My Orders</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                {!localStorage.getItem('user') ? (
                    <>
                        <IonSegment
                            value={activeTab}
                            onIonChange={(e) => setActiveTab(e.detail.value as 'login' | 'lookup')}
                        >
                            <IonSegmentButton value="login">
                                <IonLabel>Login</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="lookup">
                                <IonLabel>Lookup</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>

                        {activeTab === 'login' && (
                            <div className="tab-content-container">
                                <LoginComponent onLoginSuccess={handleLoginSuccess} />
                            </div>
                        )}

                        {activeTab === 'lookup' && (
                            <div className="tab-content-container">
                                <IonList>
                                    <IonItem>
                                        <IonLabel position="stacked">Email</IonLabel>
                                        <IonInput
                                            value={email}
                                            placeholder="Enter your email"
                                            onIonChange={(e) => setEmail(e.detail.value!)}
                                        />
                                    </IonItem>
                                    <IonItem>
                                        <IonLabel position="stacked">Order ID</IonLabel>
                                        <IonInput
                                            value={orderId}
                                            placeholder="Enter your order ID"
                                            onIonChange={(e) => setOrderId(e.detail.value!)}
                                        />
                                    </IonItem>
                                </IonList>
                                <IonButton expand="block" type="button" onClick={handleLookup}>
                                    Lookup Order
                                </IonButton>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
                            <IonRefresherContent
                                pullingText="Pull to refresh"
                                refreshingSpinner="bubbles"
                            ></IonRefresherContent>
                        </IonRefresher>

                        {Object.keys(groupedOrders).length > 0 ? (
                            Object.entries(groupedOrders).map(([date, orders]) => (
                                <div key={date}>
                                    <IonText color="primary">
                                        <h3 className="date-bubble">{date}</h3>
                                    </IonText>
                                    <IonList className="order-list">
                                        {orders.map((order) => (
                                            <IonItem
                                                key={order.id}
                                                button
                                                onClick={() => history.push(`/confirmation/${order.id}`)}
                                            >
                                                <IonLabel>
                                                    <h3>{order.serviceEntity?.name || "Service Name Unavailable"}</h3>
                                                    <p>
                                                        {formatTime(order.startTime)} - {formatTime(order.endTime)}
                                                    </p>
                                                    <p className={order.isPaid ? "paid-status" : "unpaid-status"}>
                                                        {order.isPaid ? "Paid" : "Unpaid"}
                                                    </p>
                                                </IonLabel>
                                            </IonItem>
                                        ))}
                                    </IonList>
                                </div>
                            ))
                        ) : (
                            <div className="empty-orders">
                                <IonText color="medium">
                                    <p>No orders found. Start exploring and order your favorite food!</p>
                                </IonText>
                            </div>
                        )}


                    </>
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
