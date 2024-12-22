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
  IonTextarea,
  IonItem,
  IonLabel,
  IonInput,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const history = useHistory();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    setIsLoggedIn(!!storedUser);
  }, []);

  const handleAddToCart = async () => {
    const storedUser = localStorage.getItem('user');
    const storedCart = localStorage.getItem('cart');
  
    if (!storedUser) {
      history.push('/my-orders');
      return;
    }
  
    try {
      const user = JSON.parse(storedUser || '{}');
      let cart = JSON.parse(storedCart || 'null');
  
      // Ensure cart is present in localStorage
      if (!cart) {
        alert('Cart information missing. Please log in again.');
        history.push('/my-orders');
        return;
      }
  
      // Add the product to the cart
      const updatedCart = {
        ...cart,
        items: [
          ...cart.items,
          { productId: product.id, quantity, notes },
        ],
      };
  
      // Update the cart on the server
      const updateResponse = await fetch(`http://localhost:8080/api/cart/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCart),
      });
  
      if (!updateResponse.ok) {
        throw new Error('Failed to update the cart.');
      }
  
      const updatedCartData = await updateResponse.json();
      localStorage.setItem('cart', JSON.stringify(updatedCartData));
  
      alert('Product added to cart successfully!');
    } catch (error) {
      console.error('Error adding product to cart:', error.message);
      alert('Failed to add product to cart.');
    }
  };
  

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product details.');
        }
        const data = await response.json();
        setProduct(data);
      } catch (error: any) {
        console.error('Error fetching product details:', error.message);
        setError(error.message || 'Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
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
        <div className="custom-controls">
          <IonItem>
            <IonLabel>Quantity</IonLabel>
            <div className="quantity-controls">
              <IonButton onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</IonButton>
              <span>{quantity}</span>
              <IonButton onClick={() => setQuantity(quantity + 1)}>+</IonButton>
            </div>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Notes</IonLabel>
            <IonTextarea
              rows={4}
              value={notes}
              placeholder="Add additional details or instructions..."
              onIonChange={(e) => setNotes(e.detail.value!)}
            />
          </IonItem>
        </div>
        <div className="book-button-container">
          <IonButton expand="block" onClick={handleAddToCart}>
            {isLoggedIn ? 'Add to Cart' : 'Log in to order'}
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProductDetails;
