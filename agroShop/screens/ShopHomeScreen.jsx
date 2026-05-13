// import React, { useState, useEffect, useMemo } from 'react';
// import { 
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, 
//   TextInput, Dimensions, Modal, SafeAreaView, ActivityIndicator, 
//   RefreshControl, StatusBar 
// } from 'react-native';
// import { 
//   ArrowLeft, Search, X, ShoppingBag, Trash2, Sliders,
//   ChevronRight, Star, ShoppingCart, MapPin, ChevronDown,
//   Sparkles, Plus, Minus, Package
// } from 'lucide-react-native';
// import { LinearGradient } from 'expo-linear-gradient';

// import { useTheme } from '../../context/ThemeContext'; 
// import apiClient from '../../services/apiClient';

// import CheckoutTypeModal from '../components/CheckoutTypeModal';
// import ProductDetailModal from '../components/ProductDetailModal';
// import ProfessionalModal from '../../components/ProfessionalModal';
// import FilterModal from '../components/FilterModal';


// const { width } = Dimensions.get('window');
// const COLUMN_WIDTH = (width - 14 * 2 - 14) / 2; // 14px side padding each + 14px gap
// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300?text=No+Image';



// const COLORS = {
//   forestGreen: '#106324',
//   darkForest: '#0A4118',
//   lightForest: '#1A7A34',
//   white: '#FFFFFF',
//   black: '#0F172A',
//   darkGray: '#1E293B',
//   lightGray: '#F8FAFC',
//   mediumGray: '#64748B',
//   orange: '#F97316',
//   gold: '#F59E0B',
//   error: '#EF4444',
// };

// export default function ShopHomeScreen({ navigation }) {
//   const { isDark: IsDark } = useTheme();

//   const UI_THEME = {
//     Background: IsDark ? COLORS.black : COLORS.lightGray,
//     Card: IsDark ? COLORS.darkGray : COLORS.white,
//     TextPrimary: IsDark ? COLORS.white : COLORS.black,
//     TextSecondary: IsDark ? '#94A3B8' : COLORS.mediumGray,
//     Border: IsDark ? '#334155' : '#E2E8F0',
//     Primary: COLORS.forestGreen,
//     Accent: COLORS.gold,
//     Muted: IsDark ? '#475569' : '#CBD5E1',
//   };

//   const [modalConfig, setModalConfig] = useState({
//   visible: false,
//   type: 'info',
//   title: '',
//   message: '',
//   buttons: [],
// });

//   // STATES
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [cart, setCart] = useState([]);
//   const [showCart, setShowCart] = useState(false);
//   const [showCheckoutType, setShowCheckoutType] = useState(false);
//   const [showSellerConflict, setShowSellerConflict] = useState(false);
//   const [pendingItem, setPendingItem] = useState(null);
//   const [isFilterVisible, setIsFilterVisible] = useState(false);
//   const [currentSeller, setCurrentSeller] = useState(null);

//   const [filterCriteria, setFilterCriteria] = useState({
//     Location: '',
//     Category: 'All',
//     MinPrice: null,
//     MaxPrice: null
//   });
// const [addedToCartItems, setAddedToCartItems] = useState(new Set());
// // Brand Colors
//   // DATA FETCHING
//   const fetchProducts = async () => {
//     try {
//       if (!refreshing) setLoading(true);
//       const response = await apiClient.get('/Products');
//       const rawData = response.data || [];
//       const cleanData = rawData.map(item => ({
//         id: item.id,
//         label: item.label || 'Unnamed Product',
//         category: item.category || 'General',
//         description: item.description,
//         images: item.imageUrls?.length > 0 ? item.imageUrls : [PLACEHOLDER_IMAGE],
//         gauges: item.gaugesJson ? JSON.parse(item.gaugesJson) : (item.gauges || []),
//         rating: Number(item.averageRating ?? 0),
//         sellerId: item.sellerId,
//         sellerName: item.sellerName || 'Verified Farmer',
//         sellerState: item.state || '',
//         sellerTown: item.town || '',
//         sellerStreet: item.street || ''
//       }));
//       setProducts(cleanData);
//     } catch (err) {
//       console.error('Fetch Products Error:', err);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => { fetchProducts(); }, []);

//   useEffect(() => {
//     if (filterCriteria.Category !== activeCategory) {
//       setActiveCategory(filterCriteria.Category);
//     }
//   }, [filterCriteria.Category]);

//   // Static category list — always shown regardless of which products exist.
//   // Products whose category doesn't match any of these tabs still appear under "All".
//   const STATIC_CATEGORIES = ['All','Kitchen', 'Grains', 'Proteins', 'Oils & Spices', 'Vegetables', 'Beverages'];
//   const availableCategories = STATIC_CATEGORIES;

//   const displayedProducts = useMemo(() => {
//     return products.filter(prod => {
//       const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
//       const matchesSearch = (prod.label?.toLowerCase() || '').includes(searchQuery.toLowerCase());
//       const matchesSeller = !currentSeller || prod.sellerId === currentSeller.id;

//       const locQuery = (filterCriteria.Location || '').toLowerCase().trim();
//       const matchesLocation = !locQuery || 
//         (prod.sellerName || '').toLowerCase().includes(locQuery) ||
//         (prod.sellerState || '').toLowerCase().includes(locQuery) ||
//         (prod.sellerTown || '').toLowerCase().includes(locQuery) ||
//         (prod.sellerStreet || '').toLowerCase().includes(locQuery);

//       const minRaw = filterCriteria.MinPrice || '';
//       const maxRaw = filterCriteria.MaxPrice || '';
//       const minPrice = (minRaw.trim() && !isNaN(Number(minRaw))) ? Number(minRaw) : -Infinity;
//       const maxPrice = (maxRaw.trim() && !isNaN(Number(maxRaw))) ? Number(maxRaw) : Infinity;
//       const prodPrice = prod.gauges[0]?.price ?? 0;
//       const matchesPrice = prodPrice >= minPrice && prodPrice <= maxPrice;

//       return matchesCategory && matchesSearch && matchesSeller && matchesPrice && matchesLocation;
//     });
//   }, [products, activeCategory, searchQuery, currentSeller, filterCriteria]);

//   const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
//   const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
//   const totalWeight = cart.reduce((sum, item) => sum + (item.weight ?? 0) * item.qty, 0);

//   // CART LOGIC
//   const addToCart = (product, gauge, qty = 1) => {
//     if (!gauge || !product.gauges?.length) {
//       setSelectedProduct(product);
//       return;
//     }

//     if (cart.length > 0 && cart[0].sellerId !== product.sellerId) {
//       setPendingItem({ product, gauge, qty });
//       setShowSellerConflict(true);
//       return;
//     }

//     executeAddToCart(product, gauge, qty);
//   };

// const executeAddToCart = (product, gauge, qty) => {
//   const cartId = `${product.id}-${gauge.id}`;
  
//   // Check if item was already added via cart icon (one-time restriction)
//   if (addedToCartItems.has(cartId)) {
//     // Show modal that item is already in cart
//     setModalConfig({
//       visible: true,
//       type: 'info',
//       title: 'Already in Cart',
//       message: `${product.label} is already in your cart. Open cart to adjust quantity.`,
//       buttons: [
//         {
//           text: 'View Cart',
//           onPress: () => setShowCart(true),
//         },
//         {
//           text: 'OK',
//           style: 'cancel',
//         },
//       ],
//     });
//     return;
//   }

//   setCart(prev => {
//     const existing = prev.find(i => i.cartId === cartId);
//     if (existing) {
//       return prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + qty } : i);
//     }
//     return [...prev, {
//       cartId,
//       productId: product.id,
//       sellerId: product.sellerId,
//       sellerName: product.sellerName,
//       gaugeId: gauge.id,
//       name: product.label,
//       price: gauge.price,
//       weight: gauge.weight,
//       image: product.images[0],
//       qty
//     }];
//   });

//   // Mark item as added via cart icon
//   setAddedToCartItems(prev => new Set(prev).add(cartId));

//   // Show success modal
//   setModalConfig({
//     visible: true,
//     type: 'success',
//     title: 'Added to Cart! 🛒',
//     message: `${product.label} (${gauge.weight}kg) has been added to your cart.`,
//     buttons: [
//       {
//         text: 'Continue Shopping',
//         style: 'cancel',
//       },
//       {
//         text: 'View Cart',
//         onPress: () => setShowCart(true),
//       },
//     ],
//   });
// };

//   const updateCartQty = (cartId, delta) => {
//     setCart(prev => {
//       return prev.map(item => {
//         if (item.cartId === cartId) {
//           const newQty = Math.max(1, item.qty + delta);
//           return { ...item, qty: newQty };
//         }
//         return item;
//       });
//     });
//   };

// const handleClearAndReplace = () => {
//   if (pendingItem) {
//     setCart([]);
//     setAddedToCartItems(new Set()); // Reset added items tracking
//     executeAddToCart(pendingItem.product, pendingItem.gauge, pendingItem.qty);
//     setShowSellerConflict(false);
//     setPendingItem(null);
//   }
// };

