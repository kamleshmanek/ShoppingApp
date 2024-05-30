// src/screens/HomeScreen.tsx
import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Animated
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {CartContext} from '../context/CartContext';
import ProductItem from '../components/ProductItem';
import styles from '../styles/styles';
import Header from '../components/Header';
import ImageSlider from '../components/ImageSlider';

interface Product {
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

const HomeScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const {state, dispatch} = useContext(CartContext);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<number>(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [animatedValue] = useState(new Animated.Value(0));

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setCartItems(state.items.length);
      const lang = (await AsyncStorage.getItem('language')) || 'en';
      const response = await axios.get(
        `https://shopifyapptst1.bma.ae/react-native-exercise/?lang=${lang}`,
      );
      const newProducts = response.data.data.products.slice(
        (page - 1) * 4,
        page * 4,
      );
      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      setLoading(false);
    };
    fetchProducts();
  }, [page]);

  const handleAddToCart = (product: Product) => {
    dispatch({type: 'ADD_TO_CART', payload: product});
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start(() => {
      setCartItems(state.items.length);
      animatedValue.setValue(0);
    });
  };

  return (
    <SafeAreaView style={styles.topContainer}>
      <View style={styles.container}>
        <Header cartItem={cartItems} animatedValue={animatedValue} />
        <FlatList
          data={products}
          contentContainerStyle={styles.list}
          renderItem={({item, index}) => {
            return (
              <ProductItem
                product={item}
                onAddToCart={product => handleAddToCart(product)}
                onProductClick={productItem => {
                  let selectedProduct = [];
                  selectedProduct.push(productItem)
                  const imageArray = Object.values(selectedProduct[0]);
                  setSelectedProduct(imageArray);
                  setIsModalVisible(true);
                }}
              />
            );
          }}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={() => {
            if (!loading && products.length < 16) setPage(page + 1);
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? <ActivityIndicator size="large" color="#E70028" /> : null
          }
        />
        <ImageSlider
          images={selectedProduct}
          isModalVisible={isModalVisible}
          onCloseModal={() => {
            setIsModalVisible(false)
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
