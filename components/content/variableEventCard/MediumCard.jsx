import React from "react";

import EventElement from "../../cards/EventElement";

export default function MediumCard({ event, creator, onPress }) {
    return <EventElement event={event} onPress={onPress}  />
}
