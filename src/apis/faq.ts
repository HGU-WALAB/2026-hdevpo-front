import { ENDPOINT } from '@/apis/endPoint';
import { http } from '@/apis/http';

export const getFAQContactDesc = async () => {
  const response = await http.get<string[]>(ENDPOINT.CONTACT);

  return response;
};

