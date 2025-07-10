'use client'

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  LocationOn,
  Phone,
  AccessTime,
  DirectionsCar,
  LocalParking,
  ShoppingCart,
} from '@mui/icons-material'

export default function VisitPage() {
  const handleGetDirections = () => {
    window.open('https://www.google.com/maps/place/Fafresh+Cultural+Fashion/@39.0719,-76.9393,17z', '_blank')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Typography variant="h2" component="h1" gutterBottom align="center">
        Visit Our Store
      </Typography>

      <Grid container spacing={4}>
        {/* Store Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Store Location
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <LocationOn color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Address"
                  secondary={
                    <>
                      Inside Global Foods
                      <br />
                      13814 Outlet Dr
                      <br />
                      Silver Spring, MD 20904
                    </>
                  }
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <Phone color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Phone"
                  secondary="(240) 704-9915"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <AccessTime color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Store Hours"
                  secondary={
                    <>
                      Monday - Wednesday: Closed
                      <br />
                      Thursday - Sunday: 10:00 AM - 7:00 PM
                    </>
                  }
                />
              </ListItem>
            </List>

            <Button
              variant="contained"
              size="large"
              startIcon={<DirectionsCar />}
              onClick={handleGetDirections}
              sx={{ mt: 2 }}
              fullWidth
            >
              Get Directions
            </Button>
          </Paper>

          <Paper sx={{ p: 4, mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Visitor Information
            </Typography>

            <List>
              <ListItem>
                <ListItemIcon>
                  <LocalParking color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Parking"
                  secondary="Free parking available in the Briggs Chaney Market Place lot"
                />
              </ListItem>

              <ListItem>
                <ListItemIcon>
                  <ShoppingCart color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Shopping Experience"
                  secondary="Browse our collection of traditional Ethiopian clothing, modern fusion designs, and accessories. Our staff is happy to assist with measurements and style selection."
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>

        {/* Map */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ height: '600px', width: '100%' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3098.675186657116!2d-76.9393!3d39.0719!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89b7c0a8b8b8b8b9%3A0x1b8b8b8b8b8b8b8b!2sFafresh%20Cultural%20Fashion!5e0!3m2!1sen!2sus!4v1625000000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
} 