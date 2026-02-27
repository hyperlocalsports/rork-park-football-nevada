import React, { useState } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { LocationFilter } from '@/constants/teams';

export const [CityProvider, useCity] = createContextHook(() => {
  const [selectedCity, setSelectedCity] = useState<LocationFilter>('Henderson');
  return { selectedCity, setSelectedCity };
});
