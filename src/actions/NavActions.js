'use strict';

import { ActionTypes } from '../ActionTypes';

export function expandPanel(id) {
    return {
        type : ActionTypes.NAV_EXPAND_PANEL,
        id
    };
}
