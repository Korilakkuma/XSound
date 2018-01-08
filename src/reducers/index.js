'use strict';

import { combineReducers } from 'redux';
import * as HeaderReducers from './HeaderReducers';
import * as NavReducers from './NavReducers';

export default combineReducers({
    ...HeaderReducers,
    ...NavReducers
});
