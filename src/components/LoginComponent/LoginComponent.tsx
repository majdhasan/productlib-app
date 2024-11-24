import React, { useState } from "react";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonAlert,
} from "@ionic/react";

interface LoginProps {
    onLoginSuccess: (user: any) => void; // Callback function after a successful login
}

const LoginComponent: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async () => {
        console.log("Login attempt with:", { email, password }); // Debug
        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message || "Login failed. Please check your credentials.");
                return;
            }

            const user = await response.json();
            localStorage.setItem("user", JSON.stringify(user));
            onLoginSuccess(user);
        } catch (error) {
            setErrorMessage("An error occurred during login. Please try again.");
        }
    };

    return (
        <div>
            <IonList>
                <IonItem>
                    <IonLabel position="stacked">Email</IonLabel>
                    <IonInput
                        value={email}
                        placeholder="Enter your email"
                        onIonChange={(e) => setEmail(e.detail.value || "")} // Update email state
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">Password</IonLabel>
                    <IonInput
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onIonInput={(e: any) => setPassword(e.target.value || "")}
                        />
                </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleLogin}>
                Login
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
        </div>
    );
};

export default React.memo(LoginComponent);