//   const handleCardPress = (product) => {
//     if (currentSeller) {
//       setSelectedProduct(product);
//     } else {
//       setCurrentSeller({ id: product.sellerId, name: product.sellerName });
//       setActiveCategory('All');
//       setSearchQuery('');
//     }
//   };

//   const removeFromCart = (cartId) => {
//   setCart(prev => prev.filter(i => i.cartId !== cartId));
//   // Remove from added items set so it can be added again
//   setAddedToCartItems(prev => {
//     const newSet = new Set(prev);
//     newSet.delete(cartId);
//     return newSet;
//   });
// };
//   return (
//     <SafeAreaView style={[styles.container, { backgroundColor: UI_THEME.Background }]}>
//       <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />

//       {/* ENHANCED HEADER */}
//       <LinearGradient
//         colors={IsDark ? [COLORS.darkGray, COLORS.black] : [COLORS.white, COLORS.lightGray]}
//         style={[styles.header, { borderBottomColor: UI_THEME.Border }]}
//       >
//         <TouchableOpacity 
//           onPress={() => currentSeller ? setCurrentSeller(null) : navigation.goBack()} 
//           style={[styles.headerIcon, { backgroundColor: UI_THEME.Background }]}
//           activeOpacity={0.7}
//         >
//           <ArrowLeft size={22} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
//         </TouchableOpacity>

//         <View style={styles.headerTitleContainer}>
//           <View style={styles.headerTitleRow}>
//             <Sparkles size={16} color={COLORS.forestGreen} />
//             <Text style={[styles.headerTitle, { color: UI_THEME.TextPrimary }]}>
//               {currentSeller ? currentSeller.name : 'Marketplace'}
//             </Text>
//           </View>
//           <View style={styles.headerLocation}>
//             <MapPin size={12} color={COLORS.forestGreen} strokeWidth={2.5} />
//             <Text style={[styles.headerSub, { color: UI_THEME.TextSecondary }]}>
//               South Africa
//             </Text>
//           </View>
//         </View>

//         <TouchableOpacity 
//           style={[styles.cartButton, { backgroundColor: UI_THEME.Background }]} 
//           onPress={() => setShowCart(true)}
//           activeOpacity={0.7}
//         >
//           <ShoppingBag size={22} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
//           {totalItems > 0 && (
//             <View style={[styles.cartBadge, { backgroundColor: COLORS.forestGreen }]}>
//               <Text style={styles.badgeText}>{totalItems}</Text>
//             </View>
//           )}
//         </TouchableOpacity>
//       </LinearGradient>

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl 
//             refreshing={refreshing} 
//             onRefresh={() => { setRefreshing(true); fetchProducts(); }} 
//             tintColor={COLORS.forestGreen}
//             colors={[COLORS.forestGreen]}
//           />
//         }
//       >
//         {/* ENHANCED SEARCH */}
//         <View style={styles.searchSection}>
//           <View style={[styles.searchBox, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}>
//             <Search size={20} color={UI_THEME.TextSecondary} strokeWidth={2.5} />
//             <TextInput
//               placeholder={currentSeller ? `Search in ${currentSeller.name}...` : 'Search fresh produce...'}
//               placeholderTextColor={UI_THEME.Muted}
//               style={[styles.searchInput, { color: UI_THEME.TextPrimary }]}
//               value={searchQuery}
//               onChangeText={setSearchQuery}
//             />
//           </View>
//           <TouchableOpacity
//             style={styles.filterBtn}
//             onPress={() => setIsFilterVisible(true)}
//             activeOpacity={0.7}
//           >
//             <LinearGradient
//               colors={[COLORS.forestGreen, COLORS.darkForest]}
//               style={styles.filterGradient}
//             >
//               <Sliders size={20} color={COLORS.white} strokeWidth={2.5} />
//             </LinearGradient>
//           </TouchableOpacity>
//         </View>

//         {/* ENHANCED CATEGORY TABS */}
//         {!currentSeller && (
//           <ScrollView 
//             horizontal 
//             showsHorizontalScrollIndicator={false} 
//             contentContainerStyle={styles.categoryContainer}
//           >
//             {availableCategories.map((cat, index) => {
//               const isActive = activeCategory === cat;
//               return (
//                 <TouchableOpacity
//                   key={cat}
//                   onPress={() => {
//                     setActiveCategory(cat);
//                     setFilterCriteria(prev => ({ ...prev, Category: cat }));
//                   }}
//                   style={[
//                     styles.categoryTab,
//                     { backgroundColor: isActive ? COLORS.forestGreen : UI_THEME.Card },
//                     { borderColor: UI_THEME.Border }
//                   ]}
//                   activeOpacity={0.7}
//                 >
//                   <Text style={[
//                     styles.categoryTabText, 
//                     { color: isActive ? COLORS.white : UI_THEME.TextPrimary }
//                   ]}>
//                     {cat}
//                   </Text>
//                 </TouchableOpacity>
//               );
//             })}
//           </ScrollView>
//         )}

//         {/* PRODUCT GRID */}
//         {loading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color={COLORS.forestGreen} />
//             <Text style={[styles.loadingText, { color: UI_THEME.TextSecondary }]}>
//               Loading products...
//             </Text>
//           </View>
//         ) : displayedProducts.length === 0 ? (
//           <View
//             style={styles.emptyState}
//           >
//             <View style={[styles.emptyIconCircle, { backgroundColor: UI_THEME.Card }]}>
//               <Package size={48} color={UI_THEME.Muted} strokeWidth={2} />
//             </View>
//             <Text style={[styles.emptyTitle, { color: UI_THEME.TextPrimary }]}>
//               No products found
//             </Text>
//             <Text style={[styles.emptySubtitle, { color: UI_THEME.TextSecondary }]}>
//               Try adjusting your filters
//             </Text>
//           </View>
//         ) : (
//           <View style={styles.productGrid}>
//             {displayedProducts.map((prod, index) => {
//               const hasGauges = prod.gauges?.length > 0;
//               const defaultGauge = hasGauges ? prod.gauges[0] : null;

//               const soldCount = hasGauges
//                 ? Math.max(5, (prod.id?.toString().split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 200) + 10)
//                 : 0;

//               const isInCart = hasGauges && addedToCartItems.has(`${prod.id}-${defaultGauge?.id}`);

//               return (
//                 <View key={prod.id} style={styles.cardWrapper}>
//                   <TouchableOpacity
//                     style={[styles.productCard, { backgroundColor: UI_THEME.Card }]}
//                     onPress={() => handleCardPress(prod)}
//                     activeOpacity={0.92}
//                   >
//                     {/* ─── IMAGE SECTION ─────────────────────────────────────── */}
//                     <View style={styles.imageContainer}>
//                       <Image
//                         source={{ uri: prod.images[0] || PLACEHOLDER_IMAGE }}
//                         style={styles.productImage}
//                         resizeMode="cover"
//                       />

//                       {/* Subtle dark gradient scrim at bottom */}
//                       <LinearGradient
//                         colors={['transparent', 'rgba(0,0,0,0.28)']}
//                         style={styles.imageScrim}
//                       />

//                       {/* Weight badge — top left */}
//                       {hasGauges && (
//                         <View style={styles.weightBadge}>
//                           <Text style={styles.weightText}>{defaultGauge.weight}kg</Text>
//                         </View>
//                       )}

//                       {/* Category — bottom left over scrim */}
//                       <View style={styles.categoryOverlay}>
//                         <Text style={styles.categoryOverlayText} numberOfLines={1}>
//                           {prod.category}
//                         </Text>
//                       </View>
//                     </View>

//                     {/* ─── INFO SECTION ──────────────────────────────────────── */}
//                     <View style={styles.cardContent}>

//                       {/* Product name — 1 line, bold */}
//                       <Text
//                         style={[styles.productTitle, { color: UI_THEME.TextPrimary }]}
//                         numberOfLines={1}
//                       >
//                         {prod.label}
//                       </Text>

//                       {/* Rating LEFT · Sold count RIGHT */}
//                       <View style={styles.metaRow}>
//                         <View style={styles.ratingGroup}>
//                           <Star size={12} color={COLORS.gold} fill={COLORS.gold} />
//                           <Text style={[styles.ratingVal, { color: UI_THEME.TextPrimary }]}>
//                             {prod.rating > 0 ? prod.rating.toFixed(1) : '—'}
//                           </Text>
//                         </View>
//                         {soldCount > 0 && (
//                           <Text style={[styles.soldText, { color: UI_THEME.TextSecondary }]}>
//                             {soldCount}+ sold
//                           </Text>
//                         )}
//                       </View>

//                       {/* Divider */}
//                       <View style={[styles.divider, { backgroundColor: UI_THEME.Border }]} />

//                       {/* Price LEFT · per-kg RIGHT */}
//                       <View style={styles.priceRow}>
//                         <View style={styles.priceBlock}>
//                           <Text style={styles.priceCurrency}>R</Text>
//                           <Text style={[styles.priceText, { color: COLORS.forestGreen }]}>
//                             {hasGauges
//                               ? defaultGauge.price.toLocaleString()
//                               : 'Variable'}
//                           </Text>
//                         </View>
//                         {hasGauges && (
//                           <View style={[styles.perKgBadge, { backgroundColor: UI_THEME.Background }]}>
//                             <Text style={[styles.perKgText, { color: UI_THEME.TextSecondary }]}>
//                               R{(defaultGauge.price / defaultGauge.weight).toFixed(0)}/kg
//                             </Text>
//                           </View>
//                         )}
//                       </View>

