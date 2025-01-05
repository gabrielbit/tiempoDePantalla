import React, { createContext, useContext, useState } from 'react';
import { ScreenTimeSchedule, ChildProfile } from '../types/types';

interface SessionContextType {
  startSession: (profileId: string, schedule: ScreenTimeSchedule) => void;
  endSession: (profileId: string, scheduleId: string) => void;
  getActiveSession: (profileId: string) => ScreenTimeSchedule | null;
  updateScheduleStatus: (profileId: string, scheduleId: string, status: ScreenTimeSchedule['status']) => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [activeSessions, setActiveSessions] = useState<Record<string, ScreenTimeSchedule>>({});
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);

  const startSession = (profileId: string, schedule: ScreenTimeSchedule) => {
    setActiveSessions(prev => ({
      ...prev,
      [profileId]: { ...schedule, status: 'in_progress' }
    }));
    updateScheduleStatus(profileId, schedule.id, 'in_progress');
  };

  const endSession = (profileId: string, scheduleId: string) => {
    setActiveSessions(prev => {
      const newSessions = { ...prev };
      delete newSessions[profileId];
      return newSessions;
    });
    updateScheduleStatus(profileId, scheduleId, 'completed');
  };

  const getActiveSession = (profileId: string) => {
    return activeSessions[profileId] || null;
  };

  const updateScheduleStatus = (profileId: string, scheduleId: string, status: ScreenTimeSchedule['status']) => {
    setProfiles(currentProfiles => 
      currentProfiles.map(profile => {
        if (profile.id === profileId) {
          return {
            ...profile,
            schedules: profile.schedules.map(schedule => 
              schedule.id === scheduleId 
                ? { ...schedule, status }
                : schedule
            )
          };
        }
        return profile;
      })
    );
  };

  return (
    <SessionContext.Provider value={{
      startSession,
      endSession,
      getActiveSession,
      updateScheduleStatus,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
} 