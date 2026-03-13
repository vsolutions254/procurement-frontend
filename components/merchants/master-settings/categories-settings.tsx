import CategoriesTable from "@/components/shared/catalogue/products/categories-table";
import ServiceCategoriesTable from "@/components/shared/catalogue/services/categories/categories-table";

import { Tabs } from "@mantine/core";
import React from "react";

interface CategoriesSettingsProps {
  setGoodsModalOpen: (open: boolean) => void;
  setServiceModalOpen: (open: boolean) => void;
  handleDeleteCategory: (category: Category) => void;
}

const CategoriesSettings = ({
  setGoodsModalOpen,
  setServiceModalOpen,
  handleDeleteCategory,
}: CategoriesSettingsProps) => {
  return (
    <Tabs.Panel value="categories" pt="md">
      <Tabs defaultValue="goods">
        <Tabs.List>
          <Tabs.Tab value="goods">Goods</Tabs.Tab>
          <Tabs.Tab value="services">Services</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="goods" pt="md">
          <CategoriesTable
            setCategoryModalOpen={setGoodsModalOpen}
            handleDeleteCategory={handleDeleteCategory}
          />
        </Tabs.Panel>

        <Tabs.Panel value="services" pt="md">
          <ServiceCategoriesTable setCategoryModalOpen={setServiceModalOpen} />
        </Tabs.Panel>
      </Tabs>
    </Tabs.Panel>
  );
};

export default CategoriesSettings;
