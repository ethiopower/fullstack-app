'use client'

import { useState } from 'react'
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Paper,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'
import ReactPlayer from 'react-player'
import { useRouter } from 'next/navigation'

// Mock product data
const products = [
  {
    id: 1,
    name: 'Traditional Habesha Kemis',
    price: 249.99,
    image: 'https://source.unsplash.com/800x600/?ethiopian+dress',
  },
  {
    id: 2,
    name: 'Modern Ethiopian Suit',
    price: 299.99,
    image: 'https://source.unsplash.com/800x600/?suit',
  },
  {
    id: 3,
    name: 'Festival Collection Dress',
    price: 199.99,
    image: 'https://source.unsplash.com/800x600/?festival+dress',
  },
  {
    id: 4,
    name: 'Royal Wedding Attire',
    price: 399.99,
    image: 'https://source.unsplash.com/800x600/?wedding+dress',
  },
]

export default function Home() {
  const router = useRouter()
  const [customizeRows, setCustomizeRows] = useState([{ gender: '', ageGroup: '' }])

  const addCustomizeRow = () => {
    setCustomizeRows([...customizeRows, { gender: '', ageGroup: '' }])
  }

  const updateRow = (index: number, field: 'gender' | 'ageGroup', value: string) => {
    const newRows = [...customizeRows]
    newRows[index] = { ...newRows[index], [field]: value }
    setCustomizeRows(newRows)
  }

  const handleCustomize = () => {
    // Save the customization data and redirect to measurements page
    router.push('/measurements')
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          height: '100vh',
          position: 'relative',
          backgroundImage: 'url(https://source.unsplash.com/1600x900/?ethiopian+culture)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', color: 'white', textAlign: 'center' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            FAFRESH FASHION
          </Typography>
          <Typography variant="h4" gutterBottom>
            Timeless Ethiopian elegance – made custom for you.
          </Typography>
        </Container>
      </Box>

      {/* Customize Section */}
      <Box id="customize" sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h2" component="h2" gutterBottom align="center">
            Customize Your Look
          </Typography>
          <Paper sx={{ p: 4, mt: 4 }}>
            {customizeRows.map((row, index) => (
              <Grid container spacing={3} key={index} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      value={row.gender}
                      label="Gender"
                      onChange={(e) => updateRow(index, 'gender', e.target.value)}
                    >
                      <MenuItem value="male">Male</MenuItem>
                      <MenuItem value="female">Female</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Age Group</InputLabel>
                    <Select
                      value={row.ageGroup}
                      label="Age Group"
                      onChange={(e) => updateRow(index, 'ageGroup', e.target.value)}
                    >
                      <MenuItem value="adult">Adult</MenuItem>
                      <MenuItem value="youth">Youth</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                startIcon={<AddIcon />}
                onClick={addCustomizeRow}
                variant="outlined"
              >
                Add Another Row
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleCustomize}
                size="large"
              >
                Next
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Featured Collection */}
      <Box
        sx={{
          py: 8,
          backgroundImage: 'url(https://source.unsplash.com/1600x900/?ethiopian+fashion)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          <Typography variant="h2" gutterBottom>
            Introducing the Royal Collection
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Video Section */}
      <Box sx={{ py: 8, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Box sx={{ position: 'relative', paddingTop: '56.25%' }}>
            <ReactPlayer
              url="https://www.youtube.com/watch?v=your-video-id"
              width="100%"
              height="100%"
              style={{ position: 'absolute', top: 0, left: 0 }}
              controls
            />
          </Box>
          <Typography variant="h3" align="center" sx={{ mt: 4 }}>
            Crafted with Culture. Designed for You.
          </Typography>
        </Container>
      </Box>

      {/* Shop Collection */}
      <Box id="shop" sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom align="center">
            Shop Collection
          </Typography>
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="300"
                    image={product.image}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6">
                      {product.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      ${product.price}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small">View Options</Button>
                    <Button size="small" variant="contained">Buy Now</Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Second Banner */}
      <Box
        sx={{
          py: 12,
          backgroundImage: 'url(https://source.unsplash.com/1600x900/?ethiopian+textile)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', textAlign: 'center', color: 'white' }}>
          <Typography variant="h2" gutterBottom>
            "Every thread tells a story."
          </Typography>
        </Container>
      </Box>

      {/* Footer */}
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Follow Us
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Add social media icons/links here */}
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button color="inherit">FAQs</Button>
                <Button color="inherit">About Us</Button>
                <Button color="inherit">Terms</Button>
                <Button color="inherit">Shipping</Button>
                <Button color="inherit">Returns</Button>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" gutterBottom>
                Newsletter
              </Typography>
              {/* Add newsletter signup form here */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  )
} 