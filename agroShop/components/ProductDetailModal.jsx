// import React, { useState, useEffect } from 'react';
// import { 
//   View, Text, StyleSheet, ScrollView, TouchableOpacity, 
//   Dimensions, Modal, Platform, ActivityIndicator, Image
// } from 'react-native';
// import { 
//   X, Minus, Plus, Layers, Star, ShieldCheck, ShoppingCart, Info, User, Package, Sparkles, Heart
// } from 'lucide-react-native';
// import { MotiView } from 'moti';
// import { LinearGradient } from 'expo-linear-gradient';

// import { useTheme } from '../../context/ThemeContext';
// import apiClient from '../../services/apiClient';

// const { width, height } = Dimensions.get('window');
// const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/300?text=No+Image+Available';

// // Helper function to construct proper image URL
// const getImageUrl = (imagePath) => {
//   if (!imagePath) return PLACEHOLDER_IMAGE;
  
//   // If already a full URL, return as is
//   if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
//     return imagePath;
//   }
  
//   // Construct full URL from backend
//   const baseURL = apiClient.defaults.baseURL || 'http://localhost:5000';
//   const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
//   return `${baseURL}${cleanPath}`;
// };

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
// };

// export default function ProductDetailModal({ visible, onClose, product, onAddToCart }) {
//   const { isDark: IsDark } = useTheme();

//   const UI_THEME = {
//     Background: IsDark ? COLORS.black : COLORS.white,
//     Surface: IsDark ? COLORS.darkGray : COLORS.lightGray,
//     Card: IsDark ? '#334155' : COLORS.white,
//     TextPrimary: IsDark ? COLORS.white : COLORS.black,
//     TextSecondary: IsDark ? '#94A3B8' : COLORS.mediumGray,
//     Border: IsDark ? '#334155' : '#E2E8F0',
//     Primary: COLORS.forestGreen,
//     PrimaryMuted: IsDark ? 'rgba(16, 99, 36, 0.2)' : 'rgba(16, 99, 36, 0.08)',
//     PriceBadge: IsDark ? COLORS.darkForest : '#ECFDF5',
//   };

//   const [SelectedGauge, SetSelectedGauge] = useState(null);
//   const [Quantity, SetQuantity] = useState(1);
//   const [ActiveImageIndex, SetActiveImageIndex] = useState(0);
//   const [SellerData, SetSellerData] = useState(null);
//   const [IsLoadingSeller, SetIsLoadingSeller] = useState(false);
//   const [IsFavorite, SetIsFavorite] = useState(false);

//   useEffect(() => {
//     if (visible && product) {
//       if (product.gauges?.length > 0) {
//         SetSelectedGauge(product.gauges[0]);
//         SetQuantity(1);
//         SetActiveImageIndex(0);
//       }
//       FetchSellerInfo(product.sellerId);
//     }
//   }, [product, visible]);

//   const FetchSellerInfo = async (sellerId) => {
//     if (!sellerId) return;
//     SetIsLoadingSeller(true);
//     try {
//       const response = await apiClient.get(`/auth/seller/${sellerId}`);
//       SetSellerData(response.data);
//     } catch (err) {
//       console.error("Error fetching seller details:", err);
//     } finally {
//       SetIsLoadingSeller(false);
//     }
//   };

//   if (!product) return null;

//   const HandleAddClick = () => {
//     if (SelectedGauge) {
//       onAddToCart(product, SelectedGauge, Quantity);
//       onClose();
//     }
//   };

//   const TotalPrice = (SelectedGauge?.price || 0) * Quantity;

//   return (
//     <Modal visible={visible} animationType="slide" transparent statusBarTranslucent>
//       <View style={styles.ModalOverlay}>
//         <MotiView
//           from={{ translateY: height }}
//           animate={{ translateY: visible ? 0 : height }}
//           transition={{ type: 'timing', duration: 400 }}
//           style={[styles.Sheet, { backgroundColor: UI_THEME.Background }]}
//         >
          
//           {/* ENHANCED IMAGE CAROUSEL */}
//           <View style={styles.CarouselWrapper}>
//             <ScrollView 
//               horizontal 
//               pagingEnabled 
//               showsHorizontalScrollIndicator={false}
//               onScroll={(e) => {
//                 const Offset = e.nativeEvent.contentOffset.x;
//                 SetActiveImageIndex(Math.round(Offset / width));
//               }}
//               scrollEventThrottle={16}
//             >
//               {product.images?.length > 0 ? (
//                 product.images.map((Img, Index) => (
//                   <View key={Index} style={styles.ImageContainer}>
//                     <Image 
//                       source={{ uri: getImageUrl(Img) }} 
//                       style={styles.SheetImg}
//                       resizeMode="cover"
//                     />
//                     <LinearGradient colors={['transparent', 'rgba(0,0,0,0.3)']} style={styles.ImageGradient} />
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.ImageContainer}>
//                   <Image 
//                     source={{ uri: PLACEHOLDER_IMAGE }} 
//                     style={styles.SheetImg}
//                     resizeMode="cover"
//                   />
//                 </View>
//               )}
//             </ScrollView>

//             {/* Close Button */}
//             <TouchableOpacity 
//               style={styles.CloseBtn} 
//               onPress={onClose}
//               activeOpacity={0.8}
//             >
//               <View style={styles.CloseCircle}>
//                 <X size={24} color={COLORS.white} strokeWidth={2.5} />
//               </View>
//             </TouchableOpacity>

