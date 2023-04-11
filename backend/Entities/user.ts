import { Socket } from "socket.io";


type User = {
    /**
     * @remarks
     * This is a user object
     * 
     * @param id - The id of the user
     * @param user_name - The name of the user
     * @param socket - The socket of the user
     */

    id: number,
    user_name: string,
    socket: Socket
};

export default User;