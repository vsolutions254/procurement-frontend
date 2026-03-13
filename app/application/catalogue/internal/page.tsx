"use client";

import { ContentContainer } from "@/components/layout/content-container";
import ECommerceFilters from "@/components/shared/catalogue/internal/ecommerce-filters";
import InternalCatalogPageHeader from "@/components/shared/catalogue/internal/page-hader";
import InternalCatalogTabsHeader from "@/components/shared/catalogue/internal/tabs-header";
import ProductsView from "@/components/shared/catalogue/products/view/products-view";
import ServicesView from "@/components/shared/catalogue/services/services-view";
import { fetchCategories } from "@/lib/redux/features/products/categories/categoriesSlice";
import { getProducts } from "@/lib/redux/features/products/productsSlice";
import { fetchServiceCategories } from "@/lib/redux/features/services/categories/serviceCategoriesSlice";
import { getServices } from "@/lib/redux/features/services/servicesSlice";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  recommendedProducts,
  recommendedServices,
} from "@/lib/utils/constants";
import {
  Grid,
  Text,
  Group,
  Badge,
  Button,
  Stack,
  Paper,
  Modal,
} from "@mantine/core";
import { useEffect, useState } from "react";

export default function InternalCatalogPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<string | null>("inventory");
  const [recommendationTab, setRecommendationTab] = useState<string | null>(
    "products",
  );
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedRecommendation, setSelectedRecommendation] = useState<
    (typeof recommendedProducts)[0] | null
  >(null);
  const dispatch = useAppDispatch();

  const { products, pagination } = useAppSelector((state) => state.products);
  const { services } = useAppSelector((state) => state.services);
  const { categories } = useAppSelector((state) => state.product_categories);
  const { categories: serviceCategories } = useAppSelector(
    (state) => state.service_categories,
  );

  useEffect(() => {
    dispatch(getProducts({ page: 1 }));
    dispatch(fetchCategories(1));
    dispatch(fetchServiceCategories(1));
    dispatch(getServices({ page: 1 }));
  }, [dispatch]);

  const currentItems = activeTab === "inventory" ? products || [] : services;
  const currentCategories =
    activeTab === "inventory" ? categories : serviceCategories;

  const handleApproveRecommendation = (id: string) => {
    console.log("Approving recommendation:", id);
  };

  const handleRejectRecommendation = (id: string) => {
    console.log("Rejecting recommendation:", id);
  };

  const handleViewRecommendation = (id: string) => {
    const allRecommendations = [...recommendedProducts, ...recommendedServices];
    const item = allRecommendations.find((rec) => rec.id === id);
    setSelectedRecommendation(item || null);
    setViewModalOpen(true);
  };

  return (
    <ContentContainer>
      <Stack gap="lg">
        <InternalCatalogPageHeader />

        <InternalCatalogTabsHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          recommendationTab={recommendationTab}
          setRecommendationTab={setRecommendationTab}
          handleViewRecommendation={handleViewRecommendation}
          handleApproveRecommendation={handleApproveRecommendation}
          handleRejectRecommendation={handleRejectRecommendation}
        />
        <Grid>
          {activeTab !== "recommendations" && <ECommerceFilters />}

          {activeTab === "inventory" && (
            <ProductsView
              viewMode={viewMode}
              setViewMode={setViewMode}
              activeTab={activeTab!}
              pagination={pagination}
            />
          )}

          {activeTab === "services" && <ServicesView />}
        </Grid>

        <Modal
          opened={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          title="Item Recommendation Details"
          size="lg"
          centered
        >
          {selectedRecommendation && (
            <Stack gap="md">
              <Group justify="space-between">
                <div>
                  <Text fw={600} size="lg">
                    {selectedRecommendation.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {selectedRecommendation.id}
                  </Text>
                </div>
                <Badge variant="light">{selectedRecommendation.category}</Badge>
              </Group>

              <Paper p="md" withBorder>
                <Text fw={500} mb="xs">
                  Description
                </Text>
                <Text size="sm">{selectedRecommendation.description}</Text>
              </Paper>

              <Grid>
                <Grid.Col span={6}>
                  <Paper p="md" withBorder>
                    <Text fw={500} mb="xs">
                      Requested By
                    </Text>
                    <Text size="sm">{selectedRecommendation.requestedBy}</Text>
                    <Text size="xs" c="dimmed">
                      {selectedRecommendation.requestDate}
                    </Text>
                  </Paper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper p="md" withBorder>
                    <Text fw={500} mb="xs">
                      Estimated Price
                    </Text>
                    <Text size="lg" fw={600} c="cyan">
                      {selectedRecommendation.estimatedPrice}
                    </Text>
                  </Paper>
                </Grid.Col>
              </Grid>

              <Paper p="md" withBorder>
                <Text fw={500} mb="xs">
                  Specifications
                </Text>
                <Text size="sm">{selectedRecommendation.reason}</Text>
              </Paper>

              <Group justify="flex-end" gap="sm">
                <Button
                  variant="outline"
                  onClick={() => setViewModalOpen(false)}
                >
                  Close
                </Button>
                <Button
                  color="red"
                  onClick={() => {
                    handleRejectRecommendation(selectedRecommendation.id);
                    setViewModalOpen(false);
                  }}
                >
                  Reject
                </Button>
                <Button
                  color="green"
                  onClick={() => {
                    handleApproveRecommendation(selectedRecommendation.id);
                    setViewModalOpen(false);
                  }}
                >
                  Approve & Add to Catalog
                </Button>
              </Group>
            </Stack>
          )}
        </Modal>
      </Stack>
    </ContentContainer>
  );
}
