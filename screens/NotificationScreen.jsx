// import React, { useState, useEffect, useCallback } from 'react';
// import { 
//   View, Text, StyleSheet, FlatList, TouchableOpacity, 
//   ActivityIndicator, RefreshControl, LayoutAnimation, 
//   SafeAreaView, StatusBar, Platform, UIManager
// } from 'react-native';
// import { useNavigation } from '@react-navigation/native'; 
// import { 
//   ChevronDown, Trash2, Bell, ArrowLeft, Info, 
//   Wallet, Package, CheckCircle2, AlertCircle, Eye,
//   Settings, CheckCheck, Truck, ShieldCheck, Tag, CreditCard 
// } from 'lucide-react-native';
// import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';

// import { useTheme } from '../context/ThemeContext';
// import apiClient from '../services/apiClient'; 
// import { useAuth } from '../auth/AuthContext'; 
// import { usePusherNotifications } from '../hooks/usePusherNotifications'; 

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

// export default function NotificationScreen() {
//   const Navigation = useNavigation(); 
//   const { currentUser: CurrentUser } = useAuth(); 
//   const { isDark } = useTheme();
  
//   const [Notifications, SetNotifications] = useState([]);
//   const [Loading, SetLoading] = useState(true);
//   const [Refreshing, SetRefreshing] = useState(false);
//   const [ExpandedId, SetExpandedId] = useState(null); 

//   const UI_THEME = {
//     Background: isDark ? '#0F172A' : '#F8FAFC',
//     Surface: isDark ? '#1E293B' : '#FFFFFF',
//     TextPrimary: isDark ? '#F8FAFC' : '#1E293B',
//     TextSecondary: isDark ? '#94A3B8' : '#64748B',
//     Primary: '#008148',
//     Border: isDark ? '#334155' : '#E2E8F0',
//     Highlight: isDark ? 'rgba(0, 129, 72, 0.12)' : '#F0F9F4' 
//   };

//   const FetchNotifications = useCallback(async () => {
//     try {
//       const Response = await apiClient.get('/notifications');
//       const data = Array.isArray(Response.data) ? Response.data : [];
//       SetNotifications(data);
//     } catch (Err) {
//       console.error("Fetch Error:", Err);
//     } finally {
//       SetLoading(false);
//       SetRefreshing(false);
//     }
//   }, []);

//   useEffect(() => {
//     FetchNotifications();
//   }, [FetchNotifications]);

//   usePusherNotifications(CurrentUser?.id, (NewNoti) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    
//     const FormattedNoti = {
//       id: NewNoti.Id || NewNoti.id,
//       title: NewNoti.Title || NewNoti.title,
//       message: NewNoti.Message || NewNoti.message,
//       type: NewNoti.Type || NewNoti.type,
//       isRead: false,
//       relatedOrderId: NewNoti.OrderId || NewNoti.RelatedOrderId || NewNoti.orderId,
//       createdAt: new Date().toISOString()
//     };

//     SetNotifications(Prev => {
//         const filtered = Prev.filter(n => n.id !== FormattedNoti.id);
//         return [FormattedNoti, ...filtered];
//     });
//   });

//   const MarkAllAsRead = async () => {
//     try {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//       SetNotifications(Prev => Prev.map(n => ({ ...n, isRead: true })));
//       await apiClient.post('/notifications/mark-all-read');
//     } catch (Err) {
//       console.error("Mark All Read Error:", Err);
//     }
//   };

//   const ToggleAccordion = async (Item) => {
//     LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//     SetExpandedId(ExpandedId === Item.id ? null : Item.id);

//     if (!Item.isRead) {
//       try {
//         SetNotifications(Prev => 
//           Prev.map(N => N.id === Item.id ? { ...N, isRead: true } : N)
//         );
//         await apiClient.post(`/notifications/mark-read/${Item.id}`);
//       } catch (Err) {
//         console.error("Mark Read Error:", Err);
//       }
//     }
//   };

//   const HandleDelete = async (Id) => {
//     try {
//       LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
//       SetNotifications(Prev => Prev.filter(N => N.id !== Id));
//       await apiClient.delete(`/notifications/${Id}`);
//     } catch (Err) {
//       console.error("Delete Error:", Err);
//       FetchNotifications(); 
//     }
//   };

