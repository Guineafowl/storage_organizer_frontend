import React, {useState, useCallback} from 'react';
import {Button, Confirm} from "semantic-ui-react";

export const RemoveButton = ({onDelete, header}) => {
    const [show, setShow] = useState(false);
    const confirmDelete = useCallback(() => {
        onDelete()
            .then(() => setShow(false))
            .catch(() => setShow(false));
    });
    return (
        <div>
            <Button size={'mini'} onClick={() => setShow(true)} color={'red'} icon={'trash'}/>
            <Confirm
                open={show}
                header={header}
                onCancel={() => setShow(false)}
                onConfirm={confirmDelete}
                confirmButton={<Button primary={false} color={'red'}>Delete</Button>}
            />
        </div>
    )
};