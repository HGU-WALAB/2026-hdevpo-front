import {
  DeferredComponent,
  Flex,
  PageErrorFallback,
  SectionErrorFallback,
  TableListSkeleton,
  Title,
} from '@/components';
import { useTrackPageView } from '@/service/amplitude/useTrackPageView';
import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { AwardFilterSection } from './components/AwardFilterSection';
import { AwardTableListSection } from './components/AwardTableListSection';
import { AwardArchiveGrid } from '@/pages/award/AwardArchivePage/components/AwardArchiveGrid';
import { AwardArchiveSkeleton } from '@/pages/award/AwardArchivePage/components/AwardArchiveSkeleton';

const AwardArchivePage = () => {
  useTrackPageView({ eventName: '[View] 상장 조회 페이지' });

  return (
    <Flex.Column margin="1rem" gap="3rem">
      <Flex.Column>
        <Title label="수상 내역" />

        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary
              FallbackComponent={SectionErrorFallback}
              onReset={reset}
            >
              <Suspense
                fallback={
                  <DeferredComponent>
                    <AwardArchiveSkeleton />
                  </DeferredComponent>
                }
              >
                <AwardArchiveGrid />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Flex.Column>

      <Flex.Column>
        <Flex.Row justify="space-between" align="center">
          <AwardFilterSection />
        </Flex.Row>

        <QueryErrorResetBoundary>
          {({ reset }) => (
            <ErrorBoundary FallbackComponent={PageErrorFallback} onReset={reset}>
              <Suspense
                fallback={
                  <DeferredComponent>
                    <TableListSkeleton />
                  </DeferredComponent>
                }
              >
                <AwardTableListSection />
              </Suspense>
            </ErrorBoundary>
          )}
        </QueryErrorResetBoundary>
      </Flex.Column>
    </Flex.Column>
  );
};

export default AwardArchivePage;
