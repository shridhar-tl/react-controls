import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import Draggable from './Draggable';
import Droppable from './Droppable';
import Sortable from './Sortable';

export { Draggable, Droppable, Sortable };

export default function DragDropProvider({ children }) {
    return (<DndProvider backend={HTML5Backend}>{children}</DndProvider>);
}