
/**
 * State Management File
 * 
 * This file contains the state management logic for modals and duocolors.
 * 
 * Contents:
 * - modalReducer: Manages the state related to modals, including opening and closing modals.
 * - duocolorReducer: Manages the state related to duocolors, allowing changes to the color value.
 * 
 * Usage:
 * This file can be imported into components that need to manage state related to modals
 * or duocolors. Each reducer can be used independently with its own initial state.
 * 
 * Author: mast_g
 * License: MIT
 */

const { registerStore } = wp.data;

const modalInitialState = { isModalOpen: false };
const modalReducer = (state = modalInitialState, action) => {
    switch (action.type) {
        case 'OPEN_MODAL':
            return { ...state, isModalOpen: true };
        case 'CLOSE_MODAL':
            return { ...state, isModalOpen: false };
        default:
            return state;
    }
};







// ========================================

export const STORE_DUOTONE = 'mie-image/duotone';

const actionsDuotone = {
    setDuoColor(color) {
        return {
            type: 'mie-image/duocolor-new',
            payload: { value: color },
        };
    },
}

const selectorsDuotone = {
    getDuoColor(state) {
        return state.duoColor;
    },
};

const duocolorReducer = (state = duocolorInitialState, action) => {
    switch (action.type) {
        case 'mie-image/duocolor-new':
            return { ...state, duoColor: action.payload.value };
            default:
                return state;
            }
        };
        
const duocolorInitialState = {
    duoColor: '',
};

registerStore(STORE_DUOTONE, {
    reducer: duocolorReducer,
    selectors: selectorsDuotone,
    actions: actionsDuotone,
    initialState: duocolorInitialState,
});





/* ++++++++++++++++++ */
export const STORE_NAME = 'myAwesomeApp/data';

const DEFAULT_STATE = {
    value: '555666Slypknot',
};

const actions2 = {
    setValue(newValue) {
        return {
            type: 'SET_VALUE',
            payload: newValue,
        };
    },
};

const selectors2 = {
    getValue(state) {
        return state.value;
    },
};


const reducer = (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case 'SET_VALUE':
            console.log('SET_VALUE', action.payload);
            return {
                ...state,
                value: action.payload,
            };
        default:
            return state;
    }
};

registerStore(STORE_NAME, {
    reducer: reducer,
    actions: actions2,
    selectors: selectors2
});



export { modalReducer, duocolorReducer };