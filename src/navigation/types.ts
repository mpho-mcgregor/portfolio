import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeTab: undefined;
  BrowseTab: { categoryId?: string; province?: string } | undefined;
  FavoritesTab: undefined;
  AccountTab: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  CreativeDetail: { creativeId: string };
  Booking: { creativeId: string; serviceId?: string };
  Checkout: {
    creativeId: string;
    creativeName: string;
    serviceId: string;
    serviceTitle: string;
    amount: number;
    date: string;
    name: string;
  };
  Dashboard: undefined;
  BecomeCreative: undefined;
  Auth: undefined;
};