//   const renderRightActions = (itemId) => (
//     <TouchableOpacity 
//       style={styles.deleteSwipeAction} 
//       onPress={() => HandleDelete(itemId)}
//     >
//       <Trash2 size={22} color="#FFF" />
//       <Text style={styles.deleteSwipeText}>Delete</Text>
//     </TouchableOpacity>
//   );

//   const RenderItem = ({ item: Item }) => {
//     const IsExpanded = ExpandedId === Item.id;
//     const msg = (Item.message || '').toLowerCase();
//     const type = (Item.type || '').toLowerCase();

//     const getStatusConfig = () => {
//       if (msg.includes('delivered') || msg.includes('complete')) return { icon: <CheckCircle2 size={22} color="#10B981" />, bg: '#DCFCE7' };
//       if (msg.includes('cancel') || msg.includes('fail')) return { icon: <AlertCircle size={22} color="#EF4444" />, bg: '#FEE2E2' };
//       if (type === 'finance' || msg.includes('wallet')) return { icon: <CreditCard size={22} color="#F59E0B" />, bg: '#FEF3C7' };
//       if (type === 'logistics' || msg.includes('shipped')) return { icon: <Truck size={22} color="#3B82F6" />, bg: '#DBEAFE' };
//       if (msg.includes('promo') || msg.includes('off')) return { icon: <Tag size={22} color="#8B5CF6" />, bg: '#EDE9FE' };
//       return { icon: <Package size={22} color={UI_THEME.Primary} />, bg: isDark ? '#0F172A' : '#F1F5F9' };
//     };

//     const config = getStatusConfig();

//     return (
//       <Swipeable renderRightActions={() => renderRightActions(Item.id)} friction={2}>
//         <View style={[
//           styles.notiCard, 
//           { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border },
//           !Item.isRead && { backgroundColor: UI_THEME.Highlight, borderColor: UI_THEME.Primary + '40' }
//         ]}>
//           <TouchableOpacity 
//             style={styles.cardHeader}
//             onPress={() => ToggleAccordion(Item)}
//             activeOpacity={0.7}
//           >
//             <View style={[styles.iconBox, { backgroundColor: isDark ? '#0F172A' : config.bg, borderColor: UI_THEME.Border, borderWidth: 1 }]}>
//               {config.icon}
//             </View>
            
//             <View style={styles.content}>
//               <View style={styles.headerRow}>
//                 <Text style={[styles.notiTitle, { color: UI_THEME.TextPrimary }]} numberOfLines={1}>{Item.title}</Text>
//                 {!Item.isRead && <View style={[styles.unreadDot, { backgroundColor: UI_THEME.Primary }]} />}
//               </View>
//               <Text numberOfLines={1} style={[styles.notiPreview, { color: UI_THEME.TextSecondary }]}>{Item.message}</Text>
//               <Text style={styles.timeAgo}>
//                 {new Date(Item.createdAt).toLocaleDateString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
//               </Text>
//             </View>

//             <ChevronDown 
//               size={18} 
//               color={UI_THEME.TextSecondary} 
//               style={{ transform: [{ rotate: IsExpanded ? '180deg' : '0deg' }] }} 
//             />
//           </TouchableOpacity>

