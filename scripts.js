import { createOrderHtml, html, updateDraggingHtml, moveToColumn }  from './view.js' 

import { state, createOrderData, updateDragging } from './data.js'
/**
 * A handler that fires when a user drags over any element inside a column. In
 * order to determine which column the user is dragging over the entire event
 * bubble path is checked with `event.path` (or `event.composedPath()` for
 * browsers that don't support `event.path`). The bubbling path is looped over
 * until an element with a `data-area` attribute is found. Once found both the
 * active dragging column is set in the `state` object in "data.js" and the HTML
 * is updated to reflect the new column.
 *
 * @param {Event} event 
 */
const handleDragOver = (event) => {
    event.preventDefault();
    const path = event.path || event.composedPath()
    let column = null

    for (const element of path) {
        const { area } = element.dataset
        if (area) {
            column = area
            break;
        }
    }

    if (!column) return
    updateDragging({ over: column })
    updateDraggingHtml({ over: column })
}

const handleDragStart = (event) => { 
    const dragID = event.target.dataset.id
    const dragSourceColumn = state.orders[dragID.column]
    state.dragging.source = dragSourceColumn
}

const handleDragEnd = (event) => { 
const dragID = event.target.dataset.id
const dragOverColumn = state.dragging.over

moveToColumn(dragID, dragOverColumn)

state.orders[dragID].column = dragOverColumn

}


const handleHelpToggle = (event) => {
    const { target } = event

    if (target.hasAttribute('data-help')) {
      const helpOverlayElement = html.help.overlay
      helpOverlayElement.setAttribute('open', 'true')
    }
  
    if (target.hasAttribute('data-help-cancel')) {
      const helpCancelElement = html.help.overlay
      helpCancelElement.removeAttribute('open')
    } 
  }

const handleAddToggle = (event) => {
const { target } = event  
const otherAdd = html.other.add
const addCancelElement = html.add.overlay
const addOrder = html.add.overlay


if (target.hasAttribute('data-add')) {
addOrder.showModal()
} 

if (target.hasAttribute('data-add-cancel')) {
    addCancelElement.close()
    otherAdd.focus()
  }

}

const handleAddSubmit = (event) => {
event.preventDefault()
const addOverlay = html.add.overlay
const otherAdd = html.other.add
const addForm = html.add.form

const addTitle = html.add.title.value
const addTable = html.add.table.value
const defaultColumn = 'ordered'

const defaultHTMLColumn = html.columns.ordered

const newOrderObj = createOrderData({title: addTitle, table: addTable, column: defaultColumn})

state.orders[newOrderObj.id] = newOrderObj

defaultHTMLColumn.appendChild(createOrderHtml(state.orders[newOrderObj.id]))

addForm.reset()
addOverlay.close()
otherAdd.focus()
}

const handleEditToggle = (event) => {
    const editOverlay = html.edit.overlay
    const otherAdd = html.other.add
    const formID = html.edit.id
    const formTitle = html.edit.title
    const formTable = html.edit.table
    const formColumn = html.edit.column

    if(event.target.className === 'order') {
        formID.value = event.target.dataset.id
        formTitle.value = state.orders[formID.value].title
        formTable.value = state.orders[formID.value].table
        formColumn.value = state.orders[formID.value].column
        editOverlay.showModal()
    } else {
        editOverlay.close()
        otherAdd.focus()
    }


}
const handleEditSubmit = (event) => {
event.preventDefault()
const editOverlay = html.edit.overlay
const otherAdd = html.other.add
const formID = html.edit.id

const formTitle = html.edit.title
const formTable = html.edit.table
const formColumn = html.edit.column
let currentColumn = null

if(formColumn.value === 'ordered') currentColumn = html.columns.ordered
if(formColumn.value === 'preparing') currentColumn = html.columns.preparing
if(formColumn.value === 'served') currentColumn = html.columns.served

state.orders[formID.value].title = formTitle.value 
state.orders[formID.value].table = formTable.value 
state.orders[formID.value].column = formColumn.value  

currentColumn.appendChild(document.querySelector(`[data-id="${formID.value}"]`))
document.querySelector(`[data-id="${formID.value}"] [data-order-title]`).innerHTML = state.orders[formID.value].title
document.querySelector(`[data-id="${formID.value}"] [data-order-table]`).innerHTML = state.orders[formID.value].table

editOverlay.close()
otherAdd.focus()

}

const handleDelete = (event) => {
const editOverlay = html.edit.overlay
const otherAdd = html.other.add
const formID = html.edit.id

const formColumn = html.edit.column
let currentColumn = null

if (formColumn.value === 'ordered') currentColumn = html.columns.ordered
if (formColumn.value === 'preparing') currentColumn = html.columns.preparing
if (formColumn.value === 'served') currentColumn = html.columns.served

currentColumn.removeChild(document.querySelector(`[data-id="${formID.value}"]`))

delete state.orders[formID.value]
editOverlay.close()
otherAdd.focus()
}

html.add.cancel.addEventListener('click', handleAddToggle)
html.other.add.addEventListener('click', handleAddToggle)
html.add.form.addEventListener('submit', handleAddSubmit)

html.other.grid.addEventListener('click', handleEditToggle)
html.edit.cancel.addEventListener('click', handleEditToggle)
html.edit.form.addEventListener('submit', handleEditSubmit)
html.edit.delete.addEventListener('click', handleDelete)

html.help.cancel.addEventListener('click', handleHelpToggle)
html.other.help.addEventListener('click', handleHelpToggle)

for (const htmlColumn of Object.values(html.columns)) {
    htmlColumn.addEventListener('dragstart', handleDragStart)
    htmlColumn.addEventListener('dragend', handleDragEnd)
}

for (const htmlArea of Object.values(html.area)) {
    htmlArea.addEventListener('dragover', handleDragOver)
}