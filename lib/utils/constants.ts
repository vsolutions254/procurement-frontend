import {
  IconChartBar,
  IconChecklist,
  IconClipboardList,
  IconFileText,
  IconHome,
  IconPackage,
  IconSettings,
  IconShield,
  IconShoppingCart,
  IconUsers,
  IconFolders,
  IconClock,
  IconTruck,
  IconUser,
  IconHammer,
  IconBox,
} from "@tabler/icons-react";

export const landingPageFeatures = [
  {
    icon: IconShoppingCart,
    title: "Smart Procurement",
    description:
      "Streamline your purchasing process with intelligent catalog management",
  },
  {
    icon: IconFileText,
    title: "Digital Requisitions",
    description:
      "Create, track, and manage requisitions with automated approval workflows",
  },
  {
    icon: IconHammer,
    title: "Disposal Auctions",
    description:
      "Manage asset disposal through internal auctions and participate in external bidding opportunities",
  },
  {
    icon: IconShield,
    title: "Secure & Compliant",
    description:
      "Enterprise-grade security with full audit trails and compliance reporting",
  },
];

export const protectedRoutes = ["/application"];

export const dashboardStats = [
  {
    title: "Pending Requisitions",
    value: "12",
    icon: IconFileText,
    color: "blue",
  },
  { title: "Items in Cart", value: "5", icon: IconShoppingCart, color: "cyan" },
  {
    title: "Awaiting Approval",
    value: "8",
    icon: IconChecklist,
    color: "orange",
  },
  {
    title: "Catalogue Items",
    value: "1,247",
    icon: IconPackage,
    color: "green",
  },
];

export const dashboardRecentActivity = [
  {
    id: "REQ-001",
    title: "Office Supplies Request",
    status: "Pending Approval",
    date: "2 hours ago",
  },
  {
    id: "REQ-002",
    title: "IT Equipment Purchase",
    status: "Approved",
    date: "5 hours ago",
  },
  {
    id: "REQ-003",
    title: "Marketing Materials",
    status: "In Review",
    date: "1 day ago",
  },
  {
    id: "REQ-004",
    title: "Facility Maintenance",
    status: "Completed",
    date: "2 days ago",
  },
];

export const navItems = [
  { label: "Dashboard", icon: IconHome, href: "/application/dashboard" },
  { label: "Warehouses", icon: IconBox, href: "/application/warehouses" },
  {
    label: "User Management",
    icon: IconUsers,
    href: "/users",
    children: [
      { label: "Users", href: "/users" },
      { label: "Roles", href: "/roles" },
    ],
  },
  {
    label: "Catalogue",
    icon: IconPackage,
    href: "/catalogue",
    children: [
      { label: "Internal Catalog", href: "/catalogue/internal" },
      { label: "Suppliers Catalog", href: "/catalogue/suppliers" },
    ],
  },
  {
    label: "Requisitions",
    icon: IconFileText,
    href: "/requisitions",
    children: [
      { label: "My Requisitions", href: "/requisitions" },
      { label: "Request Cart", href: "/cart" },
    ],
  },
  { label: "Projects", icon: IconFolders, href: "/application/projects" },
  { label: "Inventory", icon: IconPackage, href: "/application/inventory" },
  {
    label: "Procurement",
    icon: IconClipboardList,
    href: "/procurement-requisitions",
    children: [
      { label: "Approvals", href: "/approvals" },
      { label: "Requisitions", href: "/procurement-requisitions" },
      { label: "RFQs", href: "/rfqs" },
      { label: "Quotations", href: "/quotations" },
      { label: "Purchase Orders", href: "/purchase-orders" },
      { label: "Material Receipts", href: "/material-receipts" },
      { label: "Contracts", href: "/contracts" },
      { label: "Suppliers", href: "/suppliers" },
      {
        label: "Disposal Auctions",
        href: "/disposal-auctions",
        children: [
          { label: "Internal Auctions", href: "/disposal-auctions/internal" },
          { label: "External Auctions", href: "/disposal-auctions/external" },
        ],
      },
    ],
  },

  {
    label: "Administration",
    icon: IconSettings,
    href: "/admin",
    children: [{ label: "Master Settings", href: "/master-settings" }],
  },
  { label: "Reports", icon: IconChartBar, href: "/application/reports" },
];

export const nonTangibleCatalogueItems = [
  {
    id: "SRV-001",
    name: "Flight Booking Service",
    category: "Travel",
    supplier: "Kenya Airways",
    price: "From KES 15,000",
    description: "Domestic and international flight bookings",
    inStock: true,
  },
  {
    id: "SRV-002",
    name: "Hotel Accommodation",
    category: "Travel",
    supplier: "Serena Hotels",
    price: "From KES 12,000",
    description: "Business hotel bookings and reservations",
    inStock: true,
  },
  {
    id: "SRV-003",
    name: "Car Rental Service",
    category: "Transport",
    supplier: "Avis Kenya",
    price: "From KES 8,000",
    description: "Vehicle rental for business trips",
    inStock: true,
  },
  {
    id: "SRV-004",
    name: "Training & Development",
    category: "Professional Services",
    supplier: "Corporate Training Ltd",
    price: "From KES 25,000",
    description: "Employee training and development programs",
    inStock: true,
  },
  {
    id: "SRV-005",
    name: "Digital Marketing Campaign",
    category: "Marketing",
    supplier: "Creative Agency Ltd",
    price: "From KES 50,000",
    description: "Social media and digital advertising campaigns",
    inStock: true,
  },
  {
    id: "SRV-006",
    name: "Event Management",
    category: "Marketing",
    supplier: "Events Pro Kenya",
    price: "From KES 75,000",
    description: "Corporate event planning and management",
    inStock: true,
  },
  {
    id: "SRV-007",
    name: "Graphic Design Services",
    category: "Marketing",
    supplier: "Design Studio",
    price: "From KES 20,000",
    description: "Branding, logos, and marketing materials design",
    inStock: true,
  },
];

