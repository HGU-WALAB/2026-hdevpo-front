import { getUserInfo } from '@/pages/auth/apis/auth';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { UserResponse } from '@/pages/auth/types/auth';
import { useAuthStore } from '@/stores';
import { useQuery } from '@tanstack/react-query';

const useGetUserInfoQuery = () => {
  const { login, currentSemester: storedCurrentSemester, student } = useAuthStore();

  return useQuery<UserResponse>({
    queryKey: [QUERY_KEYS.userInfo],
    queryFn: () => getUserInfo(),
    onSuccess: res => {
      const nextCurrentSemester =
        (res as unknown as { currentSemester?: string }).currentSemester ??
        storedCurrentSemester;

      login(
        {
          studentId: res.studentId ?? student.studentId,
          studentName: res.studentName ?? student.studentName,
          studentType: res.studentType ?? student.studentType,
        },
        nextCurrentSemester,
        res.term,
      );
    },
    throwOnError: true,
  });
};

export default useGetUserInfoQuery;
