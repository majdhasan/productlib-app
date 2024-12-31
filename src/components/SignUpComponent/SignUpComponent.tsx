import React, { useState } from "react";
import {
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonList,
    IonAlert,
} from "@ionic/react";
import { useAppContext } from "../../context/AppContext";
import { useHistory } from "react-router-dom";
import { translations } from "../../translations";
import "./SignUpComponent.css";

const SignUpComponent: React.FC = () => {
    const { setUser, language, setShowToast, setToastMessage, setToastColor, isLoading, setIsLoading } = useAppContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const history = useHistory();

    const labels = translations[language];

    const handleSignUp = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    phoneNumber,
                    email,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to sign up.");
              }

            const newUser = await response.json();
            setUser(newUser);
            setToastMessage(labels.registrationSuccessful);
            setToastColor('success');
            setShowToast(true);

            history.push("/my-orders");
        } catch (error) {
            console.error("Error signing up:", error);
            setToastMessage(labels.registrationFailed + ": " + error.message);
            setToastColor('danger');
            setShowToast(true);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="sign-up-container">
            <IonList>
                <IonItem>
                    <IonLabel position="stacked">{labels.firstName}</IonLabel>
                    <IonInput
                        value={firstName}
                        placeholder={labels.enterFirstName}
                        onIonInput={(e: any) => setFirstName(e.target.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">{labels.lastName}</IonLabel>
                    <IonInput
                        value={lastName}
                        placeholder={labels.enterLastName}
                        onIonInput={(e: any) => setLastName(e.target.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">{labels.phoneNumber}</IonLabel>
                    <IonInput
                        value={phoneNumber}
                        placeholder={labels.enterPhoneNumber}
                        onIonInput={(e: any) => setPhoneNumber(e.target.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">{labels.email}</IonLabel>
                    <IonInput
                        value={email}
                        placeholder={labels.enterEmail}
                        onIonInput={(e: any) => setEmail(e.target.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">{labels.password}</IonLabel>
                    <IonInput
                        type="password"
                        value={password}
                        placeholder={labels.enterPassword}
                        onIonInput={(e: any) => setPassword(e.target.value || "")}
                    />
                </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleSignUp}>
                {labels.signUp}
            </IonButton>
        </div>
    );
};

export default React.memo(SignUpComponent);