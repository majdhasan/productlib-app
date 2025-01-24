import { createRoot } from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext';
import { IonReactRouter } from '@ionic/react-router';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <IonReactRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </IonReactRouter>
);