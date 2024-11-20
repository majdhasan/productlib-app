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
  const [showAlert, setShowAlert] = useState(false); // Alert for no slot selected

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

  // Confirm booking
  const handleConfirmBooking = async () => {
    if (!selectedSlot || !selectedDate || !userEmail.trim()) {
      setShowAlert(true); // Show alert if no slot or email is selected
      return;
    }

    const bookingRequest = {
      serviceId: id,
      userEmail: userEmail.trim(), // Get user email input
      startTime: `${selectedDate.split("T")[0]}T${selectedSlot}:00`, // Combine date and time
    };

    try {
      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingRequest),
      });

      if (response.ok) {
        const data = await response.json(); // Assuming the response contains the booking ID
        history.push(`/confirmation/${data.id}`); // Navigate to the confirmation page
      } else {
        const errorData = await response.json();
        console.error("Booking failed:", errorData);
      }
    } catch (error) {
      console.error("Error confirming booking:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Book your Slot</IonTitle>
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

        {/* Email Input */}
        <div className="email-input-container">
          <IonInput
            placeholder="Enter your email"
            value={userEmail}
            onIonChange={(e) => setUserEmail(e.detail.value!)}
            type="email"
          ></IonInput>
        </div>

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
      </IonContent>
    </IonPage>
  );
};

export default BookingCalendar;
