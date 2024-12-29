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
  IonToast
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personOutline, rocketOutline, bookOutline, cartOutline } from 'ionicons/icons';
import Products from './pages/Products/Products';
import ProductDetails from './components/ProductComponent/ProductDetails';
import Confirmation from './pages/Confirmation/Confirmation';
import PaymentPage from './pages/Payment/PaymentPage';
import Cart from './pages/Cart/Cart';
import MyOrders from './pages/MyOrders/MyOrders';
import Checkout from './pages/Checkout/Checkout';
import Profile from './pages/Profile/Profile';
import { useAppContext } from './context/AppContext';
import { translations } from './translations';

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

setupIonicReact();

const App: React.FC = () => {

  const { language, setShowToast, showToast, toastMessage, toastColor } = useAppContext();

  const labels = translations[language];

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/products">
              <Products />
            </Route>
            <Route exact path="/">
              <Redirect to="/products" />
            </Route>
            <Route path="/products/:id"> {/* Add route for product details */}
              <ProductDetails />
            </Route>
            <Route path="/confirmation/:id" render={(props) => <Confirmation key={props.match.params.id} />} />
            <Route exact path="/payment/:id">
              <PaymentPage />
            </Route>
            <Route exact path="/my-orders">
              <MyOrders />
            </Route>
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/cart">
              <Cart />
            </Route>
            <Route exact path="/checkout">
              <Checkout />
            </Route>
          </IonRouterOutlet>
          <IonToast
            isOpen={showToast}
            onDidDismiss={() => setShowToast(false)}
            message={toastMessage}
            duration={5000}
            color={toastColor}
            buttons={[
              {
                text: labels.close,
                role: 'cancel',
              },
            ]}
          />
          <IonTabBar slot="bottom">
            <IonTabButton tab="my-orders" href="/my-orders">
              <IonIcon aria-hidden="true" icon={bookOutline} />
              <IonLabel>{labels.myOrders}</IonLabel>
            </IonTabButton>

            <IonTabButton tab="products" href="/products">
              <IonIcon aria-hidden="true" icon={rocketOutline} />
              <IonLabel>{labels.orderNow}</IonLabel>
            </IonTabButton>

            <IonTabButton tab="cart" href="/cart">
              <IonIcon aria-hidden="true" icon={cartOutline} />
              <IonLabel>{labels.cart}</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href="/profile">
              <IonIcon aria-hidden="true" icon={personOutline} />
              <IonLabel>{labels.profile}</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
