import { keyframes } from '@mui/material';

export const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const fadeInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const fadeInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

export const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

// Animation utility functions
export const fadeInAnimation = (delay = 0) => ({
  animation: `${fadeIn} 0.6s ease-out ${delay}s both`,
});

export const fadeInLeftAnimation = (delay = 0) => ({
  animation: `${fadeInLeft} 0.6s ease-out ${delay}s both`,
});

export const fadeInRightAnimation = (delay = 0) => ({
  animation: `${fadeInRight} 0.6s ease-out ${delay}s both`,
});

export const scaleInAnimation = (delay = 0) => ({
  animation: `${scaleIn} 0.6s ease-out ${delay}s both`,
}); 