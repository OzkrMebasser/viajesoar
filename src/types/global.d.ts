import type {Messages} from './messages';

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}

// src/types/messages.ts (CREAR ESTE ARCHIVO NUEVO)
export interface Messages {
  Navigation: {
    home: string;
    holidays: string;
    destinations: string;
    flights: string;
    offers: string;
    blog: string;
    contact: string;
    navigation: string;
    trending: string;
    login: string;
  };
  Search: {
    placeholder: string;
    noResults: string;
    tryDifferent: string;
    popularSearches: string;
    searchLabel: string;
  };
  User: {
    login: string;
    loginLabel: string;
    user: string;
  };
  Menu: {
    openMenu: string;
    closeMenu: string;
  };
  Common: {
    goToHome: string;
  };

  SearchResult : {
    id: number;
    title: string;
    category: string;
    description: string;
  };
}
