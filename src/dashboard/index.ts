// Simple API for adding custom modules
import type { FC } from 'react';

export async function addCustomModule(id: string, name: string, component: FC): Promise<void> {
  console.log(`Custom module registration: ${id} - ${name}`);
  // Module registration logic would go here
  // For now, just log as this requires integration with the dashboard system
}