import type {MemberAction} from 'types/serviceType';

import {useState} from 'react';

import useRequestGetStepList from '@hooks/queries/useRequestGetStepList';
import useRequestDeleteMemberAction from '@hooks/queries/useRequestDeleteMemberAction';

import getEventIdByUrl from '@utils/getEventIdByUrl';

type UseDeleteMemberActionProps = {
  memberActionList: MemberAction[];
  setIsBottomSheetOpened: React.Dispatch<React.SetStateAction<boolean>>;
  showToastAlreadyExistMemberAction: () => void;
  showToastExistSameMemberFromAfterStep: (name: string) => void;
};

const useDeleteMemberAction = ({
  memberActionList,
  setIsBottomSheetOpened,
  showToastAlreadyExistMemberAction,
  showToastExistSameMemberFromAfterStep,
}: UseDeleteMemberActionProps) => {
  const {data: stepListData} = useRequestGetStepList();
  const stepList = stepListData ?? [];
  const {mutate: deleteMemberActionMutate} = useRequestDeleteMemberAction();

  const [deleteActionList, setDeleteActionList] = useState<MemberAction[]>([]);

  const eventId = getEventIdByUrl();

  const deleteMemberAction = async (actionId: number) => {
    deleteMemberActionMutate(
      {actionId},
      {
        onError: () => {
          setDeleteActionList([]);
        },
      },
    );
    setIsBottomSheetOpened(false);
  };

  // TODO: (@cookie: 추후에 반복문으로 delete하는 것이 아니라 한 번에 모아서 delete 처리하기 (backend에 문의))
  const deleteMemberActionList = async () => {
    for (const {actionId} of deleteActionList) {
      await deleteMemberAction(actionId);
    }
  };

  const checkAlreadyExistMemberAction = (memberAction: MemberAction, showToast: () => void) => {
    if (!memberActionList.includes(memberAction)) {
      showToast();
    }
  };

  const checkExistSameMemberFromAfterStep = (memberAction: MemberAction, showToast: () => void) => {
    if (isExistSameMemberFromAfterStep(memberAction)) {
      showToast();
    }
  };

  const addDeleteMemberAction = (memberAction: MemberAction) => {
    checkAlreadyExistMemberAction(memberAction, showToastAlreadyExistMemberAction);
    checkExistSameMemberFromAfterStep(memberAction, () => showToastExistSameMemberFromAfterStep(memberAction.name));
    setDeleteActionList(prev => [...prev, memberAction]);
  };

  const isExistSameMemberFromAfterStep = (memberAction: MemberAction) => {
    const memberActionList = stepList
      .filter(step => step.type !== 'BILL')
      .map(({actions}) => actions)
      .flat();
    const currentActionIndex = memberActionList.findIndex(action => action.actionId === memberAction.actionId);
    const memberActionListAfterCurrentAction = memberActionList.slice(Math.max(currentActionIndex - 1, 0));
    const memberNameList = memberActionListAfterCurrentAction.map(({name}) => name);

    return memberNameList.filter(member => member === memberAction.name).length >= 2;
  };

  const aliveActionList = memberActionList.filter(
    memberAction => !deleteActionList.some(deleteAction => deleteAction.actionId === memberAction.actionId),
  );
  return {aliveActionList, deleteMemberActionList, addDeleteMemberAction};
};

export default useDeleteMemberAction;