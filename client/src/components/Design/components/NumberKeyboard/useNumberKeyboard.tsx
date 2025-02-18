import type {KeyboardType} from './keypads';

import {useEffect, useState} from 'react';

interface Props {
  type: KeyboardType;
  maxNumber?: number;
  initialValue?: string;
  onChange: (value: string) => void;
}

const useNumberKeyboard = ({type, maxNumber, initialValue, onChange}: Props) => {
  const [value, setValue] = useState(initialValue ?? '');

  useEffect(() => {
    if (initialValue) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const onClickKeypad = (inputValue: string) => {
    const newValue = (value + inputValue).replace(/,/g, '');
    setValueByType(newValue);
  };

  const onClickDelete = () => {
    const newValue = value.slice(0, value.length - 1).replace(/,/g, '');
    setValueByType(newValue);
  };

  const onClickDeleteAll = () => {
    setValue('');
  };

  const onClickAddAmount = (amount: number) => {
    const newValue = `${Number(value.replace(/,/g, '')) + amount}`;
    setValueByType(newValue);
  };

  const setValueByType = (value: string) => {
    if (type === 'string') {
      setValue(value);
    } else {
      const limitedValue = maxNumber !== 0 ? (maxNumber && Number(value) > maxNumber ? `${maxNumber}` : value) : 0;

      if (Number(limitedValue) === 0) {
        setValue('');
      } else {
        setValue(type === 'amount' ? Number(limitedValue).toLocaleString() : `${limitedValue}`);
      }
    }
  };

  useEffect(() => {
    onChange(value);
  }, [value]);

  return {value, onClickKeypad, onClickDelete, onClickDeleteAll, onClickAddAmount};
};

export default useNumberKeyboard;
