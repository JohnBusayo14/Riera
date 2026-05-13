// import React, { useState } from 'react';
// import { 
//   View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, 
//   Dimensions, SafeAreaView, StatusBar 
// } from 'react-native';
// import { 
//   ChevronLeft, ShoppingBasket, Star, MapPin, 
//   TrendingUp, Package, Shield, Heart, Share2
// } from 'lucide-react-native';
// import { MotiView } from 'moti';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useTheme } from '../../context/ThemeContext';
// import GaugeSelector from '../components/GaugeSelector';

// const { width, height } = Dimensions.get('window');

// // Brand Colors
// const COLORS = {
//   forestGreen: '#106324',
//   darkForest: '#0A4118',
//   lightForest: '#1A7A34',
//   white: '#FFFFFF',
//   black: '#0F172A',
//   darkGray: '#1E293B',
//   lightGray: '#F8FAFC',
//   mediumGray: '#64748B',
//   gold: '#F59E0B',
//   error: '#EF4444',
// };

// export default function ProductDetailScreen({ route, navigation }) {
//   const { product } = route.params;
//   const { isDark } = useTheme();
//   const gauges = JSON.parse(product.gaugesJson);
//   const [selectedGauge, setSelectedGauge] = useState(gauges[0]);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const UI_THEME = {
//     Background: isDark ? COLORS.black : COLORS.white,
//     Card: isDark ? COLORS.darkGray : COLORS.lightGray,
//     TextPrimary: isDark ? COLORS.white : COLORS.black,
//     TextSecondary: isDark ? '#94A3B8' : COLORS.mediumGray,
//     Border: isDark ? '#334155' : '#E2E8F0',
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: UI_THEME.Background }]}>
//       <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      
//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* ENHANCED IMAGE SECTION */}
//         <View style={styles.imageSection}>
//           <Image 
//             source={{ uri: product.imageUrl }} 
//             style={styles.productImage}
//             resizeMode="cover"
//           />
          
//           {/* Gradient Overlay */}
//           <LinearGradient
//             colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.4)']}
//             style={styles.imageGradient}
//           />

//           {/* Header Actions */}
//           <SafeAreaView style={styles.headerActions}>
//             <TouchableOpacity 
//               style={styles.actionButton}
//               onPress={() => navigation.goBack()}
//               activeOpacity={0.8}
//             >
//               <View style={styles.actionButtonInner}>
//                 <ChevronLeft color={COLORS.black} size={24} strokeWidth={2.5} />
//               </View>
//             </TouchableOpacity>

//             <View style={styles.headerActionsRight}>
//               <TouchableOpacity 
//                 style={styles.actionButton}
//                 onPress={() => setIsFavorite(!isFavorite)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.actionButtonInner}>
//                   <Heart 
//                     color={isFavorite ? COLORS.error : COLORS.black} 
//                     fill={isFavorite ? COLORS.error : 'none'}
//                     size={22} 
//                     strokeWidth={2.5} 
//                   />
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity 
//                 style={styles.actionButton}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.actionButtonInner}>
//                   <Share2 color={COLORS.black} size={22} strokeWidth={2.5} />
//                 </View>
//               </TouchableOpacity>
//             </View>
//           </SafeAreaView>

//           {/* Product Badge */}
//           <View style={styles.productBadge}>
//             <LinearGradient
//               colors={[COLORS.forestGreen, COLORS.darkForest]}
//               style={styles.badgeGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <Star size={12} color={COLORS.white} fill={COLORS.white} strokeWidth={2} />
//               <Text style={styles.badgeText}>Fresh</Text>
//             </LinearGradient>
//           </View>
//         </View>

//         {/* CONTENT SECTION */}
//         <MotiView
//           from={{ opacity: 0, translateY: 30 }}
//           animate={{ opacity: 1, translateY: 0 }}
//           transition={{ type: 'timing', duration: 600 }}
//           style={[styles.contentSection, { backgroundColor: UI_THEME.Background }]}
//         >
//           {/* Category & Name */}
//           <View style={styles.headerInfo}>
//             <View>
//               <Text style={[styles.categoryText, { color: COLORS.forestGreen }]}>
//                 {product.category}
//               </Text>
//               <Text style={[styles.productName, { color: UI_THEME.TextPrimary }]}>
//                 {product.name}
//               </Text>
//             </View>