export const currencies = [
  { value: "KES", label: "Kenyan Shilling (KES)" },
  { value: "USD", label: "US Dollar (USD)" },
  { value: "EUR", label: "Euro (EUR)" },
  { value: "GBP", label: "British Pound (GBP)" },
];

export const requisitions = [
  {
    id: "REQ-2025-001",
    title: "Q1 Office Equipment",
    status: "Approved",
    priority: "High",
    amount: "KES 281,443",
    createdDate: "2025-01-15",
    approver: "John Smith",
  },
  {
    id: "REQ-2025-002",
    title: "Marketing Materials",
    status: "Approved",
    priority: "Medium",
    amount: "KES 110,500",
    createdDate: "2025-01-14",
    approver: "Sarah Johnson",
  },
  {
    id: "REQ-2025-003",
    title: "IT Infrastructure Upgrade",
    status: "In Procurement",
    priority: "Urgent",
    amount: "KES 2,014,999",
    createdDate: "2025-01-12",
    approver: "Mike Davis",
  },
  {
    id: "REQ-2025-004",
    title: "Office Supplies Restock",
    status: "Completed",
    priority: "Low",
    amount: "KES 31,915",
    createdDate: "2025-01-10",
    approver: "John Smith",
  },
  {
    id: "REQ-2025-005",
    title: "Conference Room Setup",
    status: "Rejected",
    priority: "Medium",
    amount: "KES 416,000",
    createdDate: "2025-01-08",
    approver: "Sarah Johnson",
  },
];

export const cartItems = [
  {
    id: "CAT-001",
    name: "Ergonomic Office Chair",
    quantity: 2,
    price: 38999,
  },
  {
    id: "CAT-002",
    name: "Laptop - Dell XPS 15",
    quantity: 1,
    price: 194999,
  },
  {
    id: "CAT-003",
    name: "Printer Paper (500 sheets)",
    quantity: 5,
    price: 1689,
  },
];

export const cartItemsCart = [
  {
    id: "CAT-001",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    supplier: "Office Pro Ltd",
    price: 38999,
    quantity: 2,
    image: "/ergonomic-office-chair.png",
  },
  {
    id: "CAT-002",
    name: "Laptop - Dell XPS 15",
    category: "IT Equipment",
    supplier: "Tech Solutions Inc",
    price: 194999,
    quantity: 1,
    image: "/modern-laptop.png",
  },
  {
    id: "CAT-003",
    name: "Printer Paper (500 sheets)",
    category: "Office Supplies",
    supplier: "Supplies Direct",
    price: 1689,
    quantity: 5,
    image: "/printer-paper.jpg",
  },
];

export const nonTangibleCartItems = [
  {
    id: "SRV-001",
    name: "Flight Booking - Nairobi to Mombasa",
    category: "Travel",
    supplier: "Kenya Airways",
    price: 15000,
    quantity: 1,
    description: "Round trip business class",
  },
  {
    id: "SRV-002",
    name: "Hotel Accommodation",
    category: "Travel",
    supplier: "Serena Hotels",
    price: 12000,
    quantity: 2,
    description: "3 nights at Serena Beach Resort",
  },
  {
    id: "SRV-003",
    name: "Car Rental",
    category: "Transport",
    supplier: "Avis Kenya",
    price: 8000,
    quantity: 1,
    description: "Toyota Camry for 5 days",
  },
  {
    id: "SRV-005",
    name: "Q1 Marketing Campaign",
    category: "Marketing",
    supplier: "Creative Agency Ltd",
    price: 150000,
    quantity: 1,
    description: "Digital marketing campaign for Q1 product launch",
  },
];

export const pendingApprovals = [
  {
    id: "REQ-2025-006",
    title: "Q1 Office Equipment",
    requester: "Jane Doe",
    department: "IT",
    priority: "High",
    amount: "$2,164.94",
    submittedDate: "2025-01-15",
    daysWaiting: 2,
  },
  {
    id: "REQ-2025-007",
    title: "Marketing Campaign Materials",
    requester: "Bob Wilson",
    department: "Marketing",
    priority: "Urgent",
    amount: "$5,200.00",
    submittedDate: "2025-01-14",
    daysWaiting: 3,
  },
  {
    id: "REQ-2025-008",
    title: "Training Room Equipment",
    requester: "Alice Brown",
    department: "HR",
    priority: "Medium",
    amount: "$1,850.00",
    submittedDate: "2025-01-13",
    daysWaiting: 4,
  },
];

export const approvedRequests = [
  {
    id: "REQ-2025-005",
    title: "Office Supplies Restock",
    requester: "Tom Harris",
    department: "Operations",
    priority: "Low",
    amount: "$245.50",
    approvedDate: "2025-01-12",
  },
  {
    id: "REQ-2025-004",
    title: "IT Infrastructure Upgrade",
    requester: "Sarah Lee",
    department: "IT",
    priority: "High",
    amount: "$15,499.99",
    approvedDate: "2025-01-10",
  },
];