//                       {/* Cart button — full width, green fill */}
//                       <TouchableOpacity
//                         style={[
//                           styles.cartBtn,
//                           {
//                             backgroundColor: isInCart
//                               ? UI_THEME.Background
//                               : COLORS.forestGreen,
//                             borderColor: COLORS.forestGreen,
//                           },
//                           !hasGauges && { opacity: 0.45 },
//                         ]}
//                         onPress={() => addToCart(prod, defaultGauge)}
//                         activeOpacity={0.78}
//                         disabled={!hasGauges}
//                       >
//                         <ShoppingCart
//                           size={15}
//                           color={isInCart ? COLORS.forestGreen : COLORS.white}
//                           strokeWidth={2.5}
//                         />
//                         <Text
//                           style={[
//                             styles.cartBtnText,
//                             { color: isInCart ? COLORS.forestGreen : COLORS.white },
//                           ]}
//                         >
//                           {isInCart ? 'In Cart' : 'Add to Cart'}
//                         </Text>
//                       </TouchableOpacity>

//                     </View>
//                   </TouchableOpacity>
//                 </View>
//               );
//             })}
//           </View>
//         )}
//       </ScrollView>

//       {/* ENHANCED CART BOTTOM SHEET - SMOOTH ANIMATION */}
//       <Modal visible={showCart} animationType="slide" transparent>
//         <View style={styles.cartOverlay}>
//           <View
//             from={{ translateY: 1000 }}
//             animate={{ translateY: 0 }}
//             exit={{ translateY: 1000 }}
//             style={[styles.cartSheet, { backgroundColor: UI_THEME.Background }]}
//           >
//             <View style={[styles.cartHandle, { backgroundColor: UI_THEME.Border }]} />
            
//             <View style={styles.cartHeaderSheet}>
//               <View>
//                 <Text style={[styles.cartTitle, { color: UI_THEME.TextPrimary }]}>
//                   Your Basket
//                 </Text>
//                 <Text style={[styles.cartSubtitle, { color: UI_THEME.TextSecondary }]}>
//                   {totalItems} {totalItems === 1 ? 'item' : 'items'}
//                 </Text>
//               </View>
//               <TouchableOpacity 
//                 onPress={() => setShowCart(false)} 
//                 style={[styles.closeButton, { backgroundColor: UI_THEME.Card }]}
//                 activeOpacity={0.7}
//               >
//                 <X size={20} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
//               </TouchableOpacity>
//             </View>

//             <ScrollView style={styles.cartItemsList} showsVerticalScrollIndicator={false}>
//               {cart.length === 0 ? (
//                 <View
//                   style={styles.emptyCart}
//                 >
//                   <View style={[styles.emptyCartIcon, { backgroundColor: UI_THEME.Card }]}>
//                     <ShoppingCart size={48} color={UI_THEME.Muted} strokeWidth={2} />
//                   </View>
//                   <Text style={[styles.emptyCartTitle, { color: UI_THEME.TextPrimary }]}>
//                     Your basket is empty
//                   </Text>
//                   <Text style={[styles.emptyCartText, { color: UI_THEME.TextSecondary }]}>
//                     Start adding fresh produce to your cart
//                   </Text>
//                 </View>
//               ) : (
//                 cart.map((item, i) => (
//                   <View
//                     key={i}
//                     from={{ opacity: 0, translateX: -20 }}
//                     animate={{ opacity: 1, translateX: 0 }}
//                     transition={{ delay: i * 50 }}
//                   >
//                     <View style={[styles.cartItem, { backgroundColor: UI_THEME.Card }]}>
//                       <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                      
//                       <View style={styles.cartItemInfo}>
//                         <Text style={[styles.cartItemName, { color: UI_THEME.TextPrimary }]}>
//                           {item.name}
//                         </Text>
//                         <Text style={[styles.cartItemMeta, { color: UI_THEME.TextSecondary }]}>
//                           {item.weight}kg per unit
//                         </Text>
//                         <Text style={[styles.cartItemPrice, { color: COLORS.forestGreen }]}>
//                           R{(item.price * item.qty).toLocaleString()}
//                         </Text>
//                       </View>

//                       <View style={styles.cartItemActions}>
//                         <View style={[styles.qtyControl, { backgroundColor: UI_THEME.Background }]}>
//                           <TouchableOpacity
//                             onPress={() => updateCartQty(item.cartId, -1)}
//                             style={styles.qtyButton}
//                             activeOpacity={0.7}
//                           >
//                             <Minus size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
//                           </TouchableOpacity>
//                           <Text style={[styles.qtyText, { color: UI_THEME.TextPrimary }]}>
//                             {item.qty}
//                           </Text>
//                           <TouchableOpacity
//                             onPress={() => updateCartQty(item.cartId, 1)}
//                             style={styles.qtyButton}
//                             activeOpacity={0.7}
//                           >
//                             <Plus size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
//                           </TouchableOpacity>
//                         </View>
                        
//                         <TouchableOpacity 
//                           onPress={() => setCart(cart.filter((_, idx) => idx !== i))}
//                           style={[styles.deleteButton, { backgroundColor: '#FEE2E2' }]}
//                           activeOpacity={0.7}
//                         >
//                           <Trash2 size={16} color={COLORS.error} strokeWidth={2.5} />
//                         </TouchableOpacity>
//                       </View>
//                     </View>
//                   </View>
//                 ))
//               )}
//             </ScrollView>

//             {cart.length > 0 && (
//               <View style={[styles.cartFooter, { backgroundColor: UI_THEME.Card }]}>
//                 <View style={styles.summaryRow}>
//                   <Text style={[styles.summaryLabel, { color: UI_THEME.TextSecondary }]}>
//                     Subtotal
//                   </Text>
//                   <Text style={[styles.summaryValue, { color: UI_THEME.TextPrimary }]}>
//                     R{cartTotal.toLocaleString()}
//                   </Text>
//                 </View>
//                 <View style={styles.summaryRow}>
//                   <Text style={[styles.summaryLabel, { color: UI_THEME.TextSecondary }]}>
//                     Total Weight
//                   </Text>
//                   <Text style={[styles.summaryValue, { color: UI_THEME.TextPrimary }]}>
//                     {totalWeight.toFixed(1)}kg
//                   </Text>
//                 </View>

//                 <TouchableOpacity
//                   style={styles.checkoutButton}
//                   onPress={() => {
//                     setShowCart(false);
//                     setTimeout(() => setShowCheckoutType(true), 400);
//                   }}
//                   activeOpacity={0.9}
//                 >
//                   <LinearGradient
//                     colors={[COLORS.forestGreen, COLORS.darkForest]}
//                     style={styles.checkoutGradient}
//                   >
//                     <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
//                     <ChevronRight size={20} color={COLORS.white} strokeWidth={2.5} />
//                   </LinearGradient>
//                 </TouchableOpacity>
//               </View>
//             )}
//           </View>
//         </View>
//       </Modal>

//       {/* ENHANCED SELLER CONFLICT MODAL */}
//       <Modal visible={showSellerConflict} transparent animationType="fade">
//         <View style={styles.alertOverlay}>
//           <View
//             style={[styles.alertBox, { backgroundColor: UI_THEME.Card }]}
//           >
//             <LinearGradient
//               colors={[`${COLORS.forestGreen}20`, `${COLORS.forestGreen}10`]}
//               style={styles.alertIconBg}
//             >
//               <ShoppingBag size={36} color={COLORS.forestGreen} strokeWidth={2.5} />
//             </LinearGradient>

//             <Text style={[styles.alertTitle, { color: UI_THEME.TextPrimary }]}>
//               Single Source Shipping
//             </Text>

//             <Text style={[styles.alertMessage, { color: UI_THEME.TextSecondary }]}>
//               To guarantee fresh delivery and lower shipping costs, your basket can only contain items from one farmer per order.
//             </Text>

//             <View style={[styles.sellerComparison, { backgroundColor: UI_THEME.Background }]}>
//               <View style={styles.sellerInfoRow}>
//                 <Text style={[styles.sellerLabel, { color: UI_THEME.TextSecondary }]}>
//                   Current:
//                 </Text>
//                 <Text style={[styles.sellerName, { color: COLORS.forestGreen }]}>
//                   {cart[0]?.sellerName}
//                 </Text>
//               </View>
//               <ChevronDown size={16} color={UI_THEME.Border} strokeWidth={2.5} />
//               <View style={styles.sellerInfoRow}>
//                 <Text style={[styles.sellerLabel, { color: UI_THEME.TextSecondary }]}>
//                   New Item:
//                 </Text>
//                 <Text style={[styles.sellerName, { color: COLORS.orange }]}>
//                   {pendingItem?.product.sellerName}
//                 </Text>
//               </View>
//             </View>

