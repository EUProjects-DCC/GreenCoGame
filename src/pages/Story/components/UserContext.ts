import React from 'react';
import { UserContextType } from '../scripts/Interfaces';

const UserContext = React.createContext<UserContextType>({} as UserContextType); //Contex with user's information

export default UserContext;