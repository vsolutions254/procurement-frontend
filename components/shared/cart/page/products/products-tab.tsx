import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { Center, Loader, Stack, Tabs } from "@mantine/core";
import React, { useEffect } from "react";
import ProductView from "./product-view";
import { getCartProducts } from "@/lib/redux/features/products/cart/cartSlice";

const ProductsTab = () => {
  const dispatch = useAppDispatch();
  const { products, productsLoading } = useAppSelector(
    (state) => state.products_cart,
  );
  useEffect(() => {
    dispatch(getCartProducts());
  }, [dispatch]);
  if (productsLoading)
    return (
      <Tabs.Panel value="products" pt="md">
        <Center py="xl">
          <Loader />
        </Center>
      </Tabs.Panel>
    );
  return (
    <Tabs.Panel value="products" pt="md">
      <Stack gap="md">
        {products.map((item) => {
          return <ProductView item={item} key={item.product_id} />;
        })}
      </Stack>
    </Tabs.Panel>
  );
};

export default ProductsTab;
