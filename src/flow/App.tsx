import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactFlow, {
  addEdge,
  updateEdge,
  Node,
  Edge,
  MarkerType,
  XYPosition,
  Controls,
  Background,
  Connection,
  FitViewOptions,
  useNodesState,
  useEdgesState,
  SnapGrid,
  PanOnScrollMode,
  ReactFlowInstance,
  ReactFlowProvider
} from 'react-flow-renderer';
import GraphLibrary from '../graph/GraphLibrary';
import GraphHeader from '../graph/GraphHeader';

import Toolbar from './Toolbar'; // TODO
import KnowMiniMap from '../controls/KnowMiniMap';
import UpdateNodeControl from '../controls/UpdateNodeControl';
import ColorSelectorNode from '../custom-nodes/ColorSelectorNode';
// import ContextualZoomNode from '../custom-nodes/ContextualZoomNode';
import DragHandleNode from '../custom-nodes/DragHandleNode';
import CustomEdge from '../custom-edges/CustomEdge';
import ButtonEdge from '../custom-edges/ButtonEdge';
import FloatingEdge from '../custom-edges/FloatingEdge';
import Sidebar from './Sidebar';
import SaveControl from '../controls/SaveControl';
import ConnectionLine from '../custom-connection/CustomConnectionLine';
import FloatingConnectionLine from '../custom-connection/CustomConnectionLine';

// 声明新增自定义的 NodeType
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  dragHandleNode: DragHandleNode,
  // zoomNode: ContextualZoomNode
};
const edgeTypes = {
  custom: CustomEdge,
  button: ButtonEdge,
  floating: FloatingEdge,
};

import { getGraph, updateNodePos } from '../knowledge/api';

// Event
const onNodeDragStart = (event: any, node: Node) => console.log('drag start', node);
const onNodeDragStop =(event: any, node: Node) => {
  updateNodePos(node.id, node.position);
  console.log('drag stop', node) 
};
const onNodeClick = (event: any, node: Node)  => console.log('click node', node);
const onPaneClick = (event: any) => console.log('onPaneClick', event);
const onPaneScroll = (event: any) => console.log('onPaneScroll', event);
const onPaneContextMenu = (event: any) => console.log('onPaneContextMenu', event);

// Connecttion Validation
const onConnectStart = (_:any, { nodeId, handleType } : any) => console.log('on connect start', { nodeId, handleType });
const onConnectStop = (event: any) => console.log('on connect stop', event);
const onConnectEnd = (event: any) => console.log('on connect end', event);

let id = 0;
const getId = () => `node_${id++}`;

// 默认加载的节点数据
const { nodes: initialNodes, edges: initialEdges } = { nodes: [], edges: [] };

