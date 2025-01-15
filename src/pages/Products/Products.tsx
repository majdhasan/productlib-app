import React, { useEffect, useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonText } from '@ionic/react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../translations';
import './Products.css';
import { ProductAPI, baseUrl } from "../../services/apiService";
import { getTranslation } from '../../services/translationService';
import { useHistory } from 'react-router';

const Products: React.FC = () => {
  const { language, setIsLoading } = useAppContext();
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const history = useHistory();

  const labels = translations[language];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await ProductAPI.fetchProducts()
        setProducts(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const goToProductDetails = (productId: number) => {
    history.push(`/products/${productId}`);
  };

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
          <IonList>
            {products.length > 0 ? (
              products.map((product) => {
                const { name, description } = getTranslation(product, language);
                const thumbnailSrc = `${baseUrl}/files/thumbnail_${product.image}`;
                const originalSrc = `${baseUrl}/files/${product.image}`;
                let fallbackAttempted = false;

                return (
                  <IonItem key={product.id} button onClick={() => goToProductDetails(product.id)}>
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
              })
            ) : (
              <IonItem>
                <IonLabel>{labels.noProductsFound}</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Products;