//             {/* Like/Favorite Button */}
//             <TouchableOpacity 
//               style={styles.LikeBtn} 
//               onPress={() => SetIsFavorite(!IsFavorite)}
//               activeOpacity={0.8}
//             >
//               <MotiView
//                 animate={{
//                   scale: IsFavorite ? [1, 1.2, 1] : 1,
//                 }}
//                 transition={{
//                   type: 'timing',
//                   duration: 300,
//                 }}
//               >
//                 <View style={[styles.LikeCircle, IsFavorite && styles.LikeCircleActive]}>
//                   <Heart 
//                     size={24} 
//                     color={IsFavorite ? COLORS.white : COLORS.white} 
//                     fill={IsFavorite ? COLORS.white : 'transparent'}
//                     strokeWidth={2.5} 
//                   />
//                 </View>
//               </MotiView>
//             </TouchableOpacity>

//             {/* Pagination Dots */}
//             {product.images?.length > 1 && (
//               <View style={styles.DotContainer}>
//                 {product.images.map((_, I) => (
//                   <MotiView
//                     key={I}
//                     animate={{
//                       width: ActiveImageIndex === I ? 24 : 8,
//                       backgroundColor: ActiveImageIndex === I ? COLORS.forestGreen : 'rgba(255,255,255,0.6)',
//                     }}
//                     transition={{ type: 'timing', duration: 200 }}
//                     style={styles.Dot}
//                   />
//                 ))}
//               </View>
//             )}

//             {/* Fresh Badge */}
//             <View style={styles.FreshBadge}>
//               <LinearGradient
//                 colors={[COLORS.forestGreen, COLORS.darkForest]}
//                 style={styles.FreshGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <Sparkles size={14} color={COLORS.white} strokeWidth={2.5} />
//                 <Text style={styles.FreshText}>Fresh</Text>
//               </LinearGradient>
//             </View>
//           </View>

//           <ScrollView 
//             style={styles.SheetContent} 
//             showsVerticalScrollIndicator={false}
//             contentContainerStyle={{ paddingBottom: 160 }}
//           >
//             {/* ENHANCED HEADER */}
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'timing', duration: 400 }}
//             >
//               <View style={styles.SheetHeader}>
//                 <View style={styles.TitleArea}>
//                   <View style={styles.BadgeRow}>
//                     <Text style={[styles.CategoryLabel, { color: COLORS.forestGreen }]}>
//                       {product.category}
//                     </Text>
//                     <View style={styles.VerifiedBadge}>
//                       <ShieldCheck size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
//                       <Text style={[styles.VerifiedText, { color: COLORS.forestGreen }]}>
//                         Certified
//                       </Text>
//                     </View>
//                   </View>
//                   <Text style={[styles.SheetTitle, { color: UI_THEME.TextPrimary }]}>
//                     {product.label}
//                   </Text>
//                 </View>
                
//                 <View style={[styles.PriceContainer, { backgroundColor: UI_THEME.PriceBadge }]}>
//                   <Text style={[styles.PriceVal, { color: COLORS.forestGreen }]}>
//                     R{TotalPrice.toLocaleString()}
//                   </Text>
//                   <Text style={[styles.PriceSubtext, { color: COLORS.forestGreen }]}>
//                     Subtotal
//                   </Text>
//                 </View>
//               </View>
//             </MotiView>

//             {/* ENHANCED SELLER CARD */}
//             <MotiView
//               from={{ opacity: 0, scale: 0.95 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ type: 'timing', duration: 400, delay: 100 }}
//             >
//               <View style={[styles.FarmerCard, { backgroundColor: UI_THEME.Surface }]}>
//                 <View style={styles.SellerImageWrapper}>
//                   {IsLoadingSeller ? (
//                     <View style={[styles.SellerSelfie, { justifyContent: 'center', alignItems: 'center' }]}>
//                       <ActivityIndicator size="small" color={COLORS.forestGreen} />
//                     </View>
//                   ) : SellerData?.verificationSelfie ? (
//                     <>
//                       <Image 
//                         source={{ uri: getImageUrl(SellerData.verificationSelfie) }}
//                         style={styles.SellerSelfie}
//                         resizeMode="cover"
//                       />
//                       {SellerData?.isVerified && (
//                         <View style={styles.VerifiedCheck}>
//                           <ShieldCheck size={12} color={COLORS.white} strokeWidth={3} />
//                         </View>
//                       )}
//                     </>
//                   ) : (
//                     <View style={[styles.SellerSelfie, { justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.lightGray }]}>
//                       <User size={24} color={COLORS.mediumGray} strokeWidth={2} />
//                     </View>
//                   )}
//                 </View>

//                 <View style={styles.SellerDetails}>
//                   <Text style={[styles.FarmerLabel, { color: UI_THEME.TextSecondary }]}>
//                     Verified Seller
//                   </Text>
//                   <Text style={[styles.FarmerName, { color: UI_THEME.TextPrimary }]} numberOfLines={1}>
//                     {SellerData?.businessName || product.sellerName || 'Agro Seller'}
//                   </Text>
//                   <View style={styles.SellerStatsRow}>
//                     <View style={styles.StatItem}>
//                       <Star size={12} color={COLORS.gold} fill={COLORS.gold} strokeWidth={2} />
//                       <Text style={[styles.StatText, { color: UI_THEME.TextSecondary }]}>
//                         {Number(SellerData?.averageRating || 0).toFixed(1)} ({SellerData?.totalReviews || 0})
//                       </Text>
//                     </View>
//                     <View style={[styles.StatDot, { backgroundColor: UI_THEME.TextSecondary }]} />
//                     <View style={styles.StatItem}>
//                       <Package size={12} color={UI_THEME.TextSecondary} strokeWidth={2} />
//                       <Text style={[styles.StatText, { color: UI_THEME.TextSecondary }]}>
//                         {SellerData?.totalProducts || 0} Items
//                       </Text>
//                     </View>
//                   </View>
//                 </View>

