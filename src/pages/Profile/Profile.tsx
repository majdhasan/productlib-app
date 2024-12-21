import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonAlert,
  IonLoading,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null); // User state
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const history = useHistory();

  // Load the user data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setDateOfBirth(userData.dateOfBirth || "");
    }
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/users/profile/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName, dateOfBirth }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to update profile.");
        return;
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser)); // Update the local storage
    } catch (error) {
      setErrorMessage("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    history.push("/"); // Redirect to the home page
  };

  if (!user) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Login Required</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>You need to log in to access your profile.</p>
          <IonButton expand="block" onClick={() => history.push("/my-orders")}>
            Go to Login
          </IonButton>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonLoading isOpen={isLoading} message="Updating profile..." />

        <IonList>
          <IonItem>
            <IonLabel position="stacked">First Name</IonLabel>
            <IonInput
              value={firstName}
              placeholder="Enter your first name"
              onIonChange={(e) => setFirstName(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Last Name</IonLabel>
            <IonInput
              value={lastName}
              placeholder="Enter your last name"
              onIonChange={(e) => setLastName(e.detail.value!)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Date of Birth</IonLabel>
            <IonInput
              type="date"
              value={dateOfBirth}
              onIonChange={(e) => setDateOfBirth(e.detail.value!)}
            />
          </IonItem>
        </IonList>

        <IonButton expand="block" onClick={handleUpdateProfile}>
          Update Profile
        </IonButton>

        <IonButton expand="block" color="danger" onClick={handleLogout}>
          Logout
        </IonButton>

        {errorMessage && (
          <IonAlert
            isOpen={!!errorMessage}
            onDidDismiss={() => setErrorMessage(null)}
            header="Error"
            message={errorMessage}
            buttons={["OK"]}
          />
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
