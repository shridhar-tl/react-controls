import React, { useCallback } from "react";
import classNames from "classnames";
import Droppable from "./Droppable";
import Draggable from "./Draggable";

function Sortable(props) {
    const {
        items, accept, defaultItemType = 'any',
        onChange, className,
        useDropRef,
        addPlaceholder,
        placeholder,
        tagName: TagName = 'div'
    } = props;
    const containerId = React.useId();

    const handleItemRemoved = useCallback((result) => {
        const newItems = [...items];

        newItems.splice(result.index, 1);

        onChange(newItems);
    }, [items, onChange]);

    const itemDropped = React.useCallback((source, target) => {
        const newItems = [...items];

        if (source.containerId === target.containerId) {
            newItems.splice(source.index, 1);
        }

        newItems.splice(target.index, 0, source.item);

        onChange(newItems);
    }, [items, onChange]);

    const getDraggable = getDraggableFactory(props, containerId, handleItemRemoved);

    return (<TagName className={classNames("sortable", className)}>
        {items.map((item, i) => <Droppable key={i} containerId={containerId} index={i} accept={accept || defaultItemType} onDrop={itemDropped}>
            {useDropRef ? (droppable) => getDraggable(item, i, droppable) : getDraggable(item, i)}
        </Droppable>)}
        {(addPlaceholder || placeholder) && <Droppable containerId={containerId} className="drop-placeholder" index={items?.length || 0} accept={accept || defaultItemType} onDrop={itemDropped}>{placeholder}</Droppable>}
    </TagName>);
}

export default Sortable;

function getDraggableFactory(props, containerId, handleItemRemoved) {
    const {
        defaultItemType = 'any',
        itemTypePropName,
        allowRemove = true,
        itemTemplate,
        children = itemTemplate,
        useDragRef
    } = props;

    return (item, index, droppable) => (<Draggable
        containerId={containerId}
        index={index}
        item={item}
        itemType={itemTypePropName ? item[itemTypePropName] || defaultItemType : defaultItemType}
        onRemove={allowRemove && handleItemRemoved}
    >
        {useDragRef ? (draggable) => children(item, index, { draggable, droppable }) : children(item, index, { droppable })}
    </Draggable>);
}