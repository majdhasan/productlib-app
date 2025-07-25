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
import { ProductAPI, CartAPI, baseUrl } from "../../services/apiService";
import { translations } from '../../translations';
import './ProductDetails.css';
import { getTranslation } from '../../services/translationService';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');
  const { user, cart, language, setCart, setShowToast, setToastMessage, setToastColor, isLoading, setIsLoading } = useAppContext();
  const history = useHistory();

  const labels = translations[language];

  const getUnitLabel = (unit) => {
    switch (unit) {
      case 'KILOGRAM':
        return labels.unitKILOGRAM;
      case 'HALF_KILOGRAM':
        return labels.unitHALF_KILOGRAM;
      case 'PIECE':
        return labels.unitPIECE;
      default:
        return unit; // Fallback to the original unit if no translation is found
    }
  };

  const handleAddToCart = async () => {
    try {
      if (user && user.id) {
        await CartAPI.addItemToCart(user.id, product.id, quantity, notes);
        const updatedCart = await CartAPI.getOrCreateCart(user.id);
        setCart(updatedCart);
      } else {
        const guestCart = cart || { items: [] };
        const existingItemIndex = guestCart.items.findIndex(
          (item: any) =>
            item.product.id === product.id && item.notes === notes
        );

        if (existingItemIndex !== -1) {
          const updatedItems = [...guestCart.items];
          updatedItems[existingItemIndex] = {
            ...updatedItems[existingItemIndex],
            quantity: updatedItems[existingItemIndex].quantity + quantity,
          };
          setCart({ ...guestCart, items: updatedItems });
        } else {
          const newItem = {
            id: Date.now(),
            product,
            quantity,
            notes,
          };
          setCart({ ...guestCart, items: [...guestCart.items, newItem] });
        }
      }

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

        {product && !isLoading && (
          <>
            {(() => {
              const { name, description } = getTranslation(product, language);

              return (
                <>
                  <div className="product-image-container">
                    <img
                        src={`${baseUrl}/files/resized_${product.image}`}
                        alt={name}
                        className="product-image"
                      />
                  </div>

                  <div className="product-details-container">
                    <h2 className="product-name">{name}</h2>
                    <p className="product-description">{description}</p>
                    <p className="product-price">
                      <strong>{labels.price}:</strong> ₪{product.price.toFixed(2)} / {getUnitLabel(product.unit, language)}
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
                      {labels.addToCart}
                    </IonButton>
                  </div>
                </>
              );
            })()}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetails;
