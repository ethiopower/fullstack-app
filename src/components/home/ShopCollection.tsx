'use client';

import { Box, Button, Container, Grid, Typography, Card, CardMedia, CardContent, CardActions } from '@mui/material';
import Link from 'next/link';
import { THEME } from '@/lib/constants';

// Sample products - in a real app, this would come from an API or database
const featuredProducts = [
  {
    id: 1,
    name: "Traditional Habesha Kemis",
    price: 299.99,
    description: "Hand-embroidered cotton dress with intricate Ethiopian patterns",
    image: "/images/instagram/imgi_1_278193034_380033810648589_636440153269846173_n.jpg",
    instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/"
  },
  {
    id: 2,
    name: "Modern Tilfi Dress",
    price: 249.99,
    description: "Contemporary take on traditional Ethiopian formal wear",
    image: "/images/instagram/imgi_3_353591052_285357163930407_5308760856456849800_n.jpg",
    instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/"
  },
  {
    id: 3,
    name: "Ethiopian Wedding Dress",
    price: 499.99,
    description: "Luxurious wedding dress with traditional elements",
    image: "/images/instagram/imgi_7_278407559_1005903230031551_1377516088203914242_n.webp",
    instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/"
  }
];

const ShopCollection = () => {
  return (
    <Box component="section" sx={{ py: THEME.spacing.section, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          textAlign="center"
          sx={{
            mb: 6,
            fontFamily: THEME.typography.headingFamily,
            fontSize: { xs: '2rem', md: '2.5rem' }
          }}
        >
          View All Collection
        </Typography>

        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    '& .MuiCardMedia-root': {
                      transform: 'scale(1.05)'
                    }
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '133%', overflow: 'hidden' }}>
                  <CardMedia
                    component="img"
                    image={product.image}
                    alt={product.name}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    ${product.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="outlined"
                    fullWidth
                    component={Link}
                    href={`/customize?product=${product.id}`}
                    sx={{
                      borderColor: THEME.colors.primary,
                      color: THEME.colors.primary,
                      '&:hover': {
                        borderColor: THEME.colors.secondary,
                        bgcolor: 'rgba(214, 28, 78, 0.1)'
                      }
                    }}
                  >
                    Customize
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            component={Link}
            href="/shop"
            sx={{
              bgcolor: THEME.colors.primary,
              color: 'white',
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                bgcolor: THEME.colors.secondary
              }
            }}
          >
            View All Products
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default ShopCollection; 