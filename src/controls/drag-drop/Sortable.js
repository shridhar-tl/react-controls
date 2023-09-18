import React, { useCallback } from "react";
import classNames from "classnames";
import Droppable from "./Droppable";
import Draggable from "./Draggable";

function Sortable(props) {
    const propsRef = React.useRef(props);
    propsRef.current = props;

    const {
        items, accept: acceptTypeFromProps, defaultItemType = 'any',
        onChange, onDrop, className,
        useDropRef,
        addPlaceholder,
        placeholder,
        tagName: TagName = 'div'
    } = props;

    const accept = React.useMemo(() => {
        if (!acceptTypeFromProps) {
            return defaultItemType;
        }

        if (!Array.isArray(acceptTypeFromProps)) {
            return [acceptTypeFromProps, defaultItemType]
        }

        return [...acceptTypeFromProps, defaultItemType];
    }, [acceptTypeFromProps, defaultItemType]);

    const containerId = React.useId();

    const handleItemRemoved = useCallback((result) => {
        const { onRemove, items, onChange } = propsRef.current;

        if (onRemove) {
            onRemove(result);
            return;
        }

        const newItems = [...items];

        newItems.splice(result.index, 1);

        onChange(newItems);
    }, []);

    const itemDropped = React.useCallback((source, target) => {
        // If item is dropped from different container, then do not add it automatically
        // onDrop has to be handled to handle new item
        //  && source.itemType !== defaultItemType
        if (source.containerId !== containerId && (onDrop || source.itemType !== defaultItemType)) {
            onDrop?.(source, target);
            return;
        }

        const newItems = [...items];

        if (source.containerId === target.containerId) {
            newItems.splice(source.index, 1);
        }

        newItems.splice(target.index, 0, source.item);

        onChange(newItems);
    }, [items, onChange, onDrop, containerId, defaultItemType]);

    const getDraggable = getDraggableFactory(props, containerId, handleItemRemoved);

    return (<TagName className={classNames("sortable", className)}>
        {items.map((item, i) => <Droppable key={i} containerId={containerId} index={i} accept={accept || defaultItemType} onDrop={itemDropped}>
            {useDropRef ? (droppable) => getDraggable(item, i, droppable) : getDraggable(item, i)}
        </Droppable>)}
        {(addPlaceholder || placeholder) && <Droppable containerId={containerId}
            className="drop-placeholder"
            index={items?.length || 0}
            accept={accept || defaultItemType}
            onDrop={itemDropped}>{placeholder}</Droppable>}
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
        itemType={(itemTypePropName && item[itemTypePropName]) || defaultItemType}
        onRemove={allowRemove && handleItemRemoved}
    >
        {useDragRef ? (draggable) => children(item, index, { draggable, droppable }) : children(item, index, { droppable })}
    </Draggable>);
}