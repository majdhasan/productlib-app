import React, { useEffect, useState } from 'react';
import { IonButtons, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonText, IonBadge, IonButton, IonModal, IonInput, IonTextarea } from '@ionic/react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../translations';
import './Products.css';
import { ProductAPI, UserAPI, baseUrl } from "../../services/apiService";
import { getTranslation } from '../../services/translationService';
import { useHistory } from 'react-router';
import ReactGA from 'react-ga4';

const CATEGORY_ORDER = [
  'ROLL',
  'MANAKESH',
  'FATAYER',
  'FAMILY_MEALS',
  'BISCUITS',
  'OTHERS'
];

const sortCategories = (categories: string[]) => {
  return categories.sort((a, b) => {
    const indexA = CATEGORY_ORDER.indexOf(a);
    const indexB = CATEGORY_ORDER.indexOf(b);
    return indexA - indexB;
  });
};

const Products: React.FC = () => {
  const { language, setIsLoading, user, setToastColor, setToastMessage, setShowToast } = useAppContext();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactName, setContactName] = useState(user ? user.firstName + ' ' + user.lastName : '');
  const [contactEmail, setContactEmail] = useState(user ? user.email : '');
  const [contactMessage, setContactMessage] = useState('');
  const history = useHistory();

  const labels = translations[language];

  const CATEGORY_LABELS: Record<string, string> = {
    ROLL: labels.roll,
    MANAKESH: labels.manakesh,
    FATAYER: labels.fatayer,
    BISCUITS: labels.biscuits,
    FAMILY_MEALS: labels.familyMeals,
    OTHERS: labels.others
  };

  const getCategoryLabel = (category: string): string => {
    return CATEGORY_LABELS[category] || category;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await ProductAPI.fetchProducts();
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const goToProductDetails = (productId: number, productName: string) => {
    ReactGA.event({
      category: 'Product',
      action: 'Product Click',
      label: productName, // The name of the product clicked
      value: productId,   // Tracking product ID
    });
    history.push(`/products/${productId}`);
  };

  const handleContactSubmit = async () => {
    if (!contactMessage) {
      setToastMessage(labels.fillAllFields);
      setToastColor('danger');
      setShowToast(true);
      return;
    }
    setIsLoading(true);
    try {
      await UserAPI.contactUs(contactName, contactEmail, contactMessage);
      setToastMessage(labels.messageSent);
      setToastColor('success');
      setShowToast(true);
      setShowContactModal(false);
    } catch (error) {
      setToastMessage(error.message);
      setToastColor('danger');
      setShowToast
    }finally {
      setIsLoading(false);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'OTHERS';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, any[]>);

  const sortedCategories = sortCategories(Object.keys(groupedProducts));

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{labels.products}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {error ? (
          <IonText color="danger" className="ion-padding">
            <h3>{error}</h3>
          </IonText>
        ) : (
          sortedCategories.length > 0 ? (
            sortedCategories.map((category) => (
              <React.Fragment key={category}>
                <div className="category-container">
                  <IonBadge className="category-badge">{getCategoryLabel(category)}</IonBadge>
                </div>
                <IonList>
                  {groupedProducts[category].map((product) => {
                    const { name, description } = getTranslation(product, language);
                    const thumbnailSrc = `${baseUrl}/files/thumbnail_${product.image}`;
                    const originalSrc = `${baseUrl}/files/${product.image}`;
                    let fallbackAttempted = false;

                    return (
                      <IonItem key={product.id} button onClick={() => goToProductDetails(product.id, name)}>
                        <IonThumbnail slot="start">
                          <img
                            src={thumbnailSrc}
                            alt={name}
                            onError={(e) => {
                              if (!fallbackAttempted) {
                                (e.target as HTMLImageElement).src = originalSrc;
                                fallbackAttempted = true;
                              } else {
                                (e.target as HTMLImageElement).src = ''; // Clear the src to prevent infinite loop
                              }
                            }}
                          />
                        </IonThumbnail>
                        <IonLabel>
                          <h2>{name}</h2>
                          <p>{description}</p>
                          <p>{labels.price}: ₪{product.price}</p>
                        </IonLabel>
                      </IonItem>
                    );
                  })}
                </IonList>
              </React.Fragment>
            ))
          ) : (
            <IonItem>
              <IonLabel>{labels.noProductsFound}</IonLabel>
            </IonItem>
          )
        )}
        <IonButton className='feedback-button'  expand="block" onClick={() => setShowContactModal(true)}>
          {labels.somethingIsMissing}
        </IonButton>


        <IonModal isOpen={showContactModal} onDidDismiss={() => setShowContactModal(false)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>{labels.contactUs}</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => setShowContactModal(false)}>{labels.close}</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">{labels.name}</IonLabel>
                <IonInput
                  value={contactName}
                  placeholder={labels.enterName}
                  onIonInput={(e: any) => setContactName(e.target.value || "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{labels.email}</IonLabel>
                <IonInput
                  value={contactEmail}
                  placeholder={labels.enterEmail}
                  onIonInput={(e: any) => setContactEmail(e.target.value || "")}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">{labels.message}*</IonLabel>
                <IonTextarea
                  rows={4}
                  value={contactMessage}
                  placeholder={labels.enterMessage}
                  onIonInput={(e: any) => setContactMessage(e.target.value || "")}
                />
              </IonItem>
              <IonButton expand="block" onClick={handleContactSubmit}>
                {labels.send}
              </IonButton>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Products;