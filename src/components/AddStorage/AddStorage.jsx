import {uploadPhoto} from "../../service/service";
import {Button, Dimmer, Form, Loader, Modal, Progress} from "semantic-ui-react";
import {ImageUpload} from "../ImageUpload/ImageUpload";
import React, {useCallback, useState} from "react";


export const AddStorage = ({roomStore, addStorage}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [storage, setStorage] = useState({
        name: null,
        picture: null
    });
    const tryAddingStorage = useCallback(() => {
        setLoading(true);
        uploadPhoto(storage.picture)
            .then(photoId => addStorage(storage.name, photoId))
            .then(() => roomStore.fetchRooms())
            .then(() => setOpen(false))
            .then(() => setLoading(false))
    }, [roomStore, storage]);
    return (
        <div>
            <Button size={'mini'} onClick={() => setOpen(true)} style={{marginBottom: '2rem'}} >Add storage</Button>
            <Modal onClose={() => setOpen(false)} open={open}>
                {loading && (
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                )}
                <Modal.Header>Add storage</Modal.Header>
                <Progress color={'green'} percent={(!storage.name ? 0 : 50) + (!storage.picture ? 0 : 50)} attached='bottom' />
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <input onInput={({target}) => setStorage({...storage, name: target.value})} placeholder='Name...' />
                            </Form.Field>
                            <ImageUpload onChanged={image => setStorage({...storage, picture: image})}/>
                            <Form.Button onClick={tryAddingStorage} disabled={!storage.name || storage.name.length < 1 || !storage.picture} fluid>Add</Form.Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        </div>
    )
};
