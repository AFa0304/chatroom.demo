import { combineReducers } from 'redux';
import { SETNAME } from '../actions/action';

//建立預設值
const initVal = {
    name: ""
}

function setter(state = initVal, action){
    // console.log("state",state);
    // console.log("action",action);
    switch(action.type){
        default:
            return state;
        case SETNAME:
            return { ...state, name:action.name}; //將action.val取代原state的val
    }
}

const setterAPP = combineReducers({
    setter
}); //用combineReducers來打包，若有多的reducer就可用物件的形式放進去

export default setterAPP;