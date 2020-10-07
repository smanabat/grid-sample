import React, {useState} from "react";
import faker from 'faker'
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {DndExample, getItems, getItemStyle, getListStyle, reorder} from "./DndExample";

const columnData = [
    'firstName', "lastName", "title", "gender"
]

const rowData = []

for (let i = 0; i < 100; i++) {
    rowData.push({firstName: faker.name.firstName(), lastName: faker.name.lastName(), title: faker.name.title(), gender: faker.name.gender()})
}


export default () => {
    const [columnOrder, setColumnOrder] = useState(columnData)
    const [items, setItems] = useState(getItems(6))

    function onDragEnd(result) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const newColumnOrder = reorder(
            columnOrder,
            result.source.index,
            result.destination.index
        );

        setColumnOrder(newColumnOrder)
    }

    return (
        <>
            <DndExample/>


            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {columnOrder.map((item, index) => (
                                <Draggable key={item} draggableId={item} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            )}
                                        >
                                            {item}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            <div style={{display: 'flex', flexDirection: 'row', border: '1px solid red', justifyContent: 'space-around'}}>
                {columnOrder.map(column => {
                    return <div style={{border: '1px solid black', flex: 1}}>
                        <h1>{column}</h1>
                    </div>
                })}
            </div>
            <div>
                {rowData.map(row => {
                    return <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around'}}>
                        {columnOrder.map(field => {
                            return <div style={{border: '1px solid black', flex: 1}}>
                                {row[field]}
                            </div>
                        })}
                    </div>
                })}
            </div>
        </>
    )
}
