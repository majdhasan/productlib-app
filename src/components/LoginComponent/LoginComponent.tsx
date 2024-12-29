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
import { translations } from "../../translations";

const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const history = useHistory();
    const { language, setUser, setCart, setToastColor, setToastMessage, setShowToast } = useAppContext(); // Access AppContext

    const labels = translations[language];

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

            
            setUser(user);
            setCart(cart);

            setToastColor("success");
            setToastMessage(labels.loginSuccessful);
            setShowToast(true);
            
            history.push("/my-orders");
        } catch (error: any) {
            setErrorMessage("Login failed. Please try again.");
        }
    };

    return (
        <div>
            <IonList>
                <IonItem>
                    <IonLabel position="stacked">{labels.email}</IonLabel>
                    <IonInput
                        value={email}
                        placeholder={labels.enterEmail}
                        onIonChange={(e) => setEmail(e.detail.value || "")}
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
            <IonButton expand="block" onClick={handleLogin}>
                {labels.login}
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