//             <View style={styles.alertActions}>
//               <TouchableOpacity
//                 style={[styles.alertBtnSecondary, { borderColor: UI_THEME.Border, backgroundColor: UI_THEME.Background }]}
//                 onPress={() => setShowSellerConflict(false)}
//                 activeOpacity={0.7}
//               >
//                 <Text style={[styles.alertBtnTextSecondary, { color: UI_THEME.TextPrimary }]}>
//                   Keep Current
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.alertBtnPrimary}
//                 onPress={handleClearAndReplace}
//                 activeOpacity={0.9}
//               >
//                 <LinearGradient
//                   colors={[COLORS.forestGreen, COLORS.darkForest]}
//                   style={styles.alertBtnGradient}
//                 >
//                   <Text style={styles.alertBtnTextPrimary}>Replace Cart</Text>
//                 </LinearGradient>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* SUPPORTING MODALS */}
//        <ProductDetailModal
//         visible={!!selectedProduct}
//         product={selectedProduct}
//         onClose={() => setSelectedProduct(null)}
//         onAddToCart={(product, gauge, qty) => {
//           setSelectedProduct(null);
//           addToCart(product, gauge, qty);
//         }}
//       />

//       {/* NEW: Professional Modal */}
//       <ProfessionalModal
//         visible={modalConfig.visible}
//         onClose={() => setModalConfig(prev => ({ ...prev, visible: false }))}
//         type={modalConfig.type}
//         title={modalConfig.title}
//         message={modalConfig.message}
//         buttons={modalConfig.buttons}
//       />


//       <FilterModal
//         visible={isFilterVisible}
//         onClose={() => setIsFilterVisible(false)}
//         criteria={filterCriteria}
//         setCriteria={setFilterCriteria}
//         categories={availableCategories}
//       />

//       <CheckoutTypeModal
//         visible={showCheckoutType}
//         onClose={() => setShowCheckoutType(false)}
//         onSelect={(type) => navigation.navigate(
//           type === 'local' ? 'MarketplaceLocal' : 'MarketplaceInternational',
//           { cartData: { items: cart, subtotal: cartTotal, totalWeight } }
//         )}
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
  
//   // Header Styles
//   header: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     justifyContent: 'space-between', 
//     paddingHorizontal: 20, 
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//   },
//   headerIcon: { 
//     width: 44, 
//     height: 44, 
//     borderRadius: 14, 
//     alignItems: 'center', 
//     justifyContent: 'center',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   headerTitleContainer: { 
//     alignItems: 'center',
//     flex: 1,
//     marginHorizontal: 16,
//   },
//   headerTitleRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//   },
//   headerTitle: { 
//     fontSize: 18, 
//     fontWeight: '900',
//     letterSpacing: -0.5,
//   },
//   headerLocation: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4,
//     marginTop: 4,
//   },
//   headerSub: { 
//     fontSize: 12, 
//     fontWeight: '600',
//   },
//   cartButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   cartBadge: { 
//     position: 'absolute', 
//     top: 6, 
//     right: 6, 
//     minWidth: 20, 
//     height: 20, 
//     borderRadius: 10, 
//     alignItems: 'center', 
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: COLORS.white,
//   },
//   badgeText: { 
//     color: COLORS.white, 
//     fontSize: 10, 
//     fontWeight: '900',
//   },

//   // Search Section
//   searchSection: { 
//     flexDirection: 'row', 
//     padding: 20, 
//     gap: 12,
//   },
//   searchBox: { 
//     flex: 1, 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     height: 52, 
//     borderRadius: 16, 
//     borderWidth: 2, 
//     paddingHorizontal: 16,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   searchInput: { 
//     flex: 1, 
//     marginLeft: 12, 
//     fontWeight: '600', 
//     fontSize: 15,
//   },
//   filterBtn: { 
//     width: 52, 
//     height: 52, 
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   filterGradient: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   // Category Tabs
//   categoryContainer: { 
//     paddingHorizontal: 20, 
//     marginBottom: 20,
//     gap: 12,
//   },
//   categoryTab: { 
//     paddingHorizontal: 20,
//     paddingVertical: 10, 
//     borderRadius: 20,
//     borderWidth: 2,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   categoryTabText: { 
//     fontSize: 14, 
//     fontWeight: '800',
//     letterSpacing: 0.3,
//   },

//   // Product Grid
//   loadingContainer: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 100,
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   // ─── Product Grid & Cards ───────────────────────────────────────────────────
//   productGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 14,
//     justifyContent: 'space-between',
//     paddingBottom: 32,
//     gap: 14,
//   },
//   cardWrapper: {
//     width: COLUMN_WIDTH,
//   },
//   productCard: {
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 6 },
//     shadowOpacity: 0.09,
//     shadowRadius: 14,
//     elevation: 5,
//   },

//   // Image
//   imageContainer: {
//     width: '100%',
//     height: 210,
//     position: 'relative',
//     backgroundColor: '#F0F0F0',
//   },
//   productImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   imageScrim: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '45%',
//   },
//   imageGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '45%',
//   },

//   // Badges over image
//   weightBadge: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     backgroundColor: COLORS.forestGreen,
//     paddingHorizontal: 9,
//     paddingVertical: 4,
//     borderRadius: 8,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   weightText: {
//     color: COLORS.white,
//     fontSize: 11,
//     fontWeight: '900',
//     letterSpacing: 0.2,
//   },
//   categoryOverlay: {
//     position: 'absolute',
//     bottom: 10,
//     left: 10,
//     right: 10,
//   },
//   categoryOverlayText: {
//     color: 'rgba(255,255,255,0.92)',
//     fontSize: 11,
//     fontWeight: '800',
//     letterSpacing: 0.6,
//     textTransform: 'uppercase',
//   },
//   // (kept for legacy reference if used elsewhere)
//   cartIconOverlay: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: COLORS.white,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   // Card text content
//   cardContent: {
//     paddingHorizontal: 12,
//     paddingTop: 11,
//     paddingBottom: 12,
//     gap: 0,
//   },
//   productCategory: {
//     fontSize: 10,
//     fontWeight: '800',
//     textTransform: 'uppercase',
//     letterSpacing: 0.6,
//     marginBottom: 4,
//   },
//   productTitle: {
//     fontSize: 14,
//     fontWeight: '800',
//     letterSpacing: -0.2,
//     lineHeight: 19,
//     marginBottom: 8,
//   },

//   // Meta row: rating LEFT, sold RIGHT
//   metaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 10,
//   },
//   ratingGroup: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 4,
//   },
//   ratingVal: {
//     fontSize: 12,
//     fontWeight: '800',
//   },
//   soldText: {
//     fontSize: 11,
//     fontWeight: '600',
//   },
//   // legacy refs
//   ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 },
//   ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 3 },
//   ratingText: { fontSize: 11, fontWeight: '700' },

//   // Thin divider
//   divider: {
//     height: 1,
//     marginBottom: 10,
//   },

//   // Price row: price LEFT, per-kg badge RIGHT
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   priceBlock: {
//     flexDirection: 'row',
//     alignItems: 'baseline',
//     gap: 1,
//   },
//   priceCurrency: {
//     fontSize: 14,
//     fontWeight: '900',
//     color: COLORS.forestGreen,
//     marginBottom: 1,
//   },
//   priceText: {
//     fontSize: 22,
//     fontWeight: '900',
//     letterSpacing: -0.6,
//     color: COLORS.forestGreen,
//   },
//   perKgBadge: {
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },
//   perKgText: {
//     fontSize: 11,
//     fontWeight: '700',
//   },
//   pricePerKg: {
//     fontSize: 11,
//     fontWeight: '600',
//     marginTop: 2,
//   },

//   // Cart button — full-width pill at base of card
//   cartBtn: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 7,
//     height: 40,
//     borderRadius: 10,
//     borderWidth: 1.5,
//   },
//   cartBtnText: {
//     fontSize: 13,
//     fontWeight: '800',
//     letterSpacing: 0.2,
//   },

//   // legacy
//   addButton: {
//     width: 40, height: 40, borderRadius: 12, overflow: 'hidden',
//   },
//   addButtonGradient: {
//     flex: 1, alignItems: 'center', justifyContent: 'center',
//   },

//   // Empty State
//   emptyState: { 
//     alignItems: 'center', 
//     justifyContent: 'center', 
//     marginTop: 100,
//     paddingHorizontal: 40,
//   },
//   emptyIconCircle: {
//     width: 100,
//     height: 100,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   emptyTitle: {
//     fontSize: 20,
//     fontWeight: '900',
//     marginBottom: 8,
//   },
//   emptySubtitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },

//   // Cart Modal
//   cartOverlay: { 
//     flex: 1, 
//     backgroundColor: 'rgba(0,0,0,0.6)', 
//     justifyContent: 'flex-end',
//   },
//   cartSheet: { 
//     height: '85%', 
//     borderTopLeftRadius: 30, 
//     borderTopRightRadius: 30, 
//     padding: 24,
//   },
//   cartHandle: { 
//     width: 40, 
//     height: 4,
//     borderRadius: 2, 
//     alignSelf: 'center', 
//     marginBottom: 20,
//   },
//   cartHeaderSheet: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'center', 
//     marginBottom: 24,
//   },
//   cartTitle: { 
//     fontSize: 24, 
//     fontWeight: '900',
//     letterSpacing: -0.5,
//   },
//   cartSubtitle: {
//     fontSize: 14,
//     fontWeight: '600',
//     marginTop: 4,
//   },
//   closeButton: { 
//     width: 40, 
//     height: 40, 
//     borderRadius: 20,
//     alignItems: 'center', 
//     justifyContent: 'center',
//   },
//   cartItemsList: { 
//     flex: 1,
//     marginBottom: 20,
//   },
//   emptyCart: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 60,
//   },
//   emptyCartIcon: {
//     width: 100,
//     height: 100,
//     borderRadius: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   emptyCartTitle: {
//     fontSize: 20,
//     fontWeight: '900',
//     marginBottom: 8,
//   },
//   emptyCartText: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   cartItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 16, 
//     borderRadius: 20,
//     marginBottom: 12,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   cartItemImage: { 
//     width: 70, 
//     height: 70, 
//     borderRadius: 14,
//   },
//   cartItemInfo: { 
//     flex: 1, 
//     marginLeft: 14,
//   },
//   cartItemName: { 
//     fontSize: 15, 
//     fontWeight: '800',
//     marginBottom: 4,
//   },
//   cartItemMeta: { 
//     fontSize: 12,
//     marginBottom: 4,
//   },
//   cartItemPrice: { 
//     fontSize: 16, 
//     fontWeight: '900',
//   },
//   cartItemActions: {
//     alignItems: 'flex-end',
//     gap: 8,
//   },
//   qtyControl: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 10,
//     padding: 4,
//   },
//   qtyButton: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   qtyText: {
//     fontSize: 14,
//     fontWeight: '800',
//     marginHorizontal: 12,
//   },
//   deleteButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   cartFooter: { 
//     padding: 20, 
//     borderRadius: 20,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   summaryRow: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },
//   summaryLabel: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
//   summaryValue: {
//     fontSize: 16,
//     fontWeight: '900',
//   },
//   checkoutButton: {
//     marginTop: 8,
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   checkoutGradient: {
//     height: 60,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },
//   checkoutButtonText: { 
//     color: COLORS.white, 
//     fontWeight: '900', 
//     fontSize: 16,
//   },

//   // Alert Modal
//   alertOverlay: { 
//     flex: 1, 
//     backgroundColor: 'rgba(0,0,0,0.7)', 
//     justifyContent: 'center', 
//     padding: 24,
//   },
//   alertBox: { 
//     borderRadius: 30, 
//     padding: 28, 
//     alignItems: 'center',
//   },
//   alertIconBg: { 
//     width: 80, 
//     height: 80, 
//     borderRadius: 20,
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     marginBottom: 20,
//   },
//   alertTitle: { 
//     fontSize: 22, 
//     fontWeight: '900', 
//     marginBottom: 12,
//     textAlign: 'center',
//   },
//   alertMessage: { 
//     textAlign: 'center', 
//     fontSize: 14, 
//     lineHeight: 22, 
//     marginBottom: 24,
//   },
//   sellerComparison: { 
//     width: '100%',
//     padding: 16, 
//     borderRadius: 16, 
//     marginBottom: 24, 
//     alignItems: 'center', 
//     gap: 12,
//   },
//   sellerInfoRow: { 
//     flexDirection: 'row', 
//     gap: 8,
//     alignItems: 'center',
//   },
//   sellerLabel: { 
//     fontSize: 13, 
//     fontWeight: '600',
//   },
//   sellerName: { 
//     fontSize: 14, 
//     fontWeight: '900',
//   },
//   alertActions: { 
//     flexDirection: 'row', 
//     gap: 12,
//     width: '100%',
//   },
//   alertBtnPrimary: { 
//     flex: 1,
//     borderRadius: 16,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   alertBtnGradient: {
//     height: 54,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   alertBtnSecondary: { 
//     flex: 1, 
//     height: 54, 
//     borderRadius: 16, 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     borderWidth: 2,
//   },
//   alertBtnTextPrimary: { 
//     color: COLORS.white, 
//     fontWeight: '900',
//     fontSize: 15,
//   },
//   alertBtnTextSecondary: { 
//     fontWeight: '800',
//     fontSize: 15,
//   },
// });



// screens/shop/ShopHomeScreen.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, Dimensions, Modal, SafeAreaView, ActivityIndicator,
  RefreshControl, StatusBar,
} from 'react-native';
import {
  ArrowLeft, Search, X, ShoppingBag, Trash2, Sliders,
  ChevronRight, Star, ShoppingCart, MapPin, ChevronDown,
  Sparkles, Plus, Minus, Package, Shield, Crown, Zap, BadgeCheck,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../services/apiClient';
import CheckoutTypeModal from '../components/CheckoutTypeModal';
import ProductDetailModal from '../components/ProductDetailModal';
import ProfessionalModal from '../../components/ProfessionalModal';
import FilterModal from '../components/FilterModal';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 14 * 2 - 14) / 2;
const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300?text=No+Image';

const COLORS = {
  forestGreen: '#106324',
  darkForest:  '#0A4118',
  lightForest: '#1A7A34',
  white:       '#FFFFFF',
  black:       '#0F172A',
  darkGray:    '#1E293B',
  lightGray:   '#F8FAFC',
  mediumGray:  '#64748B',
  orange:      '#F97316',
  gold:        '#F59E0B',
  error:       '#EF4444',
};

// ─── Tier config — all 5 tiers ────────────────────────────────────────────────────
const TIER = {
  Platinum: { label: 'Platinum', colors: ['#334155', '#0F172A'], textColor: '#F1F5F9', icon: Sparkles,   iconColor: '#CBD5E1' },
  Gold:     { label: 'Gold',     colors: ['#D97706', '#92400E'], textColor: '#FFFFFF', icon: Crown,      iconColor: '#FDE68A' },
  Silver:   { label: 'Silver',   colors: ['#64748B', '#475569'], textColor: '#FFFFFF', icon: Shield,     iconColor: '#CBD5E1' },
  Bronze:   { label: 'Bronze',   colors: ['#92400E', '#78350F'], textColor: '#FDE68A', icon: BadgeCheck, iconColor: '#FDE68A' },
  New:      { label: 'New',      colors: ['#059669', '#047857'], textColor: '#FFFFFF', icon: Zap,        iconColor: '#6EE7B7' },
};

const getTier = (raw) => {
  if (!raw) return TIER.New;
  const key = raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase().split(' ')[0];
  if (TIER[key]) return TIER[key];
  const lower = raw.toLowerCase();
  if (lower.includes('platinum')) return TIER.Platinum;
  if (lower.includes('gold'))     return TIER.Gold;
  if (lower.includes('silver'))   return TIER.Silver;
  if (lower.includes('bronze'))   return TIER.Bronze;
  return TIER.New;
};

const TierBadge = ({ tier }) => {
  const cfg = getTier(tier);
  const IconComp = cfg.icon;
  return (
    <LinearGradient
      colors={cfg.colors}
      start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
      style={styles.tierBadge}
    >
      <IconComp size={9} color={cfg.iconColor} strokeWidth={2.5} />
      <Text style={[styles.tierBadgeText, { color: cfg.textColor }]}>{cfg.label}</Text>
    </LinearGradient>
  );
};

