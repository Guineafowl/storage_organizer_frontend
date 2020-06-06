import {observer} from "mobx-react";
import {addProduct, addStorageChild, changeStorageName, deleteStorage, image, uploadPhoto} from "../../service/service";
import placeholder from "../../placeholder.png";
import {Accordion, Button, Dimmer, Form, Icon, Input, Item, Loader, Modal, Progress} from "semantic-ui-react";
import {RemoveButton} from "../RemoveButton/RemoveButton";
import React, {useCallback, useState} from "react";
import {ImageUpload} from "../ImageUpload/ImageUpload";
import DatePicker from "react-datepicker";
import {AddStorage} from "../AddStorage/AddStorage";
import {Product} from "../Product/Product";
import {BrowserRouter as Router} from "react-router-dom";
import Slider from "@material-ui/core/Slider";

export const Storage = observer(({roomStore, storage}) => {
    const photo = !!storage.photo ? image(storage.photo.path) : placeholder;
    const [dropdown, setDropdown] = useState(true);
    const changeName = useCallback((e, {value}) => {
        storage.name = value;
        return changeStorageName(storage.id, value);
    }, [storage]);
    const onRemoveStorage = useCallback(() => deleteStorage(storage.id)
        .then(() => roomStore.fetchRooms()), [storage, roomStore]);
    const addStorage = useCallback((name, photoId) => addStorageChild(storage.id, name, photoId), [storage]);
    return (
        <Item id={`storage:${storage.id}`}>
            <Item.Image size='small' src={photo} wrapped ui={false}/>
            <Item.Content>
                <Item.Header style={{display: 'inline-flex'}}>
                    <Input placeholder={'Unnamed storage'} onChange={changeName} transparent value={storage.name}/>
                    <RemoveButton onDelete={onRemoveStorage} header={`Remove ${storage.name}`}/>
                </Item.Header>
                {!!storage.storages && storage.storages.length > 0 && (
                    <Item.Meta>
                        <span>{storage.storages.length} storages</span>
                    </Item.Meta>
                )}
                {!!storage.products && storage.products.length > 0 && (
                    <Item.Meta>
                        <span>{storage.products.length} products</span>
                    </Item.Meta>
                )}
                <Item.Description>
                    {!!storage.capacity && (
                        <Progress style={{maxWidth: '21rem'}} percent={storage.capacity  * 100} size='tiny'>
                            Capacity
                        </Progress>
                    )}
                    {!storage.products || storage.products.length < 1 && (
                        <AddStorage addStorage={addStorage} roomStore={roomStore}/>
                    )}
                    {!storage.storages || storage.storages.length < 1 && (
                        <AddProduct storage={storage} roomStore={roomStore}>Add product</AddProduct>
                    )}
                    {!!storage.products && storage.products.length > 0 && (
                        <Accordion>
                            <Accordion.Title active={dropdown} onClick={() => setDropdown(!dropdown)}>
                                <Icon name={dropdown ? 'caret down' : 'caret right'} />
                                Products
                            </Accordion.Title>
                            <Accordion.Content active={dropdown}>
                                <Item.Group divided>
                                    {storage.products.map(product => <Product storage={storage} key={`product:${product.id}`} products={storage.products} product={product}/>)}
                                </Item.Group>
                            </Accordion.Content>
                        </Accordion>
                    )}
                    {!!storage.storages && storage.storages.length > 0 && (
                        <Accordion>
                            <Accordion.Title active={dropdown} onClick={() => setDropdown(!dropdown)}>
                                <Icon name={dropdown ? 'caret down' : 'caret right'} />
                                Storages
                            </Accordion.Title>
                            <Accordion.Content active={dropdown}>
                                <Item.Group divided>
                                    {storage.storages.map(childStorage => <Storage roomStore={roomStore} key={`storage:${childStorage.id}`} storage={childStorage}/>)}
                                </Item.Group>
                            </Accordion.Content>
                        </Accordion>
                    )}
                </Item.Description>
            </Item.Content>
        </Item>
    )
});

const quantityUnits = [
    { key: 'pcs', value: 'PCS', text: 'pieces' },
    { key: 'kg', value: 'KG', text: 'kg' },
    { key: 'g', value: 'G', text: 'g' },
    { key: 'l', value: 'L', text: 'l' },
    { key: 'ml', value: 'ML', text: 'ml' },
];

const AddProduct = ({roomStore, storage}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState({
        name: null,
        picture: null,
        quantity: null,
        unit: null,
        expirationDate: null,
        capacity: !storage.capacity ? 0 : storage.capacity
    });
    const progress = Object.keys(product)
        .map(key => !product[key] ? 0 : 100 / Object.keys(product).length)
        .reduce((previous, current) => previous + current);
    const tryAddingProduct = useCallback(() => {
        setLoading(true);
        uploadPhoto(product.picture)
            .then(photoId => addProduct(storage.id, {
                name: product.name,
                photoId: photoId,
                quantity: {
                    value: product.quantity,
                    unit: product.unit
                },
                capacity: product.capacity,
                expirationDate: !product.expirationDate ? null : product.expirationDate.toISOString()
            }))
            .then(() => roomStore.fetchRooms())
            .then(() => setOpen(false))
            .then(() => setLoading(false))
    }, [roomStore, product, storage]);
    return (
        <div>
            <Button size={'mini'} onClick={() => setOpen(true)} style={{marginBottom: '2rem'}} >Add product</Button>
            <Modal onClose={() => setOpen(false)} open={open}>
                {loading && (
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                )}
                <Modal.Header>Add product</Modal.Header>
                <Progress color={'green'} percent={progress} attached='bottom' />
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field>
                                <label>Name</label>
                                <input onInput={({target}) => setProduct({...product, name: target.value})} placeholder='Name...' />
                            </Form.Field>
                            <Form.Select onChange={(e, {value}) => setProduct({...product, unit: value})} label={'Quantity unit'} placeholder={'Unit...'} options={quantityUnits}/>
                            <Form.Field error={!!product.quantity && !Number(product.quantity)}>
                                <label>Quantity</label>
                                <input onInput={({target}) => setProduct({...product, quantity: target.value})} placeholder='Quantity...' />
                            </Form.Field>
                            <Form.Field>
                                <label>Expiration date</label>
                                <DatePicker
                                    selected={product.expirationDate}
                                    onChange={date => setProduct({...product, expirationDate: date})}
                                />
                            </Form.Field>
                            <Form.Field>
                                <label>Storage capacity</label>
                                <Slider value={product.capacity * 100} onChange={(e, value) => setProduct({...product, capacity: value / 100})} min={0} max={100}/>
                            </Form.Field>
                            <ImageUpload onChanged={image => setProduct({...product, picture: image})}/>
                            <Form.Button onClick={tryAddingProduct} disabled={!product.name || product.name.length < 1 || !product.picture || !product.unit || !product.quantity} fluid>Add</Form.Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        </div>
    )
};