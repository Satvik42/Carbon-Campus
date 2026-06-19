import { create } from 'zustand';
import { db } from '../lib/db';
import { UserProfile, ChatMessage, ActionJourneyItem } from '../types';

interface AppState {
  profile: UserProfile | null;
  isOnboarded: boolean;
  journeyItems: ActionJourneyItem[];
  chatMessages: ChatMessage[];
  loadingAssistant: boolean;
  reducedMotion: boolean;
  isDbLoaded: boolean;
  
  loadFromDB: () => Promise<void>;
  saveProfile: (profileData: Omit<UserProfile, 'createdAt'>) => Promise<void>;
  addChatMessage: (role: 'user' | 'assistant', content: string, structuredData?: ChatMessage['structuredData']) => Promise<void>;
  clearChatHistory: () => Promise<void>;
  toggleJourneyStatus: (id: number, status: ActionJourneyItem['status']) => Promise<void>;
  seedJourney: (profile: UserProfile) => Promise<void>;
  setReducedMotion: (reduced: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  profile: null,
  isOnboarded: false,
  journeyItems: [],
  chatMessages: [],
  loadingAssistant: false,
  reducedMotion: false,
  isDbLoaded: false,

  loadFromDB: async () => {
    try {
      const profiles = await db.profile.toArray();
      const messages = await db.chat_history.orderBy('timestamp').toArray();
      const journey = await db.journey.orderBy('week').toArray();

      const userProfile = profiles[0] || null;
      set({
        profile: userProfile,
        isOnboarded: !!userProfile,
        chatMessages: messages,
        journeyItems: journey,
        isDbLoaded: true,
      });
    } catch (error) {
      console.error('Failed to load data from IndexedDB:', error);
      set({ isDbLoaded: true });
    }
  },

  saveProfile: async (profileData) => {
    try {
      // Clear existing profiles (we only maintain one active user profile for offline privacy)
      await db.profile.clear();
      
      const newProfile: UserProfile = {
        ...profileData,
        createdAt: Date.now(),
      };
      
      const id = await db.profile.add(newProfile);
      newProfile.id = id;

      set({
        profile: newProfile,
        isOnboarded: true,
      });

      // Automatically seed journey based on preferences
      await get().seedJourney(newProfile);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  },

  addChatMessage: async (role, content, structuredData) => {
    try {
      const newMessage: ChatMessage = {
        role,
        content,
        timestamp: Date.now(),
        structuredData,
      };
      
      const id = await db.chat_history.add(newMessage);
      newMessage.id = id;

      set((state) => ({
        chatMessages: [...state.chatMessages, newMessage],
      }));
    } catch (error) {
      console.error('Failed to add chat message:', error);
    }
  },

  clearChatHistory: async () => {
    try {
      await db.chat_history.clear();
      set({ chatMessages: [] });
    } catch (error) {
      console.error('Failed to clear chat history:', error);
    }
  },

  toggleJourneyStatus: async (id, status) => {
    try {
      await db.journey.update(id, { status, updatedAt: Date.now() });
      set((state) => ({
        journeyItems: state.journeyItems.map((item) =>
          item.id === id ? { ...item, status, updatedAt: Date.now() } : item
        ),
      }));
    } catch (error) {
      console.error('Failed to update journey status:', error);
    }
  },

  seedJourney: async (profile) => {
    try {
      await db.journey.clear();
      
      const baseJourneyItems: Omit<ActionJourneyItem, 'id' | 'updatedAt'>[] = [];

      // Week 1 Actions
      if (!profile.ledBulbs) {
        baseJourneyItems.push({
          week: 1,
          action: 'Switch 5 Bulbs to LEDs',
          description: 'Replace five energy-guzzling incandescent lightbulbs in highly-trafficked rooms with high-efficiency LEDs.',
          estimatedCO2Saved: 6.2,
          category: 'energy',
          status: 'pending',
        });
      } else {
        baseJourneyItems.push({
          week: 1,
          action: 'Perform a Standby Audit',
          description: 'Identify and unplug 5 vampire loads (electronics on standby mode like TVs, consoles, and chargers) when not in use.',
          estimatedCO2Saved: 2.5,
          category: 'energy',
          status: 'pending',
        });
      }

      if (profile.transportPreference === 'car') {
        baseJourneyItems.push({
          week: 1,
          action: 'Carpool Once This Week',
          description: 'Share a commute with a colleague or friend instead of driving alone. Saves fuel and emissions.',
          estimatedCO2Saved: 10.5,
          category: 'transport',
          status: 'pending',
        });
      } else {
        baseJourneyItems.push({
          week: 1,
          action: 'Walk or Bike for Short Errands',
          description: 'Leave the car behind for all trips under 3 km this week. Great for your health and the climate.',
          estimatedCO2Saved: 3.5,
          category: 'transport',
          status: 'pending',
        });
      }

      // Week 2 Actions
      if (profile.dietPreference === 'meat-heavy') {
        baseJourneyItems.push({
          week: 2,
          action: 'Introduce Meatless Monday',
          description: 'Replace beef and pork meals with vegetarian alternatives for one full day to significantly cut dietary carbon.',
          estimatedCO2Saved: 7.8,
          category: 'food',
          status: 'pending',
        });
      } else {
        baseJourneyItems.push({
          week: 2,
          action: 'Reduce Food Waste by 50%',
          description: 'Audit your fridge before shopping, create a strict meal plan, and freeze leftovers to eliminate food waste.',
          estimatedCO2Saved: 4.2,
          category: 'food',
          status: 'pending',
        });
      }

      if (!profile.smartThermostat) {
        baseJourneyItems.push({
          week: 2,
          action: 'Nudge Thermostat by 2°F',
          description: 'Manually adjust your thermostat by 2 degrees (cooler in winter, warmer in summer) to save HVAC energy.',
          estimatedCO2Saved: 5.0,
          category: 'energy',
          status: 'pending',
        });
      }

      // Week 3 Actions
      if (profile.commutingDays > 0) {
        baseJourneyItems.push({
          week: 3,
          action: 'Work Remotely for One Day',
          description: 'Skip the commute entirely and work from home for a day, avoiding road emissions completely.',
          estimatedCO2Saved: 12.0,
          category: 'lifestyle',
          status: 'pending',
        });
      }

      baseJourneyItems.push({
          week: 3,
          action: 'Repair or Buy Second-hand',
          description: 'Need something new? Source a garment or home item second-hand or repair an existing one instead of buying new.',
          estimatedCO2Saved: 15.0,
          category: 'shopping',
          status: 'pending',
      });

      // Week 4 Actions
      if (profile.transportPreference === 'car') {
        baseJourneyItems.push({
          week: 4,
          action: 'Take Public Transport Once',
          description: 'Try the bus or train for a journey where you would normally drive alone.',
          estimatedCO2Saved: 8.5,
          category: 'transport',
          status: 'pending',
        });
      }

      if (!profile.solarPanels) {
        baseJourneyItems.push({
          week: 4,
          action: 'Explore Community Solar',
          description: 'Look into a community solar program in your area to purchase green grid energy without physical panels.',
          estimatedCO2Saved: 18.0,
          category: 'energy',
          status: 'pending',
        });
      }

      // Populate IndexedDB and set state
      const seeded: ActionJourneyItem[] = [];
      for (const item of baseJourneyItems) {
        const fullItem: ActionJourneyItem = {
          ...item,
          updatedAt: Date.now(),
        };
        const id = await db.journey.add(fullItem);
        fullItem.id = id;
        seeded.push(fullItem);
      }

      set({ journeyItems: seeded });
    } catch (error) {
      console.error('Failed to seed journey items:', error);
    }
  },

  setReducedMotion: (reduced) => {
    set({ reducedMotion: reduced });
  },
}));
