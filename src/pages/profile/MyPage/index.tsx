import { Flex, Footer, PageErrorFallback } from '@/components';
import {
  GitHubAccountSection,
  ImportantNoticeSection,
  UserInfoSection,
} from './components';
import { useTrackPageView } from '@/service/amplitude/useTrackPageView';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { ErrorBoundary } from 'react-error-boundary';

const MyPage = () => {
  useTrackPageView({ eventName: '[View] 마이페이지' });

  return (
    <Flex.Column margin="1rem" gap="1.5rem">
      <ImportantNoticeSection />

      <QueryErrorResetBoundary>
        {({ reset }) => (
          <ErrorBoundary FallbackComponent={PageErrorFallback} onReset={reset}>
            <UserInfoSection />
          </ErrorBoundary>
        )}
      </QueryErrorResetBoundary>

      <GitHubAccountSection />

      <Footer />
    </Flex.Column>
  );
};

export default MyPage;



