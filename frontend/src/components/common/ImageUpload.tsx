'use client';

import { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Stack,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { THEME } from '@/lib/constants';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
}

export default function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (value.length + acceptedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} images`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadPromises = acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload image');
        }

        const data = await response.json();
        return data.url;
      });

      const urls = await Promise.all(uploadPromises);
      onChange([...value, ...urls]);
    } catch (err) {
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, [value, onChange, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: maxFiles - value.length
  });

  const handleDelete = (index: number) => {
    const newUrls = [...value];
    newUrls.splice(index, 1);
    onChange(newUrls);
  };

  return (
    <Box>
      {/* Upload Area */}
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? THEME.colors.primary : 'grey.300',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          bgcolor: isDragActive ? `${THEME.colors.primary}10` : 'transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            borderColor: THEME.colors.primary,
            bgcolor: `${THEME.colors.primary}10`
          }
        }}
      >
        <input {...getInputProps()} />
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: 100 }}
        >
          {uploading ? (
            <CircularProgress />
          ) : (
            <>
              <UploadIcon
                sx={{
                  fontSize: 40,
                  color: isDragActive ? THEME.colors.primary : 'text.secondary'
                }}
              />
              <Typography color="text.secondary">
                {isDragActive
                  ? 'Drop the images here'
                  : 'Drag & drop images here, or click to select'}
              </Typography>
            </>
          )}
        </Stack>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Image Preview */}
      {value.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Uploaded Images
          </Typography>
          <Grid container spacing={2}>
            {value.map((url, index) => (
              <Grid item xs={6} sm={4} md={3} key={url}>
                <Box
                  sx={{
                    position: 'relative',
                    paddingTop: '100%',
                    borderRadius: 1,
                    overflow: 'hidden',
                    boxShadow: 1
                  }}
                >
                  <Box
                    component="img"
                    src={url}
                    alt={`Upload ${index + 1}`}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                  <IconButton
                    onClick={() => handleDelete(index)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Box>
  );
} 