export const rejectedRequests = [
  {
    id: "REQ-2025-003",
    title: "Conference Room Renovation",
    requester: "Mike Chen",
    department: "Facilities",
    priority: "Medium",
    amount: "$8,500.00",
    rejectedDate: "2025-01-09",
    reason: "Budget constraints for Q1",
  },
];

export const requisitionDetails = {
  id: "REQ-2025-006",
  title: "Q1 Office Equipment",
  requester: "Jane Doe",
  department: "IT",
  costCenter: "IT Operations",
  priority: "High",
  status: "Pending Approval",
  submittedDate: "2025-01-15",
  requestedDeliveryDate: "2025-02-01",
  deliveryLocation: "Main Office - Building A",
  businessJustification:
    "These items are essential for the new team members joining in Q1. The ergonomic chairs and laptops will ensure productivity and comfort for the expanding IT department.",
  items: [
    {
      id: "CAT-001",
      name: "Ergonomic Office Chair",
      category: "Furniture",
      supplier: "Office Pro Ltd",
      quantity: 2,
      unitPrice: 299.99,
      total: 599.98,
    },
    {
      id: "CAT-002",
      name: "Laptop - Dell XPS 15",
      category: "IT Equipment",
      supplier: "Tech Solutions Inc",
      quantity: 1,
      unitPrice: 1499.99,
      total: 1499.99,
    },
    {
      id: "CAT-003",
      name: "Printer Paper (500 sheets)",
      category: "Office Supplies",
      supplier: "Supplies Direct",
      quantity: 5,
      unitPrice: 12.99,
      total: 64.95,
    },
    {
      id: "SRV-001",
      name: "Flight Booking - Nairobi to Mombasa",
      category: "Travel",
      supplier: "Kenya Airways",
      quantity: 1,
      unitPrice: 150.0,
      total: 150.0,
    },
  ],
};

export const timeline = [
  {
    title: "Requisition Submitted",
    description: "Jane Doe submitted the requisition",
    date: "2025-01-15 09:30 AM",
    icon: IconFileText,
    color: "blue",
  },
  {
    title: "Pending Line Manager Approval",
    description: "Awaiting approval from John Smith",
    date: "2025-01-15 09:31 AM",
    icon: IconClock,
    color: "orange",
  },
];

export const approvalsPendingReview = [
  {
    id: "REQ-2025-007",
    title: "Marketing Campaign Materials",
    requester: "Bob Wilson",
    department: "Marketing",
    priority: "Urgent",
    amount: "$5,200.00",
    approvedDate: "2025-01-14",
    approver: "Sarah Johnson",
  },
  {
    id: "REQ-2025-008",
    title: "Training Room Equipment",
    requester: "Alice Brown",
    department: "HR",
    priority: "Medium",
    amount: "$1,850.00",
    approvedDate: "2025-01-13",
    approver: "John Smith",
  },
];

export const approvalsInProcurement = [
  {
    id: "REQ-2025-005",
    title: "IT Infrastructure Upgrade",
    requester: "Sarah Lee",
    department: "IT",
    priority: "High",
    amount: "$15,499.99",
    status: "RFQ Sent",
    procurementOfficer: "Mike Davis",
  },
  {
    id: "REQ-2025-004",
    title: "Office Furniture Package",
    requester: "Tom Harris",
    department: "Operations",
    priority: "Medium",
    amount: "$8,750.00",
    status: "PO Created",
    procurementOfficer: "Lisa Chen",
  },
];

export const approvalsCompleted = [
  {
    id: "REQ-2025-003",
    title: "Office Supplies Restock",
    requester: "Jane Doe",
    department: "Operations",
    priority: "Low",
    amount: "$245.50",
    completedDate: "2025-01-10",
    deliveryDate: "2025-01-12",
  },
];

export const purchaseOrders = [
  {
    id: "PO-2025-001",
    requisitionId: "REQ-2025-005",
    projectId: "PROJ-2025-001",
    title: "IT Infrastructure Upgrade",
    supplier: "Tech Solutions Inc",
    amount: "$15,499.99",
    status: "Pending Delivery",
    createdDate: "2025-01-16",
    expectedDelivery: "2025-01-25",
    procurementOfficer: "Mike Davis",
    requester: "Sarah Lee",
    department: "IT",
  },
  {
    id: "PO-2025-004",
    requisitionId: null,
    projectId: null,
    title: "Marketing Campaign Materials",
    supplier: "Print Solutions Ltd",
    amount: "$4,850.00",
    status: "Pending Delivery",
    createdDate: "2025-01-20",
    expectedDelivery: "2025-01-30",
    procurementOfficer: "Mike Davis",
    requester: "System Generated",
    department: "Procurement",
  },
  {
    id: "PO-2025-002",
    requisitionId: "REQ-2025-004",
    projectId: "PROJ-2025-002",
    title: "Office Furniture Package",
    supplier: "Office Pro Ltd",
    amount: "$8,750.00",
    status: "Delivered",
    createdDate: "2025-01-14",
    expectedDelivery: "2025-01-20",
    deliveredDate: "2025-01-19",
    procurementOfficer: "Lisa Chen",
    requester: "Tom Harris",
    department: "Operations",
  },
  {
    id: "PO-2025-003",
    requisitionId: "REQ-2025-007",
    projectId: null,
    title: "Marketing Campaign Materials",
    supplier: "Print Solutions Ltd",
    amount: "$5,200.00",
    status: "In Transit",
    createdDate: "2025-01-15",
    expectedDelivery: "2025-01-22",
    procurementOfficer: "Mike Davis",
    requester: "Bob Wilson",
    department: "Marketing",
  },
];

