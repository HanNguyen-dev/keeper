import { AccountingRequest } from './domain/accounting.types';

const baseUrl = process.env.NEXT_PUBLIC_BASE_API;

export const fetchAccounting = (
  payload: AccountingRequest
): Promise<{ npv: number }> => {
  const url = `${baseUrl}?cost=${payload.cost}&rate=${payload.rate}&payoff=${payload.payoff}`;

  return fetch(url).then((resp) => {
    if (resp.ok) {
      return resp.json() as Promise<{ npv: number }>;
    }
    throw 'Error fetching data';
  });
};
