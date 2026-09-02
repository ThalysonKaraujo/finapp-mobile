import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { CreateCategoryPage } from '@/pages/create-category';
import { CreateObjectivePage } from '@/pages/create-objective';
import { CreateTransactionPage } from '@/pages/create-transaction';
import { CreateWalletPage } from '@/pages/create-wallet';
import { DepositWithdrawObjectivePage } from '@/pages/deposit-withdraw-objective';
import { TransactionDetailsPage } from '@/pages/transaction-details';
import { TransferPage } from '@/pages/transfer';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
      initialRouteName='MainTabs'
    >
      <Stack.Screen name='MainTabs' component={BottomTabNavigator} />

      <Stack.Screen
        name='CreateTransaction'
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

      <Stack.Screen
        name='CreateWallet'
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      >
        {({ navigation }) => (
          <CreateWalletPage
            onBack={() => navigation.goBack()}
            onSuccess={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name='CreateCategory'
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      >
        {({ navigation }) => (
          <CreateCategoryPage
            onBack={() => navigation.goBack()}
            onSuccess={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name='CreateObjective'
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      >
        {({ navigation }) => (
          <CreateObjectivePage
            onBack={() => navigation.goBack()}
            onSuccess={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name='DepositWithdrawObjective'
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      >
        {({ navigation, route }) => (
          <DepositWithdrawObjectivePage
            objective={route.params.objective}
            initialMode={route.params.mode}
            onBack={() => navigation.goBack()}
            onSuccess={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name='Transfer'
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      >
        {({ navigation }) => (
          <TransferPage
            onBack={() => navigation.goBack()}
            onSuccess={() => navigation.goBack()}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name='TransactionDetails'>
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
