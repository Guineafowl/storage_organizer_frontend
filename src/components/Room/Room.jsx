import React, {useCallback} from 'react';
import {
    Container,
    Item
} from "semantic-ui-react";
import {
    addRoomStorage,
    deleteRoom
} from "../../service/service";
import {observer} from "mobx-react";
import {RemoveButton} from "../RemoveButton/RemoveButton";
import {useHistory} from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import {Storage} from "../Storage/Storage";
import {AddStorage} from "../AddStorage/AddStorage";

export const Room = observer(({room, roomStore}) => {
    const history = useHistory();
    const onRemoveRoom = useCallback(() => deleteRoom(room.id)
            .then(() => roomStore.rooms.splice(roomStore.rooms.findIndex(element => element.id === room.id), 1))
            .then(() => history.push('/')), [roomStore, room]);
    const addStorage = useCallback((name, photoId) => addRoomStorage(room.id, name, photoId), [room]);
    return (
        <Container style={{marginBottom: '1rem'}}>
            <div style={{textAlign: 'left', marginBottom: '1rem', display: 'flex'}}>
                <span style={{fontSize: '2rem', fontWeight: 600, marginRight: '1rem'}}>{room.name}</span>
                <RemoveButton onDelete={onRemoveRoom} header={`Remove ${room.name}`}/>
            </div>
            <Item.Group style={{textAlign: 'left'}} divided>
                <Item>
                    <Item.Content>
                        <AddStorage addStorage={addStorage} roomStore={roomStore}/>
                    </Item.Content>
                </Item>
                {room.storages.sort((a, b) => a.name.localeCompare(b.name)).map(storage => <Storage roomStore={roomStore} key={`storage:${storage.id}`} storage={storage}/>)}
            </Item.Group>
        </Container>
    )
});
