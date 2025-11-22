import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { memo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Asset } from "../hooks/useMediaLibrary";

interface AssetItemProps {
  asset: Asset;
  size: number;
  onPress: (asset: Asset) => void;
}

const AssetItem = memo(({ asset, size, onPress }: AssetItemProps) => {
  return (
    <Pressable onPress={() => onPress(asset)} style={{ width: size, height: size }}>
      <Image
        source={asset.uri}
        style={styles.image}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      {asset.mediaType === "video" && (
        <View style={styles.videoIndicator}>
          <Ionicons name="play" size={12} color="white" />
          <Text style={styles.duration}>
            {formatDuration(asset.duration)}
          </Text>
        </View>
      )}
    </Pressable>
  );
});

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    backgroundColor: "#e1e1e1",
  },
  videoIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  duration: {
    color: "white",
    fontSize: 10,
    marginLeft: 2,
    fontWeight: "600",
  },
});

export default AssetItem;
