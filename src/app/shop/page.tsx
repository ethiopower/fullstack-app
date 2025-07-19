'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  FormGroup,
  FormControlLabel,
  IconButton,
  useMediaQuery,
  useTheme,
  Chip,
  TextField,
  InputAdornment
} from '@mui/material';
import { FilterList, Search, ShoppingCart } from '@mui/icons-material';
import Link from 'next/link';
import { THEME } from '@/lib/constants';

// Sample products - in a real app, this would come from an API or database
const products = [
  {
    id: 1,
    name: "Traditional Habesha Kemis",
    price: 299.99,
    description: "Hand-embroidered cotton dress with intricate Ethiopian patterns",
    image: "/images/instagram/imgi_1_278193034_380033810648589_636440153269846173_n.jpg",
    category: "Dresses",
    material: "Cotton",
    size: ["S", "M", "L", "XL"],
    instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/"
  },
  {
    id: 2,
    name: "Modern Tilfi Dress",
    price: 249.99,
    description: "Contemporary take on traditional Ethiopian formal wear",
    image: "/images/instagram/imgi_3_353591052_285357163930407_5308760856456849800_n.jpg",
    category: "Dresses",
    material: "Silk",
    size: ["S", "M", "L"],
    instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/"
  },
  {
    id: 3,
    name: "Ethiopian Wedding Dress",
    price: 499.99,
    description: "Luxurious wedding dress with traditional elements",
    image: "/images/instagram/imgi_7_278407559_1005903230031551_1377516088203914242_n.webp",
    category: "Wedding",
    material: "Premium Cotton",
    size: ["S", "M", "L", "XL"],
    instagramUrl: "https://www.instagram.com/fafresh.cultural.fashion/"
  }
  // Add more products as needed
];

const categories = ["All", "Dresses", "Wedding", "Accessories"];
const materials = ["All", "Cotton", "Silk", "Premium Cotton"];
const sizes = ["S", "M", "L", "XL"];

export default function ShopPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedMaterial, setSelectedMaterial] = useState("All");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesMaterial = selectedMaterial === "All" || product.material === selectedMaterial;
    const matchesSizes = selectedSizes.length === 0 || selectedSizes.some(size => product.size.includes(size));
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesMaterial && matchesSizes && matchesSearch;
  });

  const FilterDrawer = (
    <Box sx={{ width: isMobile ? 250 : 300, p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Filters</Typography>
      
      <Typography variant="subtitle1" sx={{ mb: 1 }}>Category</Typography>
      <List>
        {categories.map((category) => (
          <ListItem
            key={category}
            dense
            button
            onClick={() => setSelectedCategory(category)}
            selected={selectedCategory === category}
          >
            <ListItemText primary={category} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Material</Typography>
      <List>
        {materials.map((material) => (
          <ListItem
            key={material}
            dense
            button
            onClick={() => setSelectedMaterial(material)}
            selected={selectedMaterial === material}
          >
            <ListItemText primary={material} />
          </ListItem>
        ))}
      </List>

      <Typography variant="subtitle1" sx={{ mb: 1, mt: 2 }}>Size</Typography>
      <FormGroup>
        {sizes.map((size) => (
          <FormControlLabel
            key={size}
            control={
              <Checkbox
                checked={selectedSizes.includes(size)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedSizes([...selectedSizes, size]);
                  } else {
                    setSelectedSizes(selectedSizes.filter(s => s !== size));
                  }
                }}
              />
            }
            label={size}
          />
        ))}
      </FormGroup>
    </Box>
  );

  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography
            variant="h1"
            sx={(theme) => ({
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: THEME.typography.headingFamily,
              fontWeight: 500,
              color: theme.palette.text.primary
            })}
          >
            Our Collection
          </Typography>
          
          {isMobile && (
            <IconButton onClick={() => setDrawerOpen(true)}>
              <FilterList />
            </IconButton>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <IconButton
            component={Link}
            href="/cart"
            color="primary"
            sx={{ border: 1, borderColor: 'divider' }}
          >
            <ShoppingCart />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          {selectedCategory !== "All" && (
            <Chip
              label={`Category: ${selectedCategory}`}
              onDelete={() => setSelectedCategory("All")}
            />
          )}
          {selectedMaterial !== "All" && (
            <Chip
              label={`Material: ${selectedMaterial}`}
              onDelete={() => setSelectedMaterial("All")}
            />
          )}
          {selectedSizes.map(size => (
            <Chip
              key={size}
              label={`Size: ${size}`}
              onDelete={() => setSelectedSizes(selectedSizes.filter(s => s !== size))}
            />
          ))}
        </Box>

        <Grid container spacing={4}>
          {!isMobile && (
            <Grid item xs={12} md={3}>
              {FilterDrawer}
            </Grid>
          )}
          
          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {filteredProducts.map((product) => (
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
                      <Box sx={{ mt: 1 }}>
                        {product.size.map(size => (
                          <Chip
                            key={size}
                            label={size}
                            size="small"
                            sx={{ mr: 0.5, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions sx={{ p: 2, pt: 0 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => {
                          // Add to cart functionality
                          console.log(`Added ${product.name} to cart`);
                          // You can integrate with your cart context here
                        }}
                        sx={{
                          bgcolor: THEME.colors.primary,
                          '&:hover': {
                            bgcolor: THEME.colors.secondary
                          }
                        }}
                      >
                        Add to Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        {FilterDrawer}
      </Drawer>
    </Box>
  );
} 