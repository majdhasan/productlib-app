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
  IonBackButton,
  IonLoading,
  IonText,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './ServiceDetails.css';

const ServiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the service ID from the URL
  const [service, setService] = useState<any>(null); // State for the service
  const [isLoading, setIsLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState<string | null>(null); // State for error message
  const history = useHistory();

  const handleBookSlot = () => {
    history.push(`/book/${id}`); // Navigate to the booking page
  };

  useEffect(() => {
    // Fetch service details from the backend
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/services/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch service details.');
        }
        const data = await response.json();
        setService(data);
      } catch (error: any) {
        console.error('Error fetching service details:', error.message);
        setError(error.message || 'Failed to load service details.');
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
          <IonLoading isOpen={isLoading} message="Loading service details..." />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Error</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonText color="danger">
            <h3>{error}</h3>
          </IonText>
        </IonContent>
      </IonPage>
    );
  }

  if (!service) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
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
            <IonBackButton defaultHref="/" />
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
            <p><strong>Description:</strong> {service.description}</p>
            <p><strong>Cost:</strong> ${service.cost}</p>
            <p><strong>Duration:</strong> {service.duration} minutes</p>
            <p><strong>Category:</strong> {service.category}</p>
            {service.address && <p><strong>Address:</strong> {service.address}</p>}
            {service.latitude && service.longitude && (
              <p>
                <strong>Coordinates:</strong> ({service.latitude}, {service.longitude})
              </p>
            )}
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
