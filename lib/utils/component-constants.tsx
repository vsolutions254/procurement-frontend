import {
  IconBriefcase,
  IconMapPin,
  IconTag,
  IconUser,
} from "@tabler/icons-react";
import React, { ReactNode } from "react";

export const categoryIcons: Record<string, ReactNode> = {
  Travel: <IconMapPin size={16} />,
  Transport: <IconBriefcase size={16} />,
  "Professional Services": <IconUser size={16} />,
  Consulting: <IconTag size={16} />,
};
