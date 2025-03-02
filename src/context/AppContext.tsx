import React, {createContext, useContext, useEffect, useState} from 'react';
import {IonLoading} from '@ionic/react';
import {translations} from '../translations';
import {NotificationsAPI} from "../services/apiService";

interface AppContextType {
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    notifications: any;
    setNotifications: React.Dispatch<React.SetStateAction<any>>;
    cart: any;
    setCart: React.Dispatch<React.SetStateAction<any>>;
    language: string;
    setLanguage: React.Dispatch<React.SetStateAction<string>>;
    orderSubmitted: boolean;
    setOrderSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    showToast: boolean;
    setShowToast: React.Dispatch<React.SetStateAction<boolean>>;
    toastMessage: string;
    setToastMessage: React.Dispatch<React.SetStateAction<string>>;
    toastColor: string;
    setToastColor: React.Dispatch<React.SetStateAction<string>>;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    activeProfileTab: 'login' | 'signup';
    setActiveProfileTab: React.Dispatch<React.SetStateAction<'login' | 'signup'>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [user, setUser] = useState<any>(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const [cart, setCart] = useState<any>(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart ? JSON.parse(storedCart) : null;
    });

    const [language, setLanguage] = useState<string>(() => {
        const storedLanguage = localStorage.getItem('language');
        return storedLanguage || 'ar';
    });

    const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastColor, setToastColor] = useState('success');

    const [isLoading, setIsLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const [activeProfileTab, setActiveProfileTab] = useState<'login' | 'signup'>('login');

    const labels = translations[language];

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user]);

    useEffect(() => {
        if (cart) {
            localStorage.setItem('cart', JSON.stringify(cart));
        } else {
            localStorage.removeItem('cart');
        }
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('language', language);
    }, [language]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const data = await NotificationsAPI.fetchNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications(); // Initial fetch

        const intervalId = setInterval(fetchNotifications, 30000); // Fetch every 30 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    return (
        <AppContext.Provider
            value={{
                user,
                setUser,
                notifications,
                setNotifications,
                cart,
                setCart,
                language,
                setLanguage,
                orderSubmitted,
                setOrderSubmitted,
                showToast,
                setShowToast,
                toastMessage,
                setToastMessage,
                toastColor,
                setToastColor,
                isLoading,
                setIsLoading,
                activeProfileTab,
                setActiveProfileTab,
            }}
        >
            {children}
            <IonLoading isOpen={isLoading} message={labels.loading} spinner="circular"/>
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
