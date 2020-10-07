import React, {useState} from "react";
import faker from 'faker'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {getItems, getItemStyle, getListStyle, reorder} from "./DndExample";
import _ from 'lodash'
import SimpleAccordion from "./SimpleAccordion";

const columnData = [
    'firstName', "lastName", "title", "gender",
]

const rowData = []

for (let i = 0; i < 100; i++) {
    rowData.push({firstName: faker.name.firstName(), lastName: faker.name.lastName(), title: faker.name.title(), gender: faker.name.gender(), nobility: faker.name.suffix()})
}

const groupRowData = (rowData, iteratee) => {
    return _.groupBy(rowData, iteratee)
}

const initialGroupedData = groupRowData(rowData, 'gender')

function getRowDataDivs(columnOrder, rowData) {
    return rowData.map(row => {
        return <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', flex: 1}}>
            {columnOrder.map(field => {
                return <div style={{border: '1px solid black', flex: 1}}>
                    {row[field]}
                </div>
            })}
        </div>
    });
}

function plainTable(columnOrder) {
    return <>
        {getRowDataDivs(columnOrder, rowData)}
    </>;
}

function groupedTable(columnOrder, groupedRowData) {
    return Object.keys(groupedRowData).map((grouping) => {
        return <SimpleAccordion title={grouping}>
            <div style={{flexDirection: 'column', flex: 1}}>
                {getRowDataDivs(columnOrder, groupedRowData[grouping])}
            </div>
        </SimpleAccordion>
        }
    );
}

export default () => {
    const [columnOrder, setColumnOrder] = useState(columnData)
    const [items, setItems] = useState(getItems(6))
    const [groupedRowData, setGroupedRowData] = useState(initialGroupedData)



    console.log(groupedRowData)

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
            <button  onClick={()=> setColumnOrder([...columnOrder, "nobility"])}>add nobility</button>
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
                                            <h1>{item}</h1>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div>
                {/*{plainTable(columnOrder)}*/}
                {groupedTable(columnOrder,groupedRowData)}
            </div>
        </>
    )
}