//             <View style={styles.ratingContainer}>
//               <Star size={16} color={COLORS.gold} fill={COLORS.gold} strokeWidth={2} />
//               <Text style={[styles.ratingText, { color: UI_THEME.TextPrimary }]}>
//                 4.8
//               </Text>
//               <Text style={[styles.ratingCount, { color: UI_THEME.TextSecondary }]}>
//                 (124)
//               </Text>
//             </View>
//           </View>

//           {/* Seller Info Card */}
//           <MotiView
//             from={{ opacity: 0, scale: 0.95 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ type: 'timing', duration: 400, delay: 200 }}
//           >
//             <View style={[styles.sellerCard, { backgroundColor: UI_THEME.Card }]}>
//               <View style={styles.sellerIconContainer}>
//                 <LinearGradient
//                   colors={[COLORS.forestGreen, COLORS.darkForest]}
//                   style={styles.sellerIconGradient}
//                 >
//                   <MapPin size={20} color={COLORS.white} strokeWidth={2.5} />
//                 </LinearGradient>
//               </View>
              
//               <View style={styles.sellerInfo}>
//                 <Text style={[styles.sellerLabel, { color: UI_THEME.TextSecondary }]}>
//                   Sold by
//                 </Text>
//                 <Text style={[styles.sellerName, { color: UI_THEME.TextPrimary }]}>
//                   Green Valley Farms
//                 </Text>
//               </View>

//               <View style={styles.verifiedBadge}>
//                 <Shield size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
//                 <Text style={styles.verifiedText}>Verified</Text>
//               </View>
//             </View>
//           </MotiView>

//           {/* Gauge Selector */}
//           <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: 'timing', duration: 400, delay: 300 }}
//           >
//             <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary }]}>
//               Select Size & Quantity
//             </Text>
//             <GaugeSelector 
//               gauges={gauges} 
//               selectedGauge={selectedGauge} 
//               onSelect={setSelectedGauge} 
//             />
//           </MotiView>

//           {/* Info Cards */}
//           <View style={styles.infoCardsContainer}>
//             <MotiView
//               from={{ opacity: 0, translateX: -20 }}
//               animate={{ opacity: 1, translateX: 0 }}
//               transition={{ type: 'timing', duration: 400, delay: 400 }}
//               style={{ flex: 1 }}
//             >
//               <View style={[styles.infoCard, { backgroundColor: UI_THEME.Card }]}>
//                 <View style={[styles.infoIconCircle, { backgroundColor: `${COLORS.forestGreen}15` }]}>
//                   <Package size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
//                 </View>
//                 <Text style={[styles.infoCardValue, { color: UI_THEME.TextPrimary }]}>
//                   {selectedGauge.weight}kg
//                 </Text>
//                 <Text style={[styles.infoCardLabel, { color: UI_THEME.TextSecondary }]}>
//                   Weight
//                 </Text>
//               </View>
//             </MotiView>

//             <MotiView
//               from={{ opacity: 0, translateX: 20 }}
//               animate={{ opacity: 1, translateX: 0 }}
//               transition={{ type: 'timing', duration: 400, delay: 450 }}
//               style={{ flex: 1 }}
//             >
//               <View style={[styles.infoCard, { backgroundColor: UI_THEME.Card }]}>
//                 <View style={[styles.infoIconCircle, { backgroundColor: `${COLORS.gold}15` }]}>
//                   <TrendingUp size={20} color={COLORS.gold} strokeWidth={2.5} />
//                 </View>
//                 <Text style={[styles.infoCardValue, { color: UI_THEME.TextPrimary }]}>
//                   R{(selectedGauge.price / selectedGauge.weight).toFixed(0)}
//                 </Text>
//                 <Text style={[styles.infoCardLabel, { color: UI_THEME.TextSecondary }]}>
//                   Per kg
//                 </Text>
//               </View>
//             </MotiView>
//           </View>

