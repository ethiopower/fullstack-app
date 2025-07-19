'use client';

import { useState } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
  Box,
  Chip
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { THEME } from '@/lib/constants';

interface Person {
  id: string;
  name: string;
  gender: 'men' | 'women' | 'children';
}

export default function OrderPlanningPage() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [newPerson, setNewPerson] = useState({ name: '', gender: 'men' as const });

  const addPerson = () => {
    if (newPerson.name.trim()) {
      const person: Person = {
        id: Date.now().toString(),
        name: newPerson.name.trim(),
        gender: newPerson.gender
      };
      setPeople([...people, person]);
      setNewPerson({ name: '', gender: 'men' });
    }
  };

  const removePerson = (id: string) => {
    setPeople(people.filter(p => p.id !== id));
  };

  const handleNext = () => {
    if (people.length > 0) {
      // Store order details in sessionStorage
      sessionStorage.setItem('orderPeople', JSON.stringify(people));
      sessionStorage.setItem('currentPersonIndex', '0');
      // Navigate to design selection for first person
      router.push(`/customize/step1?personId=${people[0].id}`);
    }
  };

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontFamily: THEME.typography.headingFamily,
          fontWeight: 500,
          mb: 2,
          color: 'text.primary'
        }}
      >
        Plan Your Custom Order
      </Typography>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 6,
          color: 'text.secondary',
          fontFamily: THEME.typography.headingFamily
        }}
      >
        Tell us who you're ordering for
      </Typography>

      <Grid container spacing={4}>
        {/* Add Person Form */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ bgcolor: 'background.paper', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontFamily: THEME.typography.headingFamily }}>
              Add Person
            </Typography>
            
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Name"
                value={newPerson.name}
                onChange={(e) => setNewPerson({...newPerson, name: e.target.value})}
                placeholder="Enter person's name"
              />
              
              <FormControl component="fieldset">
                <FormLabel component="legend">Category</FormLabel>
                <RadioGroup
                  value={newPerson.gender}
                  onChange={(e) => setNewPerson({...newPerson, gender: e.target.value as any})}
                >
                  <FormControlLabel value="men" control={<Radio />} label="Men's" />
                  <FormControlLabel value="women" control={<Radio />} label="Women's" />
                  <FormControlLabel value="children" control={<Radio />} label="Children's" />
                </RadioGroup>
              </FormControl>
              
              <Button
                variant="contained"
                onClick={addPerson}
                disabled={!newPerson.name.trim()}
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: THEME.colors.primary,
                  '&:hover': { bgcolor: THEME.colors.secondary }
                }}
              >
                Add Person
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* People List */}
        <Grid item xs={12} md={6}>
          <Card elevation={0} sx={{ bgcolor: 'background.paper', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontFamily: THEME.typography.headingFamily }}>
              Order Summary ({people.length} {people.length === 1 ? 'person' : 'people'})
            </Typography>
            
            {people.length === 0 ? (
              <Typography color="text.secondary">No people added yet</Typography>
            ) : (
              <Stack spacing={2}>
                {people.map((person) => (
                  <Box
                    key={person.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body1" fontWeight="medium">
                        {person.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={person.gender.charAt(0).toUpperCase() + person.gender.slice(1)}
                        color="primary"
                      />
                    </Stack>
                    <IconButton
                      onClick={() => removePerson(person.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        sx={{ mt: 6 }}
      >
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={people.length === 0}
          sx={{
            bgcolor: THEME.colors.primary,
            color: 'white',
            px: 6,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              bgcolor: THEME.colors.secondary
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled'
            }
          }}
        >
          Start Customizing ({people.length} {people.length === 1 ? 'order' : 'orders'})
        </Button>
      </Stack>
    </>
  );
} 