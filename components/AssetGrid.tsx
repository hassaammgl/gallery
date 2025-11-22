import { FlashList } from "@shopify/flash-list";
import { useCallback } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Asset } from "../hooks/useMediaLibrary";
import AssetItem from "./AssetItem";

const SCREEN_WIDTH = Dimensions.get("window").width;
const COLUMNS = 4;
const ITEM_SIZE = SCREEN_WIDTH / COLUMNS;

interface AssetGridProps {
  assets: Asset[];
  onEndReached: () => void;
  onAssetPress: (asset: Asset) => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
}

export default function AssetGrid({ assets, onEndReached, onAssetPress, ListHeaderComponent }: AssetGridProps) {
  const renderItem = useCallback(
    ({ item }: { item: Asset }) => (
      <AssetItem asset={item} size={ITEM_SIZE} onPress={onAssetPress} />
    ),
    [onAssetPress]
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={assets}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        // estimatedItemSize={ITEM_SIZE}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  listContent: {
    paddingBottom: 20,
  },
});
