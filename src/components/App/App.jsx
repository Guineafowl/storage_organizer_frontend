import React, {useEffect} from 'react';
import {Route, BrowserRouter as Router, Switch, Link} from "react-router-dom";
import {Rooms} from "../Rooms/Rooms";
import {Room} from "../Room/Room";
import SearchBar from "../SearchBar/SearchBar";
import {observer} from "mobx-react/dist/mobx-react";
import {Button, Dimmer, Header, Loader} from "semantic-ui-react";

const App = observer(({roomStore}) => {
    useEffect(() => {
        roomStore.fetchRooms();
    }, [roomStore]);
    return (
        <div style={{
            minHeight: '50vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center'
        }}>
            <Router>
                <div id={'top'} style={{marginBottom: '1rem'}}>
                    <Header style={{fontSize: '4rem'}}>
                        <Link style={{color: 'black'}} to={'/'}>Storage organizer</Link>
                    </Header>
                    <SearchBar rooms={roomStore.rooms}/>
                </div>
                {roomStore.loading && (
                    <Dimmer active inverted>
                        <Loader content='Loading' />
                    </Dimmer>
                )}
                {!roomStore.loading && (
                    <Route exact path={'/room/:id'} component={({match}) => <Room roomStore={roomStore} room={roomStore.rooms.find(room => room.id === Number(match.params.id))}/>}/>
                )}
                <Route exact path={'/'} component={() => <Rooms roomStore={roomStore}/>}/>
                <Button secondary link href={'#top'} style={{position: 'fixed', right: '2rem', bottom: '2rem'}} icon={'arrow alternate circle up'}/>
            </Router>
        </div>
    )
});

export default App;