//           {/* Logistics Note */}
//           <MotiView
//             from={{ opacity: 0, translateY: 20 }}
//             animate={{ opacity: 1, translateY: 0 }}
//             transition={{ type: 'timing', duration: 400, delay: 500 }}
//           >
//             <View style={[styles.logisticsNote, { backgroundColor: UI_THEME.Card }]}>
//               <View style={styles.logisticsHeader}>
//                 <View style={[styles.logisticsIcon, { backgroundColor: `${COLORS.forestGreen}15` }]}>
//                   <Shield size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
//                 </View>
//                 <Text style={[styles.logisticsTitle, { color: UI_THEME.TextPrimary }]}>
//                   Shipping Information
//                 </Text>
//               </View>
//               <Text style={[styles.logisticsText, { color: UI_THEME.TextSecondary }]}>
//                 This item weighs {selectedGauge.weight}kg. Shipping costs will be calculated at checkout based on weight and delivery location.
//               </Text>
//               <View style={styles.logisticsFeatures}>
//                 <View style={styles.logisticsFeature}>
//                   <View style={styles.featureDot} />
//                   <Text style={[styles.featureText, { color: UI_THEME.TextSecondary }]}>
//                     Fast delivery available
//                   </Text>
//                 </View>
//                 <View style={styles.logisticsFeature}>
//                   <View style={styles.featureDot} />
//                   <Text style={[styles.featureText, { color: UI_THEME.TextSecondary }]}>
//                     Fresh guarantee
//                   </Text>
//                 </View>
//               </View>
//             </View>
//           </MotiView>

//           {/* Description Section */}
//           {product.description && (
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'timing', duration: 400, delay: 550 }}
//             >
//               <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary }]}>
//                 Description
//               </Text>
//               <Text style={[styles.descriptionText, { color: UI_THEME.TextSecondary }]}>
//                 {product.description}
//               </Text>
//             </MotiView>
//           )}
//         </MotiView>
//       </ScrollView>

//       {/* ENHANCED FOOTER */}
//       <MotiView
//         from={{ opacity: 0, translateY: 100 }}
//         animate={{ opacity: 1, translateY: 0 }}
//         transition={{ type: 'spring', damping: 20, delay: 600 }}
//       >
//         <View style={[styles.footer, { backgroundColor: UI_THEME.Background, borderTopColor: UI_THEME.Border }]}>
//           <View style={styles.priceContainer}>
//             <Text style={[styles.priceLabel, { color: UI_THEME.TextSecondary }]}>
//               Total Price
//             </Text>
//             <Text style={[styles.priceValue, { color: UI_THEME.TextPrimary }]}>
//               R{selectedGauge.price.toLocaleString()}
//             </Text>
//           </View>

//           <TouchableOpacity 
//             style={styles.addToCartButton}
//             onPress={() => navigation.navigate('ShopHome', { addedItem: {...product, selectedGauge} })}
//             activeOpacity={0.9}
//           >
//             <LinearGradient
//               colors={[COLORS.forestGreen, COLORS.darkForest]}
//               style={styles.addToCartGradient}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//             >
//               <ShoppingBasket color={COLORS.white} size={22} strokeWidth={2.5} />
//               <Text style={styles.addToCartText}>Add to Cart</Text>
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>
//       </MotiView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { 
//     flex: 1,
//   },
  
//   // Image Section
//   imageSection: {
//     height: height * 0.5,
//     position: 'relative',
//   },
//   productImage: {
//     width: '100%',
//     height: '100%',
//   },
//   imageGradient: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//   },
  
//   // Header Actions
//   headerActions: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     paddingTop: 10,
//   },
//   headerActionsRight: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   actionButton: {
//     borderRadius: 14,
//     overflow: 'hidden',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   actionButtonInner: {
//     width: 44,
//     height: 44,
//     backgroundColor: COLORS.white,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
  
//   // Product Badge
//   productBadge: {
//     position: 'absolute',
//     top: 80,
//     left: 20,
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   badgeGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//   },
//   badgeText: {
//     color: COLORS.white,
//     fontSize: 13,
//     fontWeight: '900',
//     letterSpacing: 0.5,
//   },

//   // Content Section
//   contentSection: {
//     marginTop: -30,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingTop: 28,
//     paddingHorizontal: 24,
//     paddingBottom: 120,
//   },
  
