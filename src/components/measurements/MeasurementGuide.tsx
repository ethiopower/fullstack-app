import { Box, Typography } from '@mui/material'

interface MeasurementGuideProps {
  field: string
}

export function MeasurementGuide({ field }: MeasurementGuideProps) {
  const guides = {
    chest: {
      path: 'M50,30 C50,30 70,30 100,30 C130,30 150,30 150,30',
      text: 'Measure around the fullest part of your chest',
      y: 30,
    },
    waist: {
      path: 'M50,60 C50,60 70,60 100,60 C130,60 150,60 150,60',
      text: 'Measure around your natural waistline',
      y: 60,
    },
    hips: {
      path: 'M50,90 C50,90 70,90 100,90 C130,90 150,90 150,90',
      text: 'Measure around the fullest part of your hips',
      y: 90,
    },
    length: {
      path: 'M100,20 L100,160',
      text: 'Measure from shoulder to desired length',
      y: 90,
    },
    shoulders: {
      path: 'M40,20 L160,20',
      text: 'Measure across shoulders from edge to edge',
      y: 20,
    },
    sleeves: {
      path: 'M160,20 C160,20 140,40 130,80',
      text: 'Measure from shoulder to desired sleeve length',
      y: 50,
    },
  }

  const guide = guides[field as keyof typeof guides]

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        viewBox="0 0 200 200"
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* Body outline */}
        <path
          d="M100,10 
             C120,10 130,20 130,30
             C130,40 120,50 120,60
             C120,90 130,100 130,120
             C130,140 120,160 100,180
             C80,160 70,140 70,120
             C70,100 80,90 80,60
             C80,50 70,40 70,30
             C70,20 80,10 100,10"
          stroke="currentColor"
          fill="none"
          strokeWidth="2"
          opacity="0.3"
        />

        {/* Measurement line */}
        {guide && (
          <>
            <path
              d={guide.path}
              stroke="#0F9D58"
              strokeWidth="3"
              fill="none"
              strokeDasharray="5,5"
            />
            <circle
              cx="100"
              cy={guide.y}
              r="3"
              fill="#0F9D58"
            />
          </>
        )}
      </svg>

      {guide && (
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          {guide.text}
        </Typography>
      )}
    </Box>
  )
} 