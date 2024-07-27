//define new data types/modeify existing 
import 'next-auth'
import { DefaultSession } from 'next-auth';

//already declared module are redefined /modified
//we import module because we are messing with some interfaces like in this case user interface

declare module 'next-auth' {
    interface User{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
    interface Session{
        user:{
            _id?: string;
            isVerified?: boolean;
            isAcceptingMessages?: boolean;
            username?: string
        }& DefaultSessionp['user']
    }
}
//second method
declare module 'next-auth/jwt'{
    interface JWT{
        _id?: string;
        isVerified?: boolean;
        isAcceptingMessages?: boolean;
        username?: string
    }
}
