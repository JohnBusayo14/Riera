import React, { useState, useEffect } from 'react';
import { Image, View, ActivityIndicator, StyleSheet } from 'react-native';
import { getValidUri } from '../utils/helpers';

const SafeImage = ({ uri, style, placeholderIcon: PlaceholderIcon, ...props }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset error state if the URI changes (useful for profile updates)
  useEffect(() => {
    setHasError(false);
  }, [uri]);

  const validUri = getValidUri(uri);

  // If the URI is invalid or an error occurred, return null.
  // This is CRITICAL because it allows the ProfileScreen's 
  // <Text>{initial}</Text> background to be visible.
  if (!validUri || hasError) {
    return null;
  }

  return (
    <View style={[style, { overflow: 'hidden' }]}>
      <Image
        {...props}
        source={{ uri: validUri }}
        // We use absoluteFill to cover the parent, 
        // but we remove the extra 'style' array here to avoid conflicts
        style={StyleSheet.absoluteFill} 
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(e) => {
          console.warn("SafeImage Load Error for:", validUri);
          setHasError(true);
          setIsLoading(false);
        }}
      />
      
      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loaderContainer]}>
          <ActivityIndicator size="small" color="#008148" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9', // Solid background during load prevents "flashing"
  }
});

export default SafeImage;