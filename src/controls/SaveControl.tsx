import { useCallback } from 'react';
import { useReactFlow, Node } from 'react-flow-renderer';

import './save_control.css';

const flowKey = 'example-flow';
const getNodeId = () => `randomnode_${+new Date()}`;

const SaveControl = ({ rfInstance, setNodes, setEdges }: any) => {
    const { setViewport } = useReactFlow();

    const onSave = useCallback(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject();
            localStorage.setItem(flowKey, JSON.stringify(flow));
        }
    }, [rfInstance]);

    const onRestore = useCallback(() => {
        const restoreFlow = async () => {
            const flow = JSON.parse(localStorage.getItem(flowKey) as string);

            if (flow) {
                const { x = 0, y = 0, zoom = 1 } = flow.viewport;
                setNodes(flow.nodes || []);
                setEdges(flow.edges || []);
                setViewport({ x, y, zoom });
            }
        };

        restoreFlow();
    }, [setNodes, setViewport]);

    const onAdd = useCallback(() => {
        const newNode: Node = {
            id: getNodeId(),
            data: { label: 'Added node' },
            position: {
                x: Math.random() * window.innerWidth - 100,
                y: Math.random() * window.innerHeight,
            },
        };
        setNodes((nds: Node[]) => nds.concat(newNode));
    }, [setNodes]);

    return  (
        <div className="save__controls">
            <button onClick={onSave}>save</button>
            <button onClick={onRestore}>restore</button>
            <button onClick={onAdd}>add node</button>
        </div>
    );
}

export default SaveControl;