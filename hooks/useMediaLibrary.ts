import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useState } from "react";
import { Alert, Linking } from "react-native";

export type Asset = MediaLibrary.Asset;
export type Album = MediaLibrary.Album;

export const useMediaLibrary = () => {
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions({
    granularPermissions: ["photo", "video"],
  });
  const [assets, setAssets] = useState<Asset[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [endCursor, setEndCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const requestPermissions = useCallback(async () => {
    if (permissionResponse?.status !== "granted") {
      const { status, canAskAgain } = await requestPermission();
      if (status !== "granted" && !canAskAgain) {
        Alert.alert(
          "Permission Required",
          "This app needs access to your photos to function. Please enable it in settings.",
          [{ text: "Open Settings", onPress: Linking.openSettings }]
        );
      }
    }
  }, [permissionResponse, requestPermission]);

  const loadAssets = useCallback(async (cursor?: string) => {
    if (isLoading || (!cursor && !hasNextPage && assets.length > 0)) return;
    setIsLoading(true);

    try {
      const { assets: newAssets, endCursor: newCursor, hasNextPage: newHasNextPage } =
        await MediaLibrary.getAssetsAsync({
          first: 50,
          after: cursor,
          mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
          sortBy: [MediaLibrary.SortBy.creationTime],
        });

      setAssets((prev) => (cursor ? [...prev, ...newAssets] : newAssets));
      setEndCursor(newCursor);
      setHasNextPage(newHasNextPage);
    } catch (error) {
      console.error("Error loading assets:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasNextPage, assets.length]);

  const loadAlbums = useCallback(async () => {
    try {
      const newAlbums = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });
      setAlbums(newAlbums);
    } catch (error) {
      console.error("Error loading albums:", error);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      loadAssets(endCursor);
    }
  }, [hasNextPage, isLoading, endCursor, loadAssets]);

  const refresh = useCallback(() => {
    setAssets([]);
    setEndCursor(undefined);
    setHasNextPage(true);
    loadAssets(undefined);
    loadAlbums();
  }, [loadAssets, loadAlbums]);

  useEffect(() => {
    if (permissionResponse?.status === "granted") {
      loadAssets();
      loadAlbums();
    }
  }, [permissionResponse?.status]);

  return {
    permissionResponse,
    requestPermissions,
    assets,
    albums,
    loadMore,
    refresh,
    isLoading,
  };
};
