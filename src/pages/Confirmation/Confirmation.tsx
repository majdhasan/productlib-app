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
import "./Confirmation.css";

const Confirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

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
            <IonTitle>Loading...</IonTitle>
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
            <IonTitle>Order Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>The order could not be retrieved.</p>
        </IonContent>
      </IonPage>
    );
  }

  const statusMessage = order.isPaid
    ? "Your order is now confirmed!"
    : "Your reservation is awaiting payment.";

  const calculateRowTotal = (quantity: number, price: number) =>
    quantity * price;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>Order Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>{statusMessage}</h2>
        <p>
          <strong>Order ID:</strong> {order.id}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={order.isPaid ? "paid" : "unpaid"}>
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
        </p>

        <IonList>
          {order.cart.items.map((item: any) => (
            <IonItem key={item.id}>
              <IonThumbnail slot="start">
                <img
                  src={`http://localhost:8080/images/${item.product.image}`}
                  alt={item.product.name}
                />
              </IonThumbnail>
              <IonLabel>
                <h2>{item.product.name}</h2>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Price per unit:</strong> ₪{item.productPrice.toFixed(2)}
                </p>
                <p>
                  <strong>Total:</strong> ₪{calculateRowTotal(item.quantity, item.productPrice).toFixed(2)}
                </p>
                {item.notes && <p><strong>Notes:</strong> {item.notes}</p>}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>

        {!order.isPaid && (
          <IonButton expand="block" color="success" onClick={() => history.push(`/payment/${id}`)}>
            Pay Now
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Confirmation;
