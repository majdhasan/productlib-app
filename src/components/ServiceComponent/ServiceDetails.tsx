import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonButtons,
  IonBackButton
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './ServiceDetails.css';

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the service ID from the URL
  const [service, setService] = useState<any>(null); // State for the service
  const [isLoading, setIsLoading] = useState(true); // State for loading spinner
  const history = useHistory();

  const handleBookSlot = () => {
    history.push(`/book/${id}`); // Navigate to the booking page
  };

  useEffect(() => {
    // Fetch service details from the backend
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/services/${id}`);
        const data = await response.json();
        setService(data);
      } catch (error) {
        console.error('Error fetching service details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceDetails();
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
          <p>Loading service details...</p>
        </IonContent>
      </IonPage>
    );
  }

  if (!service) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Service Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>The requested service could not be found.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton></IonBackButton>
          </IonButtons>
          <IonTitle>Service Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{service.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>{service.description}</p>
            <p>Cost: ${service.cost}</p>
            <p>Duration: {service.duration} minutes</p>
            <p>Category: {service.category}</p>
          </IonCardContent>
        </IonCard>
        <div className="book-button-container">
          <IonButton expand="block" onClick={handleBookSlot}>
            Book a Slot Now
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ServiceDetails;
