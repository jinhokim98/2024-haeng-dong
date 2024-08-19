import {FixedButton, LabelGroupInput} from 'haengdong-design';
import {useEffect} from 'react';

import validatePurchase from '@utils/validate/validatePurchase';
import {useStepList} from '@hooks/useStepList/useStepList';

import useDynamicBillActionInput from '@hooks/useDynamicBillActionInput';

import style from './AddBillActionListModalContent.style';

interface AddBillActionListModalContentProps {
  setIsOpenBottomSheet: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddBillActionListModalContent = ({setIsOpenBottomSheet}: AddBillActionListModalContentProps) => {
  const {
    inputPairList,
    inputRefList,
    errorMessage,
    handleInputChange,
    getFilledInputPairList,
    deleteEmptyInputPairElementOnBlur,
    focusNextInputOnEnter,
  } = useDynamicBillActionInput(validatePurchase);
  const {addBill} = useStepList();

  const handleSetPurchaseSubmit = () => {
    // TODO: (@weadie) 요청 실패시 오류 핸들 필요
    addBill(
      getFilledInputPairList().map(({title, price}) => ({title, price: Number(price)})),
      () => setIsOpenBottomSheet(false),
    ); // TODO: (@weadie) DTO같은게 다이내믹에 필요할까?
  };

  return (
    <div css={style.container}>
      <div css={style.inputContainer}>
        <LabelGroupInput labelText="지출내역 / 금액" errorText={errorMessage}>
          {inputPairList.map(({index, title, price}) => (
            <div key={index} css={style.input}>
              <LabelGroupInput.Element
                elementKey={`${index}`}
                type="text"
                value={title}
                onChange={e => handleInputChange(index, 'title', e)}
                onKeyDown={e => focusNextInputOnEnter(e, index, 'title')}
                onBlur={() => deleteEmptyInputPairElementOnBlur()} // TODO: (@weadie) 이 블러프롭이 내부적으로 index를 넘기고 있기 때문에 화살표 함수로 써야만하내요..
                placeholder="지출 내역"
                ref={el => (inputRefList.current[index * 2] = el)}
              />
              <LabelGroupInput.Element
                elementKey={`${index}`}
                type="number"
                value={price}
                onChange={e => handleInputChange(index, 'price', e)}
                onKeyDown={e => focusNextInputOnEnter(e, index, 'price')}
                onBlur={() => deleteEmptyInputPairElementOnBlur()}
                placeholder="금액"
                ref={el => (inputRefList.current[index * 2 + 1] = el)}
              />
            </div>
          ))}
        </LabelGroupInput>
      </div>
      <FixedButton
        disabled={!(inputPairList.length - 1)}
        variants={'primary'}
        children={'추가하기'}
        onClick={handleSetPurchaseSubmit}
      />
    </div>
  );
};

export default AddBillActionListModalContent;
