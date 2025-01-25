import React, { useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  IonFooter,
  IonThumbnail,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { CartAPI, baseUrl } from "../../services/apiService";
import { translations } from '../../translations';
import { getTranslation } from '../../services/translationService';

const Cart: React.FC = () => {
  const { user, cart, setCart, language, orderSubmitted, setOrderSubmitted } = useAppContext();
  const history = useHistory();

  const labels = translations[language];

  const fetchOrCreateCart = async () => {
    try {
      if (user && user.id) {
        const newCart = await CartAPI.getOrCreateCart(user.id);
        setCart(newCart);
      } else {
        console.error("User not logged in or user ID is missing.");
      }
    } catch (error) {
      console.error("Error initializing cart:", error);
    }
  };

  useEffect(() => {
    fetchOrCreateCart();
  }, []);

  useEffect(() => {
    if (orderSubmitted) {
      fetchOrCreateCart();
      setOrderSubmitted(false);
    }
  }, [orderSubmitted]);

  const handleQuantityChange = async (cartItemId: number, change: number) => {
    try {
      const updatedItems = cart.items.map((item: any) =>
        item.id === cartItemId
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      );

      const updatedCart = { ...cart, items: updatedItems };
      setCart(updatedCart);

      const targetItem = updatedItems.find((item: any) => item.id === cartItemId);
      if (targetItem) {
        await CartAPI.updateCartItemQuantity(cartItemId, targetItem.quantity);
      }

    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await CartAPI.removeCartItem(cartItemId);
      const updatedCart = await CartAPI.getOrCreateCart(user.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateRowTotal = (item: any) => {
    const price = item.product.price;
    return price * item.quantity;
  };

  const calculateCartTotal = () =>
    cart.items.reduce((total: number, item: any) => total + calculateRowTotal(item), 0);

  const handleCheckout = () => {
    if (cart.items.length > 0) {
      history.push("/checkout");
    } else {
      alert(labels.emptyCartAlert);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{labels.cart}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {cart?.items?.length > 0 ? (
          <IonList>
            {cart.items.map((item: any, index: number) => (
              
              <IonItem key={index}>
                <IonThumbnail slot="start">
                  <img src={`${baseUrl}/files/thumbnail_${item.product.image}`} alt={getTranslation(item.product, language).name} />
                </IonThumbnail>
                <IonLabel>
                  <h2>{getTranslation(item.product, language).name}</h2>
                  <p>
                    <strong>{labels.pricePerUnit}:</strong> ₪
                    {item.product.price.toFixed(2)}
                  </p>
                  <p>
                    <strong>{labels.rowTotal}:</strong> ₪
                    {calculateRowTotal(item).toFixed(2)}
                  </p>
                  {item.notes && <p>{labels.notes}: {item.notes}</p>}
                </IonLabel>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IonButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.id, -1)}
                  >
                    -
                  </IonButton>
                  <p style={{ margin: "0 10px", width: "40px", textAlign: "center" }}>
                    {item.quantity}
                  </p>
                  <IonButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.id, 1)}
                  >
                    +
                  </IonButton>
                </div>
                <IonButton
                  color="danger"
                  slot="end"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  {labels.remove}
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonText color="medium" className="ion-text-center">
            <h2>{user ? labels.emptyCart : labels.notLoggedIn}</h2>
          </IonText>
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          {cart?.items?.length > 0 ? (
            <div style={{ padding: "10px" }}>
              <h3>{labels.total}: ₪{calculateCartTotal().toFixed(2)}</h3>
              <IonButton expand="block" onClick={handleCheckout}>
                {labels.proceedToCheckout}
              </IonButton>
            </div>
          ) : (
            <IonButton expand="block" onClick={() => history.push("/products")}>
              {labels.browseProducts}
            </IonButton>
          )}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Cart;