//           {IsExpanded && (
//             <View style={styles.expandedContent}>
//               <View style={[styles.detailBox, { backgroundColor: isDark ? '#0F172A' : '#FAFAFA', borderColor: UI_THEME.Border }]}>
//                 <Text style={[styles.notiMessage, { color: UI_THEME.TextPrimary }]}>{Item.message}</Text>
//                 <View style={styles.actionRow}>
//                   {/* Only show "Track Order" for BUYERS (not drivers or sellers) */}
//                   {Item.relatedOrderId && CurrentUser?.role?.toUpperCase() !== 'DRIVER' && CurrentUser?.role?.toUpperCase() !== 'SELLER' ? (
//                      <TouchableOpacity 
//                       style={[styles.viewOrderBtn, { backgroundColor: UI_THEME.Primary }]}
//                       onPress={() => Navigation.navigate('TrackingScreen', { orderId: Item.relatedOrderId })}
//                      >
//                        <Eye size={14} color="#FFF" />
//                        <Text style={styles.viewOrderText}>Track Order</Text>
//                      </TouchableOpacity>
//                   ) : <View />}
//                   <TouchableOpacity onPress={() => HandleDelete(Item.id)} style={styles.deleteCircle}>
//                     <Trash2 size={16} color="#EF4444" />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>
//       </Swipeable>
//     );
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaView style={[styles.container, { backgroundColor: UI_THEME.Background }]}>
//         <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
//         <View style={[styles.header, { backgroundColor: UI_THEME.Surface, borderBottomColor: UI_THEME.Border }]}>
//           <TouchableOpacity onPress={() => Navigation.goBack()} style={styles.backBtn}>
//             <ArrowLeft size={24} color={UI_THEME.TextPrimary} />
//           </TouchableOpacity>
//           <View style={styles.titleGroup}>
//             <Text style={[styles.headerTitle, { color: UI_THEME.TextPrimary }]}>Activity Feed</Text>
//             <Text style={styles.headerSub}>Real-time updates</Text>
//           </View>
//           <View style={styles.headerActions}>
//             <TouchableOpacity onPress={MarkAllAsRead} style={styles.actionIcon}>
//               <CheckCheck size={20} color={UI_THEME.Primary} />
//             </TouchableOpacity>
   
//           </View>
//         </View>

//         {Loading && !Refreshing ? (
//           <View style={styles.centered}> 
//             <ActivityIndicator size="large" color={UI_THEME.Primary} />
//           </View>
//         ) : (
//           <FlatList
//             data={Notifications}
//             keyExtractor={item => item.id.toString()}
//             renderItem={RenderItem}
//             contentContainerStyle={styles.list}
//             refreshControl={
//               <RefreshControl 
//                 refreshing={Refreshing} 
//                 onRefresh={() => { SetRefreshing(true); FetchNotifications(); }} 
//                 tintColor={UI_THEME.Primary} 
//               />
//             }
//             ListEmptyComponent={
//               <View style={styles.empty}>
//                 <Bell size={60} color={UI_THEME.Border} />
//                 <Text style={[styles.emptyText, { color: UI_THEME.TextSecondary }]}>No new activity</Text>
//               </View>
//             }
//           />
//         )}
//       </SafeAreaView>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, paddingTop: Platform.OS === 'android' ? 40 : 16 },
//   backBtn: { width: 40, height: 40, justifyContent: 'center' },
//   titleGroup: { flex: 1, marginLeft: 8 },
//   headerTitle: { fontSize: 20, fontWeight: '900' },
//   headerSub: { fontSize: 10, color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' },
//   headerActions: { flexDirection: 'row', gap: 4 },
//   actionIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
//   list: { padding: 16, paddingBottom: 100 },
//   centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
//   notiCard: { borderRadius: 20, marginBottom: 12, borderWidth: 1, overflow: 'hidden' },
//   cardHeader: { flexDirection: 'row', padding: 14, alignItems: 'center' },
//   iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
//   content: { flex: 1, marginLeft: 12, marginRight: 8 },
//   headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
//   notiTitle: { fontSize: 14, fontWeight: '800', flex: 1, marginRight: 10 },
//   unreadDot: { width: 8, height: 8, borderRadius: 4 },
//   notiPreview: { fontSize: 13, marginTop: 2, fontWeight: '500' },
//   timeAgo: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '700' },
//   expandedContent: { paddingHorizontal: 14, paddingBottom: 14 },
//   detailBox: { borderRadius: 12, padding: 14, borderWidth: 1 },
//   notiMessage: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
//   actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
//   viewOrderBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 8 },
//   viewOrderText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
//   deleteCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(239, 68, 68, 0.08)', justifyContent: 'center', alignItems: 'center' },
//   empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 120 },
//   emptyText: { marginTop: 15, fontSize: 16, fontWeight: '800' },
//   deleteSwipeAction: { backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', width: 80, height: '88%', borderRadius: 20, marginBottom: 12 },
//   deleteSwipeText: { color: '#FFF', fontSize: 10, fontWeight: '800', marginTop: 4 }
// });