export const procurementDetails = {
  id: "REQ-2025-005",
  title: "IT Infrastructure Upgrade",
  requester: "Sarah Lee",
  department: "IT",
  costCenter: "IT Operations",
  priority: "High",
  status: "In Procurement",
  procurementStatus: "PO Created",
  submittedDate: "2025-01-12",
  approvedDate: "2025-01-14",
  procurementStartDate: "2025-01-15",
  requestedDeliveryDate: "2025-02-01",
  deliveryLocation: "Main Office - Building A",
  businessJustification:
    "These items are essential for the new team members joining in Q1. The laptops and accessories will ensure productivity for the expanding IT department.",
  approver: "Mike Davis",
  procurementOfficer: "Mike Davis",
  purchaseOrderId: "PO-2025-001",
  items: [
    {
      id: "CAT-002",
      name: "Laptop - Dell XPS 15",
      category: "IT Equipment",
      supplier: "Tech Solutions Inc",
      quantity: 3,
      unitPrice: 194999,
      total: 584997,
      inStock: true,
    },
    {
      id: "CAT-005",
      name: "Wireless Mouse",
      category: "IT Equipment",
      supplier: "Tech Solutions Inc",
      quantity: 3,
      unitPrice: 3899,
      total: 11697,
      inStock: true,
    },
    {
      id: "SRV-002",
      name: "Hotel Accommodation",
      category: "Travel",
      supplier: "Serena Hotels",
      quantity: 1,
      unitPrice: 12000,
      total: 12000,
      inStock: false,
    },
  ],
  subtotal: 608694,
  tax: 109565,
  total: 718259,
};

export const customerFeedback = {
  "REQ-2025-005": {
    hasInStockItems: true,
    itemFeedback: [
      {
        itemId: "CAT-002",
        itemName: "Laptop - Dell XPS 15",
        inStock: true,
        customerPreference: "PO",
        feedback: "Customer prefers direct Purchase Order for faster delivery",
      },
      {
        itemId: "CAT-005",
        itemName: "Wireless Mouse",
        inStock: true,
        customerPreference: "Material Request",
        feedback: "Customer requests Material Request from existing inventory",
      },
      {
        itemId: "SRV-002",
        itemName: "Hotel Accommodation",
        inStock: false,
        customerPreference: "RFQ",
        feedback: "Service not in stock, proceed with RFQ process",
      },
    ],
  },
  "REQ-2025-007": {
    hasInStockItems: true,
    itemFeedback: [
      {
        itemId: "CAT-001",
        itemName: "Ergonomic Office Chair",
        inStock: true,
        customerPreference: "PO",
        feedback:
          "Item in stock but customer wants new purchase for specific department",
      },
      {
        itemId: "CAT-003",
        itemName: "Printer Paper (500 sheets)",
        inStock: true,
        customerPreference: "RFQ",
        feedback:
          "Item in stock but customer wants bulk purchase at better rates",
      },
      {
        itemId: "CAT-005",
        itemName: "Wireless Mouse",
        inStock: true,
        customerPreference: "Material Request",
        feedback: "Customer satisfied with existing inventory stock",
      },
    ],
  },
};

export const suppliers = [
  {
    id: "SUP-001",
    name: "Tech Solutions Inc",
    email: "procurement@techsolutions.co.ke",
    categories: ["IT Equipment", "Software"],
  },
  {
    id: "SUP-002",
    name: "Office Pro Ltd",
    email: "orders@officepro.co.ke",
    categories: ["Furniture", "Office Supplies"],
  },
  {
    id: "SUP-003",
    name: "Print Solutions Ltd",
    email: "quotes@printsolutions.co.ke",
    categories: ["Marketing Materials", "Printing"],
  },
];

export const rfqs = [
  {
    id: "RFQ-2025-001",
    requisitionId: "REQ-2025-007",
    title: "Marketing Campaign Materials",
    supplier: "Print Solutions Ltd",
    status: "Pending Response",
    sentDate: "2025-01-15",
    dueDate: "2025-01-22",
    amount: "$5,200.00",
  },
  {
    id: "RFQ-2025-002",
    requisitionId: "REQ-2025-007",
    title: "Marketing Campaign Materials",
    supplier: "Office Pro Ltd",
    status: "Responded",
    sentDate: "2025-01-15",
    dueDate: "2025-01-22",
    amount: "$5,400.00",
  },
  {
    id: "RFQ-2025-003",
    requisitionId: "REQ-2025-007",
    title: "Marketing Campaign Materials",
    supplier: "Tech Solutions Inc",
    status: "Expired",
    sentDate: "2025-01-15",
    dueDate: "2025-01-22",
    amount: "$5,800.00",
  },
  {
    id: "RFQ-2025-004",
    requisitionId: "REQ-2025-005",
    title: "IT Infrastructure Upgrade",
    supplier: "Tech Solutions Inc",
    status: "Responded",
    sentDate: "2025-01-16",
    dueDate: "2025-01-23",
    amount: "$15,499.99",
  },
  {
    id: "RFQ-2025-005",
    requisitionId: "REQ-2025-005",
    title: "IT Infrastructure Upgrade",
    supplier: "Office Pro Ltd",
    status: "Pending Response",
    sentDate: "2025-01-16",
    dueDate: "2025-01-23",
    amount: "$16,200.00",
  },
  {
    id: "RFQ-2025-006",
    requisitionId: "REQ-2025-008",
    title: "Training Room Equipment",
    supplier: "Office Pro Ltd",
    status: "Responded",
    sentDate: "2025-01-17",
    dueDate: "2025-01-24",
    amount: "$1,850.00",
  },
  {
    id: "RFQ-2025-007",
    requisitionId: "REQ-2025-008",
    title: "Training Room Equipment",
    supplier: "Tech Solutions Inc",
    status: "Pending Response",
    sentDate: "2025-01-17",
    dueDate: "2025-01-24",
    amount: "$1,950.00",
  },
  {
    id: "RFQ-2025-008",
    requisitionId: "REQ-2025-008",
    title: "Training Room Equipment",
    supplier: "Print Solutions Ltd",
    status: "Expired",
    sentDate: "2025-01-17",
    dueDate: "2025-01-24",
    amount: "$2,100.00",
  },
  {
    id: "RFQ-2025-009",
    requisitionId: "REQ-2025-004",
    title: "Office Furniture Package",
    supplier: "Office Pro Ltd",
    status: "Responded",
    sentDate: "2025-01-18",
    dueDate: "2025-01-25",
    amount: "$8,750.00",
  },
];

