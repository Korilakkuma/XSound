'use strict';

import { ActionTypes } from '../ActionTypes';

export function expandedPanelId(state = '', action) {
    switch (action.type) {
        case ActionTypes.NAV_EXPAND_PANEL:
            return action.id;
        default:
            return state;
    }
}
