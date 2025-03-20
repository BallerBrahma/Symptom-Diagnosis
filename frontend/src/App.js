import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  CircularProgress,
  ThemeProvider,
  createTheme,
  Autocomplete,
  Alert,
  useMediaQuery,
  Fade,
  IconButton,
  Tooltip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          margin: 4,
        },
      },
    },
  },
});

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        console.log('Fetching symptoms from backend...');
        const response = await axios.get(`${API_BASE_URL}/api/symptoms`);
        console.log('Received symptoms:', response.data);
        if (Array.isArray(response.data)) {
          setAvailableSymptoms(response.data);
          setChatHistory([
            { type: 'bot', content: 'Welcome! Please select your symptoms from the list below.' }
          ]);
        } else {
          console.error('Received invalid symptoms data:', response.data);
          setError('Invalid symptoms data received from server');
        }
      } catch (error) {
        console.error('Error fetching symptoms:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError(`Failed to load available symptoms: ${error.response?.data?.error || error.message}`);
      }
    };
    fetchSymptoms();
  }, []);

  const handleInputChange = (event, newValue) => {
    console.log('Input changed:', newValue);
    setInputValue(newValue);
  };

  const handleAddSymptom = () => {
    if (inputValue && !symptoms.includes(inputValue)) {
      console.log('Adding symptom:', inputValue);
      setSymptoms([...symptoms, inputValue]);
      setInputValue('');
      setChatHistory([
        ...chatHistory,
        { type: 'user', content: `Added symptom: ${inputValue}` },
      ]);
    }
  };

  const handleRemoveSymptom = (symptom) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
    setChatHistory([
      ...chatHistory,
      { type: 'user', content: `Removed symptom: ${symptom}` },
    ]);
  };

  const handleGetDiagnosis = async () => {
    if (symptoms.length === 0) {
      setError('Please add at least one symptom before getting a diagnosis.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/diagnose`, {
        symptoms,
      });
      setDiagnosis(response.data.diagnosis);
      setChatHistory([
        ...chatHistory,
        { type: 'bot', content: `Based on your symptoms, the possible diagnosis is: ${response.data.diagnosis}` },
      ]);
    } catch (error) {
      console.error('Error getting diagnosis:', error);
      setError(error.response?.data?.error || 'Error getting diagnosis. Please try again.');
      setChatHistory([
        ...chatHistory,
        { type: 'error', content: 'Error getting diagnosis. Please try again.' },
      ]);
    }
    setLoading(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        minHeight: '100vh', 
        bgcolor: 'background.default',
        py: { xs: 2, sm: 4 }
      }}>
        <Container maxWidth="md">
          <Fade in timeout={1000}>
            <Paper elevation={3} sx={{ 
              p: { xs: 2, sm: 3 }, 
              height: { xs: '90vh', sm: '80vh' }, 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                gap: 2
              }}>
                <MedicalServicesIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h4" color="primary" sx={{ fontWeight: 600 }}>
                  Symptom Diagnosis
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {/* Chat History */}
              <Box sx={{ 
                flexGrow: 1, 
                overflowY: 'auto', 
                mb: 2,
                px: 1,
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f1f1',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#888',
                  borderRadius: '4px',
                  '&:hover': {
                    background: '#555',
                  },
                },
              }}>
                {chatHistory.map((message, index) => (
                  <Fade in key={index} timeout={500}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Paper
                        sx={{
                          p: 2,
                          backgroundColor: message.type === 'user' ? 'primary.light' : 'secondary.light',
                          color: 'white',
                          maxWidth: '80%',
                          borderRadius: '16px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        <Typography>{message.content}</Typography>
                      </Paper>
                    </Box>
                  </Fade>
                ))}
                {loading && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <CircularProgress />
                  </Box>
                )}
              </Box>

              {/* Symptoms Input */}
              <Box sx={{ 
                display: 'flex', 
                gap: 1, 
                mb: 2,
                flexDirection: { xs: 'column', sm: 'row' }
              }}>
                <Autocomplete
                  fullWidth
                  options={availableSymptoms}
                  value={inputValue}
                  onChange={handleInputChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select or type a symptom"
                      variant="outlined"
                      placeholder="Start typing to see available symptoms"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                        },
                      }}
                    />
                  )}
                  freeSolo
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSymptom()}
                  renderOption={(props, option) => (
                    <li {...props}>
                      {option}
                    </li>
                  )}
                  getOptionLabel={(option) => option || ''}
                  isOptionEqualToValue={(option, value) => option === value}
                />
                <Tooltip title="Add Symptom">
                  <IconButton
                    onClick={handleAddSymptom}
                    disabled={!inputValue}
                    sx={{
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Tooltip>
              </Box>

              {/* Selected Symptoms */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 1, 
                mb: 2,
                minHeight: '60px',
                p: 1,
                bgcolor: 'background.default',
                borderRadius: '8px',
              }}>
                {symptoms.map((symptom) => (
                  <Chip
                    key={symptom}
                    label={symptom}
                    onDelete={() => handleRemoveSymptom(symptom)}
                    color="primary"
                    variant="outlined"
                    deleteIcon={<DeleteIcon />}
                    sx={{
                      '& .MuiChip-deleteIcon': {
                        color: 'primary.main',
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      },
                    }}
                  />
                ))}
              </Box>

              {/* Diagnosis Button */}
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                onClick={handleGetDiagnosis}
                disabled={symptoms.length === 0 || loading}
                endIcon={<SendIcon />}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                }}
              >
                Get Diagnosis
              </Button>
            </Paper>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App; 