//   // Header Info
//   headerInfo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//   },
//   categoryText: {
//     fontSize: 13,
//     fontWeight: '800',
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//     marginBottom: 8,
//   },
//   productName: {
//     fontSize: 28,
//     fontWeight: '900',
//     letterSpacing: -0.5,
//     lineHeight: 34,
//   },
//   ratingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     backgroundColor: `${COLORS.gold}15`,
//     borderRadius: 12,
//   },
//   ratingText: {
//     fontSize: 16,
//     fontWeight: '900',
//   },
//   ratingCount: {
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   // Seller Card
//   sellerCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     borderRadius: 20,
//     marginBottom: 24,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   sellerIconContainer: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     overflow: 'hidden',
//   },
//   sellerIconGradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   sellerInfo: {
//     flex: 1,
//     marginLeft: 14,
//   },
//   sellerLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 2,
//   },
//   sellerName: {
//     fontSize: 15,
//     fontWeight: '900',
//   },
//   verifiedBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//     backgroundColor: `${COLORS.forestGreen}15`,
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 10,
//   },
//   verifiedText: {
//     color: COLORS.forestGreen,
//     fontSize: 11,
//     fontWeight: '800',
//   },

//   // Section Title
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '900',
//     marginBottom: 16,
//     letterSpacing: -0.5,
//   },

//   // Info Cards
//   infoCardsContainer: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 24,
//     marginBottom: 24,
//   },
//   infoCard: {
//     flex: 1,
//     padding: 20,
//     borderRadius: 20,
//     alignItems: 'center',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   infoIconCircle: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   infoCardValue: {
//     fontSize: 22,
//     fontWeight: '900',
//     marginBottom: 4,
//     letterSpacing: -0.5,
//   },
//   infoCardLabel: {
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   // Logistics Note
//   logisticsNote: {
//     padding: 20,
//     borderRadius: 20,
//     marginBottom: 24,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   logisticsHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginBottom: 12,
//   },
//   logisticsIcon: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   logisticsTitle: {
//     fontSize: 16,
//     fontWeight: '800',
//   },
//   logisticsText: {
//     fontSize: 14,
//     lineHeight: 22,
//     marginBottom: 16,
//   },
//   logisticsFeatures: {
//     gap: 10,
//   },
//   logisticsFeature: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   featureDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: COLORS.forestGreen,
//   },
//   featureText: {
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   // Description
//   descriptionText: {
//     fontSize: 14,
//     lineHeight: 22,
//   },

//   // Footer
//   footer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 24,
//     paddingVertical: 20,
//     borderTopWidth: 1,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//     gap: 16,
//   },
//   priceContainer: {
//     flex: 1,
//   },
//   priceLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   priceValue: {
//     fontSize: 26,
//     fontWeight: '900',
//     letterSpacing: -0.5,
//   },
//   addToCartButton: {
//     flex: 1.2,
//     borderRadius: 18,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   addToCartGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 10,
//     paddingVertical: 18,
//   },
//   addToCartText: {
//     color: COLORS.white,
//     fontWeight: '900',
//     fontSize: 16,
//     letterSpacing: 0.3,
//   },
// });













// screens/marketplace/ProductDetailScreen.jsx
// 📱 Product Details - AliExpress Style

