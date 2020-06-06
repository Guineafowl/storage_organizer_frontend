import React, {useState, useCallback} from 'react';
import {
    Button,
    Card,
    Container,
    Dimmer,
    Form,
    Header,
    Icon,
    Image,
    Loader,
    Modal,
    Progress,
    Step
} from "semantic-ui-react";
import {addRoom, image, uploadPhoto} from "../../service/service";
import placeholder from '../../placeholder.png'
import {Link} from "react-router-dom";
import {ImageUpload} from "../ImageUpload/ImageUpload";
import {observer} from "mobx-react";

export const Rooms = observer(({roomStore}) => (
    <Container>
        <Header style={{textAlign: 'left'}}>
            Rooms
        </Header>
        <Card.Group centered>
            {roomStore.rooms.map(room => <RoomCard key={`room:${room.id}`} room={room}/>)}
            <AddRoom roomStore={roomStore}/>
        </Card.Group>
    </Container>
));

const RoomCard = ({room}) => {
    const photo = !!room.photo ? image(room.photo.path) : placeholder;
    return (
        <Card link as={Link} to={`/room/${room.id}`}>
            <Image src={photo} wrapped ui={false}/>
            <Card.Content>
                <Card.Header>{room.name}</Card.Header>
                <Card.Meta>
                    <span className='date'>{room.storages.length} storage{room.storages.length > 1 && 's'}</span>
                </Card.Meta>
                {!!room.capacity && (
                    <Card.Description>
                        <Progress percent={room.capacity * 100} size='tiny'>
                            Capacity
                        </Progress>
                    </Card.Description>
                )}
            </Card.Content>
        </Card>
    )
};

const AddRoom = ({roomStore}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState({
        name: null,
        picture: null
    });
    const tryAddingRoom = useCallback(() => {
        setLoading(true);
        uploadPhoto(room.picture)
            .then(photoId => addRoom(room.name, photoId))
            .then(() => roomStore.fetchRooms())
            .then(() => setOpen(false))
            .then(() => setLoading(false))
    }, [roomStore, room]);
    return (
        <Card>
            <Button onClick={() => setOpen(true)} style={{height: '100%', fontSize: '2rem'}} fluid>
                <Icon name={'plus'}/>
                <span>Add room</span>
            </Button>
            <Modal onClose={() => setOpen(false)} open={open}>
                {loading && (
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                )}
                <Modal.Header>
                    Add room
                </Modal.Header>
                <Progress color={'green'} percent={(!room.name ? 0 : 50) + (!room.picture ? 0 : 50)} attached='bottom' />
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <input onInput={({target}) => setRoom({...room, name: target.value})} placeholder='Name...' />
                            </Form.Field>
                            <ImageUpload onChanged={image => setRoom({...room, picture: image})}/>
                            <Form.Button onClick={tryAddingRoom} disabled={!room.name || room.name.length < 1 || !room.picture} fluid>Add</Form.Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        </Card>
    )
};