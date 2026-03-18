import { useEffect, useState } from 'react';

import getMaintenanceStatus from '@/apis/maintenance';
import { MaintenanceStatus } from '@/types/maintenance';
import useAuthStore from '@/stores/useAuthStore';

export const useMaintenanceCheck = () => {
  const [maintenanceStatus, setMaintenanceStatus] =
    useState<MaintenanceStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { isLogin } = useAuthStore();

  useEffect(() => {
    const checkMaintenance = async () => {
      setIsLoading(true);
      try {
        const status = await getMaintenanceStatus();
        setMaintenanceStatus(status);
      } catch (error) {
        setMaintenanceStatus({
          maintenanceMode: true,
          message: '점검 상태를 확인할 수 없습니다.\n잠시 후 다시 시도해주세요.',
          estimatedTime: '',
          isAllowedUser: false,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkMaintenance();

    const interval = setInterval(checkMaintenance, 60000 * 10);
    return () => clearInterval(interval);
  }, [isLogin]); // 로그인 상태 바뀔 때 재조회 → 허용 유저면 isAllowedUser 반영

  return { maintenanceStatus, isLoading };
};


