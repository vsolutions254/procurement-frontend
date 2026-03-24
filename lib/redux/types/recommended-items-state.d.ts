type RecommendedItemsState = {
  recommended_items: RecommendedItem[];
  recommended_items_loading: boolean;
  recommended_items_error: string | null;
  recommended_item: RecommendedItem | null;
  recommended_item_loading: boolean;
  recommended_item_error: string | null;
};
