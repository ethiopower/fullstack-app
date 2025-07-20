'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Person {
  id: string;
  name: string;
  gender: 'men' | 'women' | 'children';
  ageGroup: 'adult' | 'child';
  designId?: string;
  size?: string;
  measurements?: Record<string, string>;
}

interface OrderContextType {
  people: Person[];
  currentPersonIndex: number;
  setPeople: (people: Person[]) => void;
  updatePerson: (personId: string, updates: Partial<Person>) => void;
  nextPerson: () => void;
  previousPerson: () => void;
  isLastPerson: () => boolean;
  isFirstPerson: () => boolean;
  getCurrentPerson: () => Person | null;
  isPersonComplete: (person: Person) => boolean;
  areAllPeopleComplete: () => boolean;
}

const OrderContext = createContext<OrderContextType | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>([]);
  const [currentPersonIndex, setCurrentPersonIndex] = useState(0);

  // Load initial state from sessionStorage
  useEffect(() => {
    const storedPeople = sessionStorage.getItem('orderPeople');
    if (storedPeople) {
      setPeople(JSON.parse(storedPeople));
    }
    const storedIndex = sessionStorage.getItem('currentPersonIndex');
    if (storedIndex) {
      setCurrentPersonIndex(parseInt(storedIndex));
    }
  }, []);

  // Save state changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('orderPeople', JSON.stringify(people));
    sessionStorage.setItem('currentPersonIndex', currentPersonIndex.toString());
  }, [people, currentPersonIndex]);

  const updatePerson = (personId: string, updates: Partial<Person>) => {
    setPeople(people.map(person => 
      person.id === personId ? { ...person, ...updates } : person
    ));
  };

  const nextPerson = () => {
    if (currentPersonIndex < people.length - 1) {
      setCurrentPersonIndex(currentPersonIndex + 1);
    }
  };

  const previousPerson = () => {
    if (currentPersonIndex > 0) {
      setCurrentPersonIndex(currentPersonIndex - 1);
    }
  };

  const isLastPerson = () => currentPersonIndex === people.length - 1;
  const isFirstPerson = () => currentPersonIndex === 0;
  const getCurrentPerson = () => people[currentPersonIndex] || null;

  const isPersonComplete = (person: Person) => {
    if (!person.designId) return false;
    if (!person.size) return false;
    if (person.size === 'Custom' && !person.measurements) return false;
    return true;
  };

  const areAllPeopleComplete = () => people.every(isPersonComplete);

  return (
    <OrderContext.Provider value={{
      people,
      currentPersonIndex,
      setPeople,
      updatePerson,
      nextPerson,
      previousPerson,
      isLastPerson,
      isFirstPerson,
      getCurrentPerson,
      isPersonComplete,
      areAllPeopleComplete
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
} 