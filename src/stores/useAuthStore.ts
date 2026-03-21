import { STORE_NAME } from '@/constants/storeName';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLogin: boolean;
  student: {
    studentId: string;
    studentName: string;
    studentType: string;
  };
  currentSemester: string;
  term: number;
  login: (
    student: {
      studentId: string;
      studentName: string;
      studentType: string;
    },
    currentSemester?: string,
    term?: number,
  ) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      isLogin: false,
      student: {
        studentId: '',
        studentName: '',
        studentType: '',
      },
      currentSemester: '',
      term: 0,
      login: (student, currentSemester, term) =>
        set(state => ({
          isLogin: true,
          student,
          currentSemester:
            typeof currentSemester === 'string' &&
            currentSemester.trim().length > 0
              ? currentSemester
              : state.currentSemester,
          term: typeof term === 'number' ? term : state.term,
        })),
      logout: () =>
        set({
          isLogin: false,
          student: { studentId: '', studentName: '', studentType: '' },
          currentSemester: '',
          term: 0,
        }),
    }),
    {
      name: STORE_NAME.auth,
    },
  ),
);

export default useAuthStore;
