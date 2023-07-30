import classNames from "classnames";
import { useDrop } from "react-dnd";

function Droppable(props) {
    const { containerId,
        index, args, id, children, accept = 'any', className, testId, onDrop } = props;

    const [{ canDrop, isOver }, dropRef] = useDrop(() => ({
        accept,
        drop: (source, monitor) => {
            const target = { index, args, id, containerId };
            onDrop?.(source, target);

            return target;
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    }), [onDrop, index, args, id, containerId]);

    if (children === 'function') {
        return children({ canDrop, isOver });
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