export const quotations = [
  {
    id: "QUO-2025-001",
    rfqId: "RFQ-2025-001",
    supplier: "Print Solutions Ltd",
    amount: "$4,850.00",
    validUntil: "2025-02-01",
    status: "Accepted",
    submittedDate: "2025-01-18",
  },
  {
    id: "QUO-2025-002",
    rfqId: "RFQ-2025-004",
    supplier: "Tech Solutions Inc",
    amount: "$15,200.00",
    validUntil: "2025-02-05",
    status: "Pending Review",
    submittedDate: "2025-01-19",
  },
];

export const projectTasks = [
  {
    id: "TASK-001",
    projectId: "PROJ-2025-001",
    title: "Conduct IT infrastructure assessment",
    description: "Evaluate current systems and identify upgrade requirements",
    status: "Completed",
    priority: "High",
    assignee: "John Smith",
    dueDate: "2025-01-20",
    completedDate: "2025-01-18",
  },
  {
    id: "TASK-002",
    projectId: "PROJ-2025-001",
    title: "Procure new servers",
    description: "Purchase and install new server hardware",
    status: "In Progress",
    priority: "High",
    assignee: "Sarah Johnson",
    dueDate: "2025-02-15",
  },
  {
    id: "TASK-003",
    projectId: "PROJ-2025-001",
    title: "Network security upgrade",
    description: "Implement enhanced security protocols",
    status: "Pending",
    priority: "Medium",
    assignee: "Mike Davis",
    dueDate: "2025-03-01",
  },
  {
    id: "TASK-004",
    projectId: "PROJ-2025-002",
    title: "Office furniture procurement",
    description: "Source and purchase ergonomic office furniture",
    status: "Completed",
    priority: "Medium",
    assignee: "Alice Brown",
    dueDate: "2025-01-25",
    completedDate: "2025-01-22",
  },
  {
    id: "TASK-005",
    projectId: "PROJ-2025-002",
    title: "Lighting system upgrade",
    description: "Install LED lighting throughout office spaces",
    status: "In Progress",
    priority: "Low",
    assignee: "Tom Wilson",
    dueDate: "2025-02-28",
  },
];

export const projects = [
  {
    id: "PROJ-2025-001",
    name: "IT Infrastructure Upgrade",
    description: "Modernize company IT systems and infrastructure",
    status: "In Progress",
    priority: "High",
    budget: "KES 2,500,000",
    spent: "KES 850,000",
    startDate: "2025-01-01",
    endDate: "2025-06-30",
    manager: "John Smith",
    department: "IT",
    progress: 35,
    tasksCompleted: 1,
    totalTasks: 3,
    team: 5,
  },
  {
    id: "PROJ-2025-002",
    name: "Office Modernization",
    description: "Upgrade office spaces with modern furniture and equipment",
    status: "In Progress",
    priority: "Medium",
    budget: "KES 1,200,000",
    spent: "KES 400,000",
    startDate: "2025-01-15",
    endDate: "2025-04-30",
    manager: "Sarah Johnson",
    department: "Operations",
    progress: 50,
    tasksCompleted: 1,
    totalTasks: 2,
    team: 3,
  },
  {
    id: "PROJ-2025-003",
    name: "Remote Work Setup",
    description: "Provide remote work equipment for employees",
    status: "Planning",
    priority: "Low",
    budget: "KES 800,000",
    spent: "KES 0",
    startDate: "2025-02-01",
    endDate: "2025-05-31",
    manager: "Mike Davis",
    department: "HR",
    progress: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    team: 8,
  },
];

export const projectItemUsage = [
  {
    id: "USAGE-001",
    projectId: "PROJ-2025-001",
    poId: "PO-2025-001",
    itemId: "CAT-002",
    itemName: "Laptop - Dell XPS 15",
    totalQuantity: 3,
    usedQuantity: 2,
    availableQuantity: 1,
    usedDate: "2025-01-20",
    usedBy: "John Smith",
  },
  {
    id: "USAGE-002",
    projectId: "PROJ-2025-002",
    poId: "PO-2025-002",
    itemId: "CAT-001",
    itemName: "Ergonomic Office Chair",
    totalQuantity: 5,
    usedQuantity: 3,
    availableQuantity: 2,
    usedDate: "2025-01-22",
    usedBy: "Sarah Johnson",
  },
];

