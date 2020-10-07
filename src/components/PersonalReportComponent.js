import React, {useState} from "react";
import faker from 'faker'

const columnData = [
    'firstName', "lastName", "title", "gender"
]

const rowData = []

for (let i = 0; i < 100; i++) {
    rowData.push({firstName: faker.name.firstName(), lastName: faker.name.lastName(), title: faker.name.title(), gender: faker.name.gender()})
}


export default () => {
    const [columnOrder, setColumnOrder] = useState(columnData)

    return (
        <>
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
