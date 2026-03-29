import { ENDPOINT } from '@/apis/endPoint';
import { http } from '@/apis/http';

/** 도메인 내 기술 한 줄 (GET/PUT 공통) */
export interface TechStackSkill {
  name: string;
  level: number;
}

export interface TechStackDomain {
  id?: number;
  name: string;
  order_index: number;
  tech_stacks: TechStackSkill[];
}

export interface TechStackResponse {
  domains: TechStackDomain[];
}

export interface TechStackPutRequest {
  domains: TechStackDomain[];
}

export const getTechStack = async () => {
  const response = await http.get<TechStackResponse>(ENDPOINT.PORTFOLIO_TECH_STACK);
  return response;
};

export const putTechStack = async (body: TechStackPutRequest) => {
  const response = await http.put<TechStackResponse>(
    ENDPOINT.PORTFOLIO_TECH_STACK,
    body,
  );
  return response;
};