// Material receipts now reference requisitions instead of quotations
export const materialReceiptsData = [
  {
    id: "MR-001",
    requisitionId: "REQ-2025-001",
    requester: "Demo User",
    department: "IT",
    status: "Pending",
    createdDate: "2025-01-20",
    receivedDate: "-",
    totalAmount: 116997,
    items: [
      {
        name: "Ergonomic Office Chair",
        quantity: 2,
        unitPrice: 38999,
        total: 77998,
        received: 0,
      },
      {
        name: "Laptop - Dell XPS 15",
        quantity: 1,
        unitPrice: 194999,
        total: 194999,
        received: 0,
      },
    ],
  },
  {
    id: "MR-002",
    requisitionId: "REQ-2025-002",
    requester: "Jane Doe",
    department: "Marketing",
    status: "Received",
    createdDate: "2025-01-18",
    receivedDate: "2025-01-22",
    totalAmount: 194999,
    items: [
      {
        name: "Laptop - Dell XPS 15",
        quantity: 1,
        unitPrice: 194999,
        total: 194999,
        received: 1,
      },
    ],
  },
];

export const inventoryItems = [
  {
    id: "INV-001",
    itemId: "CAT-001",
    name: "Ergonomic Office Chair",
    category: "Furniture",
    currentStock: 15,
    minStock: 5,
    maxStock: 50,
    unitPrice: 38999,
    location: "Warehouse A",
    lastUpdated: "2025-01-20",
    status: "In Stock",
  },
  {
    id: "INV-002",
    itemId: "CAT-002",
    name: "Laptop - Dell XPS 15",
    category: "IT Equipment",
    currentStock: 3,
    minStock: 2,
    maxStock: 20,
    unitPrice: 194999,
    location: "IT Storage",
    lastUpdated: "2025-01-19",
    status: "Low Stock",
  },
  {
    id: "INV-003",
    itemId: "CAT-003",
    name: "Printer Paper (500 sheets)",
    category: "Office Supplies",
    currentStock: 0,
    minStock: 10,
    maxStock: 100,
    unitPrice: 1689,
    location: "Supply Room",
    lastUpdated: "2025-01-18",
    status: "Out of Stock",
  },
  {
    id: "INV-004",
    itemId: "CAT-005",
    name: "Wireless Mouse",
    category: "IT Equipment",
    currentStock: 25,
    minStock: 10,
    maxStock: 50,
    unitPrice: 3899,
    location: "IT Storage",
    lastUpdated: "2025-01-20",
    status: "In Stock",
  },
];

export const contracts = [
  {
    id: "CON-2025-001",
    title: "IT Support Services",
    supplier: "Tech Solutions Inc",
    value: "KES 500,000",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    status: "Active",
    renewalDate: "2025-11-01",
  },
];

export const disposalAuctions = [
  {
    id: "DA-2025-001",
    title: "Old Office Equipment Auction",
    description: "Disposal of obsolete computers and furniture",
    startDate: "2025-02-01",
    endDate: "2025-02-15",
    status: "Open for Bidding",
    estimatedValue: "KES 75,000",
    highestBid: "KES 45,000",
  },
];

// Helper function to get stock level for an item
export const getStockLevel = (itemId: string): number => {
  const inventoryItem = inventoryItems.find((inv) => inv.itemId === itemId);
  return inventoryItem ? inventoryItem.currentStock : 0;
};

// Workflow statuses for different modules
export const workflowStatuses = {
  requisition: [
    "Draft",
    "Pending Approval",
    "Approved",
    "In Procurement",
    "Completed",
    "Rejected",
  ],
  contract: [
    "Draft",
    "Under Review",
    "Approved",
    "Active",
    "Expired",
    "Terminated",
  ],
  auction: [
    "Draft",
    "Open for Bidding",
    "Bidding Closed",
    "Awarded",
    "Completed",
    "Cancelled",
  ],
};

export const wishlistItems = [
  {
    id: "CAT-007",
    name: "4K Monitor - 27 inch",
    category: "IT Equipment",
    supplier: "Tech Solutions Inc",
    price: "KES 45,999",
    image: "/modern-laptop.png",
    addedDate: "2025-01-15",
    inStock: true,
  },
  {
    id: "CAT-008",
    name: "Executive Desk Chair",
    category: "Furniture",
    supplier: "Office Pro Ltd",
    price: "KES 52,999",
    image: "/ergonomic-office-chair.png",
    addedDate: "2025-01-12",
    inStock: false,
  },
  {
    id: "CAT-009",
    name: "Mechanical Keyboard",
    category: "IT Equipment",
    supplier: "Tech Solutions Inc",
    price: "KES 8,999",
    image: "/wireless-mouse.png",
    addedDate: "2025-01-10",
    inStock: true,
  },
];

export const notifications = [
  {
    id: "1",
    title: "Requisition Approved",
    message: "Your requisition REQ-2025-001 has been approved by John Smith",
    type: "success",
    time: "2 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "RFQ Response Received",
    message: "Tech Solutions Inc has submitted a quotation for RFQ-2025-004",
    type: "info",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Purchase Order Delivered",
    message: "PO-2025-002 has been successfully delivered",
    type: "success",
    time: "3 hours ago",
    read: true,
  },
  {
    id: "4",
    title: "Approval Required",
    message: "REQ-2025-008 is pending your approval",
    type: "warning",
    time: "5 hours ago",
    read: true,
  },
  {
    id: "5",
    title: "RFQ Expired",
    message: "RFQ-2025-003 has expired without response",
    type: "error",
    time: "1 day ago",
    read: true,
  },
];