//                 <TouchableOpacity 
//                   style={[styles.ViewSellerBtn, { borderColor: COLORS.forestGreen }]}
//                   activeOpacity={0.7}
//                 >
//                   <Text style={[styles.ViewSellerText, { color: COLORS.forestGreen }]}>
//                     Visit
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </MotiView>

//             {/* GAUGE SELECTOR */}
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'timing', duration: 400, delay: 200 }}
//             >
//               <View style={styles.SectionHeader}>
//                 <View style={[styles.SectionIconCircle, { backgroundColor: UI_THEME.PrimaryMuted }]}>
//                   <Layers size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
//                 </View>
//                 <Text style={[styles.SectionLabel, { color: UI_THEME.TextPrimary }]}>
//                   Choose Package Size
//                 </Text>
//               </View>

//               <View style={styles.GaugeGrid}>
//                 {product.gauges?.map((G, index) => (
//                   <MotiView
//                     key={G.id}
//                     from={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ type: 'timing', duration: 300, delay: 250 + (index * 50) }}
//                   >
//                     <TouchableOpacity 
//                       style={[
//                         styles.GaugeCard, 
//                         { 
//                           backgroundColor: UI_THEME.Card, 
//                           borderColor: SelectedGauge?.id === G.id ? COLORS.forestGreen : UI_THEME.Border,
//                           borderWidth: SelectedGauge?.id === G.id ? 2.5 : 1.5,
//                         },
//                         SelectedGauge?.id === G.id && { 
//                           backgroundColor: UI_THEME.PrimaryMuted,
//                           shadowColor: COLORS.forestGreen,
//                           shadowOffset: { width: 0, height: 4 },
//                           shadowOpacity: 0.2,
//                           shadowRadius: 8,
//                           elevation: 4,
//                         }
//                       ]} 
//                       onPress={() => SetSelectedGauge(G)}
//                       activeOpacity={0.7}
//                     >
//                       <Text style={[
//                         styles.GaugeLabelText, 
//                         { color: UI_THEME.TextPrimary },
//                         SelectedGauge?.id === G.id && { color: COLORS.forestGreen }
//                       ]}>
//                         {G.label}
//                       </Text>
//                       <Text style={[styles.GaugeWeightText, { color: UI_THEME.TextSecondary }]}>
//                         {G.weight}kg
//                       </Text>
//                       <Text style={[styles.GaugePriceText, { color: COLORS.forestGreen }]}>
//                         R{G.price.toLocaleString()}
//                       </Text>
//                       {SelectedGauge?.id === G.id && (
//                         <MotiView
//                           from={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           transition={{ type: 'timing', duration: 200 }}
//                           style={[styles.ActiveMarker, { backgroundColor: COLORS.forestGreen }]}
//                         />
//                       )}
//                     </TouchableOpacity>
//                   </MotiView>
//                 ))}
//               </View>
//             </MotiView>

//             {/* DESCRIPTION */}
//             <MotiView
//               from={{ opacity: 0, translateY: 20 }}
//               animate={{ opacity: 1, translateY: 0 }}
//               transition={{ type: 'timing', duration: 400, delay: 300 }}
//             >
//               <View style={styles.SectionHeader}>
//                 <View style={[styles.SectionIconCircle, { backgroundColor: UI_THEME.PrimaryMuted }]}>
//                   <Info size={18} color={COLORS.forestGreen} strokeWidth={2.5} />
//                 </View>
//                 <Text style={[styles.SectionLabel, { color: UI_THEME.TextPrimary }]}>
//                   Product Information
//                 </Text>
//               </View>
//               <Text style={[styles.SheetDesc, { color: UI_THEME.TextSecondary }]}>
//                 {product.description || 'Fresh, high-quality produce delivered straight from the farm to your door. Carefully selected and packaged to ensure maximum freshness.'}
//               </Text>

//               {/* Additional Info Cards */}
//               <View style={styles.InfoCardsRow}>
//                 <View style={[styles.InfoMiniCard, { backgroundColor: UI_THEME.Card }]}>
//                   <ShieldCheck size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
//                   <Text style={[styles.InfoMiniText, { color: UI_THEME.TextSecondary }]}>
//                     Quality Assured
//                   </Text>
//                 </View>
//                 <View style={[styles.InfoMiniCard, { backgroundColor: UI_THEME.Card }]}>
//                   <Package size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
//                   <Text style={[styles.InfoMiniText, { color: UI_THEME.TextSecondary }]}>
//                     Secure Packaging
//                   </Text>
//                 </View>
//               </View>
//             </MotiView>
//           </ScrollView>

