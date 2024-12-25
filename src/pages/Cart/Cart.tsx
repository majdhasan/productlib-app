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
import { CartAPI } from "../../services/apiService";
import { translations } from '../../translations';

const Cart: React.FC = () => {
  const { user, cart, setCart, language } = useAppContext();
  const history = useHistory();

  const labels = translations[language];

  const fetchOrCreateCart = async () => {
    try {
      if (cart && cart.status === "PENDING") {
        const fetchedCart = await CartAPI.fetchCart(cart.id);
        if (fetchedCart.status === "PENDING") {
          setCart(fetchedCart);
          return;
        }
      }
      const newCart = await CartAPI.createCart();
      setCart(newCart);
    } catch (error) {
      console.error("Error initializing cart:", error);
    }
  };

  useEffect(() => {
    fetchOrCreateCart();
  }, []);

  const handleQuantityChange = async (cartItemId: number, change: number) => {
    try {
      const updatedItems = cart.items.map((item: any) =>
        item.id === cartItemId
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      );

      const updatedCart = { ...cart, items: updatedItems };
      setCart(updatedCart);

      if (cart.status === "PENDING") {
        const targetItem = updatedItems.find((item: any) => item.id === cartItemId);
        if (targetItem) {
          await CartAPI.updateCartItemQuantity(cartItemId, targetItem.quantity);
        }
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await CartAPI.removeCartItem(cartItemId);
      const updatedCart = await CartAPI.fetchCart(cart.id);
      setCart(updatedCart);
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateRowTotal = (item: any) => {
    const price = cart.status === "PENDING" ? item.product.cost : item.productPrice;
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
                  <img
                    // src={`http://localhost:8080/images/${item.product.image}`}
                    src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`}
                    alt={item.product.name}
                  />
                </IonThumbnail>
                <IonLabel>
                  <h2>{item.product.name}</h2>
                  <p>
                    <strong>{labels.pricePerUnit}:</strong> ₪
                    {cart.status === "PENDING"
                      ? item.product.cost.toFixed(2)
                      : (item.productPrice || 0).toFixed(2)}
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
