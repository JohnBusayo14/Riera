import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { 
  View, Text, StyleSheet, FlatList, Image, 
  TouchableOpacity, ActivityIndicator, SafeAreaView, 
  Alert, RefreshControl, StatusBar, Dimensions, TextInput 
} from 'react-native';
import { 
  ChevronLeft, Package, Search, Filter, 
  Plus, Trash2, Layers, EyeOff, Eye, X
} from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import apiClient from '../services/apiClient';
import EditProductModal from './EditProductModal'; 

const { width } = Dimensions.get('window');

const Inventory = ({ navigation }) => {
  const { colors: Colors, isDark: IsDark } = useTheme();

  const [Products, setProducts] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [Refreshing, setRefreshing] = useState(false);
  const [SearchQuery, setSearchQuery] = useState(''); 
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const UI = {
    Bg: IsDark ? '#0F172A' : '#F8FAFC',
    Card: IsDark ? '#1E293B' : '#FFFFFF',
    Text: IsDark ? '#F8FAFC' : '#0F172A',
    Muted: IsDark ? '#94A3B8' : '#64748B',
    Primary: '#008148',
    Border: IsDark ? '#334155' : '#E2E8F0',
    Danger: '#EF4444',
    Accent: IsDark ? '#0F172A' : '#f1f5f9'
  };

  const FetchInventory = async () => {
    try {
      const Response = await apiClient.get('/Products/seller/my-products');
      // Logic check: Ensure we are receiving an array
      setProducts(Array.isArray(Response.data) ? Response.data : []);
    } catch (Err) {
      console.error("Fetch error:", Err);
      Alert.alert("Sync Error", "Could not refresh inventory from the server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { FetchInventory(); }, []);

  const OnRefresh = useCallback(() => {
    setRefreshing(true);
    FetchInventory();
  }, []);

  const FilteredProducts = useMemo(() => {
    if (!SearchQuery.trim()) return Products;
    return Products.filter(p => 
      p.label?.toLowerCase().includes(SearchQuery.toLowerCase()) || 
      p.category?.toLowerCase().includes(SearchQuery.toLowerCase())
    );
  }, [SearchQuery, Products]);

  const HandleDelete = (Id, Label) => {
    Alert.alert(
      "Remove Product",
      `Are you sure you want to delete "${Label}"?`,
      [
        { text: "Keep", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: async () => {
            try {
              await apiClient.delete(`/Products/seller/delete/${Id}`);
              setProducts(Prev => Prev.filter(P => P.id !== Id));
            } catch (Err) {
              Alert.alert("Restricted", "Cannot delete items with active pending orders.");
            }
          } 
        }
      ]
    );
  };

  const RenderProduct = ({ item: Item }) => (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={[styles.ProductCard, { backgroundColor: UI.Card, borderColor: UI.Border }]}
      onPress={() => {
        setSelectedProductId(Item.id);
        setEditModalVisible(true);
      }}
    >
      <View style={styles.ImageWrapper}>
        <Image 
          // FIX: Added safe check for thumbnail URL and fallback
          source={{ 
            uri: (Item.thumbnail && Item.thumbnail.length > 5) 
              ? Item.thumbnail 
              : 'https://via.placeholder.com/150' 
          }} 
          style={[styles.ProductImg, { backgroundColor: UI.Bg }]} 
          resizeMode="cover"
        />
        <View style={[styles.StatusPill, { 
            backgroundColor: Item.isAvailable ? (IsDark ? '#064E3B' : '#DCFCE7') : (IsDark ? '#7F1D1D' : '#FEE2E2'), 
            borderColor: UI.Card 
        }]}>
          {Item.isAvailable ? <Eye size={10} color="#16A34A" /> : <EyeOff size={10} color="#EF4444" />}
          <Text style={[styles.StatusLabel, { color: Item.isAvailable ? '#16A34A' : '#EF4444' }]}>
            {Item.isAvailable ? 'LIVE' : 'HIDDEN'}
          </Text>
        </View>
      </View>

      <View style={styles.ProductContent}>
        <View style={styles.MetaRow}>
          <Text style={[styles.CategoryTag, { color: UI.Primary }]}>{Item.category}</Text>
          <TouchableOpacity onPress={() => HandleDelete(Item.id, Item.label)} style={styles.DeleteIcon}>
            <Trash2 size={16} color={UI.Muted} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.ProductName, { color: UI.Text }]} numberOfLines={1}>{Item.label}</Text>
        
        <View style={styles.PriceStockRow}>
            <View>
                <Text style={[styles.PriceVal, { color: UI.Text }]}>{Item.priceRange}</Text>
                <Text style={[styles.CurrencyLabel, { color: UI.Muted }]}>Price Range</Text>
            </View>
            <View style={[styles.StockBadge, { backgroundColor: UI.Accent }]}>
                <Layers size={14} color={UI.Primary} />
                <Text style={[styles.StockNum, { color: UI.Text }]}>{Item.stockCount} SKUs</Text>
            </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleEdit = (id) => {
  setSelectedProductId(id); // 1. Set the ID first
  setEditModalVisible(true); // 2. Then show the modal
};
  return (
    <SafeAreaView style={[styles.Main, { backgroundColor: UI.Bg }]}>
      <StatusBar barStyle={IsDark ? 'light-content' : 'dark-content'} />
      
      <View style={[styles.Header, { borderBottomColor: UI.Border, backgroundColor: UI.Card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.CircularBtn}>
          <ChevronLeft color={UI.Text} size={24} />
        </TouchableOpacity>
        <View style={styles.TitleArea}>
          <Text style={[styles.Title, { color: UI.Text }]}>Catalog</Text>
          <Text style={[styles.Subtitle, { color: UI.Muted }]}>{Products.length} items listed</Text>
        </View>
        <TouchableOpacity 
            style={[styles.AddButton, { backgroundColor: UI.Primary }]} 
            onPress={() => navigation.navigate('AddProduct')}
        >
          <Plus color="white" size={20} />
          <Text style={styles.AddButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.SearchSection}>
        <View style={[styles.SearchBar, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
            <Search size={18} color={UI.Muted} />
            <TextInput 
              style={[styles.Input, { color: UI.Text }]}
              placeholder="Search inventory..."
              placeholderTextColor={UI.Muted}
              value={SearchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {SearchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={UI.Muted} />
              </TouchableOpacity>
            )}
        </View>
        <TouchableOpacity style={[styles.ConfigBtn, { backgroundColor: UI.Card, borderColor: UI.Border }]}>
            <Filter size={18} color={UI.Primary} />
        </TouchableOpacity>
      </View>

      {Loading ? (
        <View style={styles.Loader}>
          <ActivityIndicator size="large" color={UI.Primary} />
        </View>
      ) : (
        <FlatList
          data={FilteredProducts}
          keyExtractor={(I) => I.id.toString()}
          renderItem={RenderProduct}
          contentContainerStyle={styles.ListContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={Refreshing} onRefresh={OnRefresh} tintColor={UI.Primary} />}
          ListEmptyComponent={
            <View style={styles.EmptyWrapper}>
              <Package size={60} color={UI.Border} />
              <Text style={[styles.EmptyTitle, { color: UI.Text }]}>
                {SearchQuery ? "No results found" : "No Produce Listed"}
              </Text>
              <Text style={[styles.EmptyBody, { color: UI.Muted }]}>
                {SearchQuery 
                  ? `We couldn't find anything matching "${SearchQuery}"`
                  : "Start selling by adding your first farm-fresh product."}
              </Text>
            </View>
          }
        />
      )}

     <EditProductModal 
  visible={editModalVisible} 
  productId={selectedProductId} // Passing the actual ID here
  onClose={() => setEditModalVisible(false)}
  onUpdateSuccess={FetchInventory}
  UI={UI} // Pass your theme mapping
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Main: { flex: 1 },
  Loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  Header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15, 
    borderBottomWidth: 1 
  },
  CircularBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  TitleArea: { flex: 1, marginLeft: 10 },
  Title: { fontSize: 22, fontWeight: '900' },
  Subtitle: { fontSize: 12, fontWeight: '600' },
  AddButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 20,
    gap: 5
  },
  AddButtonText: { color: 'white', fontWeight: '800', fontSize: 14 },
  SearchSection: { flexDirection: 'row', padding: 20, gap: 10 },
  SearchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, height: 48, borderRadius: 14, borderWidth: 1, gap: 10 },
  Input: { flex: 1, height: '100%', fontSize: 14, fontWeight: '600' },
  ConfigBtn: { width: 48, height: 48, borderRadius: 14, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  ListContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  ProductCard: { 
    borderRadius: 24, 
    borderWidth: 1, 
    marginBottom: 16, 
    overflow: 'hidden',
    padding: 12,
    flexDirection: 'row',
    gap: 15
  },
  ImageWrapper: { position: 'relative' },
  ProductImg: { width: 90, height: 90, borderRadius: 18 },
  StatusPill: { 
    position: 'absolute', 
    bottom: -5, 
    alignSelf: 'center',
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 10,
    borderWidth: 2,
    gap: 4
  },
  StatusLabel: { fontSize: 9, fontWeight: '900' },
  ProductContent: { flex: 1, justifyContent: 'space-between' },
  MetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  CategoryTag: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  DeleteIcon: { padding: 4 },
  ProductName: { fontSize: 17, fontWeight: '800', marginVertical: 2 },
  PriceStockRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  PriceVal: { fontSize: 15, fontWeight: '900' },
  CurrencyLabel: { fontSize: 10, fontWeight: '600' },
  StockBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, gap: 6 },
  StockNum: { fontSize: 11, fontWeight: '800' },
  EmptyWrapper: { alignItems: 'center', marginTop: 100, paddingHorizontal: 40 },
  EmptyTitle: { fontSize: 20, fontWeight: '900', marginTop: 20 },
  EmptyBody: { textAlign: 'center', marginTop: 10, fontSize: 14, lineHeight: 20, fontWeight: '600' }
});

export default Inventory;