// screens/marketplace/ReviewsScreen.jsx
// ⭐ Product Reviews Screen

import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  SafeAreaView, StatusBar, Image, ScrollView
} from 'react-native';
import {
  ArrowLeft, Star, ChevronDown, Check, Image as ImageIcon,
  ThumbsUp, MessageCircle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../theme/designSystem';

export default function ReviewsScreen({ route, navigation }) {
  const { product } = route.params;
  const { isDark } = useTheme();
  const theme = useMemo(() => getTheme(isDark), [isDark]);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Most recent');

  // Mock reviews data
  const reviews = [
    {
      id: 1,
      user: 'Sarah M.',
      avatar: 'SM',
      rating: 5,
      date: '15 Jan 2026',
      verified: true,
      comment: 'Excellent quality! The product arrived exactly as described. Very happy with my purchase.',
      helpful: 24,
      images: [
        'https://via.placeholder.com/200',
        'https://via.placeholder.com/200',
      ],
      variant: 'Color: Black, Size: 42',
    },
    {
      id: 2,
      user: 'John D.',
      avatar: 'JD',
      rating: 4,
      date: '12 Jan 2026',
      verified: true,
      comment: 'Good product but shipping took longer than expected. Quality is great though!',
      helpful: 15,
      images: [],
      variant: 'Color: Brown, Size: 40',
    },
    {
      id: 3,
      user: 'Lisa K.',
      avatar: 'LK',
      rating: 5,
      date: '8 Jan 2026',
      verified: true,
      comment: 'Love it! Fits perfectly and very comfortable. Highly recommend!',
      helpful: 42,
      images: [
        'https://via.placeholder.com/200',
      ],
      variant: 'Color: Beige, Size: 39',
    },
    {
      id: 4,
      user: 'Michael P.',
      avatar: 'MP',
      rating: 3,
      date: '5 Jan 2026',
      verified: false,
      comment: 'Average quality. Expected better based on the price.',
      helpful: 8,
      images: [],
      variant: 'Color: Black, Size: 43',
    },
  ];

  const ratingBreakdown = [
    { stars: 5, count: 156, percentage: 65 },
    { stars: 4, count: 48, percentage: 20 },
    { stars: 3, count: 24, percentage: 10 },
    { stars: 2, count: 8, percentage: 3 },
    { stars: 1, count: 4, percentage: 2 },
  ];

  const filters = ['All', '5 stars', '4 stars', 'With photos', 'Verified'];
  const sortOptions = ['Most recent', 'Most helpful', 'Highest rated', 'Lowest rated'];

  const filteredReviews = useMemo(() => {
    return reviews.filter(review => {
      if (selectedFilter === 'All') return true;
      if (selectedFilter === '5 stars') return review.rating === 5;
      if (selectedFilter === '4 stars') return review.rating === 4;
      if (selectedFilter === 'With photos') return review.images.length > 0;
      if (selectedFilter === 'Verified') return review.verified;
      return true;
    });
  }, [reviews, selectedFilter]);

  const ReviewCard = ({ review }) => (
    <View style={[styles.reviewCard, { backgroundColor: theme.colors.card }, theme.shadows.sm]}>
      {/* Header */}
      <View style={styles.reviewHeader}>
        <View style={[styles.avatar, { backgroundColor: theme.colors.primary + '20' }]}>
          <Text style={[styles.avatarText, { color: theme.colors.primary }]}>
            {review.avatar}
          </Text>
        </View>

        <View style={styles.reviewerInfo}>
          <View style={styles.reviewerNameRow}>
            <Text style={[theme.typography.bodyLarge, { color: theme.colors.textPrimary }]}>
              {review.user}
            </Text>
            {review.verified && (
              <View style={styles.verifiedBadge}>
                <Check size={10} color="#FFF" strokeWidth={3} />
              </View>
            )}
          </View>
          <Text style={[styles.reviewDate, { color: theme.colors.textMuted }]}>
            {review.date}
          </Text>
        </View>
      </View>

      {/* Rating */}
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            size={14}
            color="#F59E0B"
            fill={star <= review.rating ? '#F59E0B' : 'none'}
            strokeWidth={star <= review.rating ? 0 : 2}
          />
        ))}
      </View>

      {/* Variant */}
      <Text style={[styles.variantText, { color: theme.colors.textMuted }]}>
        {review.variant}
      </Text>

      {/* Comment */}
      <Text style={[styles.comment, { color: theme.colors.textPrimary }]}>
        {review.comment}
      </Text>

      {/* Images */}
      {review.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.reviewImages}>
            {review.images.map((img, index) => (
              <TouchableOpacity key={index} style={styles.reviewImageContainer}>
                <Image source={{ uri: img }} style={styles.reviewImage} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Actions */}
      <View style={styles.reviewActions}>
        <TouchableOpacity style={styles.actionButton}>
          <ThumbsUp size={16} color={theme.colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            Helpful ({review.helpful})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={16} color={theme.colors.textSecondary} strokeWidth={2} />
          <Text style={[styles.actionText, { color: theme.colors.textSecondary }]}>
            Reply
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft size={24} color={theme.colors.textPrimary} strokeWidth={2.5} />
        </TouchableOpacity>
        <Text style={[theme.typography.h3, { color: theme.colors.textPrimary }]}>
          Reviews
        </Text>
        <View style={{ width: 44 }} />
      </View>

      {/* Rating Overview */}
      <View style={[styles.overviewSection, { backgroundColor: theme.colors.card }]}>
        <View style={styles.overviewLeft}>
          <Text style={[styles.bigRating, { color: theme.colors.textPrimary }]}>
            {product.rating}
          </Text>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map(star => (
              <Star
                key={star}
                size={18}
                color="#F59E0B"
                fill={star <= Math.floor(product.rating) ? '#F59E0B' : 'none'}
                strokeWidth={star <= Math.floor(product.rating) ? 0 : 2}
              />
            ))}
          </View>
          <Text style={[styles.reviewsCount, { color: theme.colors.textMuted }]}>
            {product.reviews} reviews
          </Text>
        </View>

        <View style={styles.breakdownBars}>
          {ratingBreakdown.map(item => (
            <View key={item.stars} style={styles.barRow}>
              <Text style={[styles.barLabel, { color: theme.colors.textSecondary }]}>
                {item.stars}★
              </Text>
              <View style={[styles.barTrack, { backgroundColor: theme.colors.surface }]}>
                <View 
                  style={[
                    styles.barFill, 
                    { 
                      width: `${item.percentage}%`,
                      backgroundColor: theme.colors.primary 
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.barCount, { color: theme.colors.textMuted }]}>
                {item.count}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {filters.map(filter => {
              const isActive = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.filterChip,
                    { 
                      backgroundColor: isActive ? theme.colors.primary : theme.colors.surface,
                      borderColor: isActive ? theme.colors.primary : theme.colors.border,
                    }
                  ]}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[
                    styles.filterText,
                    { color: isActive ? '#FFF' : theme.colors.textSecondary }
                  ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <TouchableOpacity style={[styles.sortButton, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.sortText, { color: theme.colors.textPrimary }]}>
            {sortBy}
          </Text>
          <ChevronDown size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Reviews List */}
      <FlatList
        data={filteredReviews}
        renderItem={({ item }) => <ReviewCard review={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[theme.typography.h3, { color: theme.colors.textMuted }]}>
              No reviews found
            </Text>
          </View>
        }
      />

      {/* Write Review Button */}
      <TouchableOpacity 
        style={[styles.writeReviewButton, { backgroundColor: theme.colors.primary }, theme.shadows.lg]}
      >
        <Text style={styles.writeReviewText}>Write a Review</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Overview
  overviewSection: {
    flexDirection: 'row',
    padding: 20,
    gap: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  overviewLeft: {
    alignItems: 'center',
    paddingRight: 24,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0,0,0,0.1)',
  },
  bigRating: {
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  reviewsCount: {
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownBars: {
    flex: 1,
    gap: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barLabel: {
    width: 30,
    fontSize: 12,
    fontWeight: '700',
  },
  barTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
  },
  barCount: {
    width: 30,
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'right',
  },

  // Filters
  filtersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    marginRight: 16,
  },
  sortText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Reviews List
  list: {
    padding: 16,
    paddingBottom: 100,
  },
  reviewCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '900',
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reviewDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 8,
  },
  variantText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 12,
  },
  comment: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    marginBottom: 12,
  },
  reviewImages: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  reviewImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
  },
  reviewImage: {
    width: '100%',
    height: '100%',
  },
  reviewActions: {
    flexDirection: 'row',
    gap: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Empty State
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },

  // Write Review Button
  writeReviewButton: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  writeReviewText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
  },
});