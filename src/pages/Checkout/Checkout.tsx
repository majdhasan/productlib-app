import React, { useState, useEffect } from "react";
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
import { getTranslation } from '../../services/translationService';
import "./Checkout.css";

const WORKING_HOURS = {
    start: 6,
    end: 16
};

const isWithinWorkingHours = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    return !(currentDay === 0 || currentHour < WORKING_HOURS.start || currentHour >= WORKING_HOURS.end);
};

const Checkout: React.FC = () => {
    const { setIsLoading, user, cart, language, setOrderSubmitted, setToastColor, setToastMessage, setShowToast, setCart } = useAppContext();
    const [pickupOrDelivery, setPickupOrDelivery] = useState<"pickup" | "delivery">("pickup");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState(user?.phoneNumber || "");
    const [firstName, setFirstName] = useState(user?.firstName || "");
    const [lastName, setLastName] = useState(user?.lastName || "");
    const [orderNotes, setOrderNotes] = useState("");
    const [pickupTimeOption, setPickupTimeOption] = useState<"asap" | "specific">("asap");
    const [specificPickupTime, setSpecificPickupTime] = useState("");

    const labels = translations[language];
    const history = useHistory();

    useEffect(() => {
        if (!cart || cart.items.length === 0) {
            history.push("/products");
        }
    }, [cart, history]);

    const calculateRowTotal = (quantity: number, price: number) => quantity * price;

    const calculateCartTotal = () =>
        cart?.items.reduce((total: number, item: any) => total + calculateRowTotal(item.quantity, item.product.price), 0) || 0;

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
            setToastMessage(labels.enterWishedTime);
            setToastColor('danger');
            setShowToast(true);
            return;
        }

        try {
            setIsLoading(true);
            const commonPayload = {
                orderType: pickupOrDelivery === "pickup" ? "PICKUP" : "DELIVERY",
                address: pickupOrDelivery === "pickup" ? labels.bakeryAddress : address,
                phone,
                firstName,
                lastName,
                orderNotes: orderNotes || null,
                wishedPickupTime:
                    pickupTimeOption === "specific"
                        ? `${specificPickupTime.date}T${padTime(specificPickupTime.time)}`
                        : null,
                language: language
            };

            let createdOrder;
            if (user && user.id) {
                const payload = {
                    ...commonPayload,
                    cartId: cart.id,
                    customerId: user.id,
                };
                createdOrder = await OrderAPI.createOrder(payload);
            } else {
                const payload = {
                    ...commonPayload,
                    items: cart.items.map((item: any) => ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        notes: item.notes,
                    })),
                };
                createdOrder = await OrderAPI.createGuestOrder(payload);
            }

            setOrderSubmitted(true);
            setCart(null);
            setAddress("");
            setOrderNotes("");
            setSpecificPickupTime("");
            setPickupTimeOption("asap");
            setToastMessage(labels.orderSubmitted);
            setToastColor('success');
            setShowToast(true);

            if (user && user.id) {
                history.push(`/my-orders`);
            } else {
                history.push(`/confirmation/${createdOrder.id}`);
            }
        } catch (error) {
            console.error("Checkout Error:", error);

            setToastMessage(labels.checkoutError);
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    const isSubmitDisabled = pickupTimeOption === "asap" && !isWithinWorkingHours();

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
                    <IonSegmentButton value="delivery">
                        <IonLabel>{labels.delivery}</IonLabel>
                    </IonSegmentButton>
                </IonSegment>

                <IonItem>
                    <IonIcon slot="start" icon={personOutline} />
                    <IonLabel position="stacked">{labels.firstName}</IonLabel>
                    <IonInput
                        value={firstName}
                        placeholder={labels.enterFirstName}
                        onIonChange={(e) => setFirstName(e.detail.value || "")}
                    />
                </IonItem>

                <IonItem>
                    <IonIcon slot="start" icon={personOutline} />
                    <IonLabel position="stacked">{labels.lastName}</IonLabel>
                    <IonInput
                        value={lastName}
                        placeholder={labels.enterLastName}
                        onIonChange={(e) => setLastName(e.detail.value || "")}
                    />
                </IonItem>

                {pickupOrDelivery === 'pickup' && (
                    <IonItem>
                        <IonIcon slot="start" icon={locationOutline} />
                        <IonLabel position="stacked">{labels.orderAddress}</IonLabel>
                        <IonInput value={labels.bakeryAddress} readonly />
                    </IonItem>
                )}

                {pickupOrDelivery === 'delivery' && (
                    <IonItem>
                        <IonIcon slot="start" icon={locationOutline} />
                        <IonLabel position="stacked">{labels.orderAddress}</IonLabel>
                        <IonTextarea
                            rows={3}
                            value={address}
                            onIonChange={(e) => setAddress(e.detail.value || "")}
                            placeholder={labels.addAddressInfo}
                        />
                    </IonItem>
                )}

                <IonItem>
                    <IonIcon slot="start" icon={callOutline} />
                    <IonLabel position="stacked">{labels.phoneNumber}</IonLabel>
                    <IonInput
                        type="tel"
                        value={phone}
                        placeholder={labels.enterYourPhone}
                        onIonChange={(e) => setPhone(e.detail.value || "")}
                    />
                </IonItem>

                <IonItem>
                    <IonIcon slot="start" icon={timeOutline} />
                    <div className="pickup-options-container">
                        <IonLabel position="stacked">
                            {pickupOrDelivery === 'delivery' ? labels.deliveryTime : labels.pickupTime}
                        </IonLabel>
                        <IonRadioGroup
                            value={pickupTimeOption}
                            onIonChange={(e) => setPickupTimeOption(e.detail.value)}
                        >
                            <IonItem
                                lines="none"
                                className="radio-option"
                                button
                                onClick={() => setPickupTimeOption("asap")}
                            >
                                <IonRadio slot="start" value="asap" />
                                <IonLabel>{labels.asap}</IonLabel>
                            </IonItem>
                            <IonItem
                                lines="none"
                                className="radio-option"
                                button
                                onClick={() => setPickupTimeOption("specific")}
                            >
                                <IonRadio slot="start" value="specific" />
                                <IonLabel>{labels.specificTime}</IonLabel>
                            </IonItem>
                        </IonRadioGroup>
                        {pickupTimeOption === "specific" && (
                            <div className="datetime-dropdowns">
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
                                            const dayOfWeek = date.getDay();

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
                                        disabled={!specificPickupTime.date}
                                    >
                                        {(() => {
                                            if (!specificPickupTime.date) {
                                                return null;
                                            }

                                            const selectedDate = new Date(specificPickupTime.date);
                                            const isToday = selectedDate.toDateString() === new Date().toDateString();
                                            const currentHour = new Date().getHours();
                                            const hours = Array.from({ length: 12 }).map((_, i) => i + 9);
                                            const availableHours = isToday
                                                ? hours.filter((hour) => hour >= currentHour + 3)
                                                : hours;

                                            if (availableHours.length === 0) {
                                                return (
                                                    <IonSelectOption disabled>
                                                        {labels.noAvailableTime}
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

                <IonList className="product-list">
                    <IonItem lines="none">
                        <IonIcon icon={clipboardOutline} slot="start" />
                        <IonLabel position="stacked">{labels.orderSummary}</IonLabel>
                    </IonItem>
                    {cart?.items.map((item: any, index: number) => (
                        <IonItem key={index} lines="inset" className="product-item">
                            <IonThumbnail slot="start" className="product-thumbnail">
                                <img src={`${baseUrl}/files/thumbnail_${item.product.image}`} alt={getTranslation(item.product, language).name} />
                            </IonThumbnail>
                            <IonLabel>
                                <h3>{getTranslation(item.product, language).name}</h3>
                                <p>
                                    <strong>{labels.quantity}:</strong> {item.quantity}
                                </p>
                                <p>
                                    {item.notes && <><strong>{labels.notes}:</strong> {item.notes}</>}
                                </p>
                                <p>
                                    <strong>{labels.pricePerUnit}:</strong> ₪{item.product.price.toFixed(2)}
                                </p>
                                <p>
                                    <strong>{labels.rowTotal}:</strong> ₪{calculateRowTotal(item.quantity, item.product.price).toFixed(2)}
                                </p>
                            </IonLabel>
                        </IonItem>
                    ))}
                    <IonLabel>{labels.total}: ₪{calculateCartTotal().toFixed(2)}</IonLabel>
                </IonList>

                <IonItem>
                    <IonIcon slot="start" icon={clipboardOutline} />
                    <IonLabel position="stacked">{labels.orderNotes}</IonLabel>
                    <IonTextarea
                        rows={4}
                        value={orderNotes}
                        onIonChange={(e) => setOrderNotes(e.detail.value || "")}
                        placeholder={labels.addOrderNotes}
                    />
                </IonItem>

                <IonButton expand="block" onClick={handleSubmit} disabled={isSubmitDisabled}>
                    {isSubmitDisabled ? labels.bakeryClosed : labels.submitOrder}
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Checkout;
