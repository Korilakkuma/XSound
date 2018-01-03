'use strict';

import { combineReducers } from 'redux';
import * as NavReducers from './NavReducers';

export default combineReducers({
    ...NavReducers
});
