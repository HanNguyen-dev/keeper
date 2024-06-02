'use client';
import { Button, Input } from '@nextui-org/react';
import style from './Plan.module.css';
import { useRef, useState } from 'react';

export default function Plan() {
  const costRef = useRef<HTMLInputElement>(null);
  const rateRef = useRef<HTMLInputElement>(null);
  const payoffRef = useRef<HTMLInputElement>(null);
  const [npv, setNpv] = useState<number>();

  const handleClick = () => {
    const cost = Number(costRef.current?.value);
    const rate = Number(rateRef.current?.value);
    const payoff = Number(payoffRef.current?.value);

    if (!isNaN(cost) && !isNaN(rate) && !isNaN(payoff)) {
      setNpv(payoff / (1 + rate) - cost);
    }
  };

  return (
    <div className={style.planSubmodule}>
      <div className={style.cardName}>Account</div>
      <Input ref={costRef} label="Cost" className="max-w-xs" />
      <Input ref={rateRef} label="Interest Rate" className="max-w-xs" />
      <Input ref={payoffRef} label="Expected Payoff" className="max-w-xs" />
      <Button onClick={handleClick}>Calculate NPV</Button>
      <div>{npv}</div>
    </div>
  );
}
