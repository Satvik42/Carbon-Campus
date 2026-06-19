import Dexie, { type Table } from 'dexie';
import { UserProfile, ChatMessage, SimulationRecord, ActionJourneyItem } from '../types';

export class CarbonCompassDatabase extends Dexie {
  profile!: Table<UserProfile>;
  chat_history!: Table<ChatMessage>;
  history!: Table<SimulationRecord>;
  journey!: Table<ActionJourneyItem>;

  constructor() {
    super('CarbonCompassDatabase');
    this.version(1).stores({
      profile: '++id, dietPreference, transportPreference, createdAt',
      chat_history: '++id, role, timestamp',
      history: '++id, scenarioId, timestamp',
      journey: '++id, week, category, status, updatedAt'
    });
  }
}

export const db = new CarbonCompassDatabase();