function GraphFlow() {
  const reactFlowWrapper = useRef<HTMLInputElement>(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance>();
  const [isSelectable, setIsSelectable] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  const [isConnectable, setIsConnectable] = useState(true);
  const [zoomOnScroll, setZoomOnScroll] = useState(false);
  const [panOnScroll, setPanOnScroll] = useState(false);
  const [panOnScrollMode, setPanOnScrollMode] = useState(PanOnScrollMode.Free);
  const [zoomOnDoubleClick, setZoomOnDoubleClick] = useState(false);
  const [panOnDrag, setpanOnDrag] = useState(true);
  const [captureZoomClick, setCaptureZoomClick] = useState(false);
  const [captureZoomScroll, setCaptureZoomScroll] = useState(false);
  const [captureElementClick, setCaptureElementClick] = useState(false);

  // 通过 Query 参数，动态加载 Graph 数据
  const [searchParams, setSearchParams] = useSearchParams();
  const graphId: string | null = searchParams.get('graphId');

  const onInit = (_reactFlowInstance: ReactFlowInstance) =>  {
    console.log('🚀 GraphFlow loaded success :', _reactFlowInstance);
    setReactFlowInstance(_reactFlowInstance);

    getGraph(graphId as string, (graph: any) => {
      console.log('get data')
      setNodes(graph.nodes);
      setEdges(graph.edges);
    });
  }

  const onConnect = useCallback((connection: Connection) => setEdges((eds) => 
    addEdge({...connection, animated: true, type: 'floating', markerEnd: { type: MarkerType.Arrow } }, eds)),
    []
  );

  // gets called after end of edge gets dragged to another source or target
  const onEdgeUpdate = (oldEdge: Edge, newConnection: Connection) => 
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  
  useEffect(() => {
    const onChange: Function = (event: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id !== 'Color') { return node; }
          const color = event.target.value;
          setBgColor(color);
          return {
            ...node,
            data: {
              ...node.data,
              color,
            },
          };
        })
      );
    };

    // const setBgColorNode: Node = { 
    //   id: 'Color',
    //   type: 'selectorNode',
    //   data: { onChange: onChange, color: initBgColor },
    //   style: { border: '1px solid #777', padding: 10 },
    //   position: { x: -200, y: 200 }
    // }

    // const dragTestNode: any = {
    //   id: 'drag',
    //   type: 'dragHandleNode',
    //   dragHandle: '.custom-drag-handle',
    //   style: { border: '1px solid #ddd', padding: '20px 40px' },
    //   position: { x: 0, y: 400 },
    // }

    // setNodes(nodes.concat([setBgColorNode, dragTestNode]));

    setEdges(edges);
  }, []);
  
  const fitViewOptions: FitViewOptions = {
    padding: 0.2
  }
  // ColorSelectorNode change bgColor
  const initBgColor = '#f5f5f5';
  const [bgColor, setBgColor] = useState(initBgColor);
  const connectionLineStyle = { stroke: '#fff' };
  const snapGrid: SnapGrid = [20, 20];

  // Drag to add nodes
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper?.current?.getBoundingClientRect() as DOMRect;
      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      }) as XYPosition;
      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  return (
    <div className="providerflow">
      <ReactFlowProvider>
        <GraphLibrary />
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <GraphHeader />
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeUpdate={onEdgeUpdate}
            connectionLineComponent={FloatingConnectionLine}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onInit={onInit}
            style={{ background: bgColor }}
            fitView
            fitViewOptions={fitViewOptions}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            snapGrid={snapGrid}
            // defaultZoom={0.8}
            // minZoom={0.2}
            // maxZoom={4}
            attributionPosition="bottom-right"
            onConnectStart={onConnectStart}
            onConnectStop={onConnectStop}
            onConnectEnd={onConnectEnd}
            onDrop={onDrop}
            onDragOver={onDragOver}
            elementsSelectable={isSelectable}
            nodesConnectable={isConnectable}
            nodesDraggable={isDraggable}
            zoomOnScroll={zoomOnScroll}
            panOnScroll={panOnScroll}
            panOnScrollMode={panOnScrollMode}
            zoomOnDoubleClick={zoomOnDoubleClick}
            onNodeClick={captureElementClick ? onNodeClick : undefined}
            onNodeDragStart={onNodeDragStart}
            onNodeDragStop={onNodeDragStop}
            panOnDrag={panOnDrag}
            onPaneClick={captureZoomClick ? onPaneClick : undefined}
            onPaneScroll={captureZoomScroll ? onPaneScroll : undefined}
            onPaneContextMenu={captureZoomClick ? onPaneContextMenu : undefined} >
              <KnowMiniMap />
              <Controls />
            {/*  <UpdateNodeControl 
                setNodes={setNodes}
                setEdges={setEdges} />*/}
            {/*  <SaveControl 
                rfInstance={reactFlowInstance}
                setNodes={setNodes}
                setEdges={setEdges} />*/}

              <Background color="#fff" gap={8} />

              <div className="toolbar">
                <div>
                  <label htmlFor="draggable">
                    <input
                      id="draggable"
                      type="checkbox"
                      checked={isDraggable}
                      onChange={(event) => setIsDraggable(event.target.checked)}
                      className="react-flow__draggable"
                    />
                    nodesDraggable
                  </label>
                </div>
                <div>
                  <label htmlFor="connectable">
                    <input
                      id="connectable"
                      type="checkbox"
                      checked={isConnectable}
                      onChange={(event) => setIsConnectable(event.target.checked)}
                      className="react-flow__connectable"
                    />
                    nodesConnectable
                  </label>
                </div>
                <div>
                  <label htmlFor="selectable">
                    <input
                      id="selectable"
                      type="checkbox"
                      checked={isSelectable}
                      onChange={(event) => setIsSelectable(event.target.checked)}
                      className="react-flow__selectable"
                    />
                    elementsSelectable
                  </label>
                </div>
                <div>
                  <label htmlFor="zoomonscroll">
                    <input
                      id="zoomonscroll"
                      type="checkbox"
                      checked={zoomOnScroll}
                      onChange={(event) => setZoomOnScroll(event.target.checked)}
                      className="react-flow__zoomonscroll"
                    />
                    zoomOnScroll
                  </label>
                </div>
                <div>
                  <label htmlFor="panonscroll">
                    <input
                      id="panonscroll"
                      type="checkbox"
                      checked={panOnScroll}
                      onChange={(event) => setPanOnScroll(event.target.checked)}
                      className="react-flow__panonscroll"
                    />
                    panOnScroll
                  </label>
                </div>
                <div>
                  <label htmlFor="panonscrollmode">
                    <select
                      id="panonscrollmode"
                      value={panOnScrollMode}
                      onChange={(event) => setPanOnScrollMode(event.target.value as PanOnScrollMode) }
                      className="react-flow__panonscrollmode"
                    >
                      <option value="free">free</option>
                      <option value="horizontal">horizontal</option>
                      <option value="vertical">vertical</option>
                    </select>
                    panOnScrollMode
                  </label>
                </div>
                <div>
                  <label htmlFor="zoomondbl">
                    <input
                      id="zoomondbl"
                      type="checkbox"
                      checked={zoomOnDoubleClick}
                      onChange={(event) => setZoomOnDoubleClick(event.target.checked)}
                      className="react-flow__zoomondbl"
                    />
                    zoomOnDoubleClick
                  </label>
                </div>
                <div>
                  <label htmlFor="panOnDrag">
                    <input
                      id="panOnDrag"
                      type="checkbox"
                      checked={panOnDrag}
                      onChange={(event) => setpanOnDrag(event.target.checked)}
                      className="react-flow__panOnDrag"
                    />
                    panOnDrag
                  </label>
                </div>
                <div>
                  <label htmlFor="capturezoompaneclick">
                    <input
                      id="capturezoompaneclick"
                      type="checkbox"
                      checked={captureZoomClick}
                      onChange={(event) => setCaptureZoomClick(event.target.checked)}
                      className="react-flow__capturezoompaneclick"
                    />
                    capture onPaneClick
                  </label>
                </div>
                <div>
                  <label htmlFor="capturezoompanescroll">
                    <input
                      id="capturezoompanescroll"
                      type="checkbox"
                      checked={captureZoomScroll}
                      onChange={(event) => setCaptureZoomScroll(event.target.checked)}
                      className="react-flow__capturezoompanescroll"
                    />
                    capture onPaneScroll
                  </label>
                </div>
                <div>
                  <label htmlFor="captureelementclick">
                    <input
                      id="captureelementclick"
                      type="checkbox"
                      checked={captureElementClick}
                      onChange={(event) => setCaptureElementClick(event.target.checked)}
                      className="react-flow__captureelementclick"
                    />
                    capture onElementClick
                  </label>
                </div>
              </div>
          </ReactFlow>
        </div>
        <Sidebar nodes={nodes} setNodes={setNodes} />
      </ReactFlowProvider>
    </div>
  )
}

export default GraphFlow;

