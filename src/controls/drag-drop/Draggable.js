import React from 'react';
import classNames from 'classnames';
import { useDrag } from 'react-dnd';

function Draggable(props) {
    const {
        containerId,
        index, id,
        item,
        itemType = 'any',
        testId,
        children,
        onRemove,
        className
    } = props;

    const [{ canDrag, isDragging }, dragRef] = useDrag(() => ({
        type: itemType,
        item: { index, item, itemType, id, containerId },
        end: (item, monitor) => {
            if (!onRemove || !monitor.didDrop()) {
                return;
            }

            const dropResult = monitor.getDropResult();
            if (dropResult?.containerId !== containerId) {
                onRemove({ index, id }, dropResult);
            }
        },
        collect: (monitor) => ({
            didDrop: monitor.didDrop(),
            canDrag: monitor.canDrag(),
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId()
        }),
    }), [onRemove, index, id, item, containerId])

    if (typeof children === 'function') {
        return children({ isDragging, dragRef });
    } else {
        const elClassName = classNames('draggable', className, {
            'item-draggable': canDrag,
            'item-dragging': isDragging
        });

        return (
            <div ref={dragRef} className={elClassName} data-testid={testId}>
                {children}
            </div>
        );
    }
}

export default React.memo(Draggable);