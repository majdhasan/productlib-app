import React, { useState } from "react";
import {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonInput,
    IonItem,
    IonButton,
    IonTextarea,
    IonThumbnail,
    IonList,
    IonIcon,
} from "@ionic/react";
import { callOutline, locationOutline, clipboardOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { translations } from "../../translations";
import "./Checkout.css";

const Checkout: React.FC = () => {
    const { user, cart, language } = useAppContext();
    const [pickupOrDelivery, setPickupOrDelivery] = useState<"pickup" | "delivery">("pickup");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState(user?.phoneNumber || "");
    const [orderNotes, setOrderNotes] = useState("");

    const labels = translations[language];
    const history = useHistory();

    const calculateRowTotal = (quantity: number, price: number) => quantity * price;

    const calculateCartTotal = () =>
        cart.items.reduce((total: number, item: any) => total + calculateRowTotal(item.quantity, item.product.cost), 0);

    const handleSubmit = async () => {
        if (!phone) {
            alert(labels.enterPhone);
            return;
        }

        if (pickupOrDelivery === "delivery" && !address) {
            alert(labels.enterAddress);
            return;
        }

        try {
            const payload = {
                cartId: cart.id,
                method: pickupOrDelivery,
                address: pickupOrDelivery === "pickup" ? "Al-Bishara St 49, Nazareth, Israel" : address,
                phone,
                orderNotes,
            };

            console.log("Checkout Payload:", payload);

            alert(labels.checkoutSuccess);
            history.push("/confirmation/" + cart.id);
        } catch (error) {
            console.error("Checkout Error:", error);
            alert(labels.checkoutError);
        }
    };

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{labels.checkout}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">

                <IonSegment
                    value={pickupOrDelivery}
                    onIonChange={(e) => setPickupOrDelivery(e.detail.value as "pickup" | "delivery")}
                >
                    <IonSegmentButton value="pickup">
                        <IonLabel>{labels.pickup}</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="delivery" disabled>
                        <IonLabel>{labels.delivery}</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <IonItem className="ion-margin-top">
                    <IonIcon slot="start" icon={locationOutline} />
                    <IonLabel position="stacked">{labels.orderAddress}</IonLabel>
                    <IonInput value={labels.bakeryAddress} readonly />
                </IonItem>

                <IonItem className="ion-margin-top">
                    <IonIcon slot="start" icon={callOutline} />
                    <IonLabel position="stacked">{labels.phoneNumber}</IonLabel>
                    <IonInput
                        type="tel"
                        value={phone}
                        placeholder={labels.enterYourPhone}
                        onIonChange={(e) => setPhone(e.detail.value || "")}
                    />
                </IonItem>

                <IonList className="ion-margin-top product-list">
                    <IonItem lines="none">
                        <IonLabel>
                            <h2>{labels.orderSummary}</h2>
                        </IonLabel>
                    </IonItem>
                    {cart.items.map((item: any, index: number) => (
                        <IonItem key={index} lines="inset" className="product-item">
                            <IonThumbnail slot="start">
                                <img
                                    src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`}
                                    alt={item.product.name}
                                />
                            </IonThumbnail>
                            <IonLabel>
                                <h3>{item.product.name}</h3>
                                <p>
                                    {labels.quantity}: {item.quantity}
                                </p>
                                <p>
                                    {labels.pricePerUnit}: ₪{item.product.cost.toFixed(2)}
                                </p>
                                <p>
                                    {labels.rowTotal}: ₪{calculateRowTotal(item.quantity, item.product.cost).toFixed(2)}
                                </p>
                            </IonLabel>
                        </IonItem>
                    ))}
                    <IonItem>
                        <IonLabel>
                            <h3>{labels.total}: ₪{calculateCartTotal().toFixed(2)}</h3>
                        </IonLabel>
                    </IonItem>
                </IonList>

                <IonItem className="ion-margin-top ion-margin-bottom">
                    <IonIcon slot="start" icon={clipboardOutline} />
                    <IonLabel position="stacked">{labels.orderNotes}</IonLabel>
                    <IonTextarea
                        rows={4}
                        value={orderNotes}
                        onIonChange={(e) => setOrderNotes(e.detail.value || "")}
                        placeholder={labels.addOrderNotes}
                    />
                </IonItem>

                <IonButton expand="block" className="ion-margin-top" onClick={handleSubmit}>
                    {labels.submitOrder}
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Checkout;
