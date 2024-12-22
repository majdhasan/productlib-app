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
  IonSegment,
  IonSegmentButton,
  useIonToast,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import LoginComponent from "../../components/LoginComponent/LoginComponent";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [dateOfBirth, setDateOfBirth] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"login" | "lookup">("login");
  const [email, setEmail] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [presentToast] = useIonToast();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setDateOfBirth(userData.dateOfBirth || "");
      setEmail(userData.email || "");
    }
  }, []);

  const handleLoginSuccess = (user: any) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const handleLookup = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/orders/lookup?email=${email}&orderId=${orderId}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Failed to lookup order.");
        return;
      }

      const order = await response.json();
      history.push(`/confirmation/${order.id}`);
    } catch (error) {
      setErrorMessage("An error occurred during lookup. Please try again.");
      console.error(error);
    }
  };

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
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      setErrorMessage("An error occurred while updating the profile.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    history.push("/");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {user ? (
          <>
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
          </>
        ) : (
          <>
            <IonSegment
              value={activeTab}
              onIonChange={(e) => setActiveTab(e.detail.value as "login" | "lookup")}
            >
              <IonSegmentButton value="login">
                <IonLabel>Login</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value="lookup">
                <IonLabel>Lookup</IonLabel>
              </IonSegmentButton>
            </IonSegment>

            {activeTab === "login" && (
              <div className="tab-content-container">
                <LoginComponent onLoginSuccess={handleLoginSuccess} />
              </div>
            )}

            {activeTab === "lookup" && (
              <div className="tab-content-container">
                <IonList>
                  <IonItem>
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                      value={email}
                      placeholder="Enter your email"
                      onIonChange={(e) => setEmail(e.detail.value!)}
                    />
                  </IonItem>
                  <IonItem>
                    <IonLabel position="stacked">Order ID</IonLabel>
                    <IonInput
                      value={orderId}
                      placeholder="Enter your order ID"
                      onIonChange={(e) => setOrderId(e.detail.value!)}
                    />
                  </IonItem>
                </IonList>
                <IonButton expand="block" type="button" onClick={handleLookup}>
                  Lookup Order
                </IonButton>
              </div>
            )}
          </>
        )}

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
