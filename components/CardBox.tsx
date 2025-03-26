import { Box, Typography } from '@mui/material';
import React from 'react'

type Props = {
  title?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

export default function CardBox({ title, children, style }: Props) {
  return (
    <Box className="rounded-lg border-1 p-6 shadow-md">
        {children}
    </Box>
  )
}
