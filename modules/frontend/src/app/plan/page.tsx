'use client';
import { Button, Input } from '@nextui-org/react';
import style from './Plan.module.css';
import { useRef, useState } from 'react';
import { fetchAccounting } from '@/lib/apiRequest';
import useSWR from 'swr';
import { AccountingRequest } from '@/lib/domain/accounting.types';

export default function Plan() {
  const costRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const payoffRef = useRef<HTMLInputElement>(null);
  const [accountingRequest, setAccountingRequest] =
    useState<AccountingRequest>();

  const { data } = useSWR(accountingRequest, fetchAccounting);

  const handleClick = () => {
    const cost = Number(costRef.current?.value);
    const rate = Number(rateRef.current?.value);
    const payoff = Number(payoffRef.current?.value);

    if (!isNaN(cost) && !isNaN(rate) && !isNaN(payoff)) {
      setAccountingRequest({
        cost: costRef.current?.value as string,
        rate: rateRef.current?.value as string,
        payoff: payoffRef.current?.value as string,
      });
    }
  };

  return (
    <div className={style.planSubmodule}>
      <div className={style.cardName}>Account</div>
      <Input ref={costRef} label="Cost" className="max-w-xs" />
      <Input ref={rateRef} label="Interest Rate" className="max-w-xs" />
      <Input ref={payoffRef} label="Expected Payoff" className="max-w-xs" />
      <Button onClick={handleClick}>Calculate NPV</Button>
      <div>{data?.npv}</div>
    </div>
  );
}
