import React, { useState } from "react";
import {
    IonItem,
    IonLabel,
    IonInput,
    IonList,
    IonCheckbox,
    IonModal,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
} from "@ionic/react";
import { useAppContext } from "../../context/AppContext";
import { translations } from "../../translations";
import { UserAPI } from "../../services/apiService";
import "./SignUpComponent.css";

const SignUpComponent: React.FC = () => {
    const { language, setShowToast, setToastMessage, setToastColor, isLoading, setIsLoading, setActiveProfileTab } = useAppContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [acceptPrivacyNotice, setAcceptPrivacyNotice] = useState(false);
    const [agreeToReceiveMessages, setAgreeToReceiveMessages] = useState(false);
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    const labels = translations[language];

    const handleSignUp = async () => {
        setIsLoading(true);

        if (!firstName || !lastName || !email || !password || !phoneNumber) {
            setToastMessage(labels.fillAllFields);
            setToastColor('danger');
            setShowToast(true);
            setIsLoading(false);
            return;
        }

        if (!acceptPrivacyNotice) {
            setToastMessage(labels.pleaseReadAndAcceptPrivacyNotice);
            setToastColor('danger');
            setShowToast(true);
            setIsLoading(false);
            return;
        }

        // validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setToastMessage(labels.invalidEmailFormat);
            setToastColor('danger');
            setShowToast(true);
            setIsLoading(false);
            return;
        }
        
        try {
            await UserAPI.signUp(firstName, lastName, phoneNumber, email, password, agreeToReceiveMessages);

            setToastMessage(labels.registrationSuccessful);
            setToastColor('success');
            setShowToast(true);
            setActiveProfileTab('login');

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
        <div>
            <IonList>
                <IonItem>
                    <IonLabel position="stacked">{labels.firstName}*</IonLabel>
                    <IonInput
                        value={firstName}
                        placeholder={labels.enterFirstName}
                        onIonInput={(e: any) => setFirstName(e.target.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">{labels.lastName}*</IonLabel>
                    <IonInput
                        value={lastName}
                        placeholder={labels.enterLastName}
                        onIonInput={(e: any) => setLastName(e.target.value || "")}
                    />
                </IonItem>
                <IonItem>
                    <IonLabel position="stacked">{labels.phoneNumber}*</IonLabel>
                    <IonInput
                        value={phoneNumber}
                        placeholder={labels.enterPhoneNumber}
                        onIonInput={(e: any) => setPhoneNumber(e.target.value || "")}
                    />
                </IonItem>
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
                <IonItem>
                    <IonCheckbox
                        checked={acceptPrivacyNotice}
                        onIonChange={(e) => setAcceptPrivacyNotice(e.detail.checked)}
                    />
                    <IonLabel>
                        {labels.acceptPrivacyNotice}
                        <a className="clickable-link" onClick={() => setShowPrivacyModal(true)}>
                            {labels.privacyNotice}

                        </a>
                        *
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonCheckbox
                        checked={agreeToReceiveMessages}
                        onIonChange={(e) => setAgreeToReceiveMessages(e.detail.checked)}
                    />
                    <IonLabel>
                        {labels.agreeToReceiveMessages}
                    </IonLabel>
                </IonItem>
            </IonList>
            <IonButton expand="block" onClick={handleSignUp}>
                {labels.signUp}
            </IonButton>

            <IonModal isOpen={showPrivacyModal} onDidDismiss={() => setShowPrivacyModal(false)}>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{labels.privacyNotice}</IonTitle>
                        <IonButtons slot="end">
                            <IonButton onClick={() => setShowPrivacyModal(false)}>{labels.close}</IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <div className="privacy-notice">
                        <p>אנו, <strong>מאפיית משהדאוי</strong>, מחויבים להגן על פרטיות לקוחותינו. הצהרת פרטיות זו מסבירה כיצד אנו אוספים, משתמשים ומגנים על המידע האישי שלך בעת השימוש באתר שלנו.</p>

                        <h3>מידע שאנו אוספים:</h3>
                        <ul>
                            <li>שם פרטי ושם משפחה</li>
                            <li>מספר טלפון</li>
                            <li>כתובת דוא"ל</li>
                            <li>סיסמה מוצפנת</li>
                            <li>כתובת למשלוח (במקרה של בחירת משלוח)</li>
                        </ul>

                        <h3>כיצד אנו משתמשים במידע:</h3>
                        <ul>
                            <li>עיבוד הזמנות ומשלוחים</li>
                            <li>יצירת קשר במקרה הצורך</li>
                            <li>שיפור השירותים שלנו</li>
                            <li>שליחת עדכונים ומבצעים (בהסכמתך)</li>
                        </ul>

                        <h3>שמירה על המידע:</h3>
                        <p>אנו שומרים על אבטחת המידע שלך באמצעות אמצעים טכנולוגיים וארגוניים מתקדמים. אנו לא משתפים את פרטיך עם צדדים שלישיים למטרות מסחריות.</p>

                        <h3>זכויותיך:</h3>
                        <p>יש לך את הזכות לעיין במידע האישי שלך, לתקנו או לבקש את מחיקתו. לבקשות ולשאלות נוספות ניתן לפנות אלינו בכתובת: </p>
                        <p>el.meshhdawi@gmail.com</p>

                        <h3>שינויים במדיניות הפרטיות:</h3>
                        <p>אנו עשויים לעדכן הצהרה זו מעת לעת. במקרה של שינויים מהותיים, נעדכן אותך באמצעות הודעה באתר.</p>


                        <hr />


                        <p>نحن في <strong>مخبز المشهداوي</strong> ملتزمون بحماية خصوصية عملائنا. يوضح إشعار الخصوصية هذا كيفية جمع بياناتك الشخصية واستخدامها وحمايتها عند استخدام موقعنا.</p>

                        <h3>المعلومات التي نقوم بجمعها:</h3>
                        <ul>
                            <li>الاسم الأول واسم العائلة</li>
                            <li>رقم الهاتف</li>
                            <li>البريد الإلكتروني</li>
                            <li>كلمة المرور المشفرة</li>
                            <li>عنوان التوصيل (في حال اختيار التوصيل)</li>
                        </ul>

                        <h3>كيفية استخدام المعلومات:</h3>
                        <ul>
                            <li>معالجة الطلبات والتوصيل</li>
                            <li>التواصل معك عند الضرورة</li>
                            <li>تحسين خدماتنا</li>
                            <li>إرسال التحديثات والعروض (بموافقتك)</li>
                        </ul>

                        <h3>حماية المعلومات:</h3>
                        <p>نقوم بحماية بياناتك باستخدام إجراءات تقنية وتنظيمية متقدمة. لا نشارك معلوماتك مع أطراف ثالثة لأغراض تجارية.</p>

                        <h3>حقوقك:</h3>
                        <p>لديك الحق في الوصول إلى بياناتك الشخصية، أو تصحيحها، أو طلب حذفها. يمكنك الاتصال بنا للاستفسارات عبر البريد الإلكتروني.</p>
                        <p>el.meshhdawi@gmail.com</p>

                        <h3>التغييرات في سياسة الخصوصية:</h3>
                        <p>قد نقوم بتحديث هذا الإشعار من وقت لآخر. سيتم إعلامك بأي تغييرات جوهرية من خلال إشعار على الموقع الإلكتروني.</p>

                        <hr />

                        <h2>ליצירת קשר / للتواصل معنا:</h2>
                        <p><strong>מאפיית משהדאוי | مخبز المشهداوي</strong></p>
                        <p>כתובת / العنوان: {labels.bakeryAddress}</p>
                        <p>טלפון / الهاتف: {labels.bakeryPhone}</p>
                        <p>אימייל / البريد الإلكتروني: el.meshhdawi@gmail.com</p>
                    </div>
                </IonContent>
            </IonModal>
        </div>
    );
};

export default React.memo(SignUpComponent);