import { useCallback } from 'react';
import { useStore, Node, ReactFlowState, useStoreApi, useReactFlow } from 'react-flow-renderer';

import './sidebar.css';

const transformSelector = (state: ReactFlowState) => state.transform;

export default ({ nodes, setNodes }: any) => {
  const transform = useStore(transformSelector);

  const selectAll = useCallback(() => {
    setNodes((nds: Node[]) =>
      nds.map((node) => {
        node.selected = true;
        return node;
      })
    );
  }, [setNodes]);

  const store = useStoreApi();
  const { zoomIn, zoomOut, setCenter, setViewport } = useReactFlow();

  const focusNode = () => {
    const { nodeInternals } = store.getState();
    const nodes: Node[] = Array.from(nodeInternals).map(([, node]) => node);

    if (nodes.length > 0) {
      const node = nodes[0];

      const x = node.position.x + node.width! / 2;
      const y = node.position.y + node.height! / 2;
      const zoom = 1.85;

      setCenter(x, y, { zoom, duration: 1000 });
    }
  };

  const handleTransform = useCallback(
    () => () => {
      setViewport({ x: 0, y: 0, zoom: 1 }, { duration: 800 });
    },
    []
  );

  const zoomInNode = () => { zoomIn({ duration: 600}) }
  const zoomOutNode = () => { zoomOut({ duration: 600}) }

  const onDragStart = (event: any, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="nav-tabs">
        <div className="tab active">
          New
        </div>
        <div className="tab">
          Style
        </div>
        <div className="tab">
          Graph
        </div>
        <div className="tab">
          Share
        </div>
      </div>
     {/* <div className="description">
        This is an example of how you can access the internal state outside of the ReactFlow component.
      </div>
      <div className="title">Zoom & pan transform</div>
      <div className="transform">
        [{transform[0].toFixed(2)}, {transform[1].toFixed(2)}, {transform[2].toFixed(2)}]
      </div>
      <div className="title">Nodes</div>
      {nodes.map((node: Node) => (
        <div key={node.id}>
          Node {node.id} - x: {node.position.x.toFixed(2)}, y: {node.position.y.toFixed(2)}
        </div>
      ))}

      <div className="selectall">
        <button onClick={selectAll}>select all nodes</button>
      </div>
      <hr  />
      <div className="description">
        This is an example of how you can use the zoom pan helper hook
      </div>
      <button onClick={focusNode}>focus node</button>
      <button onClick={zoomInNode}>zoom in</button>
      <button onClick={zoomOutNode}>zoom out</button>

      <hr />*/}
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
    </aside>
  );
};
