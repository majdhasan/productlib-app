import React, {useEffect, useState} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import {
    IonBackButton,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonText,
    IonThumbnail,
    IonTitle,
    IonToolbar
} from '@ionic/react';
import {baseUrl, OrderAPI} from "../../services/apiService";
import {useAppContext} from "../../context/AppContext";
import {translations} from '../../translations';
import "./Confirmation.css";

const Confirmation: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const location = useLocation();
    const {language, isLoading, setIsLoading, setToastMessage, setShowToast, setToastColor, user} = useAppContext();
    const lastNameParam = new URLSearchParams(location.search).get('lastName') || '';
    const labels = translations[language];
    const [order, setOrder] = useState<any>(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setIsLoading(true);
            try {
                const fetchedOrder = user && user.id
                    ? await OrderAPI.fetchOrderById(id)
                    : await OrderAPI.fetchGuestOrderById(id, lastNameParam);
                setOrder(fetchedOrder);
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, setIsLoading, user, lastNameParam]);

    const cancelOrder = async () => {
        const confirmed = window.confirm(labels.cancelOrderConfirmation);
        if (confirmed) {
            setIsLoading(true);
            try {
                let updatedOrder = await OrderAPI.cancelOrder(id);
                setOrder(updatedOrder);
                setToastColor("success");
                setToastMessage(labels.orderCancelled);
                setShowToast(true);
            } catch (error) {
                console.error("Error cancelling order:", error);
                setToastColor("danger");
                setToastMessage(error.message);
                setShowToast(true);
            } finally {
                setIsLoading(false);
            }
        }
    };

    if (isLoading) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{labels.orderConfirmation}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonText>{labels.loading}</IonText>
                </IonContent>
            </IonPage>
        );
    }

    if (!order) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{labels.orderConfirmation}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent className="ion-padding">
                    <IonText>{labels.orderNotFound}</IonText>
                </IonContent>
            </IonPage>
        );
    }

    const calculateTotalPrice = () => {
        return order.items.reduce((total: number, item: any) => total + (item.productPrice * item.quantity), 0).toFixed(2);
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'SUBMITTED':
                return labels.statusSUBMITTED;
            case 'APPROVED':
                return labels.statusAPPROVED;
            case 'IN_PREPARATION':
                return labels.statusIN_PREPARATION;
            case 'DECLINED':
                return labels.statusDECLINED;
            case 'READY_FOR_PICKUP':
                return labels.statusREADY_FOR_PICKUP;
            case 'IN_DELIVERY':
                return labels.statusIN_DELIVERY;
            case 'DELIVERED':
                return labels.statusDELIVERED;
            case 'PICKED_UP':
                return labels.statusPICKED_UP;
            case 'FAILED':
                return labels.statusFAILED;
            case 'CANCELLED':
                return labels.statusCANCELLED;
            default:
                return labels.unknownStatus;
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'PICKUP':
                return labels.pickup;
            case 'DELIVERY':
                return labels.delivery;
            default:
                return labels.unknownStatus;
        }
    };
    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('he-IL');
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/"/>
                    </IonButtons>
                    <IonTitle>{labels.orderConfirmation}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{labels.products}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            {order.items.map((item: any, index: number) => (
                                <IonItem key={index}>
                                    <IonThumbnail slot="start">
                                        <img src={`${baseUrl}/files/thumbnail_${item.productImage}`}
                                             alt={item.productName}/>
                                    </IonThumbnail>
                                    <IonLabel>
                                        <h2>{item.productName}</h2>
                                        <p>{labels.quantity}: {item.quantity}</p>
                                        <p>{labels.price}: ₪{item.productPrice}</p>
                                        <p>
                                            <strong>{labels.rowTotal}:</strong> ₪
                                            {(item.productPrice * item.quantity).toFixed(2)}
                                        </p>
                                        {item.notes && <p><strong>{labels.notes}:</strong> {item.notes}</p>}
                                    </IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                        <IonLabel>{labels.total}: ₪{calculateTotalPrice()}</IonLabel>
                    </IonCardContent>
                </IonCard>
                <IonCard>
                    <IonCardHeader>
                        <IonCardTitle>{labels.orderDetails}</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                        <IonList>
                            <IonItem>
                                <IonLabel>{labels.orderStatus}</IonLabel>
                                <IonText>{getStatusLabel(order.status)}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>{labels.orderType}</IonLabel>
                                <IonText>{getTypeLabel(order.type)}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>{labels.wishedTime}</IonLabel>
                                <IonText>{order.wishedPickupTime ? formatDateTime(order.wishedPickupTime) : labels.asSoonAsPossible}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>{labels.firstName}</IonLabel>
                                <IonText>{order.firstName}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>{labels.lastName}</IonLabel>
                                <IonText>{order.lastName}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>{labels.phoneNumber}</IonLabel>
                                <IonText>{order.phone}</IonText>
                            </IonItem>
                            <IonItem>
                                <IonLabel>{labels.orderAddress}</IonLabel>
                                {/* TODO: replace with order address when applicable */}
                                <IonText className="multi-line-text">{order.address}</IonText>
                            </IonItem>
                            {order.notes && (
                                <IonItem>
                                    <IonLabel>{labels.notes}</IonLabel>
                                    <IonText className="multi-line-text">{order.notes}</IonText>
                                </IonItem>
                            )}
                        </IonList>
                    </IonCardContent>
                </IonCard>
                {(order.status === 'SUBMITTED' || order.status === 'APPROVED') && (
                    <IonButton expand="block" color="danger" onClick={cancelOrder}>
                        {labels.cancelOrder}
                    </IonButton>
                )}
            </IonContent>
        </IonPage>
    );
};

export default Confirmation;