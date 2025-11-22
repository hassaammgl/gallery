import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";

export default function AssetViewer() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [asset, setAsset] = useState<MediaLibrary.Asset | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      MediaLibrary.getAssetInfoAsync(id).then(setAsset);
    }
  }, [id]);

  if (!asset) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar hidden />
      
      <View style={styles.content}>
        {asset.mediaType === "video" ? (
          <VideoPlayer asset={asset} />
        ) : (
          <Image
            source={asset.uri}
            style={styles.image}
            contentFit="contain"
          />
        )}
      </View>

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.iconButton}>
          <Ionicons name="close" size={28} color="white" />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.iconButton} onPress={() => {}}>
          <Ionicons name="share-outline" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => {}}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={() => {}}>
          <Ionicons name="information-circle-outline" size={24} color="white" />
        </Pressable>
      </View>
    </View>
  );
}

function VideoPlayer({ asset }: { asset: MediaLibrary.Asset }) {
  const player = useVideoPlayer(asset.uri, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <VideoView
      style={styles.video}
      player={player}
      allowsFullscreen
      allowsPictureInPicture
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  loading: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  video: {
    width: "100%",
    height: "100%",
  },
  header: {
    position: "absolute",
    top: 40,
    left: 10,
    zIndex: 10,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
  },
  iconButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 20,
  },
});
