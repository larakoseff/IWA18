import { createOrderHtml, html, updateDraggingHtml, moveToColumn }  from './view.js' 

import { COLUMNS, createOrderData, updateDragging } from './data.js'
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
    updateDragging({ start: column })
    updateDraggingHtml({ start: column })
}

const handleDragEnd = (event) => { 
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
    updateDragging({ end: column })
    updateDraggingHtml({ end: column })
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

if (target.hasAttribute('data-add')) {
const addOrder = html.add.overlay
addOrder.setAttribute('open', 'true')
} 

if (target.hasAttribute('data-add-cancel')) {
    const addCancelElement = html.add.overlay
    addCancelElement.removeAttribute('open')
  }

}

const handleAddSubmit = (event) => {

    const formData = new FormData(event.target)

    const orderTitle = formData.get('data-add-title')
    const orderTable = formData.get('data-add-table')
    const orderColumn = COLUMNS['ordered']

    createOrderHtml(orderTitle, orderTable)
    createOrderData(orderTitle, orderTable)
    moveToColumn(orderColumn)
  }

const handleEditToggle = (event) => {
    const { target } = event
    
    if (target.hasAttribute('data-grid')) {
        const editOrder = html.edit.overlay
        editOrder.setAttribute('open', 'true')
        } 
        
 if (target.hasAttribute('data-edit-cancel')) {
            const editCancel = html.edit.overlay
            editCancel.removeAttribute('open')
          }

}
const handleEditSubmit = (event) => {
    const { target } = event
    
    if (target.hasAttribute('data-edit-form')) {
        
        createOrderHtml()
        createOrderData()
        moveToColumn()
    }
}

const handleDelete = (event) => {
    const { target } = event
        
 if (target.hasAttribute('data-edit-delete')) {
            const editCancel = html.edit.overlay
            editCancel.removeAttribute('open')
          }
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