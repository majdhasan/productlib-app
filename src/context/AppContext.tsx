import React, { createContext, useState, useContext, useEffect } from 'react';

interface AppContextType {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  cart: any;
  setCart: React.Dispatch<React.SetStateAction<any>>;
  language: string;
  setLanguage: React.Dispatch<React.SetStateAction<string>>;
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
    return storedLanguage || 'en'; // Default to English if no language is stored
  });

  // Sync state to localStorage whenever user or cart changes
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
      }}
    >
      {children}
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
