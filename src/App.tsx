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
import { personOutline, rocketOutline, bookOutline } from 'ionicons/icons';
import Services from './pages/Services/Services';
import ServiceDetails from './components/ServiceComponent/ServiceDetails';
import BookingCalendar from './components/CalendarComponent/BookingCalendar';
import Confirmation from './pages/Confirmation/Confirmation';
import PaymentPage from './pages/Payment/PaymentPage';
import MyBookings from './pages/MyBookings/MyBookings';
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
            <Route exact path="/services">
              <Services />
            </Route>
            <Route exact path="/">
              <Redirect to="/services" />
            </Route>
            <Route path="/services/:id"> {/* Add route for service details */}
              <ServiceDetails />
            </Route>
            <Route exact path="/book/:id" component={BookingCalendar} />
            <Route path="/confirmation/:id" render={(props) => <Confirmation key={props.match.params.id} />} />
            <Route exact path="/payment/:id">
              <PaymentPage />
            </Route>
            <Route exact path="/my-bookings">
              <MyBookings />
            </Route>
            <Route exact path="/profile" component={Profile} />
          </IonRouterOutlet>

          <IonTabBar slot="bottom">
            <IonTabButton tab="my-bookings" href="/my-bookings">
              <IonIcon aria-hidden="true" icon={bookOutline} />
              <IonLabel>My Bookings</IonLabel>
            </IonTabButton>

            <IonTabButton tab="services" href="/services">
              <IonIcon aria-hidden="true" icon={rocketOutline} />
              <IonLabel>Book now</IonLabel>
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
