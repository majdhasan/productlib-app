import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; // For navigation
import './Services.css';

const Services: React.FC = () => {
  const [services, setServices] = useState([]); // State for services
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isLoading, setIsLoading] = useState(true); // State for loading spinner
  const history = useHistory(); // React Router hook for navigation

  useEffect(() => {
    // Fetch services from the backend
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/services'); // Replace with your API endpoint
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on search query
  const filteredServices = services.filter((service: any) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to the service details page
  const goToServiceDetails = (serviceId: number) => {
    history.push(`/services/${serviceId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Services</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">What are you looking for?</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          className="ion-searchbar"
          placeholder="Type here..."
          onIonInput={(e: any) => setSearchQuery(e.target.value)} // Update search query on input
        ></IonSearchbar>

        {isLoading ? (
          // Show a loading spinner while fetching data
          <div className="spinner-container">
            <IonSpinner name="bubbles" />
          </div>
        ) : (
          <IonList>
            {filteredServices.length > 0 ? (
              filteredServices.map((service: any) => (
                <IonItem
                  key={service.id}
                  button
                  onClick={() => goToServiceDetails(service.id)} // Navigate on click
                >
                  <IonLabel>
                    <h2>{service.name}</h2>
                    <p>{service.description}</p>
                    <p>Cost: ${service.cost}</p>
                    <p>Duration: {service.duration} minutes</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No services found</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Services;
