import React, { useState } from "react";
import {
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,

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
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");

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

            history.push("/products");
        } catch (error: any) {
            setToastMessage(labels.loginFailed);
            setToastColor('danger');
            setShowToast(true);
        }
        finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        setIsLoading(true);
        try {
          await UserAPI.forgotPassword(forgotPasswordEmail);
          setToastMessage(labels.temporaryPasswordEmailSent);
          setToastColor('success');
          setShowToast(true);
          setShowForgotPasswordModal(false);
        } catch (error) {
          console.error("Forgot password request failed:", error);
          setToastMessage(labels.forgotPasswordFailed + ": " + error.message);
          setToastColor('danger');
          setShowToast(true);
        } finally {
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
                <IonButton expand="block" fill="clear" onClick={() => setShowForgotPasswordModal(true)}>
                    {labels.forgotPassword}
                </IonButton>

            </IonList>

            <IonModal isOpen={showForgotPasswordModal} onDidDismiss={() => setShowForgotPasswordModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{labels.forgotPassword}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowForgotPasswordModal(false)}>{labels.close}</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonList>
                        <IonItem>
                            <IonLabel position="stacked">{labels.enterEmail}</IonLabel>
                            <IonInput
                                value={forgotPasswordEmail}
                                placeholder={labels.enterEmail}
                                onIonInput={(e: any) => setForgotPasswordEmail(e.target.value || "")}
                            />
                        </IonItem>
                        <IonButton expand="block" onClick={handleForgotPassword}>
                            {labels.resetPassword}
                        </IonButton>
                    </IonList>
                </IonContent>
            </IonModal>
        </div>
    );
};

export default React.memo(LoginComponent);