//           {/* ENHANCED ACTION BAR */}
//           <MotiView
//             from={{ translateY: 100 }}
//             animate={{ translateY: 0 }}
//             transition={{ type: 'timing', duration: 400, delay: 400 }}
//             style={[
//               styles.ActionBar, 
//               { 
//                 backgroundColor: UI_THEME.Background, 
//                 borderTopColor: UI_THEME.Border 
//               }
//             ]}
//           >
//             <View style={[styles.QtyWrapper, { backgroundColor: UI_THEME.Surface }]}>
//               <TouchableOpacity 
//                 style={styles.QtyAction} 
//                 onPress={() => SetQuantity(Math.max(1, Quantity - 1))}
//                 activeOpacity={0.7}
//               >
//                 <Minus size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
//               </TouchableOpacity>
//               <Text style={[styles.QtyValue, { color: UI_THEME.TextPrimary }]}>
//                 {Quantity}
//               </Text>
//               <TouchableOpacity 
//                 style={styles.QtyAction} 
//                 onPress={() => SetQuantity(Quantity + 1)}
//                 activeOpacity={0.7}
//               >
//                 <Plus size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
//               </TouchableOpacity>
//             </View>

//             <TouchableOpacity 
//               style={styles.PrimaryAddBtn} 
//               onPress={HandleAddClick}
//               activeOpacity={0.9}
//             >
//               <LinearGradient
//                 colors={[COLORS.forestGreen, COLORS.darkForest]}
//                 style={styles.AddBtnGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 0 }}
//               >
//                 <ShoppingCart size={22} color={COLORS.white} strokeWidth={2.5} />
//                 <Text style={styles.PrimaryAddBtnText}>Add to Cart</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </MotiView>

//         </MotiView>
//       </View>
//     </Modal>
//   );
// }

// const styles = StyleSheet.create({
//   ModalOverlay: { 
//     flex: 1, 
//     backgroundColor: 'rgba(0,0,0,0.85)', 
//     justifyContent: 'flex-end' 
//   },
//   Sheet: { 
//     borderTopLeftRadius: 40, 
//     borderTopRightRadius: 40, 
//     height: height * 0.94, 
//     overflow: 'hidden',
//   },
  
//   // Image Section
//   CarouselWrapper: { 
//     width: width, 
//     height: height * 0.4,
//     position: 'relative',
//   },
//   ImageContainer: {
//     width: width,
//     height: '100%',
//     position: 'relative',
//   },
//   SheetImg: { 
//     width: width, 
//     height: '100%',
//   },
//   ImageGradient: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: '30%',
//   },
//   CloseBtn: { 
//     position: 'absolute', 
//     top: 50, 
//     right: 20, 
//     zIndex: 10,
//   },
//   CloseCircle: { 
//     width: 48, 
//     height: 48, 
//     borderRadius: 24, 
//     backgroundColor: 'rgba(0,0,0,0.6)', 
//     justifyContent: 'center', 
//     alignItems: 'center',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   LikeBtn: {
//     position: 'absolute',
//     top: 50,
//     right: 80,
//     zIndex: 10,
//   },
//   LikeCircle: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     backgroundColor: 'rgba(0,0,0,0.6)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   LikeCircleActive: {
//     backgroundColor: '#EF4444',
//   },
//   FreshBadge: {
//     position: 'absolute',
//     top: 50,
//     left: 20,
//     borderRadius: 12,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 4,
//   },
//   FreshGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 6,
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//   },
//   FreshText: {
//     color: COLORS.white,
//     fontSize: 14,
//     fontWeight: '900',
//     letterSpacing: 0.5,
//   },
//   DotContainer: { 
//     position: 'absolute', 
//     bottom: 20, 
//     width: '100%', 
//     flexDirection: 'row', 
//     justifyContent: 'center', 
//     gap: 8,
//   },
//   Dot: { 
//     height: 8, 
//     borderRadius: 4,
//   },
  
//   // Content Section
//   SheetContent: { 
//     padding: 24,
//   },
//   SheetHeader: { 
//     flexDirection: 'row', 
//     justifyContent: 'space-between', 
//     alignItems: 'flex-start', 
//     marginBottom: 20,
//     gap: 16,
//   },
//   TitleArea: { 
//     flex: 1,
//   },
//   BadgeRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 10, 
//     marginBottom: 10,
//     flexWrap: 'wrap',
//   },
//   CategoryLabel: { 
//     fontSize: 13, 
//     fontWeight: '800', 
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },
//   VerifiedBadge: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4, 
//     backgroundColor: 'rgba(16,99,36,0.15)', 
//     paddingHorizontal: 10, 
//     paddingVertical: 4, 
//     borderRadius: 10,
//   },
//   VerifiedText: { 
//     fontSize: 11, 
//     fontWeight: '800',
//   },
//   SheetTitle: { 
//     fontSize: 26, 
//     fontWeight: '900',
//     lineHeight: 32,
//     letterSpacing: -0.5,
//   },
//   PriceContainer: { 
//     padding: 16, 
//     borderRadius: 20, 
//     alignItems: 'center',
//     minWidth: 110,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   PriceVal: { 
//     fontSize: 24, 
//     fontWeight: '900',
//     letterSpacing: -0.5,
//   },
//   PriceSubtext: { 
//     fontSize: 11, 
//     fontWeight: '700', 
//     textTransform: 'uppercase',
//     marginTop: 2,
//   },
  
