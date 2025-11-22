import AssetGrid from "@/components/AssetGrid";
import * as MediaLibrary from "expo-media-library";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function AlbumDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      loadAlbumAssets();
    }
  }, [id]);

  const loadAlbumAssets = async () => {
    setIsLoading(true);
    try {
      const { assets } = await MediaLibrary.getAssetsAsync({
        album: id,
        first: 100, // Load first 100 for now
        mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
        sortBy: [MediaLibrary.SortBy.creationTime],
      });
      setAssets(assets);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: title || "Album" }} />
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator />
        </View>
      ) : (
        <AssetGrid
          assets={assets}
          onEndReached={() => { }} // TODO: Implement pagination for albums
          onAssetPress={(asset) => {
            router.push({
              pathname: "/asset/[id]",
              params: { id: asset.id },
            });
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
