
import React, { useState, useRef, useEffect } from 'react';
import { 
  View, StyleSheet, Animated, Dimensions, Alert, 
  ActivityIndicator, Text, Platform 
} from 'react-native';
import * as Location from 'expo-location';
import { COLORS } from '../../constants';
import apiClient from '../../services/apiClient';
import { useAuth } from '../../auth/AuthContext';

// Modular Step Components
import MarketplaceDestinationStep from '../components/MarketplaceDestinationStep'; // Swapped from RouteStep
import ReceiverStep from '../../order/components/ReceiverStep';
import MarketplaceQuoteStep from '../components/MarketplaceQuoteStep';

const { width } = Dimensions.get('window');

export default function MarketplaceLocalRequestScreen({ route, navigation, onBack }) {
  const { cartData } = route.params || {};
  const { currentUser } = useAuth();

  // --- STATE MANAGEMENT ---
  const [ActiveStep, setActiveStep] = useState(1);
  const [IsProcessing, setIsProcessing] = useState(false);
  const [IsLocationFetching, setIsLocationFetching] = useState(true);
  const [WalletBalance, setWalletBalance] = useState(0);
  const SlideAnimation = useRef(new Animated.Value(0)).current;

  const [FormData, setFormData] = useState({ 
    produce: 'Marketplace Purchase', 
    weight: cartData?.totalWeight?.toString() || '0',
    items: cartData?.items || [],
    pickup: 'Agro Central Hub', 
    dropoff: 'Fetching location...',
    latitude: null,
    longitude: null,
    receiverName: '',
    receiverPhone: '',
  });

  // --- LOCATION LOGIC ---
  const GetUserLocation = async () => {
    try {
      setIsLocationFetching(true);
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "Location access is needed for delivery.");
        setFormData(Prev => ({ ...Prev, dropoff: '' }));
        return;
      }

      let CurrentPos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      let GeoResult = await Location.reverseGeocodeAsync({
        latitude: CurrentPos.coords.latitude,
        longitude: CurrentPos.coords.longitude,
      });

      if (GeoResult.length > 0) {
        const Addr = GeoResult[0];
        const ReadableAddress = `${Addr.name || ''} ${Addr.street || ''}, ${Addr.city || Addr.subregion || ''}`.trim();
        
        setFormData(Prev => ({
          ...Prev,
          dropoff: ReadableAddress,
          latitude: CurrentPos.coords.latitude,
          longitude: CurrentPos.coords.longitude
        }));
      }
    } catch (Error) {
      console.error("Location Error:", Error);
    } finally {
      setIsLocationFetching(false);
    }
  };

  useEffect(() => {
    GetUserLocation();
    // fetchWalletBalance() logic here...
  }, []);

  // --- NAVIGATION ---
  const HandleNextStep = () => {
    if (ActiveStep < 3) {
      const NewStep = ActiveStep + 1;
      setActiveStep(NewStep);
      Animated.timing(SlideAnimation, {
        toValue: -width * (NewStep - 1),
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  };
const handleTopUp = (shortfall) => {
    // Navigate to your Wallet/TopUp screen 
    // You can pass the shortfall amount so the top-up screen pre-fills it
    navigation.navigate('Wallet', { 
      screen: 'TopUp', 
      params: { amount: shortfall } 
    });
  };
  const HandlePrevStep = () => {
    if (ActiveStep > 1) {
      const NewStep = ActiveStep - 1;
      setActiveStep(NewStep);
      Animated.timing(SlideAnimation, {
        toValue: -width * (NewStep - 1),
        duration: 350,
        useNativeDriver: true,
      }).start();
    } else {
      onBack();
    }
  };

  return (
    <View style={styles.MainContainer}>
      <Animated.View style={[styles.WizardWrapper, { transform: [{ translateX: SlideAnimation }] }]}>
        
        {/* STEP 1: New Animated Destination Step */}
        <View style={{ width }}>
          <MarketplaceDestinationStep 
            Form={FormData} 
            setForm={setFormData} 
            onNext={HandleNextStep} 
            onBack={HandlePrevStep}
            onRefreshLocation={GetUserLocation}
          />
        </View>
        
        {/* STEP 2: Receiver Info */}
        <View style={{ width }}>
          <ReceiverStep 
            form={FormData} 
            setForm={setFormData} 
            onNext={HandleNextStep} 
          />
        </View>
        
        {/* STEP 3: Final Quote */}
        <View style={{ width }}>
          <MarketplaceQuoteStep 
            form={FormData} 
            walletBalance={WalletBalance}
            cartData={{ items: FormData.items }}
            onConfirm={(data) => console.log("Submit", data)} 
            navigation={navigation}
            onTopUp={handleTopUp}
            activeStep={ActiveStep} // <-- Pass this down
            onEdit={() => {
              setActiveStep(1);
              Animated.timing(SlideAnimation, { toValue: 0, duration: 300, useNativeDriver: true }).start();
            }} 
          />
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  MainContainer: { flex: 1, backgroundColor: 'white' },
  WizardWrapper: { flexDirection: 'row', flex: 1 },
});