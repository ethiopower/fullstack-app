import { Box, SxProps, Theme } from '@mui/material'

interface LogoProps {
  sx?: SxProps<Theme>
}

export function Logo({ sx }: LogoProps) {
  return (
    <Box
      component="svg"
      viewBox="0 0 200 60"
      sx={{
        width: 'auto',
        height: '100%',
        fill: 'currentColor',
        ...sx,
      }}
    >
      {/* Ethiopian-inspired decorative pattern */}
      <defs>
        <pattern
          id="ethiopianPattern"
          patternUnits="userSpaceOnUse"
          width="10"
          height="10"
          patternTransform="rotate(45)"
        >
          <path
            d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.3"
          />
        </pattern>
      </defs>

      {/* Background pattern */}
      <rect
        x="10"
        y="10"
        width="180"
        height="40"
        fill="url(#ethiopianPattern)"
        rx="5"
      />

      {/* Main text */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: 'Arial',
          fontSize: '28px',
          fontWeight: 'bold',
          letterSpacing: '0.1em',
        }}
      >
        FAFRESH
      </text>

      {/* Decorative line */}
      <path
        d="M40,45 L160,45"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Subtitle */}
      <text
        x="50%"
        y="52"
        textAnchor="middle"
        style={{
          fontFamily: 'Arial',
          fontSize: '10px',
          letterSpacing: '0.2em',
        }}
      >
        FASHION
      </text>
    </Box>
  )
} 