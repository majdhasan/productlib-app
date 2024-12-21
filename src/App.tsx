import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personOutline, rocketOutline, bookOutline, cartOutline } from 'ionicons/icons';
import Products from './pages/Products/Products';
import ProductDetails from './components/ProductComponent/ProductDetails';
import Confirmation from './pages/Confirmation/Confirmation';
import PaymentPage from './pages/Payment/PaymentPage';
import MyOrders from './pages/MyOrders/MyOrders';
import { UserProvider } from './context/UserContext';
import Profile from './pages/Profile/Profile';

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

const App: React.FC = () => (
  <UserProvider>
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
            <Route path="/products/:id"> {/* Add route for service details */}
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
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="my-orders" href="/my-orders">
              <IonIcon aria-hidden="true" icon={bookOutline} />
              <IonLabel>My Orders</IonLabel>
            </IonTabButton>

            <IonTabButton tab="products" href="/products">
              <IonIcon aria-hidden="true" icon={rocketOutline} />
              <IonLabel>Order now</IonLabel>
            </IonTabButton>

            <IonTabButton tab="cart" href="/cart">
              <IonIcon aria-hidden="true" icon={cartOutline} />
              <IonLabel>My Cart</IonLabel>
            </IonTabButton>

            <IonTabButton tab="profile" href="/profile">
              <IonIcon aria-hidden="true" icon={personOutline} />
              <IonLabel>Profile</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </UserProvider>
);

export default App;
