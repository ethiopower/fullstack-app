import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ImageUpload from '../ImageUpload';

describe('ImageUpload', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    value: [],
    onChange: mockOnChange,
    maxFiles: 5
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders upload area', () => {
    render(<ImageUpload {...defaultProps} />);
    expect(screen.getByText(/drag & drop images here/i)).toBeInTheDocument();
  });

  it('shows preview of uploaded images', () => {
    const images = ['/test-image-1.jpg', '/test-image-2.jpg'];
    render(<ImageUpload {...defaultProps} value={images} />);

    expect(screen.getByText('Uploaded Images')).toBeInTheDocument();
    const imageElements = screen.getAllByRole('img');
    expect(imageElements).toHaveLength(2);
    expect(imageElements[0]).toHaveAttribute('src', images[0]);
    expect(imageElements[1]).toHaveAttribute('src', images[1]);
  });

  it('handles file upload', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ url: '/uploads/test.jpg' })
    });
    global.fetch = mockFetch;

    render(<ImageUpload {...defaultProps} />);

    const input = screen.getByRole('button');
    const dataTransfer = {
      files: [file],
      types: ['Files']
    };

    fireEvent.drop(input, { dataTransfer });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/upload', expect.any(Object));
      expect(mockOnChange).toHaveBeenCalledWith(['/uploads/test.jpg']);
    });
  });

  it('shows error when file type is invalid', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const dataTransfer = {
      files: [file],
      types: ['Files']
    };

    render(<ImageUpload {...defaultProps} />);

    const input = screen.getByRole('button');
    fireEvent.drop(input, { dataTransfer });

    await waitFor(() => {
      expect(screen.getByText(/invalid file type/i)).toBeInTheDocument();
    });
  });

  it('shows error when max files limit is reached', async () => {
    const images = Array(5).fill('/test-image.jpg');
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const dataTransfer = {
      files: [file],
      types: ['Files']
    };

    render(<ImageUpload {...defaultProps} value={images} />);

    const input = screen.getByRole('button');
    fireEvent.drop(input, { dataTransfer });

    await waitFor(() => {
      expect(screen.getByText(/you can only upload up to 5 images/i)).toBeInTheDocument();
    });
  });

  it('handles image deletion', () => {
    const images = ['/test-image-1.jpg', '/test-image-2.jpg'];
    render(<ImageUpload {...defaultProps} value={images} />);

    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    fireEvent.click(deleteButtons[0]);

    expect(mockOnChange).toHaveBeenCalledWith(['/test-image-2.jpg']);
  });
}); 