// Map procurement IDs to purchase order IDs
export const procurementToPurchaseOrderMap: Record<string, string> = {
  "REQ-2025-005": "PO-2025-001",
  "REQ-2025-004": "PO-2025-002",
  "REQ-2025-007": "PO-2025-003",
};

// Customer feedback for requisitions without in-stock items
export const noStockRequisitions = ["REQ-2025-008"];

export const roles = [
  {
    id: "ROLE-001",
    name: "Administrator",
    description: "Full system access and management",
    userCount: 3,
    permissions: ["All Permissions"],
    status: "Active",
  },
  {
    id: "ROLE-002",
    name: "Procurement Manager",
    description: "Manage procurement processes and approvals",
    userCount: 5,
    permissions: [
      "Approve Requisitions",
      "Manage Suppliers",
      "Create Purchase Orders",
    ],
    status: "Active",
  },
  {
    id: "ROLE-003",
    name: "Requester",
    description: "Create and submit requisitions",
    userCount: 25,
    permissions: ["Create Requisitions", "View Catalogue", "Track Orders"],
    status: "Active",
  },
  {
    id: "ROLE-004",
    name: "Finance Officer",
    description: "Financial oversight and budget management",
    userCount: 2,
    permissions: ["View Reports", "Manage Budgets", "Approve Payments"],
    status: "Active",
  },
];

// Supplier Dashboard Data
export const supplierDashboardStats = [
  {
    title: "Active RFQs",
    value: "8",
    icon: IconFileText,
    color: "blue",
  },
  {
    title: "Pending Quotations",
    value: "3",
    icon: IconClipboardList,
    color: "orange",
  },
  {
    title: "Active Contracts",
    value: "12",
    icon: IconShield,
    color: "green",
  },
  {
    title: "Monthly Revenue",
    value: "KES 2.4M",
    icon: IconChartBar,
    color: "cyan",
  },
];

export const supplierRecentActivity = [
  {
    id: "RFQ-2025-004",
    title: "IT Infrastructure Upgrade",
    status: "Quotation Submitted",
    date: "2 hours ago",
    amount: "KES 584,997",
  },
  {
    id: "RFQ-2025-006",
    title: "Training Room Equipment",
    status: "Pending Response",
    date: "1 day ago",
    amount: "KES 185,000",
  },
  {
    id: "PO-2025-001",
    title: "Laptop Delivery Confirmed",
    status: "In Transit",
    date: "2 days ago",
    amount: "KES 584,997",
  },
];

export const supplierCatalogueItems = [
  {
    id: "SUP-CAT-001",
    name: "Dell XPS 15 Laptop",
    category: "IT Equipment",
    price: 194999,
    stock: 25,
    minOrderQty: 1,
    leadTime: "3-5 days",
    description: "High-performance business laptop with Intel i7 processor",
    specifications: 'Intel i7, 16GB RAM, 512GB SSD, 15.6" Display',
    status: "Active",
  },
  {
    id: "SUP-CAT-002",
    name: "Wireless Mouse - Logitech MX",
    category: "IT Equipment",
    price: 3899,
    stock: 150,
    minOrderQty: 5,
    leadTime: "1-2 days",
    description: "Ergonomic wireless mouse with precision tracking",
    specifications: "2.4GHz wireless, 1000 DPI, Ergonomic design",
    status: "Active",
  },
  {
    id: "SUP-CAT-003",
    name: "USB-C Hub",
    category: "IT Equipment",
    price: 8999,
    stock: 75,
    minOrderQty: 2,
    leadTime: "2-3 days",
    description: "Multi-port USB-C hub with HDMI and ethernet",
    specifications: "4x USB 3.0, HDMI 4K, Ethernet, USB-C PD",
    status: "Active",
  },
  {
    id: "SUP-CAT-004",
    name: "Mechanical Keyboard",
    category: "IT Equipment",
    price: 12999,
    stock: 0,
    minOrderQty: 1,
    leadTime: "7-10 days",
    description: "Professional mechanical keyboard with RGB lighting",
    specifications: "Cherry MX switches, RGB backlight, USB-C",
    status: "Out of Stock",
  },
];

export const supplierRFQs = [
  {
    id: "RFQ-2025-004",
    title: "IT Infrastructure Upgrade",
    client: "Procurement Solutions Ltd",
    status: "Responded",
    receivedDate: "2025-01-16",
    dueDate: "2025-01-23",
    items: 2,
    estimatedValue: "KES 584,997",
  },
  {
    id: "RFQ-2025-006",
    title: "Training Room Equipment",
    client: "Procurement Solutions Ltd",
    status: "Pending Response",
    receivedDate: "2025-01-17",
    dueDate: "2025-01-24",
    items: 3,
    estimatedValue: "KES 185,000",
  },
  {
    id: "RFQ-2025-010",
    title: "Office Setup Package",
    client: "Procurement Solutions Ltd",
    status: "Draft",
    receivedDate: "2025-01-20",
    dueDate: "2025-01-27",
    items: 5,
    estimatedValue: "KES 425,000",
  },
];

export const supplierQuotations = [
  {
    id: "QUO-2025-002",
    rfqId: "RFQ-2025-004",
    title: "IT Infrastructure Upgrade",
    client: "Procurement Solutions Ltd",
    amount: "KES 584,997",
    status: "Pending Review",
    submittedDate: "2025-01-19",
    validUntil: "2025-02-05",
  },
  {
    id: "QUO-2025-003",
    rfqId: "RFQ-2025-006",
    title: "Training Room Equipment",
    client: "Procurement Solutions Ltd",
    amount: "KES 185,000",
    status: "Accepted",
    submittedDate: "2025-01-18",
    validUntil: "2025-02-01",
  },
];

