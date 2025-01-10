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
    IonSelect,
    IonRadioGroup,
    IonRadio,
    IonSelectOption
} from "@ionic/react";
import { callOutline, locationOutline, clipboardOutline, timeOutline, personOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { translations } from "../../translations";
import { OrderAPI, baseUrl } from '../../services/apiService';
import "./Checkout.css";

const Checkout: React.FC = () => {
    const { user, cart, language, setOrderSubmitted, setToastColor, setToastMessage, setShowToast } = useAppContext();
    const [pickupOrDelivery, setPickupOrDelivery] = useState<"pickup" | "delivery">("pickup");
    const [address] = useState("");
    const [phone, setPhone] = useState(user?.phoneNumber || "");
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [orderNotes, setOrderNotes] = useState("");
    const [pickupTimeOption, setPickupTimeOption] = useState<"asap" | "specific">("asap");
    const [specificPickupTime, setSpecificPickupTime] = useState("");

    const labels = translations[language];
    const history = useHistory();

    const calculateRowTotal = (quantity: number, price: number) => quantity * price;

    const calculateCartTotal = () =>
        cart?.items.reduce((total: number, item: any) => total + calculateRowTotal(item.quantity, item.product.cost), 0) || 0;


    const padTime = (time: string) => {
        const [hour, minute] = time.split(":");
        return `${hour.padStart(2, "0")}:${minute}:00`;
    };


    const handleSubmit = async () => {
        if (!phone || !firstName || !lastName) {
            setToastMessage(labels.enterRequiredFields);
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        if (pickupOrDelivery === "delivery" && !address) {
            setToastMessage(labels.enterAddress);
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        if (!pickupTimeOption || (pickupTimeOption === "specific" && (!specificPickupTime.date || !specificPickupTime.time))) {
            setToastMessage(labels.enterPickupTime);
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        try {
            const payload = {
                cartId: cart.id,
                customerId: user.id,
                orderType: pickupOrDelivery === "pickup" ? "PICKUP" : "DELIVERY",
                address: pickupOrDelivery === "pickup" ? "Al-Bishara St 49, Nazareth, Israel" : address,
                phone,
                firstName,
                lastName,
                orderNotes: orderNotes || null,
                wishedPickupTime:
                    pickupTimeOption === "specific"
                        ? `${specificPickupTime.date}T${padTime(specificPickupTime.time)}`
                        : null,
            };

            const createdOrder = await OrderAPI.createOrder(payload);

            setOrderSubmitted(true);
            setToastMessage(labels.orderSubmitted);
            setToastColor('success');
            setShowToast(true);

            history.push(`/my-orders`);
        } catch (error) {
            console.error("Checkout Error:", error);

            setToastMessage(labels.checkoutError);
            setToastColor('danger');
            setShowToast(true);
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

                <IonItem className="section-box">
                    <IonIcon slot="start" icon={personOutline} />
                    <IonLabel position="stacked" className="section-label">{labels.firstName}</IonLabel>
                    <IonInput
                        value={firstName}
                        placeholder={labels.enterFirstName}
                        onIonChange={(e) => setFirstName(e.detail.value || "")}
                    />
                </IonItem>

                <IonItem className="section-box">
                    <IonIcon slot="start" icon={personOutline} />
                    <IonLabel position="stacked" className="section-label">{labels.lastName}</IonLabel>
                    <IonInput
                        value={lastName}
                        placeholder={labels.enterLastName}
                        onIonChange={(e) => setLastName(e.detail.value || "")}
                    />
                </IonItem>

                <IonItem className="section-box">
                    <IonIcon slot="start" icon={locationOutline} />
                    <IonLabel position="stacked" className="section-label">{labels.orderAddress}</IonLabel>
                    <IonInput value={labels.bakeryAddress} readonly />
                </IonItem>

                <IonItem className="section-box">
                    <IonIcon slot="start" icon={callOutline} />
                    <IonLabel position="stacked" className="section-label">{labels.phoneNumber}</IonLabel>
                    <IonInput
                        type="tel"
                        value={phone}
                        placeholder={labels.enterYourPhone}
                        onIonChange={(e) => setPhone(e.detail.value || "")}
                    />
                </IonItem>

                <IonItem className="section-box">
                    <IonIcon slot="start" icon={timeOutline} />
                    <div className="pickup-options-container">
                        <IonLabel position="stacked" className="section-label">
                            {labels.pickupTime}
                        </IonLabel>
                        <IonRadioGroup
                            value={pickupTimeOption}
                            onIonChange={(e) => setPickupTimeOption(e.detail.value)}
                        >
                            <IonItem
                                lines="none"
                                className="radio-option"
                                button
                                onClick={() => setPickupTimeOption("asap")} // Explicitly update the state
                            >
                                <IonRadio slot="start" value="asap" />
                                <IonLabel>{labels.asap}</IonLabel>
                            </IonItem>
                            <IonItem
                                lines="none"
                                className="radio-option"
                                button
                                onClick={() => setPickupTimeOption("specific")} // Explicitly update the state
                            >
                                <IonRadio slot="start" value="specific" />
                                <IonLabel>{labels.specificTime}</IonLabel>
                            </IonItem>
                        </IonRadioGroup>
                        {pickupTimeOption === "specific" && (
                            <div className="datetime-dropdowns">

                                {/* Date Dropdown */}
                                <IonItem className="dropdown-item" lines="none">
                                    <IonLabel position="stacked">{labels.selectDate}</IonLabel>
                                    <IonSelect
                                        placeholder={labels.selectDatePlaceholder}
                                        onIonChange={(e) =>
                                            setSpecificPickupTime((prev) => ({ ...prev, date: e.detail.value }))
                                        }
                                    >
                                        {Array.from({ length: 7 }).map((_, i) => {
                                            const date = new Date();
                                            date.setDate(date.getDate() + i);
                                            const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                                            // Skip Sundays (dayOfWeek === 0)
                                            if (dayOfWeek === 0) {
                                                return null;
                                            }

                                            return (
                                                <IonSelectOption key={i} value={date.toISOString().split("T")[0]}>
                                                    {date.toLocaleDateString(language, {
                                                        weekday: "long",
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </IonSelectOption>
                                            );
                                        })}
                                    </IonSelect>
                                </IonItem>


                                {/* Time Dropdown */}
                                <IonItem className="dropdown-item" lines="none">
                                    <IonLabel position="stacked">{labels.selectTime}</IonLabel>
                                    <IonSelect
                                        placeholder={labels.selectTimePlaceholder}
                                        onIonChange={(e) => {
                                            if (!specificPickupTime.date) {
                                                setToastMessage(labels.selectDateFirst);
                                                setToastColor('danger');
                                                setShowToast(true);
                                                return;
                                            }
                                            setSpecificPickupTime((prev) => ({ ...prev, time: e.detail.value }));
                                        }}
                                        disabled={!specificPickupTime.date} // Disable the dropdown if no date is selected
                                    >
                                        {(() => {
                                            if (!specificPickupTime.date) {
                                                return null; // Return nothing if no date is selected
                                            }

                                            const selectedDate = new Date(specificPickupTime.date);
                                            const isToday = selectedDate.toDateString() === new Date().toDateString();
                                            const currentHour = new Date().getHours();
                                            const hours = Array.from({ length: 12 }).map((_, i) => i + 9); // Working hours: 9 AM - 9 PM
                                            const availableHours = isToday
                                                ? hours.filter((hour) => hour >= currentHour + 3) // At least 2 hours from now
                                                : hours;

                                            if (availableHours.length === 0) {
                                                return (
                                                    <IonSelectOption disabled>
                                                        {labels.noAvailableTime} {/* Add this label in your translations */}
                                                    </IonSelectOption>
                                                );
                                            }

                                            return availableHours.map((hour) => (
                                                <IonSelectOption key={hour} value={`${hour}:00`}>
                                                    {`${hour}:00`}
                                                </IonSelectOption>
                                            ));
                                        })()}
                                    </IonSelect>
                                </IonItem>
                            </div>
                        )}
                    </div>
                </IonItem>


                <IonList className="section-box product-list">
                    <IonItem lines="none" className="summary-header">
                        <IonIcon icon={clipboardOutline} slot="start" />
                        <IonLabel>
                            <h2 className="summary-title">{labels.orderSummary}</h2>
                        </IonLabel>
                    </IonItem>
                    {cart?.items.map((item: any, index: number) => (
                        <IonItem key={index} lines="inset" className="product-item">
                            <IonThumbnail slot="start" className="product-thumbnail">

                                <img src={`${baseUrl}/files/${item.product.image}`} alt={item.product.name} />
                            </IonThumbnail>
                            <IonLabel className="product-details">
                                <h3 className="product-name">{item.product.name}</h3>
                                <p className="product-info">
                                    <strong>{labels.quantity}:</strong> {item.quantity}
                                </p>
                                <p className="product-info">
                                    {item.notes && <><strong>{labels.notes}:</strong> {item.notes}</>}
                                </p>
                                <p className="product-info">
                                    <strong>{labels.pricePerUnit}:</strong> ₪{item.product.cost.toFixed(2)}
                                </p>
                                <p className="product-info">
                                    <strong>{labels.rowTotal}:</strong> ₪{calculateRowTotal(item.quantity, item.product.cost).toFixed(2)}
                                </p>
                            </IonLabel>
                        </IonItem>
                    ))}
                    <IonItem lines="none" className="total-item">
                        <IonLabel>
                            <h3 className="total-text">{labels.total}: ₪{calculateCartTotal().toFixed(2)}</h3>
                        </IonLabel>
                    </IonItem>
                </IonList>

                <IonItem className="section-box">
                    <IonIcon slot="start" icon={clipboardOutline} />
                    <IonLabel position="stacked" className="section-label">{labels.orderNotes}</IonLabel>
                    <IonTextarea
                        rows={4}
                        value={orderNotes}
                        onIonChange={(e) => setOrderNotes(e.detail.value || "")}
                        placeholder={labels.addOrderNotes}
                    />
                </IonItem>

                <IonButton expand="block" onClick={handleSubmit}>
                    {labels.submitOrder}
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Checkout;
