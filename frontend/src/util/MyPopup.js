import React from 'react'
import { Popup } from "semantic-ui-react";

const MyPopup = ({content, children, position , size="mini"}) => {
    return <Popup inverted content={content} trigger={children} position={position} size={size}/>;
}

export default MyPopup