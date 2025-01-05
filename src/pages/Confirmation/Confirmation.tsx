import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonList, IonText, IonThumbnail, IonCard, IonCardHeader, IonCardTitle, IonCardContent } from '@ionic/react';
import { OrderAPI } from "../../services/apiService";
import { useAppContext } from "../../context/AppContext";
import { translations } from '../../translations';
import "./Confirmation.css";

const Confirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, isLoading, setIsLoading } = useAppContext();
  const labels = translations[language];
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const fetchedOrder = await OrderAPI.fetchOrderById(id);
        setOrder(fetchedOrder);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, setIsLoading]);

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

  const calculateTotalCost = () => {
    return order.cart.items.reduce((total: number, item: any) => total + (item.productPrice * item.quantity), 0).toFixed(2);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return labels.statusSUBMITTED;
      case 'APPROVED':
        return labels.statusAPPROVED;
      case 'READY_FOR_PICKUP':
        return labels.statusREADY_FOR_PICKUP;
      case 'IN_DELIVERY':
        return labels.statusIN_DELIVERY;
      case 'DELIVERED':
        return labels.statusDELIVERED;
      case 'FAILED':
        return labels.statusFAILED;
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{labels.orderConfirmation}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
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
                <IonLabel>{labels.wishedPickupTime}</IonLabel>
                <IonText>{order.wishedPickupTime || labels.asSoonAsPossible}</IonText>
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
                <IonText>{order.address}</IonText>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{labels.products}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {order.cart.items.map((item: any, index: number) => (
                <IonItem key={index}>
                  <IonThumbnail slot="start">
                    <img
                      src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`}
                      alt={item.product.name}
                    />
                  </IonThumbnail>
                  <IonLabel>
                    <h2>{item.product.name}</h2>
                    <p>{labels.quantity}: {item.quantity}</p>
                    <p>{labels.price}: ₪{item.productPrice}</p>
                    <p>
                      <strong>{labels.rowTotal}:</strong> ₪
                      {(item.productPrice * item.quantity).toFixed(2)}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
            <IonItem>
              <IonLabel>
                <h2>{labels.total}</h2>
              </IonLabel>
              <IonText>
                <h2>₪{calculateTotalCost()}</h2>
              </IonText>
            </IonItem>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Confirmation;