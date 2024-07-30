import {css} from '@emotion/react';
import {ToastPosition} from './Toast.type';
import {Theme} from '@/theme/theme.type';

type ToastMarginStyle = {
  position?: ToastPosition;
  isShow: boolean;
  bottom?: string;
  top?: string;
};

export const toastMarginStyle = ({position, isShow, bottom, top}: ToastMarginStyle) =>
  css({
    display: isShow ? 'block' : 'none',
    position: 'absolute',
    bottom: position === 'bottom' ? `${bottom}` : 'auto',
    top: position === 'top' ? `${top}` : 'auto',
    left: '50%',
    transform: 'translate(-50%)',

    width: '100%',
    maxWidth: '48rem',
    paddingInline: '0.5rem',
  });

export const toastStyle = (theme: Theme) =>
  css({
    width: '100%',
    padding: '0.625rem',

    backgroundColor: theme.colors.gray,
    boxShadow: '0 8px 12px rgba(0, 0, 0, 0.16);',

    borderRadius: '1.25rem',
  });

export const textStyle = (theme: Theme) =>
  css({
    width: '100%',

    color: theme.colors.white,

    whiteSpace: 'pre-line',
  });