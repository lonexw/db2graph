import { memo } from "react";
import { Handle, Position, Connection } from "react-flow-renderer";

const isValidConnection = (connection: Connection) => connection.target === '1';

export default memo(({ data, isConnectable } : any) => {
    return (
        <>
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('handle onConnect', params)}
                isConnectable={isConnectable}
                isValidConnection={isValidConnection}
            />
            <div>
                Custom Color Picker Node: <strong>{data.color}</strong>
            </div>
            <input
                className="nodrag"
                type="color"
                onChange={data.onChange}
                defaultValue={data.color}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="a"
                style={{ top: 10, background: '#555' }}
                isConnectable={isConnectable}
                isValidConnection={isValidConnection}
            />
            <Handle
                type="source"
                position={Position.Right}
                id="b"
                style={{ bottom: 10, top: 'auto', background: '#555' }}
                isConnectable={isConnectable}
                isValidConnection={isValidConnection}
            />
        </>
    );
});