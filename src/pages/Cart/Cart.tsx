import React, { useEffect, useState } from "react";
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

const Cart: React.FC = () => {
  const [cart, setCart] = useState<any>({ items: [] });
  const history = useHistory();

  useEffect(() => {
    try {
      // Safely retrieve cart from localStorage
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error("Error parsing cart data:", error);
      setCart({ items: [] }); // Fallback for invalid JSON
    }
  }, []);

  const handleQuantityChange = (productId: number, change: number) => {
    if (!cart.items) return;

    // Update the quantity of the specific product in the cart
    const updatedItems = cart.items.map((item: any) =>
      item.product.id === productId
        ? { ...item, quantity: Math.max(item.quantity + change, 1) } // Minimum quantity is 1
        : item
    );

    const updatedCart = { ...cart, items: updatedItems };

    // Save the updated cart to localStorage
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleRemoveItem = (productId: number) => {
    // Remove the item completely from the cart
    const updatedItems = cart.items.filter((item: any) => item.product.id !== productId);
    const updatedCart = { ...cart, items: updatedItems };

    // Save the updated cart to localStorage
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const calculateRowTotal = (quantity: number, price: number) => quantity * price;

  const calculateCartTotal = () =>
    cart.items.reduce((total: number, item: any) => total + calculateRowTotal(item.quantity, item.product.cost), 0);

  const handleCheckout = () => {
    if (cart.items.length > 0) {
      history.push("/payment/" + cart.id); // Redirect to the payment page
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
        {cart.items && cart.items.length > 0 ? (
          <IonList>
            {cart.items.map((item: any, index: number) => (
              <IonItem key={index}>
                <IonThumbnail slot="start">
                  <img
                    src={`http://localhost:8080/images/${item.product.image}`} // Adjust the URL based on your backend's image hosting
                    alt={item.product.name}
                  />
                </IonThumbnail>
                <IonLabel>
                  <h2>{item.product.name}</h2>
                  <p>Price: ₪{item.product.cost.toFixed(2)}</p>
                  <p>
                    Row Total: ₪
                    {calculateRowTotal(item.quantity, item.product.cost).toFixed(2)}
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
            <h2>Your cart is empty!</h2>
          </IonText>
        )}
      </IonContent>
      <IonFooter>
        <IonToolbar>
          {cart.items && cart.items.length > 0 ? (
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
