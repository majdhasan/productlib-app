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
import { useParams } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get the product ID from the URL
  const [product, setProduct] = useState<any>(null); // State for the product
  const [isLoading, setIsLoading] = useState(true); // State for loading spinner
  const [error, setError] = useState<string | null>(null); // State for error message

  const handleAddToCart = () => {

  };

  useEffect(() => {
    // Fetch product details from the backend
    const fetchServiceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details.');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product details:', error.message);
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
          <IonLoading isOpen={isLoading} message="Loading product details..." />
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

  if (!product) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/" />
            </IonButtons>
            <IonTitle>Product Not Found</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <p>The requested product could not be found.</p>
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
          <IonTitle>Product Details</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{product.name}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Cost:</strong> ${product.cost}</p>
            <p><strong>Category:</strong> {product.category}</p>
          </IonCardContent>
        </IonCard>
        <div className="book-button-container">
          <IonButton expand="block" onClick={handleAddToCart}>
            Add to Cart
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetails;
