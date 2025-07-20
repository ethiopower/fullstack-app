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
  Chip,
  Divider
} from '@mui/material';
import { Add as AddIcon, Remove as RemoveIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { THEME } from '@/lib/constants';

interface Person {
  id: string;
  name: string;
  gender: 'men' | 'women' | 'children';
  ageGroup: 'adult' | 'child';
}

export default function OrderPlanningPage() {
  const router = useRouter();
  const [people, setPeople] = useState<Person[]>([]);
  const [newPerson, setNewPerson] = useState({ 
    name: '', 
    gender: 'men' as 'men' | 'women',
    ageGroup: 'adult' as 'adult' | 'child'
  });

  const addPerson = () => {
    if (newPerson.name.trim()) {
      const person: Person = {
        id: Date.now().toString(),
        name: newPerson.name.trim(),
        gender: newPerson.ageGroup === 'child' ? 'children' : newPerson.gender,
        ageGroup: newPerson.ageGroup
      };
      setPeople([...people, person]);
      setNewPerson({ name: '', gender: 'men', ageGroup: 'adult' });
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

  const getDisplayGender = (person: Person) => {
    if (person.ageGroup === 'child') {
      return `Child (${person.gender === 'men' ? 'Boy' : 'Girl'})`;
    }
    return person.gender === 'men' ? 'Men' : 'Women';
  };

  const adultCount = people.filter(p => p.ageGroup === 'adult').length;
  const childCount = people.filter(p => p.ageGroup === 'child').length;

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
              
              {/* Age Group Selection */}
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                  Age Group
                </FormLabel>
                <RadioGroup
                  value={newPerson.ageGroup}
                  onChange={(e) => setNewPerson({
                    ...newPerson, 
                    ageGroup: e.target.value as 'adult' | 'child',
                    gender: e.target.value === 'child' ? 'men' : newPerson.gender
                  })}
                  sx={{ flexDirection: 'row' }}
                >
                  <FormControlLabel 
                    value="adult" 
                    control={<Radio sx={{ color: THEME.colors.primary }} />} 
                    label="Adult" 
                  />
                  <FormControlLabel 
                    value="child" 
                    control={<Radio sx={{ color: THEME.colors.primary }} />} 
                    label="Child" 
                  />
                </RadioGroup>
              </FormControl>

              {/* Gender Selection */}
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontWeight: 600, mb: 1 }}>
                  {newPerson.ageGroup === 'child' ? 'Child Gender' : 'Gender'}
                </FormLabel>
                                  <RadioGroup
                    value={newPerson.gender}
                    onChange={(e) => setNewPerson({...newPerson, gender: e.target.value as 'men' | 'women'})}
                    sx={{ flexDirection: 'row' }}
                  >
                  <FormControlLabel 
                    value="men" 
                    control={<Radio sx={{ color: THEME.colors.primary }} />} 
                    label={newPerson.ageGroup === 'child' ? 'Boy' : 'Male'} 
                  />
                  <FormControlLabel 
                    value="women" 
                    control={<Radio sx={{ color: THEME.colors.primary }} />} 
                    label={newPerson.ageGroup === 'child' ? 'Girl' : 'Female'} 
                  />
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

            {/* Category Counts */}
            {people.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                  {adultCount > 0 && (
                    <Chip 
                      label={`${adultCount} Adult${adultCount > 1 ? 's' : ''}`}
                      color="primary"
                      variant="outlined"
                    />
                  )}
                  {childCount > 0 && (
                    <Chip 
                      label={`${childCount} Child${childCount > 1 ? 'ren' : ''}`}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Stack>
                <Divider sx={{ mb: 2 }} />
              </Box>
            )}
            
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
                      borderRadius: 1,
                      bgcolor: person.ageGroup === 'child' ? 'rgba(156, 39, 176, 0.05)' : 'rgba(26, 77, 46, 0.05)'
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Typography variant="body1" fontWeight="medium">
                        {person.name}
                      </Typography>
                      <Chip 
                        size="small" 
                        label={getDisplayGender(person)}
                        color={person.ageGroup === 'child' ? 'secondary' : 'primary'}
                        variant="outlined"
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

            {people.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  onClick={handleNext}
                  sx={{
                    bgcolor: THEME.colors.primary,
                    color: 'white',
                    py: 2,
                    fontSize: '1.1rem',
                    '&:hover': {
                      bgcolor: THEME.colors.secondary
                    }
                  }}
                >
                  Start Designing ({people.length} {people.length === 1 ? 'Person' : 'People'})
                </Button>
              </Box>
            )}
          </Card>
        </Grid>
      </Grid>
    </>
  );
} 