export const supplierOrders = [
  {
    id: "PO-2025-001",
    title: "IT Infrastructure Upgrade",
    client: "Procurement Solutions Ltd",
    amount: "KES 584,997",
    status: "In Progress",
    orderDate: "2025-01-16",
    deliveryDate: "2025-01-25",
    items: 2,
  },
  {
    id: "PO-2025-003",
    title: "Training Room Equipment",
    client: "Procurement Solutions Ltd",
    amount: "KES 185,000",
    status: "Delivered",
    orderDate: "2025-01-14",
    deliveryDate: "2025-01-20",
    deliveredDate: "2025-01-19",
    items: 3,
  },
];

export const purchaseOrderDetails = {
  id: "PO-2025-001",
  requisitionId: "REQ-2025-005",
  title: "IT Infrastructure Upgrade",
  status: "Pending Delivery",
  createdDate: "2025-01-16",
  expectedDelivery: "2025-01-25",
  procurementOfficer: "Mike Davis",
  requester: "Sarah Lee",
  department: "IT",
  costCenter: "IT Operations",
  deliveryLocation: "Main Office - Building A",
  supplier: {
    name: "Tech Solutions Inc",
    address: "123 Tech Street, Nairobi",
    contact: "John Supplier",
    email: "john@techsolutions.co.ke",
    phone: "+254 700 123 456",
  },
  items: [
    {
      id: "CAT-002",
      name: "Laptop - Dell XPS 15",
      description: "High-performance laptop for business use",
      quantity: 3,
      unitPrice: 194999,
      total: 584997,
    },
    {
      id: "CAT-005",
      name: "Wireless Mouse",
      description: "Ergonomic wireless mouse with USB receiver",
      quantity: 3,
      unitPrice: 3899,
      total: 11697,
    },
  ],
  subtotal: 596694,
  tax: 107405,
  total: 704099,
  terms:
    "Payment due within 30 days of delivery. All items must be delivered to the specified location.",
};

// Supplier non-tangible services (subset of main non-tangible items for supplier view)
export const supplierNonTangibleItems = [
  {
    id: "SRV-004",
    name: "Training & Development",
    category: "Professional Services",
    supplier: "Tech Solutions Inc",
    price: "From KES 25,000",
    description: "Employee training and development programs",
    inStock: true,
  },
  {
    id: "SRV-101",
    name: "IT Consulting Services",
    category: "Professional Services",
    supplier: "Tech Solutions Inc",
    price: "From KES 15,000",
    description: "Expert IT consulting and system architecture services",
    inStock: true,
  },
  {
    id: "SRV-102",
    name: "Software Development",
    category: "Professional Services",
    supplier: "Tech Solutions Inc",
    price: "From KES 100,000",
    description: "Custom software development and maintenance services",
    inStock: true,
  },
];

export const supplierProfile = {
  name: "John Doe",
  email: "jdoe@example.com",
  phone: "+254 700 123 456",
  website: "XXXXXXXXXXXXXXXXXXX",
  address: "123 Main St, Nairobi",
  taxId: "XXXXXXXXXX",
  registrationNumber: "ABC123",
  establishedYear: "2020",
  employeeCount: 50,
  annualRevenue: "KES 1,000,000",
  certifications: ["ISO 9001", "ISO 27001", "ISO 13485"],
  categories: [
    "IT Equipment",
    "Software",
    "Hardware",
    "Office Supplies",
    "Furniture",
    "Services",
  ],
  paymentTerms: "30 days net",
  deliveryTerms: "Standard shipping",
};

export const supplierNavItems = [
  { label: "Dashboard", icon: IconHome, href: "/supplier/dashboard" },
  { label: "Catalogue", icon: IconPackage, href: "/supplier/catalogue" },
  { label: "RFQs", icon: IconFileText, href: "/supplier/rfqs" },
  {
    label: "Quotations",
    icon: IconClipboardList,
    href: "/supplier/quotations",
  },
  { label: "Orders", icon: IconTruck, href: "/supplier/orders" },
  { label: "Profile", icon: IconUser, href: "/supplier/profile" },
];

export const recommendedProducts = [
  {
    id: "REC-001",
    name: "Wireless Presentation Remote",
    description:
      "Bluetooth presentation remote with laser pointer for conference rooms",
    category: "Electronics",
    estimatedPrice: "KES 3,500",
    requestedBy: "John Doe",
    requestDate: "2024-01-15",
    reason: "Needed for client presentations in meeting rooms",
    status: "pending",
    type: "product",
  },
  {
    id: "REC-002",
    name: "Ergonomic Standing Desk Converter",
    description:
      "Adjustable standing desk converter for health and productivity",
    category: "Office Furniture",
    estimatedPrice: "KES 25,000",
    requestedBy: "Jane Smith",
    requestDate: "2024-01-14",
    reason: "To improve employee wellness and reduce back strain",
    status: "pending",
    type: "product",
  },
];

export const recommendedServices = [
  {
    id: "REC-003",
    name: "Cloud Storage Backup Service",
    description: "Monthly cloud backup service for critical business data",
    category: "IT Services",
    estimatedPrice: "KES 8,000/month",
    requestedBy: "Mike Johnson",
    requestDate: "2024-01-13",
    reason: "Need reliable backup solution for data security compliance",
    status: "pending",
    type: "service",
  },
];
