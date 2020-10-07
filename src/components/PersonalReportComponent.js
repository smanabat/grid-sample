import React, {useEffect, useMemo, useState} from "react";
import faker from 'faker'
import {DragDropContext, Draggable, Droppable} from 'react-beautiful-dnd';
import {getItems, getItemStyle, getListStyle, reorder} from "./DndExample";
import _ from 'lodash'
import SimpleAccordion from "./SimpleAccordion";

const columnData = [
    'firstName', "lastName", "title", "gender",
]

const initialRowData = []

for (let i = 0; i < 1000; i++) {
    initialRowData.push({firstName: faker.name.firstName(), lastName: faker.name.lastName(), title: faker.name.title(), gender: faker.name.gender(), nobility: faker.name.suffix()})
}

const groupRowData = (rowData, iteratee) => {
    function sortObject(o) {
        var sorted = {},
            key, a = [];

        for (key in o) {
            if (o.hasOwnProperty(key)) {
                a.push(key);
            }
        }

        a.sort();

        for (key = 0; key < a.length; key++) {
            sorted[a[key]] = o[a[key]];
        }
        return sorted;
    }

    let groupBy = _.groupBy(rowData, iteratee);
    return sortObject(groupBy)
}

const initialGroupedData = groupRowData(initialRowData, 'gender')

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

function plainTable(columnOrder, rowData) {
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
    const [rowData, setRowData] = useState(initialRowData)
    const [sorting, setSorting] = useState('')
    const [sortMethod, setSortMethod] = useState(true); // True = ASC, false = DESC

    const setSort = (column) => {
        if (column === sorting) {
            setSortMethod(!sortMethod);
        } else {
            setSorting(column)
            setSortMethod(true)
        }
    }

    const groupedRowData = useMemo(() => groupRowData(rowData, 'gender')
        , [rowData])
    // onCLick sort setGroupedData
    // useEffect(callback, [sortField, direction])

    useEffect(() => {
        let newRowData = _.sortBy(rowData, sorting)
        if (!sortMethod){
            newRowData = newRowData.reverse()
        }
        setRowData(newRowData)
    }, [sorting, sortMethod])

    // callback = () => map.sortby


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
            <button onClick={() => setColumnOrder([...columnOrder, "nobility"])}>add nobility</button>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}
                            {...provided.droppableProps}
                        >
                            {columnOrder.map((columnName, index) => (
                                <Draggable key={columnName} draggableId={columnName} index={index}>
                                    {(provided, snapshot) =>
                                        {
                                            const flex = index === 0 ? '0 0 100px' : '1'
                                            return <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{...getItemStyle(
                                                snapshot.isDragging,
                                                provided.draggableProps.style
                                            ), flex: flex, overflow: 'hidden'}}
                                        >
                                            <div style={{}}>
                                                <h1 style={{minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}onClick={() => setSort(columnName)}>{columnName}</h1>
                                            </div>
                                        </div>}
                                    }
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <div>
                {/*{plainTable(columnOrder, rowData}*/}
                {groupedTable(columnOrder, groupedRowData)}
            </div>
        </>
    )
}
