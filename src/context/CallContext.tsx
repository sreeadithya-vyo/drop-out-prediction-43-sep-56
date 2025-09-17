import React, { createContext, useContext, useState } from 'react';
import { Student } from '@/types';

type CallType = 'parent' | 'student' | 'mentor';

interface CallContextType {
  currentCall: {
    student: Student;
    callType: CallType;
  } | null;
  initializeCall: (student: Student, callType: CallType) => void;
  endCall: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export const CallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCall, setCurrentCall] = useState<{
    student: Student;
    callType: CallType;
  } | null>(null);

  const initializeCall = (student: Student, callType: CallType) => {
    setCurrentCall({ student, callType });
  };

  const endCall = () => {
    setCurrentCall(null);
  };

  return (
    <CallContext.Provider value={{ currentCall, initializeCall, endCall }}>
      {children}
    </CallContext.Provider>
  );
};