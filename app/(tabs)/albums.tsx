import { useMediaLibrary } from "@/hooks/useMediaLibrary";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function AlbumsScreen() {
  const { albums } = useMediaLibrary();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <FlatList
        data={albums}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.albumItem}
            onPress={() =>
              router.push({
                pathname: "/album/[id]",
                params: { id: item.id, title: item.title },
              })
            }
          >
            <View style={styles.coverContainer}>
              {/* We don't have a direct cover image in the album object from expo-media-library easily without fetching, 
                  so we'll use a placeholder or implement a fetch later. For now, a folder icon. */}
              <View style={styles.placeholderCover}>
                <Ionicons name="folder-open" size={40} color="#555" />
              </View>
            </View>
            <View style={styles.info}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.count}>{item.assetCount}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#555" />
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  albumItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#333",
  },
  coverContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    marginRight: 16,
  },
  placeholderCover: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  count: {
    fontSize: 14,
    color: "#888",
    marginTop: 4,
  },
});
