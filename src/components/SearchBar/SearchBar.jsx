import {Image, Input, List, Search} from "semantic-ui-react";
import React, {useCallback, useState} from "react";
import placeholder from '../../placeholder.png'
import { HashLink as Link } from 'react-router-hash-link';
import {image} from "../../service/service";

const SearchBar = ({rooms}) => {
    const [results, setResults] = useState({});

    const searchStorages = useCallback((room, matchedItems, storage, searched, parent) => {
        if (storage.name.toLowerCase().includes(searched.toLowerCase())) {
            if (!matchedItems.storages) {
                matchedItems.storages = {
                    name: 'Storages',
                    results: []
                }
            }
            matchedItems.storages.results.push({
                as: Link,
                title: storage.name,
                description: parent,
                image: !!storage.photo ? image(storage.photo.path) : placeholder,
                to: `/room/${room.id}#storage:${storage.id}`,
                id: `storage:${storage.id}`
            })
        }
        if (!!storage.products) {
            for (const product of storage.products) {
                if (product.name.toLowerCase().includes(searched.toLowerCase())) {
                    if (!matchedItems.products) {
                        matchedItems.products = {
                            name: 'Products',
                            results: []
                        }
                    }
                    matchedItems.products.results.push({
                        as: Link,
                        title: product.name,
                        price: !!product.expirationDate && product.expirationDate,
                        description: `${parent} in ${room.name}`,
                        image: !!product.photo ? image(product.photo.path) : placeholder,
                        to: `/room/${room.id}#product:${product.id}`,
                        id: `product:${product.id}`
                    })
                }
            }
        }
        if (!!storage.storages) {
            for (const child of storage.storages) {
                searchStorages(room, matchedItems, child, searched, storage.name);
            }
        }
    });

    const onSearch = useCallback((e, {value}) => {
        let matchedItems = {};
        if (value !== '') {
            for (const room of rooms) {
                if (room.name.toLowerCase().includes(value.toLowerCase())) {
                    if (!matchedItems.rooms) {
                        matchedItems.rooms = {
                            name: 'Rooms',
                            results: []
                        }
                    }
                    matchedItems.rooms.results.push({
                        as: Link,
                        title: room.name,
                        image: !!room.photo ? image(room.photo.path) : placeholder,
                        to: `/room/${room.id}`,
                        id: `room:${room.id}`
                    })
                }
                if (!!room.storages) {
                    for (const storage of room.storages) {
                        searchStorages(room, matchedItems, storage, value, room.name);
                    }
                }
            }
        }
        setResults(matchedItems);
    }, [rooms]);

    return <Search style={{width: '100%'}} category results={results} onSearchChange={onSearch} placeholder='Search...' fluid/>
};

export default SearchBar;
