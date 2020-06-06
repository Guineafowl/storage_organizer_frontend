import {observer} from "mobx-react";
import {
    changeProductName, changeProductQuantity,
    deleteProduct,
    image,
} from "../../service/service";
import placeholder from "../../placeholder.png";
import {Button, Dimmer, Form, Icon, Input, Item, Loader, Modal} from "semantic-ui-react";
import {RemoveButton} from "../RemoveButton/RemoveButton";
import Barcode from "react-barcode";
import React, {useCallback, useState} from "react";
import Slider from '@material-ui/core/Slider';

export const Product = observer(({storage, product, products}) => {
    const photo = !!product.photo ? image(product.photo.path) : placeholder;
    const quantity = product.quantity.unit === 'PCS' ? `${product.quantity.value}x` : `${product.quantity.value}${product.quantity.unit.toLowerCase()}`;
    const today = new Date().getTime();
    const expirationDate = new Date(product.expirationDate).getTime();
    const expirationDays = Math.round((expirationDate - today) / 86400 / 1000);
    const expirationMessage = expirationDays < 0
        ? <span style={{color: 'red'}}>expired {Math.abs(expirationDays)} days ago</span>
        : <span style={{color: 'green'}}>expires in {Math.round((expirationDate - today) / 86400 / 1000)} days</span>;
    const changeName = useCallback((e, {value}) => {
        product.name = value;
        return changeProductName(product.id, value);
    }, [product]);
    const onDelete = useCallback(() => deleteProduct(product.id)
        .then(() => {
            products.splice(products.findIndex(item => item.id === product.id), 1);
        }), [products, product]);
    return (
        <Item id={`product:${product.id}`}>
            <Item.Image size='small' src={photo} wrapped ui={false}/>
            <Item.Content>
                <Item.Header>
                    <Input placeholder={'Unnamed product'} onChange={changeName} transparent value={product.name}/>
                </Item.Header>
                <Item.Meta>
                    {quantity}
                    <Button.Group style={{marginLeft: '1rem'}} size={'mini'} >
                        <ChangeQuantity storage={storage} product={product}/>
                        <RemoveButton onDelete={onDelete} header={`Remove ${product.name}`}/>
                    </Button.Group>
                </Item.Meta>
                <Item.Description>
                    <div>
                        {!!product.expirationDate && <p><b>Expiration date:</b> {product.expirationDate} ({expirationMessage})</p>}
                        {!product.expirationDate && <p>No expiration date</p>}
                        {!!product.barcode && <Barcode fontSize={15} width={2.5} height={50} value={String(product.barcode)}/>}
                    </div>
                </Item.Description>
            </Item.Content>
        </Item>
    )
});

const ChangeQuantity = observer(({storage, product}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [quantity, setQuantity] = useState({
        value: product.quantity.value,
        capacity: !!storage.capacity ? storage.capacity : 0
    });
    const tryAddingRoom = useCallback(() => {
        setLoading(true);
        changeProductQuantity(product.id, quantity.value, quantity.capacity)
            .then(() => {
                product.quantity.value = quantity.value;
                storage.capacity = quantity.capacity;
            })
            .then(() => setOpen(false))
            .then(() => setLoading(false))
    }, [storage, product, quantity]);
    console.log(quantity)
    return (
        <>
            <Button onClick={() => setOpen(true)} icon={'balance scale'}/>
            <Modal onClose={() => setOpen(false)} open={open}>
                {loading && (
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                )}
                <Modal.Header>
                    Change quantity
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Form>
                            <Form.Field error={!!quantity.value && !Number(quantity.value)}>
                                <label>Quantity</label>
                                <input defaultValue={quantity.value} onInput={({target}) => setQuantity({...quantity, value: target.value})} placeholder='Quantity...' />
                            </Form.Field>
                            <Form.Field>
                                <label>Storage capacity</label>
                                <Slider value={quantity.capacity * 100} onChange={(e, value) => setQuantity({...quantity, capacity: value / 100})} min={0} max={100}/>
                            </Form.Field>
                            <Form.Button onClick={tryAddingRoom} disabled={!!quantity.value && !Number(quantity.value) || !quantity.value} fluid>Change</Form.Button>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>
        </>
    );
});