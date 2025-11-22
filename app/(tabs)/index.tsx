import AssetGrid from "@/components/AssetGrid";
import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export default function PhotosScreen() {
  const { assets, loadMore, permissionResponse, requestPermissions, isLoading } = useMediaLibrary();
  const router = useRouter();

  useEffect(() => {
    if (permissionResponse?.status !== "granted") {
      requestPermissions();
    }
  }, [permissionResponse, requestPermissions]);

  if (!permissionResponse || permissionResponse.status !== "granted") {
    return (
      <View style={styles.center}>
        <Text>Permission required to access photos.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AssetGrid
        assets={assets}
        onEndReached={loadMore}
        onAssetPress={(asset) => {
          router.push({
            pathname: "/asset/[id]",
            params: { id: asset.id },
          });
        }}
      />
      {isLoading && assets.length === 0 && (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
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