export default function ShopHomeScreen({ navigation }) {
  const { isDark: IsDark } = useTheme();

  const UI_THEME = {
    Background:    IsDark ? COLORS.black     : COLORS.lightGray,
    Card:          IsDark ? COLORS.darkGray  : COLORS.white,
    TextPrimary:   IsDark ? COLORS.white     : COLORS.black,
    TextSecondary: IsDark ? '#94A3B8'        : COLORS.mediumGray,
    Border:        IsDark ? '#334155'        : '#E2E8F0',
    Primary:       COLORS.forestGreen,
    Accent:        COLORS.gold,
    Muted:         IsDark ? '#475569'        : '#CBD5E1',
  };

  const [modalConfig, setModalConfig] = useState({
    visible: false, type: 'info', title: '', message: '', buttons: [],
  });

  const [activeCategory,     setActiveCategory]     = useState('All');
  const [searchQuery,        setSearchQuery]        = useState('');
  const [selectedProduct,    setSelectedProduct]    = useState(null);
  const [products,           setProducts]           = useState([]);
  const [loading,            setLoading]            = useState(true);
  const [refreshing,         setRefreshing]         = useState(false);
  const [cart,               setCart]               = useState([]);
  const [showCart,           setShowCart]           = useState(false);
  const [showCheckoutType,   setShowCheckoutType]   = useState(false);
  const [showSellerConflict, setShowSellerConflict] = useState(false);
  const [pendingItem,        setPendingItem]        = useState(null);
  const [isFilterVisible,    setIsFilterVisible]    = useState(false);
  const [currentSeller,      setCurrentSeller]      = useState(null);
  const [addedToCartItems,   setAddedToCartItems]   = useState(new Set());
  const [filterCriteria,     setFilterCriteria]     = useState({
    Location: '', Category: 'All', MinPrice: null, MaxPrice: null,
  });

  // ─── DATA FETCHING — maps all backend camelCase fields correctly ──────────────
  const fetchProducts = async () => {
    try {
      if (!refreshing) setLoading(true);
      const response = await apiClient.get('/Products');
      const rawData = response.data || [];
      const cleanData = rawData.map(item => ({
        id:          item.id,
        label:       item.label       || 'Unnamed Product',
        category:    item.category    || 'General',
        description: item.description,
        // imageUrls is a proper array from the backend
        images: Array.isArray(item.imageUrls) && item.imageUrls.length
          ? item.imageUrls
          : [PLACEHOLDER_IMAGE],
        // gauges is always [] from backend; real data is in gaugesJson string
        gauges: (() => {
          try {
            if (item.gaugesJson) return JSON.parse(item.gaugesJson);
          } catch { /* fall through */ }
          return Array.isArray(item.gauges) && item.gauges.length ? item.gauges : [];
        })(),
        // Backend returns these as strings — coerce to numbers
        rating:          Number(item.averageRating  ?? 0),
        reviewCount:     Number(item.reviewCount    ?? 0),
        visibilityBoost: Number(item.visibilityBoost ?? 1.0),
        sellerId:    item.sellerId,
        sellerName:  item.sellerName  || 'Verified Farmer',
        sellerTier:  item.sellerTier  || 'New',
        sellerState: item.state       || '',
        sellerTown:  item.town        || '',
        sellerStreet:item.street      || '',
        distance:    item.distance    ?? null,
      }));
      setProducts(cleanData);
    } catch (err) {
      console.error('Fetch Products Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    if (filterCriteria.Category !== activeCategory) {
      setActiveCategory(filterCriteria.Category);
    }
  }, [filterCriteria.Category]);

  const STATIC_CATEGORIES = ['All', 'Kitchen', 'Grains', 'Proteins', 'Oils & Spices', 'Vegetables', 'Beverages'];
  const availableCategories = STATIC_CATEGORIES;

  const displayedProducts = useMemo(() => {
    return products.filter(prod => {
      const matchesCategory = activeCategory === 'All' || prod.category === activeCategory;
      const matchesSearch   = (prod.label?.toLowerCase() || '').includes(searchQuery.toLowerCase());
      const matchesSeller   = !currentSeller || prod.sellerId === currentSeller.id;
      const locQuery        = (filterCriteria.Location || '').toLowerCase().trim();
      const matchesLocation = !locQuery ||
        (prod.sellerName  || '').toLowerCase().includes(locQuery) ||
        (prod.sellerState || '').toLowerCase().includes(locQuery) ||
        (prod.sellerTown  || '').toLowerCase().includes(locQuery) ||
        (prod.sellerStreet|| '').toLowerCase().includes(locQuery);
      const minRaw  = filterCriteria.MinPrice || '';
      const maxRaw  = filterCriteria.MaxPrice || '';
      const minPrice = (minRaw.trim() && !isNaN(Number(minRaw))) ? Number(minRaw) : -Infinity;
      const maxPrice = (maxRaw.trim() && !isNaN(Number(maxRaw))) ? Number(maxRaw) :  Infinity;
      const prodPrice = prod.gauges[0]?.price ?? 0;
      const matchesPrice = prodPrice >= minPrice && prodPrice <= maxPrice;
      return matchesCategory && matchesSearch && matchesSeller && matchesPrice && matchesLocation;
    });
  }, [products, activeCategory, searchQuery, currentSeller, filterCriteria]);

  const cartTotal   = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const totalItems  = cart.reduce((sum, item) => sum + item.qty, 0);
  const totalWeight = cart.reduce((sum, item) => sum + (item.weight ?? 0) * item.qty, 0);

  // ─── CART LOGIC — unchanged ───────────────────────────────────────────────────
  const addToCart = (product, gauge, qty = 1) => {
    if (!gauge || !product.gauges?.length) { setSelectedProduct(product); return; }
    if (cart.length > 0 && cart[0].sellerId !== product.sellerId) {
      setPendingItem({ product, gauge, qty });
      setShowSellerConflict(true);
      return;
    }
    executeAddToCart(product, gauge, qty);
  };

  const executeAddToCart = (product, gauge, qty) => {
    const cartId = `${product.id}-${gauge.id}`;
    if (addedToCartItems.has(cartId)) {
      setModalConfig({
        visible: true, type: 'info', title: 'Already in Cart',
        message: `${product.label} is already in your cart. Open cart to adjust quantity.`,
        buttons: [
          { text: 'View Cart', onPress: () => setShowCart(true) },
          { text: 'OK', style: 'cancel' },
        ],
      });
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.cartId === cartId);
      if (existing) return prev.map(i => i.cartId === cartId ? { ...i, qty: i.qty + qty } : i);
      return [...prev, {
        cartId, productId: product.id, sellerId: product.sellerId,
        sellerName: product.sellerName, gaugeId: gauge.id,
        name: product.label, price: gauge.price, weight: gauge.weight,
        image: product.images[0], qty,
      }];
    });
    setAddedToCartItems(prev => new Set(prev).add(cartId));
    setModalConfig({
      visible: true, type: 'success', title: 'Added to Cart! 🛒',
      message: `${product.label} (${gauge.weight}kg) has been added to your cart.`,
      buttons: [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => setShowCart(true) },
      ],
    });
  };

  const updateCartQty = (cartId, delta) => {
    setCart(prev => prev.map(item =>
      item.cartId === cartId ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const handleClearAndReplace = () => {
    if (pendingItem) {
      setCart([]); setAddedToCartItems(new Set());
      executeAddToCart(pendingItem.product, pendingItem.gauge, pendingItem.qty);
      setShowSellerConflict(false); setPendingItem(null);
    }
  };

  const handleCardPress = (product) => {
    if (currentSeller) { setSelectedProduct(product); }
    else { setCurrentSeller({ id: product.sellerId, name: product.sellerName }); setActiveCategory('All'); setSearchQuery(''); }
  };

  const removeFromCart = (cartId) => {
    setCart(prev => prev.filter(i => i.cartId !== cartId));
    setAddedToCartItems(prev => { const s = new Set(prev); s.delete(cartId); return s; });
  };

  // ─── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: UI_THEME.Background }]}>
      <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />

      {/* HEADER */}
      <LinearGradient
        colors={IsDark ? [COLORS.darkGray, COLORS.black] : [COLORS.white, COLORS.lightGray]}
        style={[styles.header, { borderBottomColor: UI_THEME.Border }]}
      >
        <TouchableOpacity
          onPress={() => currentSeller ? setCurrentSeller(null) : navigation.goBack()}
          style={[styles.headerIcon, { backgroundColor: UI_THEME.Background }]}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <View style={styles.headerTitleRow}>
            <Sparkles size={16} color={COLORS.forestGreen} />
            <Text style={[styles.headerTitle, { color: UI_THEME.TextPrimary }]}>
              {currentSeller ? currentSeller.name : 'Marketplace'}
            </Text>
          </View>
          <View style={styles.headerLocation}>
            <MapPin size={12} color={COLORS.forestGreen} strokeWidth={2.5} />
            <Text style={[styles.headerSub, { color: UI_THEME.TextSecondary }]}>South Africa</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.cartButton, { backgroundColor: UI_THEME.Background }]}
          onPress={() => setShowCart(true)}
          activeOpacity={0.7}
        >
          <ShoppingBag size={22} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
          {totalItems > 0 && (
            <View style={[styles.cartBadge, { backgroundColor: COLORS.forestGreen }]}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => { setRefreshing(true); fetchProducts(); }}
            tintColor={COLORS.forestGreen} colors={[COLORS.forestGreen]}
          />
        }
      >
        {/* SEARCH */}
        <View style={styles.searchSection}>
          <View style={[styles.searchBox, { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border }]}>
            <Search size={20} color={UI_THEME.TextSecondary} strokeWidth={2.5} />
            <TextInput
              placeholder={currentSeller ? `Search in ${currentSeller.name}...` : 'Search fresh produce...'}
              placeholderTextColor={UI_THEME.Muted}
              style={[styles.searchInput, { color: UI_THEME.TextPrimary }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setIsFilterVisible(true)}
            activeOpacity={0.7}
          >
            <LinearGradient colors={[COLORS.forestGreen, COLORS.darkForest]} style={styles.filterGradient}>
              <Sliders size={20} color={COLORS.white} strokeWidth={2.5} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* CATEGORY TABS */}
        {!currentSeller && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryContainer}>
            {availableCategories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => { setActiveCategory(cat); setFilterCriteria(prev => ({ ...prev, Category: cat })); }}
                  style={[
                    styles.categoryTab,
                    { backgroundColor: isActive ? COLORS.forestGreen : UI_THEME.Card, borderColor: UI_THEME.Border },
                  ]}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.categoryTabText, { color: isActive ? COLORS.white : UI_THEME.TextPrimary }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* PRODUCT GRID */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.forestGreen} />
            <Text style={[styles.loadingText, { color: UI_THEME.TextSecondary }]}>Loading products...</Text>
          </View>
        ) : displayedProducts.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconCircle, { backgroundColor: UI_THEME.Card }]}>
              <Package size={48} color={UI_THEME.Muted} strokeWidth={2} />
            </View>
            <Text style={[styles.emptyTitle, { color: UI_THEME.TextPrimary }]}>No products found</Text>
            <Text style={[styles.emptySubtitle, { color: UI_THEME.TextSecondary }]}>Try adjusting your filters</Text>
          </View>
        ) : (
          <View style={styles.productGrid}>
            {displayedProducts.map((prod) => {
              const hasGauges    = prod.gauges?.length > 0;
              const defaultGauge = hasGauges ? prod.gauges[0] : null;
              const isInCart     = hasGauges && addedToCartItems.has(`${prod.id}-${defaultGauge?.id}`);

              return (
                <View key={prod.id} style={styles.cardWrapper}>
                  <TouchableOpacity
                    style={[styles.productCard, { backgroundColor: UI_THEME.Card }]}
                    onPress={() => handleCardPress(prod)}
                    activeOpacity={0.92}
                  >
                    {/* IMAGE */}
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: prod.images[0] || PLACEHOLDER_IMAGE }}
                        style={styles.productImage}
                        resizeMode="cover"
                      />
                      <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.32)']}
                        style={styles.imageScrim}
                      />

                      {/* Tier badge — top left */}
                      <View style={styles.tierBadgePos}>
                        <TierBadge tier={prod.sellerTier} />
                      </View>

                      {/* Weight — top right */}
                      {hasGauges && (
                        <View style={styles.weightBadge}>
                          <Text style={styles.weightText}>{defaultGauge.weight}kg</Text>
                        </View>
                      )}

                      {/* Category — bottom left */}
                      <View style={styles.categoryOverlay}>
                        <Text style={styles.categoryOverlayText} numberOfLines={1}>
                          {prod.category}
                        </Text>
                      </View>
                    </View>

                    {/* CARD BODY — compact layout */}
                    <View style={styles.cardContent}>

                      {/* Row 1: Name + rating inline */}
                      <View style={styles.nameRatingRow}>
                        <Text style={[styles.productTitle, { color: UI_THEME.TextPrimary }]} numberOfLines={1}>
                          {prod.label}
                        </Text>
                        <View style={styles.ratingChip}>
                          <Star size={10} color={COLORS.gold} fill={COLORS.gold} />
                          <Text style={[styles.ratingVal, { color: UI_THEME.TextPrimary }]}>
                            {prod.rating > 0 ? prod.rating.toFixed(1) : '—'}
                          </Text>
                        </View>
                      </View>

                      {/* Row 2: Seller town + distance */}
                      {(prod.sellerTown || prod.distance != null) && (
                        <View style={styles.locationRow}>
                          <MapPin size={9} color={COLORS.forestGreen} strokeWidth={2.5} />
                          <Text style={[styles.locationText, { color: UI_THEME.TextSecondary }]} numberOfLines={1}>
                            {[prod.sellerTown, prod.distance != null ? `${prod.distance}km` : null]
                              .filter(Boolean).join(' · ')}
                          </Text>
                        </View>
                      )}

                      {/* Row 3: Price + per-kg + cart button all inline */}
                      <View style={styles.priceActionRow}>
                        <View style={styles.priceBlock}>
                          <Text style={[styles.priceCurrency, { color: COLORS.forestGreen }]}>R</Text>
                          <Text style={[styles.priceText, { color: COLORS.forestGreen }]}>
                            {hasGauges ? defaultGauge.price.toLocaleString() : '—'}
                          </Text>
                        </View>

                        <TouchableOpacity
                          style={[
                            styles.cartBtn,
                            {
                              backgroundColor: isInCart ? UI_THEME.Background : COLORS.forestGreen,
                              borderColor: COLORS.forestGreen,
                            },
                            !hasGauges && { opacity: 0.45 },
                          ]}
                          onPress={() => addToCart(prod, defaultGauge)}
                          activeOpacity={0.78}
                          disabled={!hasGauges}
                        >
                          <ShoppingCart
                            size={13}
                            color={isInCart ? COLORS.forestGreen : COLORS.white}
                            strokeWidth={2.5}
                          />
                          <Text style={[styles.cartBtnText, { color: isInCart ? COLORS.forestGreen : COLORS.white }]}>
                            {isInCart ? 'In Cart' : 'Add'}
                          </Text>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* CART MODAL */}
      <Modal visible={showCart} animationType="slide" transparent>
        <View style={styles.cartOverlay}>
          <View style={[styles.cartSheet, { backgroundColor: UI_THEME.Background }]}>
            <View style={[styles.cartHandle, { backgroundColor: UI_THEME.Border }]} />

            <View style={styles.cartHeaderSheet}>
              <View>
                <Text style={[styles.cartTitle, { color: UI_THEME.TextPrimary }]}>Your Basket</Text>
                <Text style={[styles.cartSubtitle, { color: UI_THEME.TextSecondary }]}>
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowCart(false)}
                style={[styles.closeButton, { backgroundColor: UI_THEME.Card }]}
                activeOpacity={0.7}
              >
                <X size={20} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.cartItemsList} showsVerticalScrollIndicator={false}>
              {cart.length === 0 ? (
                <View style={styles.emptyCart}>
                  <View style={[styles.emptyCartIcon, { backgroundColor: UI_THEME.Card }]}>
                    <ShoppingCart size={48} color={UI_THEME.Muted} strokeWidth={2} />
                  </View>
                  <Text style={[styles.emptyCartTitle, { color: UI_THEME.TextPrimary }]}>Your basket is empty</Text>
                  <Text style={[styles.emptyCartText, { color: UI_THEME.TextSecondary }]}>
                    Start adding fresh produce to your cart
                  </Text>
                </View>
              ) : (
                cart.map((item, i) => (
                  <View key={i}>
                    <View style={[styles.cartItem, { backgroundColor: UI_THEME.Card }]}>
                      <Image source={{ uri: item.image }} style={styles.cartItemImage} />
                      <View style={styles.cartItemInfo}>
                        <Text style={[styles.cartItemName, { color: UI_THEME.TextPrimary }]}>{item.name}</Text>
                        <Text style={[styles.cartItemMeta, { color: UI_THEME.TextSecondary }]}>{item.weight}kg per unit</Text>
                        <Text style={[styles.cartItemPrice, { color: COLORS.forestGreen }]}>
                          R{(item.price * item.qty).toLocaleString()}
                        </Text>
                      </View>
                      <View style={styles.cartItemActions}>
                        <View style={[styles.qtyControl, { backgroundColor: UI_THEME.Background }]}>
                          <TouchableOpacity onPress={() => updateCartQty(item.cartId, -1)} style={styles.qtyButton} activeOpacity={0.7}>
                            <Minus size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
                          </TouchableOpacity>
                          <Text style={[styles.qtyText, { color: UI_THEME.TextPrimary }]}>{item.qty}</Text>
                          <TouchableOpacity onPress={() => updateCartQty(item.cartId, 1)} style={styles.qtyButton} activeOpacity={0.7}>
                            <Plus size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                          onPress={() => removeFromCart(item.cartId)}
                          style={[styles.deleteButton, { backgroundColor: '#FEE2E2' }]}
                          activeOpacity={0.7}
                        >
                          <Trash2 size={16} color={COLORS.error} strokeWidth={2.5} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {cart.length > 0 && (
              <View style={[styles.cartFooter, { backgroundColor: UI_THEME.Card }]}>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: UI_THEME.TextSecondary }]}>Subtotal</Text>
                  <Text style={[styles.summaryValue, { color: UI_THEME.TextPrimary }]}>R{cartTotal.toLocaleString()}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={[styles.summaryLabel, { color: UI_THEME.TextSecondary }]}>Total Weight</Text>
                  <Text style={[styles.summaryValue, { color: UI_THEME.TextPrimary }]}>{totalWeight.toFixed(1)}kg</Text>
                </View>
                <TouchableOpacity
                  style={styles.checkoutButton}
                  onPress={() => { setShowCart(false); setTimeout(() => setShowCheckoutType(true), 400); }}
                  activeOpacity={0.9}
                >
                  <LinearGradient colors={[COLORS.forestGreen, COLORS.darkForest]} style={styles.checkoutGradient}>
                    <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                    <ChevronRight size={20} color={COLORS.white} strokeWidth={2.5} />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* SELLER CONFLICT MODAL */}
      <Modal visible={showSellerConflict} transparent animationType="fade">
        <View style={styles.alertOverlay}>
          <View style={[styles.alertBox, { backgroundColor: UI_THEME.Card }]}>
            <LinearGradient
              colors={[`${COLORS.forestGreen}20`, `${COLORS.forestGreen}10`]}
              style={styles.alertIconBg}
            >
              <ShoppingBag size={36} color={COLORS.forestGreen} strokeWidth={2.5} />
            </LinearGradient>
            <Text style={[styles.alertTitle, { color: UI_THEME.TextPrimary }]}>Single Source Shipping</Text>
            <Text style={[styles.alertMessage, { color: UI_THEME.TextSecondary }]}>
              To guarantee fresh delivery and lower shipping costs, your basket can only contain items from one farmer per order.
            </Text>
            <View style={[styles.sellerComparison, { backgroundColor: UI_THEME.Background }]}>
              <View style={styles.sellerInfoRow}>
                <Text style={[styles.sellerLabel, { color: UI_THEME.TextSecondary }]}>Current:</Text>
                <Text style={[styles.sellerName, { color: COLORS.forestGreen }]}>{cart[0]?.sellerName}</Text>
              </View>
              <ChevronDown size={16} color={UI_THEME.Border} strokeWidth={2.5} />
              <View style={styles.sellerInfoRow}>
                <Text style={[styles.sellerLabel, { color: UI_THEME.TextSecondary }]}>New Item:</Text>
                <Text style={[styles.sellerName, { color: COLORS.orange }]}>{pendingItem?.product.sellerName}</Text>
              </View>
            </View>
            <View style={styles.alertActions}>
              <TouchableOpacity
                style={[styles.alertBtnSecondary, { borderColor: UI_THEME.Border, backgroundColor: UI_THEME.Background }]}
                onPress={() => setShowSellerConflict(false)}
                activeOpacity={0.7}
              >
                <Text style={[styles.alertBtnTextSecondary, { color: UI_THEME.TextPrimary }]}>Keep Current</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.alertBtnPrimary} onPress={handleClearAndReplace} activeOpacity={0.9}>
                <LinearGradient colors={[COLORS.forestGreen, COLORS.darkForest]} style={styles.alertBtnGradient}>
                  <Text style={styles.alertBtnTextPrimary}>Replace Cart</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* SUPPORTING MODALS */}
      <ProductDetailModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(product, gauge, qty) => { setSelectedProduct(null); addToCart(product, gauge, qty); }}
      />
      <ProfessionalModal
        visible={modalConfig.visible}
        onClose={() => setModalConfig(prev => ({ ...prev, visible: false }))}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        criteria={filterCriteria}
        setCriteria={setFilterCriteria}
        categories={availableCategories}
      />
      <CheckoutTypeModal
        visible={showCheckoutType}
        onClose={() => setShowCheckoutType(false)}
        onSelect={(type) => navigation.navigate(
          type === 'local' ? 'MarketplaceLocal' : 'MarketplaceInternational',
          { cartData: { items: cart, subtotal: cartTotal, totalWeight } }
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1,
  },
  headerIcon: {
    width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center',
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  headerTitleContainer: { alignItems: 'center', flex: 1, marginHorizontal: 16 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 18, fontWeight: '900', letterSpacing: -0.5 },
  headerLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  headerSub: { fontSize: 12, fontWeight: '600' },
  cartButton: {
    width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', position: 'relative',
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  cartBadge: {
    position: 'absolute', top: 6, right: 6, minWidth: 20, height: 20,
    borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white,
  },
  badgeText: { color: COLORS.white, fontSize: 10, fontWeight: '900' },

  // Search
  searchSection: { flexDirection: 'row', padding: 20, gap: 12 },
  searchBox: {
    flex: 1, flexDirection: 'row', alignItems: 'center', height: 52,
    borderRadius: 16, borderWidth: 2, paddingHorizontal: 16,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  searchInput: { flex: 1, marginLeft: 12, fontWeight: '600', fontSize: 15 },
  filterBtn: {
    width: 52, height: 52, borderRadius: 16, overflow: 'hidden',
    shadowColor: COLORS.forestGreen, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  filterGradient: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  // Categories
  categoryContainer: { paddingHorizontal: 20, marginBottom: 20, gap: 12 },
  categoryTab: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 2,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  categoryTabText: { fontSize: 14, fontWeight: '800', letterSpacing: 0.3 },

  // Loading / empty
  loadingContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 100 },
  loadingText: { marginTop: 12, fontSize: 14, fontWeight: '600' },
  emptyState: { alignItems: 'center', justifyContent: 'center', marginTop: 100, paddingHorizontal: 40 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyTitle: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, fontWeight: '600', textAlign: 'center' },

  // Product grid
  productGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: 14, justifyContent: 'space-between', paddingBottom: 32, gap: 14,
  },
  cardWrapper: { width: COLUMN_WIDTH },
  productCard: {
    borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.09, shadowRadius: 14, elevation: 5,
  },

  // Image section
  imageContainer: { width: '100%', height: 155, position: 'relative', backgroundColor: '#F0F0F0' },
  productImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  imageScrim: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%' },

  // Tier badge — top left over image
  tierBadgePos: { position: 'absolute', top: 8, left: 8 },
  tierBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7,
  },
  tierBadgeText: { fontSize: 8, fontWeight: '900', letterSpacing: 0.5, textTransform: 'uppercase' },

  // Weight — top right
  weightBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: COLORS.forestGreen, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7,
  },
  weightText: { color: COLORS.white, fontSize: 10, fontWeight: '900', letterSpacing: 0.2 },

  // Category — bottom left
  categoryOverlay: { position: 'absolute', bottom: 8, left: 10, right: 10 },
  categoryOverlayText: {
    color: 'rgba(255,255,255,0.92)', fontSize: 10, fontWeight: '800',
    letterSpacing: 0.6, textTransform: 'uppercase',
  },

  // ── Compact card body ──────────────────────────────────────────────────────────
  cardContent: { paddingHorizontal: 10, paddingTop: 9, paddingBottom: 10, gap: 5 },

  // Row 1: Name + star rating inline
  nameRatingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 4 },
  productTitle: { fontSize: 13, fontWeight: '800', letterSpacing: -0.2, flex: 1 },
  ratingChip: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  ratingVal: { fontSize: 11, fontWeight: '800' },

  // Row 2: Location
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  locationText: { fontSize: 10, fontWeight: '600', flex: 1 },

  // Row 3: Price + Add button inline
  priceActionRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginTop: 2,
  },
  priceBlock: { flexDirection: 'row', alignItems: 'baseline', gap: 1 },
  priceCurrency: { fontSize: 12, fontWeight: '900' },
  priceText: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
  cartBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 5, paddingHorizontal: 12, height: 34, borderRadius: 9, borderWidth: 1.5,
  },
  cartBtnText: { fontSize: 12, fontWeight: '800' },

  // Cart modal
  cartOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  cartSheet: { height: '85%', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24 },
  cartHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  cartHeaderSheet: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  cartTitle: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
  cartSubtitle: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  closeButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  cartItemsList: { flex: 1, marginBottom: 20 },
  emptyCart: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyCartIcon: { width: 100, height: 100, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  emptyCartTitle: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  emptyCartText: { fontSize: 14, fontWeight: '600' },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 20, marginBottom: 12,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  cartItemImage: { width: 70, height: 70, borderRadius: 14 },
  cartItemInfo: { flex: 1, marginLeft: 14 },
  cartItemName: { fontSize: 15, fontWeight: '800', marginBottom: 4 },
  cartItemMeta: { fontSize: 12, marginBottom: 4 },
  cartItemPrice: { fontSize: 16, fontWeight: '900' },
  cartItemActions: { alignItems: 'flex-end', gap: 8 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, padding: 4 },
  qtyButton: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  qtyText: { fontSize: 14, fontWeight: '800', marginHorizontal: 12 },
  deleteButton: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  cartFooter: {
    padding: 20, borderRadius: 20,
    shadowColor: COLORS.black, shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  summaryLabel: { fontSize: 14, fontWeight: '600' },
  summaryValue: { fontSize: 16, fontWeight: '900' },
  checkoutButton: {
    marginTop: 8, borderRadius: 16, overflow: 'hidden',
    shadowColor: COLORS.forestGreen, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8,
  },
  checkoutGradient: { height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  checkoutButtonText: { color: COLORS.white, fontWeight: '900', fontSize: 16 },

  // Alert modal
  alertOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 24 },
  alertBox: { borderRadius: 30, padding: 28, alignItems: 'center' },
  alertIconBg: { width: 80, height: 80, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  alertTitle: { fontSize: 22, fontWeight: '900', marginBottom: 12, textAlign: 'center' },
  alertMessage: { textAlign: 'center', fontSize: 14, lineHeight: 22, marginBottom: 24 },
  sellerComparison: { width: '100%', padding: 16, borderRadius: 16, marginBottom: 24, alignItems: 'center', gap: 12 },
  sellerInfoRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  sellerLabel: { fontSize: 13, fontWeight: '600' },
  sellerName: { fontSize: 14, fontWeight: '900' },
  alertActions: { flexDirection: 'row', gap: 12, width: '100%' },
  alertBtnPrimary: {
    flex: 1, borderRadius: 16, overflow: 'hidden',
    shadowColor: COLORS.forestGreen, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  alertBtnGradient: { height: 54, justifyContent: 'center', alignItems: 'center' },
  alertBtnSecondary: { flex: 1, height: 54, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  alertBtnTextPrimary: { color: COLORS.white, fontWeight: '900', fontSize: 15 },
  alertBtnTextSecondary: { fontWeight: '800', fontSize: 15 },
});






