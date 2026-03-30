export const ROUTES = {
  // Tab routes
  HOME:      'Home',
  LEARN:     'Learn',
  PROFILE:   'Profile',
  // Stack routes (inside Learn tab)
  LANGUAGES: 'Languages',
  SECTIONS:  'Sections',
  STUDY:     'Study',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

/** Param list for the main stack navigator */
export type RootStackParamList = {
  MainTabs:  undefined;
  Languages: undefined;
  Sections: {
    language: string;
    languageName: string;
  };
  Study: {
    language: string;
    sectionId: string;
    sectionTitle: string;
  };
};

/** Param list for the bottom tab navigator */
export type TabParamList = {
  Home:    undefined;
  Learn:   undefined;
  Profile: undefined;
};

