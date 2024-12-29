import React, { useEffect, useState } from 'react';
import { IonSearchbar, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonThumbnail, IonLoading, IonText } from '@ionic/react';
import { useAppContext } from '../../context/AppContext';
import { translations } from '../../translations';
import './Products.css';
import { ProductAPI } from "../../services/apiService";
import { useHistory } from 'react-router';

const Products: React.FC = () => {
  const { language } = useAppContext();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const history  = useHistory();

  const labels = translations[language];

  useEffect(() => {
    const fetchProducts = async () => {
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

  const getTranslation = (product: any, language: string) => {
    const translation = product.translations.find((t: any) => t.language === language);
    return translation || { name: product.name, description: product.description };
  };

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
        {isLoading ? (
          <IonLoading isOpen={isLoading} message="Loading products..." />
        ) : error ? (
          <IonText color="danger" className="ion-padding">
            <h3>{error}</h3>
          </IonText>
        ) : (
          <IonList>
            {products.length > 0 ? (
              products.map((product) => {
                const { name, description } = getTranslation(product, language);
                return (
                  <IonItem key={product.id} button onClick={() => goToProductDetails(product.id)}>
                    <IonThumbnail slot="start">
                      <img src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`} alt={name} />
                    </IonThumbnail>
                    <IonLabel>
                      <h2>{name}</h2>
                      <p>{description}</p>
                      <p>{labels.price}: ₪{product.cost}</p>
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
