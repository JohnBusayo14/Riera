import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  Easing,
  interpolate
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const SplashScreen = ({ onFinish }) => {
  // Animation values
  const nameOpacity = useSharedValue(0);
  const nameTranslateY = useSharedValue(20);
  const mottoOpacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    // 1. Animate Company Name
    nameOpacity.value = withTiming(1, { duration: 1000 });
    nameTranslateY.value = withTiming(0, { 
      duration: 1000, 
      easing: Easing.out(Easing.exp) 
    });

    // 2. Animate Motto with a slight delay
    mottoOpacity.value = withDelay(800, withTiming(1, { duration: 1200 }));
    
    // 3. Subtle background scale
    scale.value = withTiming(1, { duration: 1000 });

    // 4. Exit trigger
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const animatedNameStyle = useAnimatedStyle(() => ({
    opacity: nameOpacity.value,
    transform: [{ translateY: nameTranslateY.value }, { scale: scale.value }]
  }));

  const animatedMottoStyle = useAnimatedStyle(() => ({
    opacity: mottoOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, animatedNameStyle]}>
        <Text style={styles.brandName}>RieRa</Text>
        
        <View style={styles.dividerContainer}>
            <Animated.View style={[styles.divider, animatedMottoStyle]} />
        </View>

        <Animated.View style={animatedMottoStyle}>
          <Text style={styles.motto}>
            Fresh. <Text style={styles.dot}>Local.</Text> Authentic.
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004d2c', // Deep professional green
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  brandName: {
    fontSize: 58,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  dividerContainer: {
    height: 2,
    width: 40,
    marginVertical: 15,
    overflow: 'hidden',
  },
  divider: {
    height: '100%',
    backgroundColor: '#99e2b4', // Mint accent
    width: '100%',
  },
  motto: {
    fontSize: 16,
    color: '#d1d1d1',
    fontWeight: '400',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  dot: {
    color: '#99e2b4',
    fontWeight: 'bold',
  }
});

export default SplashScreen;