/// <reference path="../../../types/ic3/external/Model.d.ts" />

import { IC3AdapterState, StateKey } from '../../../types/ic3/IC3AdapterState';
import { IC3DirectLineActivity } from '../../../types/ic3/IC3DirectLineActivity';
import { IngressMiddleware } from '../../../applyIngressMiddleware';
import { Role } from '../../../types/DirectLineTypes';

export default function createPatchFromRoleAndNameMiddleware(): IngressMiddleware<
  IC3DirectLineActivity,
  IC3AdapterState
> {
  return ({ getState }) => next => (activity: IC3DirectLineActivity) => {
    const {
      from: { id, name }
    } = activity;

    const role = id.includes(getState(StateKey.UserId)) ? Role.User : Role.Bot;

    return next({
      ...activity,
      from: {
        id,
        role,
        name: (role === Role.User && getState(StateKey.UserDisplayName)) || name
      }
    });
  };
}