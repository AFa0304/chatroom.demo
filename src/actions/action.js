//action type
export const SETNAME = "SETNAME";

export function setName(name){
    return {
        type: SETNAME, //與上方action type綁在一起，方便管理
        name:name
    };
}