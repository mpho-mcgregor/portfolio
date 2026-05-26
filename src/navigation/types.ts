import { NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
  HomeTab: undefined;
  BrowseTab: { categoryId?: string; province?: string } | undefined;
  FavoritesTab: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  CreativeDetail: { creativeId: string };
  Booking: { creativeId: string; serviceId?: string };
};
