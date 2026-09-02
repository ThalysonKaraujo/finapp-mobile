import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BarChart3, Receipt, Wallet } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReportsPage } from '@/pages/reports';
import { TransactionsFeedPage } from '@/pages/transactions-feed';
import { WalletsAndObjectivesPage } from '@/pages/wallets-and-objectives';
import { colors, typography } from '@/shared/theme';
import { AppStackParamList, AppTabParamList } from './types';

const Tab = createBottomTabNavigator<AppTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: [
          styles.tabBar,
          {
            height: 56 + (insets.bottom > 0 ? insets.bottom : 6),
            paddingBottom: insets.bottom > 0 ? insets.bottom : 6,
          },
        ],
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name='TransactionsTab'
        options={{
          tabBarLabel: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Receipt size={size} color={color} />
          ),
        }}
      >
        {() => (
          <TransactionsFeedPage
            onNavigateToCreate={() => navigation.navigate('CreateTransaction')}
            onSelectTransaction={(transaction) =>
              navigation.navigate('TransactionDetails', { transaction })
            }
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name='WalletsAndObjectivesTab'
        options={{
          tabBarLabel: 'Carteiras & Metas',
          tabBarIcon: ({ color, size }) => <Wallet size={size} color={color} />,
        }}
      >
        {() => (
          <WalletsAndObjectivesPage
            onNavigateToCreateWallet={() => navigation.navigate('CreateWallet')}
            onNavigateToCreateObjective={() =>
              navigation.navigate('CreateObjective')
            }
            onNavigateToTransfer={() => navigation.navigate('Transfer')}
            onNavigateToDepositWithdraw={(objective, mode) =>
              navigation.navigate('DepositWithdrawObjective', {
                objective,
                mode,
              })
            }
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name='ReportsTab'
        component={ReportsPage}
        options={{
          tabBarLabel: 'Relatórios',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 6,
  },
  tabLabel: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 11,
  },
});
