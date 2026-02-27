import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Clock, Tag } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { NEWS_ITEMS, NewsItem } from '@/constants/news';
import { getTeamById, TEAMS } from '@/constants/teams';
import Colors from '@/constants/colors';
import AppHeader from '@/components/AppHeader';
import { useCity } from '@/providers/CityProvider';

const FeaturedCard = React.memo(({ item, onPress }: { item: NewsItem; onPress: () => void }) => {
  const team = item.teamId ? getTeamById(item.teamId) : null;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.featuredCard,
        pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      {item.imageUrl && (
        <View style={styles.featuredImageWrap}>
          <Image
            source={{ uri: item.imageUrl }}
            style={StyleSheet.absoluteFillObject}
            contentFit="cover"
            transition={300}
          />
          <View style={styles.featuredOverlay} />
        </View>
      )}
      <View style={styles.featuredContent}>
        <View style={styles.categoryBadge}>
          <Tag color={Colors.accent} size={10} />
          <Text style={styles.categoryText}>
            {item.category.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredSummary} numberOfLines={2}>{item.summary}</Text>
        <View style={styles.metaRow}>
          <Clock color={Colors.textSecondary} size={10} />
          <Text style={styles.metaDate}>{item.date}</Text>
          {team && (
            <Text style={styles.metaTeam}>
              {team.mascot}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
});

const NewsCard = React.memo(({ item, onPress }: { item: NewsItem; onPress: () => void }) => {
  const team = item.teamId ? getTeamById(item.teamId) : null;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.newsCard,
        pressed && { opacity: 0.8, backgroundColor: Colors.surfaceElevated },
      ]}
    >
      <View style={styles.newsCardContent}>
        <View style={styles.categoryDot} />
        <View style={styles.newsTextWrap}>
          <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
          <View style={styles.metaRow}>
            <Clock color={Colors.textSecondary} size={10} />
            <Text style={styles.metaDate}>{item.date}</Text>
            {team && (
              <Text style={styles.metaTeam}>
                {team.mascot}
              </Text>
            )}
          </View>
        </View>
        {item.imageUrl && (
          <View style={styles.newsThumb}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.newsThumbImage}
              contentFit="cover"
              transition={200}
            />
          </View>
        )}
      </View>
    </Pressable>
  );
});

export default function NewsScreen() {
  const router = useRouter();
  const { selectedCity } = useCity();

  const handlePress = useCallback((item: NewsItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.teamId) {
      router.push({ pathname: '/team/[id]', params: { id: item.teamId } });
    }
  }, [router]);

  const cityTeamIds = TEAMS.filter(t => t.city === selectedCity).map(t => t.id);
  const cityNews = NEWS_ITEMS.filter(item => !item.teamId || cityTeamIds.includes(item.teamId));
  const featured = cityNews[0] ?? null;
  const rest = cityNews.slice(1);
  const hasNoContent = cityTeamIds.length === 0;

  return (
    <View style={styles.container}>
      <AppHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {hasNoContent ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>TEAMS COMING SOON</Text>
            <Text style={styles.emptyText}>Season 1 launches in Henderson.</Text>
          </View>
        ) : (
          <>
            {featured && (
              <FeaturedCard item={featured} onPress={() => handlePress(featured)} />
            )}

            <View style={styles.sectionDivider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>LATEST</Text>
              <View style={styles.dividerLine} />
            </View>

            {rest.map(item => (
              <NewsCard key={item.id} item={item} onPress={() => handlePress(item)} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
  },
  featuredCard: {
    margin: 16,
    borderRadius: 0,
    overflow: 'hidden',
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  featuredImageWrap: {
    height: 180,
    position: 'relative',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26,26,26,0.2)',
  },
  featuredContent: {
    padding: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 0,
    marginBottom: 10,
    backgroundColor: '#252525',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '800' as const,
    letterSpacing: 1.2,
    color: '#8B7355',
  },
  featuredTitle: {
    color: '#8B7355',
    fontSize: 18,
    fontWeight: '800' as const,
    letterSpacing: -0.3,
    lineHeight: 24,
    marginBottom: 6,
  },
  featuredSummary: {
    color: '#6B5740',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaDate: {
    color: '#6B5740',
    fontSize: 11,
    fontWeight: '500' as const,
  },
  metaTeam: {
    fontSize: 11,
    fontWeight: '700' as const,
    marginLeft: 6,
    color: '#8B7355',
  },
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#2A2A2A',
  },
  dividerText: {
    color: '#6B5740',
    fontSize: 10,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  newsCard: {
    marginHorizontal: 16,
    marginBottom: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 0,
    backgroundColor: '#1F1F1F',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  newsCardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    backgroundColor: '#8B7355',
  },
  newsTextWrap: {
    flex: 1,
  },
  newsTitle: {
    color: '#8B7355',
    fontSize: 15,
    fontWeight: '700' as const,
    lineHeight: 20,
    marginBottom: 4,
  },
  newsSummary: {
    color: '#6B5740',
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 8,
  },
  newsThumb: {
    width: 60,
    height: 60,
    borderRadius: 0,
    overflow: 'hidden',
  },
  newsThumbImage: {
    width: 60,
    height: 60,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: '#8B7355',
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 2,
  },
  emptyText: {
    color: '#6B5740',
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center' as const,
  },
});
