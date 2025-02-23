import React from 'react';
import { Box, Typography } from "@mui/material";

const colorVariants = ["default", "success", "warning", "error", "info"] as const;
type ColorVariant = (typeof colorVariants)[number];

type Props = {
  children?: React.ReactNode;
  title?: string;
  value?: string | number;
  subtitle?: string;
  style?: React.CSSProperties;
  colorVariant?: ColorVariant;
  icon?: React.ReactNode;
};

export default function CardBoxDashboard({
  children,
  title,
  value,
  subtitle,
  style,
  icon,
  colorVariant = "default"
}: Props) {
  const colorMap: Record<ColorVariant, string> = {
    default: "#ddd",
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336",
    info: "#2196f3",
  };

  return (
    <Box
      className="rounded-lg p-6 shadow-md transition-all duration-300 hover:shadow-lg"
      sx={{
        backgroundColor: colorMap[colorVariant],
        ...style
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <Typography className="text-white font-medium text-sm">
            {title || "No title"}
          </Typography>
          {icon && <span className="text-white opacity-80">{icon}</span>}
        </div>

        <div className="flex flex-col gap-2">
          {value && (
            <Typography className="text-white text-4xl font-bold">
              {value}
            </Typography>
          )}
          {subtitle && (
            <Typography className="text-white/70 text-sm">
              {subtitle}
            </Typography>
          )}
        </div>
      </div>
      {children}
    </Box>
  );
}