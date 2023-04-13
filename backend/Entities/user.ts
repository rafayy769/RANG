import { Socket } from "socket.io";


class User{
    /**
     * @remarks
     * This is a user object
     * 
     * @param id - The id of the user
     * @param user_name - The name of the user
     * @param socket - The socket of the user
     */

    id: number = -1;
    user_name: string = "";
    socket: Socket = {} as Socket;
};

export default User;