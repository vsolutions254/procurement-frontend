// "use client";

// import { ContentContainer } from "@/components/layout/content-container";
// import {
//   Card,
//   Text,
//   Group,
//   Button,
//   Stack,
//   Title,
//   TextInput,
//   NumberInput,
//   Select,
//   Textarea,
//   Grid,
// } from "@mantine/core";
// import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
// import { useRouter } from "next/navigation";
// import { useState } from "react";

// export default function NonTangibleDetailPage({
//   params,
// }: {
//   params: { id: string };
// }) {
//   const router = useRouter();
//   const item = nonTangibleCartItems.find((item) => item.id === params.id);

//   const [formData, setFormData] = useState({
//     name: item?.name || "",
//     quantity: item?.quantity || 1,
//     price: item?.price || 0,
//     description: item?.description || "",
//     // Flight specific
//     flightType: "Economy",
//     departureDate: "",
//     returnDate: "",
//     departureTime: "09:00",
//     // Hotel specific
//     roomType: "Standard",
//     checkIn: "",
//     checkOut: "",
//     guests: 1,
//     // Car rental specific
//     carType: "Economy",
//     pickupDate: "",
//     returnCarDate: "",
//     pickupTime: "09:00",
//   });

//   if (!item) {
//     return (
//       <ContentContainer>
//         <Text>Item not found</Text>
//       </ContentContainer>
//     );
//   }

//   const handleSave = () => {
//     // Save logic here
//     router.back();
//   };

//   const renderSpecificFields = () => {
//     const category = item.name.includes("Flight")
//       ? "Flight"
//       : item.name.includes("Hotel")
//         ? "Hotel"
//         : item.name.includes("Car")
//           ? "Car Rental"
//           : "Other";

//     return (
//       <>
//         <Select
//           label="Service Category"
//           value={category}
//           data={[
//             "Flight",
//             "Hotel",
//             "Car Rental",
//             "Professional Services",
//             "Consulting",
//             "Training",
//           ]}
//           disabled
//         />

//         {category === "Flight" && (
//           <>
//             <Title order={5} mt="md" mb="sm">
//               Flight Details
//             </Title>
//             <Grid gutter="md">
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="From"
//                   placeholder="Departure city"
//                   defaultValue="Nairobi (NBO)"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="To"
//                   placeholder="Destination city"
//                   defaultValue="Mombasa (MBA)"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Departure Date"
//                   type="date"
//                   defaultValue="2025-01-25"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Return Date"
//                   type="date"
//                   defaultValue="2025-01-27"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <Select
//                   label="Class"
//                   data={["Economy", "Business", "First"]}
//                   defaultValue="Business"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <NumberInput
//                   label="Passengers"
//                   min={1}
//                   max={10}
//                   defaultValue={1}
//                 />
//               </Grid.Col>
//             </Grid>
//           </>
//         )}

//         {category === "Hotel" && (
//           <>
//             <Title order={5} mt="md" mb="sm">
//               Hotel Booking Details
//             </Title>
//             <Grid gutter="md">
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Hotel Name"
//                   placeholder="Hotel name"
//                   defaultValue="Serena Beach Resort"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Location"
//                   placeholder="City, Country"
//                   defaultValue="Mombasa, Kenya"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Check-in Date"
//                   type="date"
//                   defaultValue="2025-01-25"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Check-out Date"
//                   type="date"
//                   defaultValue="2025-01-28"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <Select
//                   label="Room Type"
//                   data={["Standard", "Deluxe", "Suite", "Executive"]}
//                   defaultValue="Deluxe Ocean View"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <NumberInput label="Guests" min={1} max={8} defaultValue={2} />
//               </Grid.Col>
//             </Grid>
//           </>
//         )}

//         {category === "Car Rental" && (
//           <>
//             <Title order={5} mt="md" mb="sm">
//               Car Rental Details
//             </Title>
//             <Grid gutter="md">
//               <Grid.Col span={6}>
//                 <Select
//                   label="Car Type"
//                   data={[
//                     "Economy",
//                     "Compact",
//                     "Mid-size",
//                     "Full-size",
//                     "SUV",
//                     "Luxury",
//                   ]}
//                   defaultValue="Mid-size"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Pickup Location"
//                   placeholder="Pickup address"
//                   defaultValue="Jomo Kenyatta Airport"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Pickup Date"
//                   type="datetime-local"
//                   defaultValue="2025-01-25T09:00"
//                 />
//               </Grid.Col>
//               <Grid.Col span={6}>
//                 <TextInput
//                   label="Return Date"
//                   type="datetime-local"
//                   defaultValue="2025-01-30T09:00"
//                 />
//               </Grid.Col>
//               <Grid.Col span={12}>
//                 <TextInput
//                   label="Driver's License"
//                   placeholder="License number"
//                 />
//               </Grid.Col>
//               <Grid.Col span={12}>
//                 <Textarea
//                   label="Additional Requirements"
//                   placeholder="Insurance, GPS, child seats, etc."
//                   rows={2}
//                 />
//               </Grid.Col>
//             </Grid>
//           </>
//         )}
//       </>
//     );
//   };

//   return (
//     <ContentContainer>
//       <Stack gap="lg">
//         <Group>
//           <Button
//             variant="subtle"
//             leftSection={<IconArrowLeft size={16} />}
//             onClick={() => router.back()}
//           >
//             Back to Cart
//           </Button>
//         </Group>

//         <div>
//           <Title order={2} mb="xs">
//             Edit {item.name}
//           </Title>
//           <Text c="dimmed" size="sm">
//             Customize your service request details
//           </Text>
//         </div>

//         <Card shadow="sm" padding="lg" radius="md" withBorder>
//           <Stack gap="md">
//             <TextInput
//               label="Service Name"
//               value={formData.name}
//               onChange={(event) =>
//                 setFormData({ ...formData, name: event.currentTarget.value })
//               }
//             />

//             <Textarea
//               label="Description"
//               value={formData.description}
//               onChange={(event) =>
//                 setFormData({
//                   ...formData,
//                   description: event.currentTarget.value,
//                 })
//               }
//               rows={3}
//             />

//             {renderSpecificFields()}

//             <NumberInput
//               label="Base Price (KES)"
//               value={formData.price}
//               onChange={(value) =>
//                 setFormData({
//                   ...formData,
//                   price: typeof value === "number" ? value : 0,
//                 })
//               }
//               min={0}
//               thousandSeparator=","
//             />

//             <Group justify="flex-end" mt="xl">
//               <Button variant="outline" onClick={() => router.back()}>
//                 Cancel
//               </Button>
//               <Button
//                 leftSection={<IconDeviceFloppy size={16} />}
//                 onClick={handleSave}
//               >
//                 Save Changes
//               </Button>
//             </Group>
//           </Stack>
//         </Card>
//       </Stack>
//     </ContentContainer>
//   );
// }

export default function NonTangibleDetailPage() {
  return null;
}
