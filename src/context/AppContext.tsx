import React, { createContext, useState, useContext, useEffect } from 'react';
import { IonLoading } from '@ionic/react';
import { translations } from '../translations';

interface AppContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
    return storedLanguage || 'en';
  });

  const [orderSubmitted, setOrderSubmitted] = useState<boolean>(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('success');

  const [isLoading, setIsLoading] = useState(false);

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

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
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
      }}
    >
      {children}
      <IonLoading isOpen={isLoading} message = {labels.loading} />
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
