import React from 'react';
import { IonItem, IonLabel, IonBadge, IonThumbnail } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { baseUrl } from '../../services/apiService';
import './OrderListItem.css';

interface OrderListItemProps {
    order: any;
    labels: any;
    language: string;
}

const OrderListItem: React.FC<OrderListItemProps> = ({ order, labels, language }) => {
    const history = useHistory();

    const formatTime = (timestamp: string, language: string): string => {
        const options: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(timestamp).toLocaleTimeString(language, options);
    };

    return (
        <IonItem
            key={order.id}
            button
            onClick={() => history.push(`/confirmation/${order.id}`)}
        >
            <IonLabel>
                <h2 className="order-header">
                    {`${labels.orderNumber}${order.id}`}
                    <IonBadge className={`status-badge status-${order.status.toLowerCase()}`}>
                        {labels[`status${order.status}`] || labels.unknownStatus}
                    </IonBadge>
                </h2>
                <p>
                    <strong>{labels.createdAt}:</strong> {formatTime(order.createdAt, language)}
                </p>
                <div className="order-items">
                    {order.items.slice(0, 5).map((item: any) => (
                        <IonThumbnail key={item.id}>
                            <img src={`${baseUrl}/files/${item.productImage}`} alt={item.productName} className="item-thumbnail" />
                        </IonThumbnail>
                    ))}
                    {order.items.length > 5 && (
                        <IonThumbnail>
                            <div className="more-items">...</div>
                        </IonThumbnail>
                    )}
                </div>
            </IonLabel>
        </IonItem>
    );
};

export default OrderListItem;
