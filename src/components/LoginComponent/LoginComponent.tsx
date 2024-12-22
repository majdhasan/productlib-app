import React, { useState } from "react";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonAlert,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";

const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const history = useHistory(); // Access the history object
    const { setUser, setCart } = useAppContext(); // Access AppContext

    const handleLogin = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error("Login failed. Please check your credentials.");
            }

            const data = await response.json();
            const { user, cart } = data;

            // Update AppContext with user and cart data
            setUser(user);
            setCart(cart);

            // Redirect to products page
            history.push("/products");
        } catch (error: any) {
            console.error("Error logging in:", error.message);
            setErrorMessage("Login failed. Please try again.");
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
                        onIonChange={(e) => setEmail(e.detail.value || "")}
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
