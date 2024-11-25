import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonDatetime,
  IonLoading,
  IonAlert,
  IonInput,
  useIonToast,
  IonItem,
  IonLabel,
  IonText
} from "@ionic/react";
import { useParams, useHistory } from "react-router-dom";
import "./BookingCalendar.css";

const BookingCalendar: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Service ID from the route
  const history = useHistory(); // For navigation
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // Selected date
  const [availableSlots, setAvailableSlots] = useState<string[]>([]); // Available slots
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); // Selected slot
  const [isLoading, setIsLoading] = useState(false); // For showing a loading spinner
  const [userEmail, setUserEmail] = useState(""); // Email input state
  const [firstName, setFirstName] = useState(""); // For guest's first name
  const [lastName, setLastName] = useState(""); // For guest's last name
  const [showAlert, setShowAlert] = useState(false); // Alert for no slot selected
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if the user is logged in
  const [presentToast] = useIonToast();

  // Check if the user is logged in on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setIsLoggedIn(true);
      setUserEmail(user.email); // Set the user's email from the stored user
    }
  }, []);

  // Fetch available slots when the service ID and selected date are set
  useEffect(() => {
    if (id && selectedDate) {
      fetchAvailableSlots(selectedDate.split("T")[0]); // Send only the date part (YYYY-MM-DD)
    }
  }, [id, selectedDate]);

  // Fetch available slots from the backend
  const fetchAvailableSlots = async (date: string) => {
    setIsLoading(true); // Show loading spinner
    try {
      const response = await fetch(
        `http://localhost:8080/api/bookings/service/${id}/available-slots?date=${date}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch available slots");
      }
      const slots = await response.json();
      setAvailableSlots(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      setAvailableSlots([]);
    } finally {
      setIsLoading(false); // Hide loading spinner
    }
  };

  // Handle slot selection
  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedDate || !userEmail.trim()) {
      presentToast({
        message: "Please select a slot and provide your email before confirming your booking.",
        duration: 2000,
        color: "danger",
      });
      return;
    }

    const bookingRequest = {
      serviceId: id,
      userEmail: userEmail.trim(),
      startTime: `${selectedDate.split("T")[0]}T${selectedSlot}:00`,
    };

    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingRequest),
      });

      if (!response.ok) {
        const errorData = await response.json();
        presentToast({
          message: errorData.error || "Failed to confirm the booking.",
          duration: 3000,
          color: "danger",
        });
        return;
      }

      const data = await response.json();
      history.push(`/confirmation/${data.id}`);
    } catch (error) {
      console.error("Error confirming booking:", error);
      presentToast({
        message: "An unexpected error occurred. Please try again later.",
        duration: 3000,
        color: "danger",
      });
    }
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Book a Slot</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLoading isOpen={isLoading} message="Fetching available slots..." />

        {/* Alert for No Slot or Email Selected */}
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Incomplete Details"
          message="Please select a slot and provide your email before confirming your booking."
          buttons={["OK"]}
        />

        {/* Email Input - Only show if the user is not logged in */}
        {!isLoggedIn && (
          <div className="guest-input-container">
            <IonItem>
              <IonLabel position="stacked">First Name</IonLabel>
              <IonInput
                placeholder="Enter your first name"
                value={firstName}
                onIonChange={(e) => setFirstName(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Last Name</IonLabel>
              <IonInput
                placeholder="Enter your last name"
                value={lastName}
                onIonChange={(e) => setLastName(e.detail.value!)}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                placeholder="Enter your email"
                value={userEmail}
                onIonChange={(e) => setUserEmail(e.detail.value!)}
              />
            </IonItem>
          </div>
        )}

        {/* Display logged-in email */}
        <div className="book-slot-container">
          {userEmail && (
            <div className="logged-in-as">
              <IonText>
                <p>
                  You are logged in as <strong>{userEmail}</strong>,{" "}
                  <IonText color="primary" onClick={() => history.push("/profile")}>
                    <strong>(not you?)</strong>
                  </IonText>
                </p>
              </IonText>
            </div>
          )}

          {/* Calendar */}
          <div className="datetime-container">
            <IonDatetime
              presentation="date"
              onIonChange={(e) => {
                const value = Array.isArray(e.detail.value) ? e.detail.value[0] : e.detail.value;
                setSelectedDate(value ?? null);
              }}
              value={selectedDate}
              min={new Date().toISOString()} // Restrict past dates
            />
          </div>

          {/* Slots */}
          {selectedDate && (
            <div className="slots-container">
              <h2>Available Slots for {new Date(selectedDate).toDateString()}</h2>
              <IonGrid>
                <IonRow>
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <IonCol size="6" key={index}>
                        <IonButton
                          expand="block"
                          color={selectedSlot === slot ? "success" : "primary"}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {slot}
                        </IonButton>
                      </IonCol>
                    ))
                  ) : (
                    <p>No available slots for the selected date.</p>
                  )}
                </IonRow>
              </IonGrid>
            </div>
          )}

          {/* Confirm Booking Button */}
          {selectedSlot && (
            <div className="confirm-button-container">
              <IonButton expand="block" onClick={handleConfirmBooking}>
                Confirm Booking
              </IonButton>
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default BookingCalendar;