//   // Seller Card
//   FarmerCard: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     padding: 16, 
//     borderRadius: 20,
//     marginBottom: 28,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 8,
//     elevation: 2,
//   },
//   SellerImageWrapper: { 
//     position: 'relative',
//   },
//   SellerSelfie: { 
//     width: 56, 
//     height: 56, 
//     borderRadius: 28, 
//     borderWidth: 2.5, 
//     borderColor: COLORS.forestGreen,
//     overflow: 'hidden',
//   },
//   VerifiedCheck: { 
//     position: 'absolute', 
//     bottom: -2, 
//     right: -2, 
//     backgroundColor: COLORS.forestGreen, 
//     borderRadius: 12, 
//     padding: 4, 
//     borderWidth: 2, 
//     borderColor: COLORS.white,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   SellerDetails: {
//     flex: 1,
//     marginLeft: 14,
//   },
//   FarmerLabel: { 
//     fontSize: 11, 
//     fontWeight: '700', 
//     textTransform: 'uppercase', 
//     letterSpacing: 0.5,
//     marginBottom: 2,
//   },
//   FarmerName: { 
//     fontSize: 16, 
//     fontWeight: '900',
//     marginBottom: 6,
//   },
//   SellerStatsRow: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 8,
//   },
//   StatItem: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 4,
//   },
//   StatText: { 
//     fontSize: 12, 
//     fontWeight: '600',
//   },
//   StatDot: { 
//     width: 4, 
//     height: 4, 
//     borderRadius: 2,
//     opacity: 0.5,
//   },
//   ViewSellerBtn: { 
//     paddingHorizontal: 16, 
//     paddingVertical: 8, 
//     borderRadius: 12, 
//     borderWidth: 2,
//   },
//   ViewSellerText: { 
//     fontSize: 13, 
//     fontWeight: '900',
//   },
  
//   // Section Header
//   SectionHeader: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     gap: 12, 
//     marginBottom: 16,
//   },
//   SectionIconCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   SectionLabel: { 
//     fontSize: 18, 
//     fontWeight: '900',
//     letterSpacing: -0.5,
//   },
  
//   // Gauge Grid
//   GaugeGrid: { 
//     flexDirection: 'row', 
//     flexWrap: 'wrap', 
//     gap: 12, 
//     marginBottom: 28,
//   },
//   GaugeCard: { 
//     width: (width - 72) / 3, 
//     paddingVertical: 16, 
//     paddingHorizontal: 8,
//     borderRadius: 16,
//     alignItems: 'center',
//     position: 'relative',
//   },
//   GaugeLabelText: { 
//     fontSize: 15, 
//     fontWeight: '900',
//     marginBottom: 4,
//   },
//   GaugeWeightText: { 
//     fontSize: 12, 
//     fontWeight: '600',
//     marginBottom: 6,
//   },
//   GaugePriceText: {
//     fontSize: 14,
//     fontWeight: '800',
//   },
//   ActiveMarker: { 
//     position: 'absolute', 
//     bottom: 0, 
//     height: 4, 
//     width: '50%', 
//     borderTopLeftRadius: 4, 
//     borderTopRightRadius: 4,
//   },
  
//   // Description
//   SheetDesc: { 
//     fontSize: 15, 
//     lineHeight: 24, 
//     fontWeight: '500',
//     marginBottom: 20,
//   },
//   InfoCardsRow: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   InfoMiniCard: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     padding: 14,
//     borderRadius: 16,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   InfoMiniText: {
//     fontSize: 12,
//     fontWeight: '700',
//     flex: 1,
//   },
  
