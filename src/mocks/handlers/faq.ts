import { http, HttpResponse } from 'msw';

import { BASE_URL } from '@/apis/config';
import { ENDPOINT } from '@/apis/endPoint';
import { mockFAQContactDesc } from '@/mocks/fixtures/faq';
import { Error400, Error401, Error500, randomMswError } from '@/utils/mswError';

export const FAQHandlers = [
  http.get(BASE_URL + ENDPOINT.CONTACT, () => {
    const { is400Error, is401Error, is500Error } = randomMswError();

    if (is400Error) return Error400();
    if (is401Error) return Error401();
    if (is500Error) return Error500();

    return HttpResponse.json(mockFAQContactDesc, { status: 200 });
  }),
];

