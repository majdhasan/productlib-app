import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import "./Confirmation.css";

const Confirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the order details
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/orders/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order.");
        }
        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders(); // Fetch data on mount
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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
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