import React, { useState, useMemo, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  Dimensions, SafeAreaView, StatusBar, Share, FlatList
} from 'react-native';
import {
  ArrowLeft, Share2, Heart, Star, MapPin, Shield,
  Truck, Package, ChevronRight, MessageCircle, Store,
  TrendingUp, Check, Flame,ChevronDown,ShoppingCart
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../theme/designSystem';

const { width, height } = Dimensions.get('window');

export default function ProductDetailScreen({ product, onClose, onAddToCart }) {
  const { isDark } = useTheme();
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedGauge, setSelectedGauge] = useState(product.gauges[0]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isFavorite, setIsFavorite] = useState(false);

  const scrollViewRef = useRef(null);

  // Mock data for recommendations
  const recommendations = [
    { id: 1, image: product.images[0], price: 'ZAR175.52', sold: 116 },
    { id: 2, image: product.images[0], price: 'ZAR213.79', sold: 21 },
    { id: 3, image: product.images[0], price: 'ZAR516.58', sold: 5 },
  ];

  const tabs = ['Overview', 'Reviews', 'Description', 'Recommended items'];

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${product.name} on AgroMove!`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedGauge);
  };

  const handleBuyNow = () => {
    onAddToCart(product, selectedGauge);
    // Navigate to checkout
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* ═══ HEADER ═══ */}
      <View style={[styles.header, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: theme.colors.overlay }]}
          onPress={onClose}
        >
          <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.colors.overlay }]}
            onPress={handleShare}
          >
            <Share2 size={20} color={theme.colors.textPrimary} strokeWidth={2.5} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: theme.colors.overlay }]}
            onPress={() => setIsFavorite(!isFavorite)}
          >
            <Heart 
              size={20} 
              color={isFavorite ? '#EF4444' : theme.colors.textPrimary}
              fill={isFavorite ? '#EF4444' : 'none'}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
      >
        {/* ═══ IMAGE CAROUSEL ═══ */}
        <View style={styles.imageCarousel}>
          <FlatList
            data={product.images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.carouselImage} resizeMode="cover" />
            )}
            keyExtractor={(item, index) => index.toString()}
          />

          {/* Review Badge */}
          <View style={styles.reviewBadge}>
            <Flame size={14} color="#FFF" />
            <Text style={styles.reviewBadgeText}>1 people gave it a positive review</Text>
          </View>

          {/* Image Indicator */}
          <View style={styles.imageIndicator}>
            <Text style={styles.indicatorText}>
              Item {currentImageIndex + 1}/{product.images.length} | Color
            </Text>
          </View>
        </View>

        {/* ═══ TABS ═══ */}
        <View style={[styles.tabsContainer, { backgroundColor: theme.colors.card }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map(tab => {
              const isActive = activeTab === tab;
              return (
                <TouchableOpacity
                  key={tab}
                  style={styles.tab}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[
                    styles.tabText,
                    { color: isActive ? theme.colors.textPrimary : theme.colors.textMuted },
                    isActive && { fontWeight: '800' }
                  ]}>
                    {tab}
                  </Text>
                  {isActive && (
                    <View style={[styles.tabIndicator, { backgroundColor: theme.colors.primary }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ═══ CONTENT ═══ */}
        <View style={styles.content}>
          {/* Product Title & Rating */}
          <View style={styles.titleSection}>
            <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
              {product.name}
            </Text>
            
            <View style={styles.ratingRow}>
              <View style={styles.starRating}>
                <Star size={16} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                <Text style={[styles.ratingText, { color: theme.colors.textPrimary }]}>
                  {product.rating}
                </Text>
              </View>
              <View style={styles.divider} />
              <Text style={[styles.soldText, { color: theme.colors.textSecondary }]}>
                {product.sold} sold
              </Text>
              <View style={styles.divider} />
              <Text style={[styles.reviewsText, { color: theme.colors.textSecondary }]}>
                {product.reviews} reviews
              </Text>
              <ChevronRight size={16} color={theme.colors.textMuted} />
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={[styles.price, { color: theme.colors.primary }]}>
                ZAR{selectedGauge.price}
              </Text>
              <Text style={[styles.priceSubtext, { color: theme.colors.textMuted }]}>
                Pay in ZAR, Shop the World
              </Text>
            </View>
            <Text style={[styles.taxNote, { color: theme.colors.textMuted }]}>
              Tax excluded, add at checkout if applicable; Extra 5% off with coins
            </Text>
            
            {/* Promo */}
            <TouchableOpacity style={styles.promoRow}>
              <Package size={16} color="#EF4444" />
              <Text style={styles.promoText}>Buy 2 pieces get 3% off</Text>
              <ChevronRight size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Shipping */}
          <View style={[styles.shippingSection, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.shippingText, { color: theme.colors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>Shipping: ZAR370.92,</Text>
              <Text style={{ color: theme.colors.textSecondary }}> Delivery: Mar 01 - 11</Text>
            </Text>
          </View>

          {/* Color Selection */}
          <View style={styles.optionSection}>
            <View style={styles.optionHeader}>
              <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
                Color: Beige
              </Text>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.colorGrid}>
                {product.images.slice(0, 4).map((img, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.colorOption,
                      index === 0 && { borderColor: theme.colors.primary, borderWidth: 2 }
                    ]}
                  >
                    <Image source={{ uri: img }} style={styles.colorImage} />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Gauge/Size Selection */}
          <View style={styles.optionSection}>
            <View style={styles.optionHeader}>
              <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
                {selectedGauge.name}
              </Text>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.sizeGrid}>
                {product.gauges.map((gauge, index) => {
                  const isSelected = selectedGauge.id === gauge.id;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.sizeOption,
                        { 
                          backgroundColor: isSelected ? theme.colors.primary : theme.colors.surface,
                          borderColor: isSelected ? theme.colors.primary : theme.colors.border,
                        }
                      ]}
                      onPress={() => setSelectedGauge(gauge)}
                    >
                      <Text style={[
                        styles.sizeText,
                        { color: isSelected ? '#FFF' : theme.colors.textPrimary }
                      ]}>
                        {gauge.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* View More Details */}
          <TouchableOpacity style={styles.viewMoreButton}>
            <Text style={[styles.viewMoreText, { color: theme.colors.textPrimary }]}>
              View more details
            </Text>
            <ChevronDown size={20} color={theme.colors.textMuted} />
          </TouchableOpacity>

          {/* Return Policy */}
          <View style={[styles.policySection, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.policyItem}>
              <Package size={18} color={theme.colors.primary} />
              <View style={styles.policyContent}>
                <Text style={[theme.typography.bodyMedium, { color: theme.colors.textPrimary }]}>
                  Return & refund policy
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </View>

            <View style={[styles.divider, { marginVertical: 12 }]} />

            <View style={styles.policyItem}>
              <Shield size={18} color="#10B981" />
              <View style={styles.policyContent}>
                <Text style={[theme.typography.bodyMedium, { color: theme.colors.textPrimary }]}>
                  Security & Privacy
                </Text>
                <Text style={[styles.policySubtext, { color: theme.colors.textMuted }]}>
                  Safe payments: We do not share your personal details...
                </Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </View>
          </View>

          {/* Reviews Section */}
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
                Reviews
              </Text>
              <View style={styles.verifiedBadge}>
                <Check size={12} color="#10B981" />
                <Text style={styles.verifiedText}>All from verified purchases</Text>
              </View>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </View>

            <View style={styles.ratingOverview}>
              <Text style={[styles.bigRating, { color: theme.colors.textPrimary }]}>
                {product.rating}
              </Text>
              <View style={styles.stars}>
                {[1, 2, 3, 4].map(i => (
                  <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                ))}
                <Star size={16} color="#E5E7EB" fill="#E5E7EB" strokeWidth={0} />
              </View>
              <Text style={[styles.ratingsCount, { color: theme.colors.textMuted }]}>
                {product.reviews} ratings
              </Text>
            </View>

            {/* Sample Review */}
            <View style={[styles.reviewCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerAvatar}>
                  <Text style={styles.avatarText}>G</Text>
                </View>
                <View style={styles.reviewerInfo}>
                  <View style={styles.stars}>
                    {[1, 2, 3, 4].map(i => (
                      <Star key={i} size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                    ))}
                  </View>
                  <Text style={[styles.reviewerName, { color: theme.colors.textMuted }]}>
                    G***s, 11 Jun 2025
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Q&A Section */}
          <View style={styles.qaSection}>
            <View style={styles.qaHeader}>
              <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
                Q&A
              </Text>
              <ChevronRight size={20} color={theme.colors.textMuted} />
            </View>
            <Text style={[styles.qaDescription, { color: theme.colors.textMuted }]}>
              To know more about an item ask other shoppers
            </Text>
            <TouchableOpacity style={[styles.askButton, { backgroundColor: theme.colors.surface }]}>
              <Text style={[theme.typography.bodyMedium, { color: theme.colors.textPrimary }]}>
                Ask now
              </Text>
            </TouchableOpacity>
          </View>

          {/* Seller Info */}
          <View style={[styles.sellerSection, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.sellerHeader}>
              <View style={styles.sellerAvatar}>
                <Text style={styles.sellerAvatarText}>🇿🇦</Text>
              </View>
              <View style={styles.sellerInfo}>
                <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
                  {product.seller.name}
                </Text>
                <View style={styles.sellerStats}>
                  <Text style={[styles.statText, { color: theme.colors.textSecondary }]}>
                    Rating <Text style={{ fontWeight: '800' }}>{product.seller.rating}</Text>
                  </Text>
                  <View style={styles.divider} />
                 
                </View>
              </View>
              <TouchableOpacity style={[styles.visitStoreButton, { borderColor: theme.colors.border }]}>
                <Text style={[styles.visitStoreText, { color: theme.colors.textPrimary }]}>
                  Visit store
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Store Recommendations */}
          <View style={styles.recommendationsSection}>
            <View style={styles.recommendationsHeader}>
              <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
                Store recommendations
              </Text>
              <TouchableOpacity>
                <Text style={[styles.allItemsLink, { color: theme.colors.textSecondary }]}>
                  All items
                </Text>
                <ChevronRight size={16} color={theme.colors.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.recommendationsGrid}>
                {recommendations.map(item => (
                  <TouchableOpacity key={item.id} style={styles.recommendationCard}>
                    <Image source={{ uri: item.image }} style={styles.recommendationImage} />
                    <Text style={[styles.recommendationPrice, { color: theme.colors.primary }]}>
                      {item.price}
                    </Text>
                    <Text style={[styles.recommendationSold, { color: theme.colors.textMuted }]}>
                      {item.sold} sold
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>

      {/* ═══ FOOTER ACTIONS ═══ */}
      <View style={[styles.footer, { backgroundColor: theme.colors.card }, theme.shadows.lg]}>
        <TouchableOpacity style={styles.footerIconButton}>
          <Store size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIconButton}>
          <MessageCircle size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerIconButton}>
          <ShoppingCart size={24} color={theme.colors.textPrimary} />
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeNumber}>8</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: '#FFF', borderColor: theme.colors.border }]}
          onPress={handleAddToCart}
        >
          <Text style={[styles.addToCartText, { color: theme.colors.textPrimary }]}>
            Add to cart
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.buyNowButton, { backgroundColor: '#EF4444' }]}
          onPress={handleBuyNow}
        >
          <Text style={styles.buyNowText}>Buy now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },

  // Image Carousel
  imageCarousel: {
    width,
    height: width * 1.2,
    backgroundColor: '#000',
  },
  carouselImage: {
    width,
    height: width * 1.2,
  },
  reviewBadge: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  reviewBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  indicatorText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },

  // Tabs
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  // Content
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  starRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '700',
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: '#E5E7EB',
  },
  soldText: {
    fontSize: 13,
    fontWeight: '600',
  },
  reviewsText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Price
  priceSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '900',
  },
  priceSubtext: {
    fontSize: 13,
    fontWeight: '500',
  },
  taxNote: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  promoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    gap: 8,
  },
  promoText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
  },

  // Shipping
  shippingSection: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  shippingText: {
    fontSize: 14,
  },

  // Options
  optionSection: {
    marginBottom: 20,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  colorGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  colorOption: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  colorImage: {
    width: '100%',
    height: '100%',
  },
  sizeGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  sizeOption: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  sizeText: {
    fontSize: 15,
    fontWeight: '700',
  },

  // View More
  viewMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
    gap: 4,
  },
  viewMoreText: {
    fontSize: 15,
    fontWeight: '600',
  },

  // Policy
  policySection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  policyContent: {
    flex: 1,
  },
  policySubtext: {
    fontSize: 12,
    marginTop: 2,
  },

  // Reviews
  reviewsSection: {
    marginBottom: 20,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  bigRating: {
    fontSize: 40,
    fontWeight: '900',
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingsCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewCard: {
    padding: 12,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: 'row',
    gap: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#EF4444',
  },
  reviewerInfo: {
    flex: 1,
    gap: 4,
  },
  reviewerName: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Q&A
  qaSection: {
    marginBottom: 20,
  },
  qaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  qaDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  askButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },

  // Seller
  sellerSection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sellerAvatarText: {
    fontSize: 24,
  },
  sellerInfo: {
    flex: 1,
  },
  sellerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  visitStoreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  visitStoreText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Recommendations
  recommendationsSection: {
    marginBottom: 100,
  },
  recommendationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  allItemsLink: {
    fontSize: 13,
    fontWeight: '600',
  },
  recommendationsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  recommendationCard: {
    width: 140,
  },
  recommendationImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    marginBottom: 8,
  },
  recommendationPrice: {
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 4,
  },
  recommendationSold: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  footerIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeNumber: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '900',
  },
  addToCartButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
  },
  addToCartText: {
    fontSize: 15,
    fontWeight: '800',
  },
  buyNowButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyNowText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});