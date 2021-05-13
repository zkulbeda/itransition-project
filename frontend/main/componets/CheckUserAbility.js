import {useContext} from "react";
import {UserContext} from "./UserContextProvider";

export default function CheckUserAbility({to, subject, object, children, fallback}){
    let {user, userAbility} = useContext(UserContext);
    if(userAbility.can(to, subject, object))
        return children;
 y
else return fallback;
}
