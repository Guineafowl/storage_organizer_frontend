import React, {useState, useCallback} from 'react';
import {Image} from "semantic-ui-react";

const placeholder = 'https://react.semantic-ui.com/images/wireframe/image.png';

export const ImageUpload = ({onChanged}) => {
    const [image, setImage] = useState(null);
    const imageChanged = useCallback(({target}) => {
        setImage(target.files[0]);
        onChanged(target.files[0]);
    });
    return (
        <label style={{margin: 0}} htmlFor="add-image">
            <Image style={{cursor: 'pointer', marginBottom: '1rem'}} size={'medium'} centered src={!image ? placeholder :  URL.createObjectURL(image)} />
            <input onChange={imageChanged} type="file" name="add-image" id="add-image" hidden/>
        </label>
    )
};