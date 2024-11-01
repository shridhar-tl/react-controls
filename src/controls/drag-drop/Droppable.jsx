import classNames from "classnames";
import { useDrop } from "react-dnd";

function Droppable(props) {
    const { containerId,
        index, args, id, children,
        accept = 'any', className,
        testId, onDrop
    } = props;

    const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
        accept,
        drop: (source, monitor) => {
            if (monitor.didDrop()) { // This means item is dropped to nested droppable
                return;
            }

            const target = { index, args, id, containerId };
            onDrop?.(source, target);

            return target;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [onDrop, index, args, id, containerId]);

    if (typeof children === 'function') {
        return children({ dropRef, canDrop, isOver });
    } else {
        const elClassName = classNames('droppable', className, {
            'drop-allowed': canDrop,
            'drop-denied': !canDrop,
            'drop-hover': isOver
        });

        return (
            <div ref={dropRef} className={elClassName} data-testid={testId}>
                {children}
            </div>
        );
    }
}

export default Droppable;