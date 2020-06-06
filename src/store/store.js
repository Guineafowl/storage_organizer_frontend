import {observable, action} from "mobx";
import {fetchRooms} from "../service/service";

export const roomStore = observable({
    rooms: [],
    loading: true,
    fetchRooms() {
        fetchRooms()
            .then(rooms => {
                this.rooms = rooms;
                this.loading = false;
            });
    }
}, {
    rooms: observable,
    loading: observable,
    fetchRooms: action,
});