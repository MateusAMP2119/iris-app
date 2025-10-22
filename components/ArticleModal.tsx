import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import React, { useEffect, useRef } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    PanResponder,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { Article } from '../models';
import { AppColors, AppSpacing, AppTextStyles } from '../theme';
import CategoryChip from './CategoryChip';

interface ArticleModalProps {
  article: Article | null;
  visible: boolean;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;
const modalMaxWidth = isMobile ? width - 32 : 800;

export function ArticleModal({ article, visible, onClose }: ArticleModalProps) {
  // Pan responder for swipe gestures on the backdrop
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        // Close on left or right swipe (threshold of 100px)
        if (Math.abs(gestureState.dx) > 100) {
          onClose();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (!visible && !article) {
      // Reset animations when modal is fully closed
      return;
    }
  }, [visible, article]);

  if (!article) return null;

  const dateString = article.publishedAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer} {...panResponder.panHandlers}>
        <Pressable style={styles.backdrop} onPress={onClose} />
        <View style={styles.modalContent}>
          <LiquidGlassView
            interactive
            effect="clear"
            style={[
              styles.glassContainer,
              !isLiquidGlassSupported && styles.glassContainerFallback
            ]}
          >
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              bounces={true}
            >
              <View style={styles.content}>
                {/* Categories */}
                {article.categories && article.categories.length > 0 && (
                  <View style={styles.categoriesContainer}>
                    {article.categories.map((cat) => (
                      <CategoryChip key={cat.id} category={cat} />
                    ))}
                  </View>
                )}

                {/* Title */}
                <Text style={styles.title}>{article.title}</Text>

                {/* Metadata */}
                <View style={styles.metadata}>
                  {article.source && (
                    <>
                      <Text style={styles.metaSource}>{article.source.name}</Text>
                      <View style={styles.metaDot} />
                    </>
                  )}
                  <Text style={styles.metaDate}>{dateString}</Text>
                  {article.author && (
                    <>
                      <View style={styles.metaDot} />
                      <Text style={styles.metaAuthor}>By {article.author}</Text>
                    </>
                  )}
                </View>

                {/* Image */}
                {article.imageUrl && (
                  <View style={styles.imageContainer}>
                    <Image
                      source={{ uri: article.imageUrl }}
                      style={styles.image}
                      resizeMode="cover"
                    />
                  </View>
                )}

                {/* Content */}
                <Text style={styles.contentText}>{article.content}</Text>

                {/* Source Info */}
                <View style={styles.sourceInfo}>
                  <Text style={styles.sourceLabel}>SOURCE</Text>
                  {article.source && (
                    <Text style={styles.sourceName}>{article.source.name}</Text>
                  )}
                  <Text style={styles.sourceUrl} numberOfLines={1}>
                    {article.url}
                  </Text>
                </View>
              </View>
            </ScrollView>
          </LiquidGlassView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isMobile ? 16 : 32,
    paddingVertical: isMobile ? 40 : 60,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    width: '100%',
    maxWidth: modalMaxWidth,
    height: '100%',
    maxHeight: height - (isMobile ? 80 : 120),
    zIndex: 1,
  },
  glassContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 40,
    elevation: 20,
  },
  glassContainerFallback: {
    backgroundColor: AppColors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: AppSpacing.xl,
    paddingTop: AppSpacing.lg,
    paddingBottom: AppSpacing.xl,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: AppSpacing.xs,
    marginBottom: AppSpacing.sm,
  },
  title: {
    ...AppTextStyles.headlineSecondary,
    color: AppColors.primaryText,
    fontSize: isMobile ? 24 : 32,
    lineHeight: isMobile ? 32 : 42,
    backgroundColor: AppColors.background,
    padding: AppSpacing.md,
    borderRadius: 12,
    marginTop: AppSpacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: AppSpacing.md,
    flexWrap: 'wrap',
    backgroundColor: AppColors.background,
    padding: AppSpacing.sm,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  metaSource: {
    ...AppTextStyles.caption,
    color: AppColors.gray700,
    fontWeight: '600',
    fontSize: 11,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.gray400,
    marginHorizontal: AppSpacing.sm,
  },
  metaDate: {
    ...AppTextStyles.caption,
    color: AppColors.gray600,
    fontSize: 11,
  },
  metaAuthor: {
    ...AppTextStyles.caption,
    color: AppColors.gray600,
    fontSize: 11,
    fontStyle: 'italic',
  },
  imageContainer: {
    marginTop: AppSpacing.lg,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: AppColors.gray200,
  },
  contentText: {
    ...AppTextStyles.bodyLarge,
    color: AppColors.primaryText,
    marginTop: AppSpacing.lg,
    fontSize: isMobile ? 15 : 16,
    lineHeight: isMobile ? 24 : 28,
    backgroundColor: AppColors.background,
    padding: AppSpacing.lg,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sourceInfo: {
    backgroundColor: AppColors.background,
    borderRadius: 12,
    padding: AppSpacing.md,
    marginTop: AppSpacing.lg,
    marginBottom: AppSpacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sourceLabel: {
    ...AppTextStyles.labelSmall,
    color: AppColors.gray600,
    marginBottom: AppSpacing.xs,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sourceName: {
    ...AppTextStyles.bodyMedium,
    fontWeight: '600',
    marginBottom: AppSpacing.xs,
  },
  sourceUrl: {
    ...AppTextStyles.caption,
    color: AppColors.accentBlue,
    fontSize: 11,
  },
});
