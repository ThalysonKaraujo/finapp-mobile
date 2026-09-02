import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { useAuthStore } from '@/features/auth';
import { AppNavigator } from './AppNavigator';
import { AuthNavigator } from './AuthNavigator';

export const Navigation: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