//   // Action Bar
//   ActionBar: { 
//     position: 'absolute', 
//     bottom: 0, 
//     left: 0, 
//     right: 0, 
//     padding: 20, 
//     paddingBottom: Platform.OS === 'ios' ? 36 : 20, 
//     flexDirection: 'row', 
//     gap: 12, 
//     borderTopWidth: 1,
//     shadowColor: COLORS.black,
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   QtyWrapper: { 
//     flexDirection: 'row', 
//     alignItems: 'center', 
//     borderRadius: 16, 
//     padding: 4,
//   },
//   QtyAction: { 
//     width: 44, 
//     height: 44, 
//     justifyContent: 'center', 
//     alignItems: 'center',
//   },
//   QtyValue: { 
//     fontSize: 20, 
//     fontWeight: '900', 
//     paddingHorizontal: 16,
//   },
//   PrimaryAddBtn: { 
//     flex: 1,
//     borderRadius: 18,
//     overflow: 'hidden',
//     shadowColor: COLORS.forestGreen,
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.3,
//     shadowRadius: 16,
//     elevation: 8,
//   },
//   AddBtnGradient: {
//     height: 60,
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 10,
//   },
//   PrimaryAddBtnText: { 
//     color: COLORS.white, 
//     fontSize: 18, 
//     fontWeight: '900',
//     letterSpacing: 0.3,
//   },
// });










// screens/shop/components/ProductDetailModal.jsx
// 🛍️ Enhanced Product Detail Modal with Seller Reviews

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  Package,
  Award,
  Shield,
  Crown,
  Sparkles,
  MessageCircle,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import apiClient from '../../services/apiClient';

const { width, height } = Dimensions.get('window');

// ═══════════════════════════════════════════════════════════
// TIER BADGE CONFIGURATION
// ═══════════════════════════════════════════════════════════
const TIER_CONFIG = {
  Platinum: {
    bg: '#1E293B',
    color: '#E5E7EB',
    borderColor: '#475569',
    icon: Crown,
    label: 'Platinum',
  },
  Gold: {
    bg: '#FFFBEB',
    color: '#B45309',
    borderColor: '#F59E0B',
    icon: Star,
    iconFill: '#F59E0B',
    label: 'Gold Partner',
  },
  Silver: {
    bg: '#F8FAFC',
    color: '#475569',
    borderColor: '#94A3B8',
    icon: Shield,
    label: 'Silver',
  },
  Beginner: {
    bg: '#F0FDF4',
    color: '#065F46',
    borderColor: '#10B981',
    icon: Sparkles,
    label: 'New Seller',
  },
  Bronze: {
    show: false,
  },
};

const COLORS = {
  forestGreen: '#106324',
  darkForest: '#0A4118',
  white: '#FFFFFF',
  black: '#0F172A',
  darkGray: '#1E293B',
  lightGray: '#F8FAFC',
  mediumGray: '#64748B',
  gold: '#F59E0B',
  error: '#EF4444',
};

const DESCRIPTION_PREVIEW_LENGTH = 150;

export default function ProductDetailModal({ visible, product, onClose, onAddToCart }) {
  const { isDark } = useTheme();
  const slideAnim = useRef(new Animated.Value(height)).current;

  const [selectedGauge, setSelectedGauge] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Seller Reviews State
  const [sellerReviews, setSellerReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewsExpanded, setReviewsExpanded] = useState(false);

  // ✅ Read More State
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const UI_THEME = {
    Background: isDark ? COLORS.black : COLORS.lightGray,
    Card: isDark ? COLORS.darkGray : COLORS.white,
    TextPrimary: isDark ? COLORS.white : COLORS.black,
    TextSecondary: isDark ? '#94A3B8' : COLORS.mediumGray,
    Border: isDark ? '#334155' : '#E2E8F0',
    Primary: COLORS.forestGreen,
    Muted: isDark ? '#475569' : '#CBD5E1',
  };

  // ═══════════════════════════════════════════════════════════
  // FETCH SELLER REVIEWS
  // ═══════════════════════════════════════════════════════════
  const fetchSellerReviews = async (sellerId) => {
    if (!sellerId) return;
    try {
      setLoadingReviews(true);
      const response = await apiClient.get(`/reviews/seller/${sellerId}`);
      const payload = response.data;
      if (Array.isArray(payload)) {
        setSellerReviews(payload);
      } else if (Array.isArray(payload?.data)) {
        setSellerReviews(payload.data);
      } else {
        setSellerReviews([]);
      }
    } catch (error) {
      console.error('❌ Error fetching seller reviews:', error);
      setSellerReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  };

  // ═══════════════════════════════════════════════════════════
  // EFFECTS
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();

      if (product?.gauges?.length > 0) {
        setSelectedGauge(product.gauges[0]);
      }

      if (product?.sellerId) {
        fetchSellerReviews(product.sellerId);
      }
    } else {
      slideAnim.setValue(height);
      setSelectedGauge(null);
      setQuantity(1);
      setCurrentImageIndex(0);
      setSellerReviews([]);
      setReviewsExpanded(false);
      setDescriptionExpanded(false);
    }
  }, [visible, product]);

  if (!product) return null;

  const handleClose = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  };

  const handleAddToCart = () => {
    if (selectedGauge) {
      onAddToCart(product, selectedGauge, quantity);
      handleClose();
    }
  };

  // ═══════════════════════════════════════════════════════════
  // DESCRIPTION HELPERS
  // ═══════════════════════════════════════════════════════════
  const fullDescription = product.description || '';
  const isLongDescription = fullDescription.length > DESCRIPTION_PREVIEW_LENGTH;
  const displayedDescription =
    isLongDescription && !descriptionExpanded
      ? fullDescription.slice(0, DESCRIPTION_PREVIEW_LENGTH).trimEnd() + '…'
      : fullDescription;

  // ═══════════════════════════════════════════════════════════
  // RENDER TIER BADGE
  // ═══════════════════════════════════════════════════════════
  const renderTierBadge = (tier) => {
    const config = TIER_CONFIG[tier];
    if (!config || config.show === false || tier === 'Bronze') return null;
    const IconComponent = config.icon;
    return (
      <View style={[styles.tierBadge, { backgroundColor: config.bg, borderColor: config.borderColor }]}>
        <IconComponent
          size={12}
          color={config.borderColor}
          fill={config.iconFill || config.borderColor}
          strokeWidth={2.5}
        />
        <Text style={[styles.tierBadgeText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER STAR RATING
  // ═══════════════════════════════════════════════════════════
  const renderStars = (rating) => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={14}
          color={star <= rating ? COLORS.gold : UI_THEME.Border}
          fill={star <= rating ? COLORS.gold : 'transparent'}
          strokeWidth={2}
        />
      ))}
    </View>
  );

  // ═══════════════════════════════════════════════════════════
  // FORMAT DATE
  // ═══════════════════════════════════════════════════════════
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor(Math.abs(now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const averageRating =
    sellerReviews.length > 0
      ? (
          sellerReviews.reduce((sum, r) => sum + (r.rating || r.Rating || 0), 0) /
          sellerReviews.length
        ).toFixed(1)
      : product.rating?.toFixed(1) || '0.0';

  const displayedReviews = reviewsExpanded ? sellerReviews : sellerReviews.slice(0, 3);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { backgroundColor: UI_THEME.Background, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* ── HEADER ── */}
          <View style={[styles.header, { borderBottomColor: UI_THEME.Border }]}>
            <Text style={[styles.headerTitle, { color: UI_THEME.TextPrimary }]}>
              Product Details
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={UI_THEME.TextPrimary} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>

            {/* ── IMAGE CAROUSEL ── */}
            <View style={styles.imageSection}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / width);
                  setCurrentImageIndex(index);
                }}
                scrollEventThrottle={16}
              >
                {product.images?.map((img, idx) => (
                  <Image
                    key={idx}
                    source={{ uri: img }}
                    style={styles.productImage}
                    resizeMode="cover"
                  />
                ))}
              </ScrollView>

              {product.images?.length > 1 && (
                <View style={styles.paginationDots}>
                  {product.images.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            idx === currentImageIndex ? COLORS.forestGreen : UI_THEME.Border,
                          width: idx === currentImageIndex ? 24 : 8,
                        },
                      ]}
                    />
                  ))}
                </View>
              )}
            </View>

            {/* ── CONTENT ── */}
            <View style={styles.contentSection}>

              {/* Category & Tier */}
              <View style={styles.categoryRow}>
                <View style={[styles.categoryBadge, { backgroundColor: UI_THEME.Card }]}>
                  <Package size={14} color={COLORS.forestGreen} strokeWidth={2.5} />
                  <Text style={[styles.categoryText, { color: UI_THEME.TextSecondary }]}>
                    {product.category}
                  </Text>
                </View>
                {renderTierBadge(product.sellerTier)}
              </View>

              {/* Product Name */}
              <Text style={[styles.productName, { color: UI_THEME.TextPrimary }]}>
                {product.label}
              </Text>

              {/* Rating */}
              <View style={styles.ratingRow}>
                {renderStars(Math.round(parseFloat(averageRating)))}
                <Text style={[styles.ratingText, { color: UI_THEME.TextSecondary }]}>
                  {averageRating} ({sellerReviews.length || product.reviewCount || 0} reviews)
                </Text>
              </View>

              {/* ═══════════════════════════════════════════════════════════
                  ✅ DESCRIPTION WITH READ MORE
              ═══════════════════════════════════════════════════════════ */}
              {fullDescription.length > 0 && (
                <View style={styles.descriptionSection}>
                  <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary }]}>
                    About this product
                  </Text>

                  <Text style={[styles.descriptionText, { color: UI_THEME.TextSecondary }]}>
                    {displayedDescription}
                  </Text>

                  {isLongDescription && (
                    <TouchableOpacity
                      onPress={() => setDescriptionExpanded(!descriptionExpanded)}
                      style={styles.readMoreButton}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.readMoreText, { color: COLORS.forestGreen }]}>
                        {descriptionExpanded ? 'Show less' : 'Read more'}
                      </Text>
                      {descriptionExpanded
                        ? <ChevronUp size={15} color={COLORS.forestGreen} strokeWidth={2.5} />
                        : <ChevronDown size={15} color={COLORS.forestGreen} strokeWidth={2.5} />
                      }
                    </TouchableOpacity>
                  )}
                </View>
              )}

              {/* Seller Info */}
              <View style={[styles.sellerCard, { backgroundColor: UI_THEME.Card }]}>
                <View style={styles.sellerHeader}>
                  <View style={[styles.sellerAvatar, { backgroundColor: COLORS.forestGreen + '20' }]}>
                    <User size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sellerName, { color: UI_THEME.TextPrimary }]}>
                      {product.sellerName}
                    </Text>
                    <Text style={[styles.sellerLocation, { color: UI_THEME.TextSecondary }]}>
                      {[product.sellerTown, product.sellerState].filter(Boolean).join(', ') || 'South Africa'}
                    </Text>
                  </View>
                </View>
              </View>

              {/* ═══════════════════════════════════════════════════════════
                  SELLER REVIEWS SECTION
              ═══════════════════════════════════════════════════════════ */}
              <View style={styles.reviewsSection}>
                <View style={styles.reviewsHeader}>
                  <MessageCircle size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                  <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary, marginBottom: 0 }]}>
                    Seller Reviews
                  </Text>
                  {sellerReviews.length > 0 && (
                    <View style={styles.reviewCount}>
                      <Text style={[styles.reviewCountText, { color: UI_THEME.TextSecondary }]}>
                        {sellerReviews.length}
                      </Text>
                    </View>
                  )}
                </View>

                {loadingReviews ? (
                  <View style={styles.loadingReviews}>
                    <ActivityIndicator size="small" color={COLORS.forestGreen} />
                    <Text style={[styles.loadingText, { color: UI_THEME.TextSecondary }]}>
                      Loading reviews...
                    </Text>
                  </View>
                ) : sellerReviews.length === 0 ? (
                  <View style={[styles.noReviewsCard, { backgroundColor: UI_THEME.Card }]}>
                    <MessageCircle size={32} color={UI_THEME.Muted} strokeWidth={2} />
                    <Text style={[styles.noReviewsText, { color: UI_THEME.TextSecondary }]}>
                      No reviews yet for this seller
                    </Text>
                  </View>
                ) : (
                  <>
                    {displayedReviews.map((review) => (
                      <View
                        key={review.id || review.Id}
                        style={[
                          styles.reviewCard,
                          { backgroundColor: UI_THEME.Card, borderColor: UI_THEME.Border },
                        ]}
                      >
                        <View style={styles.reviewHeader}>
                          <View style={[styles.reviewerAvatar, { backgroundColor: COLORS.gold + '20' }]}>
                            <User size={16} color={COLORS.gold} strokeWidth={2.5} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.reviewerName, { color: UI_THEME.TextPrimary }]}>
                              {review.buyerName || review.BuyerName || 'Verified Buyer'}
                            </Text>
                            <View style={styles.reviewMeta}>
                              {renderStars(review.rating || review.Rating || 0)}
                              <Text style={[styles.reviewDate, { color: UI_THEME.TextSecondary }]}>
                                • {formatDate(review.createdAt || review.CreatedAt)}
                              </Text>
                            </View>
                          </View>
                        </View>

                        {(review.comment || review.Comment) ? (
                          <Text style={[styles.reviewComment, { color: UI_THEME.TextSecondary }]}>
                            {review.comment || review.Comment}
                          </Text>
                        ) : null}
                      </View>
                    ))}

                    {sellerReviews.length > 3 && (
                      <TouchableOpacity
                        style={[styles.showMoreButton, { backgroundColor: UI_THEME.Card }]}
                        onPress={() => setReviewsExpanded(!reviewsExpanded)}
                      >
                        <Text style={[styles.showMoreText, { color: COLORS.forestGreen }]}>
                          {reviewsExpanded
                            ? 'Show Less'
                            : `Show ${sellerReviews.length - 3} More Reviews`}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </View>

              {/* GAUGE SELECTION */}
              {product.gauges?.length > 0 && (
                <View style={styles.gaugesSection}>
                  <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary }]}>
                    Select Size
                  </Text>
                  <View style={styles.gaugesGrid}>
                    {product.gauges.map((gauge) => {
                      const isSelected = selectedGauge?.id === gauge.id;
                      return (
                        <TouchableOpacity
                          key={gauge.id}
                          style={[
                            styles.gaugeCard,
                            {
                              backgroundColor: isSelected
                                ? COLORS.forestGreen + '15'
                                : UI_THEME.Card,
                              borderColor: isSelected ? COLORS.forestGreen : UI_THEME.Border,
                            },
                          ]}
                          onPress={() => setSelectedGauge(gauge)}
                        >
                          <Text style={[styles.gaugeWeight, { color: UI_THEME.TextPrimary }]}>
                            {gauge.weight}kg
                          </Text>
                          <Text style={[styles.gaugePrice, { color: COLORS.forestGreen }]}>
                            R{gauge.price.toLocaleString()}
                          </Text>
                          <Text style={[styles.gaugePerKg, { color: UI_THEME.TextSecondary }]}>
                            R{(gauge.price / gauge.weight).toFixed(0)}/kg
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* QUANTITY SELECTOR */}
              <View style={styles.quantitySection}>
                <Text style={[styles.sectionTitle, { color: UI_THEME.TextPrimary }]}>
                  Quantity
                </Text>
                <View style={[styles.quantityControl, { backgroundColor: UI_THEME.Card }]}>
                  <TouchableOpacity
                    onPress={() => setQuantity(Math.max(1, quantity - 1))}
                    style={styles.qtyButton}
                  >
                    <Minus size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </TouchableOpacity>
                  <Text style={[styles.qtyText, { color: UI_THEME.TextPrimary }]}>
                    {quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setQuantity(quantity + 1)}
                    style={styles.qtyButton}
                  >
                    <Plus size={20} color={COLORS.forestGreen} strokeWidth={2.5} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </ScrollView>

          {/* ── FOOTER ── */}
          <View style={[styles.footer, { backgroundColor: UI_THEME.Card, borderTopColor: UI_THEME.Border }]}>
            <View>
              <Text style={[styles.footerLabel, { color: UI_THEME.TextSecondary }]}>
                Total Price
              </Text>
              <Text style={[styles.footerPrice, { color: COLORS.forestGreen }]}>
                R{selectedGauge ? (selectedGauge.price * quantity).toLocaleString() : '0'}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.addToCartButton, !selectedGauge && { opacity: 0.5 }]}
              onPress={handleAddToCart}
              disabled={!selectedGauge}
            >
              <LinearGradient
                colors={[COLORS.forestGreen, COLORS.darkForest]}
                style={styles.addToCartGradient}
              >
                <ShoppingCart size={20} color={COLORS.white} strokeWidth={2.5} />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.92,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Image
  imageSection: {
    position: 'relative',
  },
  productImage: {
    width: width,
    height: width * 0.8,
    backgroundColor: '#F0F0F0',
  },
  paginationDots: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },

  // Content
  contentSection: {
    padding: 20,
    paddingBottom: 100,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // Tier Badge
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  // Product Info
  productName: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    lineHeight: 32,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // ═══════════════════════════════════════════════════════════
  // ✅ DESCRIPTION WITH READ MORE
  // ═══════════════════════════════════════════════════════════
  descriptionSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    fontWeight: '500',
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '800',
  },

  // Seller Card
  sellerCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sellerName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  sellerLocation: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Reviews
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  reviewCount: {
    backgroundColor: COLORS.forestGreen + '20',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  reviewCountText: {
    fontSize: 12,
    fontWeight: '800',
  },
  loadingReviews: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  noReviewsCard: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  noReviewsText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 8,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 4,
  },
  reviewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reviewDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    marginTop: 8,
  },
  showMoreButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontWeight: '800',
  },

  // Gauges
  gaugesSection: {
    marginBottom: 24,
  },
  gaugesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gaugeCard: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  gaugeWeight: {
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 4,
  },
  gaugePrice: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  gaugePerKg: {
    fontSize: 12,
    fontWeight: '600',
  },

  // Quantity
  quantitySection: {
    marginBottom: 24,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 8,
    borderRadius: 12,
    maxWidth: 200,
  },
  qtyButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 18,
    fontWeight: '900',
    flex: 1,
    textAlign: 'center',
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
  },
  footerLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  footerPrice: {
    fontSize: 24,
    fontWeight: '900',
  },
  addToCartButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addToCartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  addToCartText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '900',
  },
});