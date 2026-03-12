import { getProducts } from "@/lib/redux/features/products/productsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  recommendedProducts,
  recommendedServices,
} from "@/lib/utils/constants";
import { Tabs } from "@mantine/core";
import { IconBulb, IconGrid3x3, IconPlane } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect } from "react";
import ProductFilters from "./products-filters";
import ServicesFilters from "./services-filters";
import RecommendationsTab from "./recommendations";
import { getServices } from "@/lib/redux/features/services/servicesSlice";

const InternalCatalogTabsHeader = ({
  activeTab,
  setActiveTab,
  recommendationTab,
  setRecommendationTab,
  handleViewRecommendation,
  handleApproveRecommendation,
  handleRejectRecommendation,
}: {
  activeTab: string | null;
  setActiveTab: Dispatch<SetStateAction<string | null>>;
  recommendationTab: string | null;
  setRecommendationTab: Dispatch<SetStateAction<string | null>>;
  handleViewRecommendation: (id: string) => void;
  handleApproveRecommendation: (id: string) => void;
  handleRejectRecommendation: (id: string) => void;
}) => {
  const dispatch = useAppDispatch();

  const { products } = useAppSelector((state) => state.products);
  const { services } = useAppSelector((state) => state.services);

  useEffect(() => {
    dispatch(getProducts({ page: 1 }));
    dispatch(getServices({ page: 1 }));
  }, [dispatch]);
  return (
    <Tabs value={activeTab} onChange={setActiveTab}>
      <Tabs.List>
        <Tabs.Tab value="inventory" leftSection={<IconGrid3x3 size={16} />}>
          Products ({products.length})
        </Tabs.Tab>
        <Tabs.Tab value="services" leftSection={<IconPlane size={16} />}>
          Services ({services.length})
        </Tabs.Tab>
        <Tabs.Tab value="recommendations" leftSection={<IconBulb size={16} />}>
          Recommended Items (
          {recommendedProducts.length + recommendedServices.length})
        </Tabs.Tab>
      </Tabs.List>

      <ProductFilters />

      <ServicesFilters />

      <RecommendationsTab
        recommendationTab={recommendationTab}
        setRecommendationTab={setRecommendationTab}
        handleViewRecommendation={handleViewRecommendation}
        handleApproveRecommendation={handleApproveRecommendation}
        handleRejectRecommendation={handleRejectRecommendation}
      />
    </Tabs>
  );
};

export default InternalCatalogTabsHeader;
