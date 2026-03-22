import { useMutation } from '@tanstack/react-query';

import { postPortfolioCvBuildPrompt } from '../apis/cv';

const usePostPortfolioCvBuildPromptMutation = () => {
  return useMutation({
    mutationFn: postPortfolioCvBuildPrompt,
  });
};

export default usePostPortfolioCvBuildPromptMutation;
