import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonButtons,
    IonBackButton
  } from '@ionic/react';
  import React, { useEffect, useState } from 'react';
  import { useParams } from 'react-router-dom'; // For accessing route parameters
  
  const ServiceDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Get the service ID from the URL
    const [service, setService] = useState<any>(null); // State for the service
    const [isLoading, setIsLoading] = useState(true); // State for loading spinner
  
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
          <IonButton expand="block">Block</IonButton>
        </IonContent>
      </IonPage>
    );
  };
  
  export default ServiceDetails;
  