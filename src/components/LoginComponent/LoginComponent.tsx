import React, { useState } from "react";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
} from "@ionic/react";
import { useHistory } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { translations } from "../../translations";
import { UserAPI } from "../../services/apiService";

const LoginComponent: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const history = useHistory();
    const { language, setUser, setCart, setToastColor, setToastMessage, setShowToast, setIsLoading } = useAppContext(); // Access AppContext

    const labels = translations[language];

    const handleLogin = async () => {

        if (!email || !password) {
            setToastMessage(labels.fillAllFields);
            setToastColor('danger');
            setShowToast(true);
            return;
        }
        try {
            setIsLoading(true);
            const data = await UserAPI.login(email, password);
            const { user, cart, token } = data;

            localStorage.setItem("token", token);

            setUser(user);
            setCart(cart);
            setToastMessage(labels.loginSuccessful);
            setToastColor('success');
            setShowToast(true);

            history.push("/my-orders");
        } catch (error: any) {
            console.error("Error logging in:", error);
            setToastMessage(labels.loginFailed + ": " + error.message);
            setToastColor('danger');
            setShowToast(true);
        }
        finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <IonList>
                <IonItem>
                    <IonLabel position="stacked">{labels.email}*</IonLabel>
                    <IonInput
                        value={email}
                        placeholder={labels.enterEmail}
                        onIonInput={(e: any) => setEmail(e.target.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">{labels.password}*</IonLabel>
                    <IonInput
                        type="password"
                        value={password}
                        placeholder={labels.enterPassword}
                        onIonInput={(e: any) => setPassword(e.target.value || "")}
                    />
                </IonItem>
                <IonButton expand="block" onClick={handleLogin}>
                    {labels.login}
                </IonButton>
            </IonList>
        </div>
    );
};

export default React.memo(LoginComponent);