import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, 
  ActivityIndicator, RefreshControl, LayoutAnimation, 
  SafeAreaView, StatusBar, Platform, UIManager, Vibration
} from 'react-native';

import * as ExpoNotifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native'; 
import { 
  ChevronDown, Trash2, Bell, ArrowLeft, Info, 
  Wallet, Package, CheckCircle2, AlertCircle, Eye,
  Settings, CheckCheck, Truck, ShieldCheck, Tag, CreditCard 
} from 'lucide-react-native';
import { Swipeable, GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message'; // ✅ For in-app toast notifications


import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient'; 
import { useAuth } from '../auth/AuthContext'; 
import { usePusherNotifications } from '../hooks/usePusherNotifications'; 

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function NotificationScreen() {
  const Navigation = useNavigation(); 
  const { currentUser: CurrentUser } = useAuth(); 
  const { isDark } = useTheme();
  
  const [Notifications, SetNotifications] = useState([]);
  const [Loading, SetLoading] = useState(true);
  const [Refreshing, SetRefreshing] = useState(false);
  const [ExpandedId, SetExpandedId] = useState(null); 

  const UI_THEME = {
    Background: isDark ? '#0F172A' : '#F8FAFC',
    Surface: isDark ? '#1E293B' : '#FFFFFF',
    TextPrimary: isDark ? '#F8FAFC' : '#1E293B',
    TextSecondary: isDark ? '#94A3B8' : '#64748B',
    Primary: '#008148',
    Border: isDark ? '#334155' : '#E2E8F0',
    Highlight: isDark ? 'rgba(0, 129, 72, 0.12)' : '#F0F9F4' 
  };

  const FetchNotifications = useCallback(async () => {
    try {
      const Response = await apiClient.get('/notifications');
      const data = Array.isArray(Response.data) ? Response.data : [];
      SetNotifications(data);
    } catch (Err) {
      console.error("Fetch Error:", Err);
    } finally {
      SetLoading(false);
      SetRefreshing(false);
    }
  }, []);

  useEffect(() => {
    FetchNotifications();
  }, [FetchNotifications]);

usePusherNotifications(CurrentUser?.id, async (NewNoti) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  
  const FormattedNoti = {
    id: NewNoti.Id || NewNoti.id,
    title: NewNoti.Title || NewNoti.title,
    message: NewNoti.Message || NewNoti.message,
    type: NewNoti.Type || NewNoti.type,
    isRead: false,
    relatedOrderId: NewNoti.OrderId || NewNoti.RelatedOrderId || NewNoti.orderId,
    createdAt: new Date().toISOString()
  };

  // Update State: Remove duplicate if exists and add new one to the top
  SetNotifications(Prev => {
      const filtered = Prev.filter(n => n.id !== FormattedNoti.id);
      return [FormattedNoti, ...filtered];
  });

  // ✅ WhatsApp double buzz
  Vibration.vibrate([0, 100, 50, 100]); 

  // ✅ Use ExpoNotifications (renamed import) to play sound and show banner
  try {
    await ExpoNotifications.scheduleNotificationAsync({
      content: {
        title: FormattedNoti.title,
        body: FormattedNoti.message,
        sound: 'doorbell.wav', // Ensure this is in assets and app.json
        data: { orderId: FormattedNoti.relatedOrderId },
      },
      trigger: null, 
    });
  } catch (error) {
    console.error("Local notification error:", error);
  }

  // Determine Toast Type
  const notificationType = FormattedNoti.type?.toLowerCase() || 'info';
  const toastType = ['order', 'finance', 'success', 'whatsapp'].includes(notificationType) 
    ? notificationType 
    : 'info';

  Toast.show({
    type: toastType,
    text1: FormattedNoti.title,
    text2: FormattedNoti.message,
    position: 'top',
    topOffset: Platform.OS === 'ios' ? 60 : 40, 
    visibilityTime: 4000,
    autoHide: true,
  });
});

  const MarkAllAsRead = async () => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      SetNotifications(Prev => Prev.map(n => ({ ...n, isRead: true })));
      await apiClient.post('/notifications/mark-all-read');
    } catch (Err) {
      console.error("Mark All Read Error:", Err);
    }
  };

  const ToggleAccordion = async (Item) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    SetExpandedId(ExpandedId === Item.id ? null : Item.id);

    if (!Item.isRead) {
      try {
        SetNotifications(Prev => 
          Prev.map(N => N.id === Item.id ? { ...N, isRead: true } : N)
        );
        await apiClient.post(`/notifications/mark-read/${Item.id}`);
      } catch (Err) {
        console.error("Mark Read Error:", Err);
      }
    }
  };

  const HandleDelete = async (Id) => {
    try {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      SetNotifications(Prev => Prev.filter(N => N.id !== Id));
      await apiClient.delete(`/notifications/${Id}`);
    } catch (Err) {
      console.error("Delete Error:", Err);
      FetchNotifications(); 
    }
  };

  const renderRightActions = (itemId) => (
    <TouchableOpacity 
      style={styles.deleteSwipeAction} 
      onPress={() => HandleDelete(itemId)}
    >
      <Trash2 size={22} color="#FFF" />
      <Text style={styles.deleteSwipeText}>Delete</Text>
    </TouchableOpacity>
  );

  const RenderItem = ({ item: Item }) => {
    const IsExpanded = ExpandedId === Item.id;
    const msg = (Item.message || '').toLowerCase();
    const type = (Item.type || '').toLowerCase();

    const getStatusConfig = () => {
      if (msg.includes('delivered') || msg.includes('complete')) return { icon: <CheckCircle2 size={22} color="#10B981" />, bg: '#DCFCE7' };
      if (msg.includes('cancel') || msg.includes('fail')) return { icon: <AlertCircle size={22} color="#EF4444" />, bg: '#FEE2E2' };
      if (type === 'finance' || msg.includes('wallet')) return { icon: <CreditCard size={22} color="#F59E0B" />, bg: '#FEF3C7' };
      if (type === 'logistics' || msg.includes('shipped')) return { icon: <Truck size={22} color="#3B82F6" />, bg: '#DBEAFE' };
      if (msg.includes('promo') || msg.includes('off')) return { icon: <Tag size={22} color="#8B5CF6" />, bg: '#EDE9FE' };
      return { icon: <Package size={22} color={UI_THEME.Primary} />, bg: isDark ? '#0F172A' : '#F1F5F9' };
    };

    const config = getStatusConfig();

    return (
      <Swipeable renderRightActions={() => renderRightActions(Item.id)} friction={2}>
        <View style={[
          styles.notiCard, 
          { backgroundColor: UI_THEME.Surface, borderColor: UI_THEME.Border },
          !Item.isRead && { backgroundColor: UI_THEME.Highlight, borderColor: UI_THEME.Primary + '40' }
        ]}>
          <TouchableOpacity 
            style={styles.cardHeader}
            onPress={() => ToggleAccordion(Item)}
            activeOpacity={0.7}
          >
            <View style={[styles.iconBox, { backgroundColor: isDark ? '#0F172A' : config.bg, borderColor: UI_THEME.Border, borderWidth: 1 }]}>
              {config.icon}
            </View>
            
            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text style={[styles.notiTitle, { color: UI_THEME.TextPrimary }]} numberOfLines={1}>{Item.title}</Text>
                {!Item.isRead && <View style={[styles.unreadDot, { backgroundColor: UI_THEME.Primary }]} />}
              </View>
              <Text numberOfLines={1} style={[styles.notiPreview, { color: UI_THEME.TextSecondary }]}>{Item.message}</Text>
              <Text style={styles.timeAgo}>
                {new Date(Item.createdAt).toLocaleDateString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>

            <ChevronDown 
              size={18} 
              color={UI_THEME.TextSecondary} 
              style={{ transform: [{ rotate: IsExpanded ? '180deg' : '0deg' }] }} 
            />
          </TouchableOpacity>

          {IsExpanded && (
            <View style={styles.expandedContent}>
              <View style={[styles.detailBox, { backgroundColor: isDark ? '#0F172A' : '#FAFAFA', borderColor: UI_THEME.Border }]}>
                <Text style={[styles.notiMessage, { color: UI_THEME.TextPrimary }]}>{Item.message}</Text>
                <View style={styles.actionRow}>
                  {/* Only show "Track Order" for BUYERS (not drivers or sellers) */}
                  {Item.relatedOrderId && CurrentUser?.role?.toUpperCase() !== 'DRIVER' && CurrentUser?.role?.toUpperCase() !== 'SELLER' ? (
                     <TouchableOpacity 
                      style={[styles.viewOrderBtn, { backgroundColor: UI_THEME.Primary }]}
                      onPress={() => Navigation.navigate('TrackingScreen', { orderId: Item.relatedOrderId })}
                     >
                       <Eye size={14} color="#FFF" />
                       <Text style={styles.viewOrderText}>Track Order</Text>
                     </TouchableOpacity>
                  ) : <View />}
                  <TouchableOpacity onPress={() => HandleDelete(Item.id)} style={styles.deleteCircle}>
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      </Swipeable>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={[styles.container, { backgroundColor: UI_THEME.Background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { backgroundColor: UI_THEME.Surface, borderBottomColor: UI_THEME.Border }]}>
          <TouchableOpacity onPress={() => Navigation.goBack()} style={styles.backBtn}>
            <ArrowLeft size={24} color={UI_THEME.TextPrimary} />
          </TouchableOpacity>
          <View style={styles.titleGroup}>
            <Text style={[styles.headerTitle, { color: UI_THEME.TextPrimary }]}>Activity Feed</Text>
            <Text style={styles.headerSub}>Real-time updates</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={MarkAllAsRead} style={styles.actionIcon}>
              <CheckCheck size={20} color={UI_THEME.Primary} />
            </TouchableOpacity>
   
          </View>
        </View>

        {Loading && !Refreshing ? (
          <View style={styles.centered}> 
            <ActivityIndicator size="large" color={UI_THEME.Primary} />
          </View>
        ) : (
          <FlatList
            data={Notifications}
            keyExtractor={item => item.id.toString()}
            renderItem={RenderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl 
                refreshing={Refreshing} 
                onRefresh={() => { SetRefreshing(true); FetchNotifications(); }} 
                tintColor={UI_THEME.Primary} 
              />
            }
            ListEmptyComponent={
              <View style={styles.empty}>
                <Bell size={60} color={UI_THEME.Border} />
                <Text style={[styles.emptyText, { color: UI_THEME.TextSecondary }]}>No new activity</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, paddingTop: Platform.OS === 'android' ? 40 : 16 },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  titleGroup: { flex: 1, marginLeft: 8 },
  headerTitle: { fontSize: 20, fontWeight: '900' },
  headerSub: { fontSize: 10, color: '#94A3B8', fontWeight: '800', textTransform: 'uppercase' },
  headerActions: { flexDirection: 'row', gap: 4 },
  actionIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  list: { padding: 16, paddingBottom: 100 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  notiCard: { borderRadius: 20, marginBottom: 12, borderWidth: 1, overflow: 'hidden' },
  cardHeader: { flexDirection: 'row', padding: 14, alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  content: { flex: 1, marginLeft: 12, marginRight: 8 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  notiTitle: { fontSize: 14, fontWeight: '800', flex: 1, marginRight: 10 },
  unreadDot: { width: 8, height: 8, borderRadius: 4 },
  notiPreview: { fontSize: 13, marginTop: 2, fontWeight: '500' },
  timeAgo: { fontSize: 10, color: '#94A3B8', marginTop: 4, fontWeight: '700' },
  expandedContent: { paddingHorizontal: 14, paddingBottom: 14 },
  detailBox: { borderRadius: 12, padding: 14, borderWidth: 1 },
  notiMessage: { fontSize: 14, lineHeight: 20, fontWeight: '500' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
  viewOrderBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 8 },
  viewOrderText: { color: '#FFF', fontSize: 12, fontWeight: '900' },
  deleteCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(239, 68, 68, 0.08)', justifyContent: 'center', alignItems: 'center' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 120 },
  emptyText: { marginTop: 15, fontSize: 16, fontWeight: '800' },
  deleteSwipeAction: { backgroundColor: '#EF4444', justifyContent: 'center', alignItems: 'center', width: 80, height: '88%', borderRadius: 20, marginBottom: 12 },
  deleteSwipeText: { color: '#FFF', fontSize: 10, fontWeight: '800', marginTop: 4 }
});