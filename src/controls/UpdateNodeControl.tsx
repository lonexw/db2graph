import { useState, useEffect } from 'react';
import { Node, Edge } from 'react-flow-renderer';

import './update_node.css';

const UpdateNodeControl = ({ setNodes, setEdges }: any) => {
    const [nodeName, setNodeName] = useState('Node 0');
    const [nodeBg, setNodeBg] = useState('#eee');
    const [nodeHidden, setNodeHidden] = useState(false);

    useEffect(() => {
        setNodes((nds: Node[]) =>
            nds.map((node) => {
                if (node.id === '1') {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    node.data = {
                        ...node.data,
                        label: nodeName,
                    };
                }

                return node;
            })
        );
    }, [nodeName, setNodes]);

    useEffect(() => {
        setNodes((nds: Node[]) =>
            nds.map((node) => {
                if (node.id === '1') {
                    // it's important that you create a new object here
                    // in order to notify react flow about the change
                    node.style = { ...node.style, backgroundColor: nodeBg };
                }
        
                return node;
            })
        );
    }, [nodeBg, setNodes]);

    useEffect(() => {
        setNodes((nds: Node[]) =>
            nds.map((node) => {
                if (node.id === '1') {
                    // when you update a simple type you can just update the value
                    node.hidden = nodeHidden;
                }
    
                return node;
            })
        );
        setEdges((eds: Edge[]) =>
            eds.map((edge) => {
                // 隐藏与此关联的 Edges
                if (edge.id === 'e1-2' || edge.id === 'e1-3') {
                    edge.hidden = nodeHidden;
                }
                return edge;
            })
        );
      }, [nodeHidden, setNodes, setEdges]);

    return (
        <div className="updatenode__controls">
            <label>label:</label>
            <input value={nodeName} onChange={(evt) => setNodeName(evt.target.value)} />

            <label className="updatenode__bglabel">background:</label>
            <input value={nodeBg} onChange={(evt) => setNodeBg(evt.target.value)} />

            <div className="updatenode__checkboxwrapper">
            <label>hidden:</label>
            <input
                type="checkbox"
                checked={nodeHidden}
                onChange={(evt) => setNodeHidden(evt.target.checked)}
            />
            </div>
        </div>
    );
}

export default UpdateNodeControl;