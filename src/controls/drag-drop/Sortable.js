import React, { useCallback } from "react";
import classNames from "classnames";
import Droppable from "./Droppable";
import Draggable from "./Draggable";

function Sortable(props) {
    const {
        items, accept, defaultItemType = 'any',
        itemTypePropName = "type",
        onChange, className,
        allowRemove = true,
        children,
        useDragRef
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

    return (<div className={classNames("sortable", className)}>
        {items.map((item, i) => <Droppable key={i} containerId={containerId} index={i} accept={accept || defaultItemType} onDrop={itemDropped}>
            <Draggable
                containerId={containerId}
                index={i}
                item={item}
                itemType={item[itemTypePropName] || defaultItemType}
                onRemove={allowRemove && handleItemRemoved}
            >
                {useDragRef ? (handle) => children(item, i, handle) : children(item, i)}
            </Draggable>
        </Droppable>)}
        <Droppable className="drop-placeholder" index={items?.length || 0} accept={accept || defaultItemType} onDrop={itemDropped} />
    </div>);
}

export default Sortable;
