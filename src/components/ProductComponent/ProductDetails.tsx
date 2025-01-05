import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonButtons,
  IonBackButton,
  IonText,
  IonTextarea,
  IonItem,
  IonLabel,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { ProductAPI, CartAPI } from "../../services/apiService";
import { translations } from '../../translations';
import './ProductDetails.css';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { user, cart, language, setCart, setShowToast, setToastMessage, setToastColor, isLoading, setIsLoading } = useAppContext();
  const history = useHistory();

  const labels = translations[language];

  const handleAddToCart = async () => {
    try {
      if (!user || !user.id) {
        alert('User information missing. Please log in again.');
        history.push('/profile');
        return;
      }

      await CartAPI.addItemToCart(user.id, product.id, quantity, notes);
      const updatedCart = await CartAPI.fetchCart(cart.id);

      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      setToastColor('success');
      setToastMessage(labels.productAddedToCart);
      setShowToast(true);
    } catch (error: any) {
      setToastMessage(labels.failedToAddToCart);
      setToastColor('danger');
      setShowToast(true);
    }
  };

  const fetchProductDetails = async () => {
    setIsLoading(true);
    try {
      const data = await ProductAPI.fetchProductDetailsById(id)
      setProduct(data);
    } catch (error: any) {
      console.error('Error fetching product details:', error.message);
      setError(error.message || 'Failed to load product details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" />
          </IonButtons>
          <IonTitle>{labels.productDetails}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>

        {/* Error State */}
        {error && (
          <IonText color="danger" className="ion-padding">
            <h3>{error}</h3>
          </IonText>
        )}

        {/* Product Details */}
        {product && !isLoading && (
          <>
            <div className="product-image-container">
              <img src='https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png' alt={product.name} className="product-image" />
              {/* <img src={product.imageUrl} alt={product.name} className="product-image" /> */}
            </div>

            <div className="product-details-container">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-description">{product.description}</p>
              <p className="product-price">
                <strong>{labels.price}:</strong> ₪{product.cost.toFixed(2)}
              </p>
            </div>
            
            <div className="custom-controls">
              <IonItem>
                <IonLabel>{labels.quantity}</IonLabel>
                <div className="quantity-controls">
                  <IonButton onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>-</IonButton>
                  <span>{quantity}</span>
                  <IonButton onClick={() => setQuantity(quantity + 1)}>+</IonButton>
                </div>
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{labels.notes}</IonLabel>
                <IonTextarea
                  rows={4}
                  value={notes}
                  placeholder={labels.addNotesPlaceholder}
                  onIonChange={(e) => { setNotes(e.detail.value || ''); }}
                />
              </IonItem>
            </div>
            <div className="book-button-container">
              <IonButton expand="block" onClick={handleAddToCart}>
                {user ? labels.addToCart : labels.loginToOrder}
              </IonButton>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetails;
