import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import { AxiosError } from 'axios';
import { EmptyBoxImg } from '@/assets';
import { Button, Flex, Heading } from '@/components';
import { getPortfolioCvShareHtml } from '@/pages/cv/apis/cv';
import { isCvPublicTokenFormat } from '@/pages/cv/utils/cvPublicToken';
import { palette } from '@/styles/palette';
import { getErrorMessage } from '@/utils/getErrorMessage';

const EMPTY_SHARE_MESSAGE =
  '공개 이력서 내용이 아직 없어요. 잠시 후 다시 확인해 주세요.';

function messageForUnknownError(error: unknown): string {
  if (error instanceof AxiosError && error.response?.status != null) {
    return getErrorMessage(String(error.response.status));
  }
  return getErrorMessage('default');
}

export default function CvSharePage() {
  const theme = useTheme();
  const { publicToken } = useParams<{ publicToken: string }>();

  const tokenTrimmed = publicToken?.trim() ?? '';
  const hasParam = publicToken !== undefined;
  const tokenOk = hasParam && isCvPublicTokenFormat(tokenTrimmed);

  const query = useQuery({
    queryKey: ['cv', 'html', 'public', tokenTrimmed],
    queryFn: () => getPortfolioCvShareHtml(tokenTrimmed),
    enabled: tokenOk,
    retry: false,
  });

  const iframeSrcDoc = useMemo(() => {
    const { data } = query;
    if (!data) return null;
    if (data.status === 200) return data.html;
    if (data.status === 403 || data.status === 404) {
      return data.guidanceHtml.trim() ? data.guidanceHtml : null;
    }
    return null;
  }, [query.data]);

  const headingStyle = useMemo(
    () => ({ color: theme.palette.grey300 } as const),
    [theme.palette.grey300],
  );

  if (!hasParam || !tokenOk) {
    return (
      <S.Root>
        <S.MessageWrap>
          <Flex.Column width="100%" gap="1rem" justify="center" align="center">
            <EmptyBoxImg />
            <Heading as="h2" style={headingStyle}>
              {getErrorMessage('404')}
            </Heading>
          </Flex.Column>
        </S.MessageWrap>
      </S.Root>
    );
  }

  if (query.isPending) {
    return <S.Root aria-busy />;
  }

  if (query.isError) {
    return (
      <S.Root>
        <S.MessageWrap>
          <Flex.Column width="100%" gap="1rem" justify="center" align="center">
            <EmptyBoxImg />
            <Heading as="h2" style={headingStyle}>
              {messageForUnknownError(query.error)}
            </Heading>
            <Button label="다시 시도하기" onClick={() => query.refetch()} />
          </Flex.Column>
        </S.MessageWrap>
      </S.Root>
    );
  }

  const data = query.data;
  if (!data) {
    return <S.Root />;
  }

  if (data.status === 200) {
    return (
      <S.Root>
        <iframe title="공개 이력서" srcDoc={data.html} sandbox="allow-same-origin" />
      </S.Root>
    );
  }

  if (data.status === 204) {
    return (
      <S.Root>
        <S.MessageWrap>
          <Flex.Column width="100%" gap="1rem" justify="center" align="center">
            <EmptyBoxImg />
            <Heading as="h2" style={headingStyle}>
              {EMPTY_SHARE_MESSAGE}
            </Heading>
          </Flex.Column>
        </S.MessageWrap>
      </S.Root>
    );
  }

  if (data.status === 403 || data.status === 404) {
    if (iframeSrcDoc) {
      return (
        <S.Root>
          <iframe title="공개 이력서 안내" srcDoc={iframeSrcDoc} sandbox="allow-same-origin" />
        </S.Root>
      );
    }
    return (
      <S.Root>
        <S.MessageWrap>
          <Flex.Column width="100%" gap="1rem" justify="center" align="center">
            <EmptyBoxImg />
            <Heading as="h2" style={headingStyle}>
              {getErrorMessage(String(data.status))}
            </Heading>
          </Flex.Column>
        </S.MessageWrap>
      </S.Root>
    );
  }

  return <S.Root />;
}

const S = {
  Root: styled('div')`
    box-sizing: border-box;
    width: 100%;
    min-height: 100vh;
    margin: 0;
    padding: 0;
    background-color: ${palette.white};

    & > iframe {
      display: block;
      width: 100%;
      min-height: 100vh;
      border: none;
    }
  `,
  MessageWrap: styled('div')`
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-height: 100vh;
    padding: 1.5rem;
  `,
};
