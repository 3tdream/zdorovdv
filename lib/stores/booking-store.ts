import { create } from 'zustand';

interface BookingState {
  step: number;
  selectedServiceId: string | null;
  selectedSpecialistId: string | null;
  selectedDate: string | null;
  selectedTime: string | null;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  notes: string;
  submitted: boolean;
  submitting: boolean;
  submitError: string | null;
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  setServiceId: (id: string) => void;
  setSpecialistId: (id: string) => void;
  setDate: (date: string) => void;
  setTime: (time: string) => void;
  setClientName: (name: string) => void;
  setClientPhone: (phone: string) => void;
  setClientEmail: (email: string) => void;
  setNotes: (notes: string) => void;
  submit: () => Promise<void>;
  reset: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  selectedServiceId: null,
  selectedSpecialistId: null,
  selectedDate: null,
  selectedTime: null,
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  notes: '',
  submitted: false,
  submitting: false,
  submitError: null,
  setStep: (step) => set({ step }),
  nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 5) })),
  prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) })),
  setServiceId: (selectedServiceId) => set({ selectedServiceId }),
  setSpecialistId: (selectedSpecialistId) => set({ selectedSpecialistId }),
  setDate: (selectedDate) => set({ selectedDate }),
  setTime: (selectedTime) => set({ selectedTime }),
  setClientName: (clientName) => set({ clientName }),
  setClientPhone: (clientPhone) => set({ clientPhone }),
  setClientEmail: (clientEmail) => set({ clientEmail }),
  setNotes: (notes) => set({ notes }),
  submit: async () => {
    const state = useBookingStore.getState();
    set({ submitting: true, submitError: null });
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: state.selectedServiceId,
          specialistId: state.selectedSpecialistId,
          date: state.selectedDate,
          time: state.selectedTime,
          clientName: state.clientName,
          clientPhone: state.clientPhone,
          clientEmail: state.clientEmail,
          notes: state.notes,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Server error' }));
        set({ submitting: false, submitError: err.error || 'Failed to submit' });
        return;
      }
      set({ submitted: true, step: 5, submitting: false });
    } catch {
      set({ submitting: false, submitError: 'Network error' });
    }
  },
  reset: () => set({
    step: 1,
    selectedServiceId: null,
    selectedSpecialistId: null,
    selectedDate: null,
    selectedTime: null,
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    notes: '',
    submitted: false,
    submitting: false,
    submitError: null,
  }),
}));
