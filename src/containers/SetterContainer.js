import { connect } from 'react-redux';

import MainContainer from './MainContainer';
import {setName} from '../actions/action';

// 傳遞state至props
const mapStateToProps = (state) =>{
    return {
        name: state.setter.name
        // setter 為 reducer 的名字 (reducer是state tree的分支點)
        // Key值的 Name 就是接收 props 的名稱
    }
}

const mapDispatchToProps = (dispatch) =>{
    return {
        setName: (name) => {dispatch(setName(name))}
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainContainer);