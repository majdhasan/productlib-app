import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
  IonToast,
  IonBadge
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personOutline, rocketOutline, bookOutline, cartOutline, notificationsOutline } from 'ionicons/icons';
import Products from './pages/Products/Products';
import ProductDetails from './components/ProductComponent/ProductDetails';
import Confirmation from './pages/Confirmation/Confirmation';
import Cart from './pages/Cart/Cart';
import MyOrders from './pages/MyOrders/MyOrders';
import Checkout from './pages/Checkout/Checkout';
import Profile from './pages/Profile/Profile';
import Notifications from './pages/Notifications/Notifications';
import { useAppContext } from './context/AppContext';
import { translations } from './translations';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import './App.css';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';


/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

const GA_MEASUREMENT_ID = 'G-6RM9P2FYEB';
ReactGA.initialize(GA_MEASUREMENT_ID);
ReactGA.send({ hitType: "pageview", page: window.location.pathname });
setupIonicReact();

const App: React.FC = () => {
  const { language, setShowToast, showToast, toastMessage, toastColor, cart, notifications } = useAppContext();
  const labels = translations[language];
  const cartItemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;
  const unreadNotificationsCount = notifications.filter(notification => !notification.isRead).length;
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <IonApp className="center-aligned">
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/products" component={Products} />
            <Route exact path="/" render={() => <Redirect to="/products" />} />
            <Route path="/products/:id" component={ProductDetails} />
            <Route path="/confirmation/:id" render={(props) => <Confirmation key={props.match.params.id} />} />
            <Route exact path="/my-orders" component={MyOrders} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/cart" component={Cart} />
            <Route exact path="/checkout" component={Checkout} />
            <Route path="/notifications" component={Notifications} />
          </IonRouterOutlet>
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={4000}
            color={toastColor}
            position="bottom"
            buttons={[{ text: labels.close, role: 'cancel' }]}
          />
          <IonTabBar slot="bottom">
            <IonTabButton tab="my-orders" href="/my-orders">
              <IonIcon aria-hidden="true" icon={bookOutline} />
              <IonLabel>{labels.myOrders}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="products" href="/products">
              <IonIcon aria-hidden="true" icon={rocketOutline} />
              <IonLabel>{labels.products}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="cart" href="/cart">
              <IonIcon aria-hidden="true" icon={cartOutline} />
              {cartItemCount > 0 && <IonBadge color="danger">{cartItemCount}</IonBadge>}
              <IonLabel>{labels.cart}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="profile" href="/profile">
              <IonIcon aria-hidden="true" icon={personOutline} />
              <IonLabel>{labels.profile}</IonLabel>
            </IonTabButton>
            <IonTabButton tab="notifications" href="/notifications">
              <IonIcon aria-hidden="true" icon={notificationsOutline} />
              {unreadNotificationsCount > 0 && <IonBadge color="danger">{unreadNotificationsCount}</IonBadge>}
              <IonLabel>{labels.notifications}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
