import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CreateTransactionPage } from '@/pages/create-transaction';
import { TransactionDetailsPage } from '@/pages/transaction-details';
import { TransactionsFeedPage } from '@/pages/transactions-feed';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName="TransactionsFeed"
    >
      <Stack.Screen name="TransactionsFeed">
        {({ navigation }) => (
          <TransactionsFeedPage
            onNavigateToCreate={() => navigation.navigate('CreateTransaction')}
            onSelectTransaction={(transaction) =>
              navigation.navigate('TransactionDetails', { transaction })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="CreateTransaction"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      >
        {({ navigation }) => (
          <CreateTransactionPage
            onBack={() => navigation.goBack()}
            onSuccess={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="TransactionDetails">
        {({ navigation, route }) => (
          <TransactionDetailsPage
            transaction={route.params.transaction}
            onBack={() => navigation.goBack()}
            onDeleted={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};
