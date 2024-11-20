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
  const [booking, setBooking] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the booking details
    const fetchBooking = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/bookings/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch booking.");
        }
        const data = await response.json();
        setBooking(data);
      } catch (error) {
        console.error("Error fetching booking:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking(); // Fetch data on mount
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

  if (!booking) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Booking Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>The booking could not be retrieved.</p>
        </IonContent>
      </IonPage>
    );
  }

  const statusMessage = booking.isPaid
    ? "Your booking is now confirmed!"
    : "Your reservation is awaiting payment.";

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Booking Confirmation</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>{statusMessage}</h2>
        <p>
          <strong>Booking ID:</strong> {booking.id}
        </p>
        <p>
          <strong>Start Time:</strong> {new Date(booking.startTime).toLocaleString()}
        </p>
        <p>
          <strong>End Time:</strong> {new Date(booking.endTime).toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={booking.isPaid ? "paid" : "unpaid"}>
            {booking.isPaid ? "Paid" : "Unpaid"}
          </span>
        </p>
        {!booking.isPaid && (
          <IonButton expand="block" color="success" onClick={() => history.push(`/payment/${id}`)}>
            Pay Now
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Confirmation;
