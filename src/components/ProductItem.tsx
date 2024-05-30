// Product item component
import React from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import styles from '../styles/styles';
import ImageSlider from './ImageSlider';

interface ProductItemProps {
  id: number;
  title: string;
  images: {
    [key: string]: string;
  };
  currency: string;
  price_min: number;
  compare_at_price_min: number;
  tags: string[];
  'offer-message': string;
}

const ProductItem = ({
  product,
  onAddToCart,
  onProductClick,
}: {
  product: ProductItemProps;
  onAddToCart: (product: ProductItemProps) => void;
  onProductClick: (product: ProductItemProps) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={() => onProductClick(product?.images)}
      key={product.id}
      style={styles.itemContainer}>
      <Image source={{uri: product.images[1]}} style={styles.imageContainer} />
      <TouchableOpacity
        onPress={() => onAddToCart(product)}
        style={styles.shoppingIconContainer}>
        <Image
          style={styles.shoppingIcon}
          source={require('../icons/shopping.png')}
        />
      </TouchableOpacity>
      <Text style={styles.title}>{product.title}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.currencyText}>{product.currency}</Text>
        <Text style={styles.priceText}>{product.price_min}</Text>
        <Text style={styles.comparePriceText}>
          {product.compare_at_price_min}
        </Text>
      </View>
      <View style={styles.offerContainer}>
        <Image
          style={styles.offerIcon}
          source={require('../icons/offer.png')}
        />
        <Text style={styles.offerText}>{product['offer-message']}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
