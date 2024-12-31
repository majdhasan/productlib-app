import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import { OrderAPI } from "../../services/apiService";
import { useAppContext } from "../../context/AppContext";
import { translations } from '../../translations';
import "./Confirmation.css";

// TODO rework this

const Confirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language, isLoading, setIsLoading } = useAppContext();
  const labels = translations[language];

  const history = useHistory();
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
  }, [id]);

  if (isLoading) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>{labels.loading}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonSpinner />
        </IonContent>
      </IonPage>
    );
  }

  if (!order) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>{labels.orderNotFound}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>{labels.orderRetrievalFailed}</p>
        </IonContent>
      </IonPage>
    );
  }

  const statusMessage = order.isPaid
    ? labels.orderConfirmed
    : labels.orderAwaitingPayment;

  const calculateRowTotal = (quantity: number, price: number) =>
    quantity * price;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{labels.orderDetails}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>{statusMessage}</h2>
        <p>
          <strong>{labels.orderId}:</strong> {order.id}
        </p>
        <p>
          <span className={order.isPaid ? "paid" : "unpaid"}>
            {order.isPaid ? labels.statusPaid : labels.statusUnpaid}
          </span>
        </p>

        <IonList>
          {order.cart.items.map((item: any) => (
            <IonItem key={item.id}>
              <IonThumbnail slot="start">
                <img
                  // src={`http://localhost:8080/images/${item.product.image}`}
                  src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`}
                  alt={item.product.name}
                />
              </IonThumbnail>
              <IonLabel>
                <h2>{item.product.name}</h2>
                <p>
                  <strong>{labels.quantity}:</strong> {item.quantity}
                </p>
                <p>
                  <strong>{labels.pricePerUnit}:</strong> ₪{item.productPrice.toFixed(2)}
                </p>
                <p>
                  <strong>{labels.total}:</strong> ₪{calculateRowTotal(item.quantity, item.productPrice).toFixed(2)}
                </p>
                {item.notes && <p><strong>{labels.notes}:</strong> {item.notes}</p>}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {!order.isPaid && (
          <IonButton expand="block" color="success" onClick={() => history.push(`/payment/${id}`)}>
            {labels.payNow}
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Confirmation;