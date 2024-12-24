import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  IonThumbnail
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'; // For navigation
import './Products.css';

const Products: React.FC = () => {
  const [products, setProducts] = useState([]); // State for products
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [isLoading, setIsLoading] = useState(true); // State for loading spinner
  const history = useHistory(); // React Router hook for navigation

  useEffect(() => {
    // Fetch products from the backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/products'); // Replace with your API endpoint
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter((product: any) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Navigate to the product details page
  const goToProductDetails = (productId: number) => {
    history.push(`/products/${productId}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>What are you looking for?</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">What are you looking for?</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar
          className="ion-searchbar"
          placeholder="Type here..."
          onIonInput={(e: any) => setSearchQuery(e.target.value)} // Update search query on input
        ></IonSearchbar>

        {isLoading ? (
          // Show a loading spinner while fetching data
          <div className="spinner-container">
            <IonSpinner name="bubbles" />
          </div>
        ) : (
          <IonList>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product: any) => (
                <IonItem
                  key={product.id}
                  button
                  onClick={() => goToProductDetails(product.id)} // Navigate on click
                >
                  <IonThumbnail slot="start">
                    <img
                      src={`https://pbs.twimg.com/media/Dq_Dic9W4AAQo9c.png`}
                      alt={product.name}
                    />
                  </IonThumbnail>
                  <IonLabel>
                    <h2>{product.name}</h2>
                    <p>{product.description}</p>
                    <p>Cost: ₪{product.cost}</p>
                  </IonLabel>
                </IonItem>
              ))
            ) : (
              <IonItem>
                <IonLabel>No products found</IonLabel>
              </IonItem>
            )}
          </IonList>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Products;
