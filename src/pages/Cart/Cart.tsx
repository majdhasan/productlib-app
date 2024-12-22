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

const Cart: React.FC = () => {
  const { user, cart, setCart } = useAppContext();
  const history = useHistory();

  const fetchOrCreateCart = async () => {
    try {
      if (cart && cart.status === "PENDING") {
        // Validate cart status with backend
        const response = await fetch(`http://localhost:8080/api/cart/${cart.id}`);
        if (response.ok) {
          const fetchedCart = await response.json();
          if (fetchedCart.status === "PENDING") {
            setCart(fetchedCart);
            return;
          }
        }
      }

      // Create a new cart if no valid pending cart is found
      const createResponse = await fetch(`http://localhost:8080/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [] }),
      });

      if (createResponse.ok) {
        const newCart = await createResponse.json();
        setCart(newCart);
      } else {
        throw new Error("Failed to create a new cart.");
      }
    } catch (error) {
      console.error("Error initializing cart:", error);
    }
  };

  useEffect(() => {
    fetchOrCreateCart();
  }, []); // Runs only once on mount

  const handleQuantityChange = async (productId: number, change: number) => {
    try {
      const updatedItems = cart.items.map((item: any) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(item.quantity + change, 1) }
          : item
      );

      const updatedCart = { ...cart, items: updatedItems };
      setCart(updatedCart);

      // Sync updated cart to backend
      await fetch(`http://localhost:8080/api/cart/${cart.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      });
    } catch (error) {
      console.error("Error updating cart:", error);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    try {
      const updatedItems = cart.items.filter((item: any) => item.product.id !== productId);
      const updatedCart = { ...cart, items: updatedItems };
      setCart(updatedCart);

      // Sync updated cart to backend
      await fetch(`http://localhost:8080/api/cart/${cart.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCart),
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const calculateRowTotal = (quantity: number, price: number) => quantity * price;

  const calculateCartTotal = () =>
    cart.items.reduce((total: number, item: any) => total + calculateRowTotal(item.quantity, item.product.cost), 0);

  const handleCheckout = () => {
    if (cart.items.length > 0) {
      history.push("/payment/" + cart.id);
    } else {
      alert("Your cart is empty!");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>My Cart</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {cart?.items?.length > 0 ? (
          <IonList>
            {cart.items.map((item: any, index: number) => (
              <IonItem key={index}>
                <IonThumbnail slot="start">
                  <img
                    src={`http://localhost:8080/images/${item.product.image}`}
                    alt={item.product.name}
                  />
                </IonThumbnail>
                <IonLabel>
                  <h2>{item.product.name}</h2>
                  <p>Price: ₪{item.product.cost.toFixed(2)}</p>
                  <p>
                    Row Total: ₪{calculateRowTotal(item.quantity, item.product.cost).toFixed(2)}
                  </p>
                  {item.notes && <p>Notes: {item.notes}</p>}
                </IonLabel>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IonButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.product.id, -1)}
                  >
                    -
                  </IonButton>
                  <p style={{ margin: "0 10px", width: "40px", textAlign: "center" }}>
                    {item.quantity}
                  </p>
                  <IonButton
                    color="primary"
                    onClick={() => handleQuantityChange(item.product.id, 1)}
                  >
                    +
                  </IonButton>
                </div>
                <IonButton
                  color="danger"
                  slot="end"
                  onClick={() => handleRemoveItem(item.product.id)}
                >
                  Remove
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        ) : (
          <IonText color="medium" className="ion-text-center">
            <h2>{user ? 'Your cart is empty!' : 'You are not logged in!'}</h2>
          </IonText>
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          {cart?.items?.length > 0 ? (
            <div style={{ padding: "10px" }}>
              <h3>Total: ₪{calculateCartTotal().toFixed(2)}</h3>
              <IonButton expand="block" onClick={handleCheckout}>
                Proceed to Checkout
              </IonButton>
            </div>
          ) : (
            <IonButton expand="block" onClick={() => history.push("/products")}>
              Browse Products
            </IonButton>
          )}
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Cart;
