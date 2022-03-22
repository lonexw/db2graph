import { Node, Edge, MarkerType } from 'react-flow-renderer';

const getNodes = (project: string = '') => {
    const nodes: Node[] = [
        {
            id: '1',
            type: 'input',
            data: { label: 'Node 0' },
            position: { x: 250, y: 5 },
            className: 'light',
          },
          {
            id: '2',
            data: { label: 'Group A' },
            position: { x: 100, y: 100 },
            className: 'light',
            style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 200, height: 200 },
          },
          {
            id: '2a',
            data: { label: 'Node A.1' },
            position: { x: 10, y: 50 },
            parentNode: '2',
          },
          { 
            id: '3', 
            data: { content: 'Node 1' }, 
            position: { x: 320, y: 100 }, 
            // type: 'zoomNode',
            className: 'light' },
          {
            id: '4',
            data: { label: 'Group B' },
            position: { x: 320, y: 200 },
            className: 'light',
            style: { backgroundColor: 'rgba(255, 0, 0, 0.2)', width: 300, height: 300 },
          },
          {
            id: '4a',
            data: { label: 'Node B.1' },
            position: { x: 15, y: 65 },
            className: 'light',
            parentNode: '4',
            extent: 'parent',
          },
          {
            id: '4b',
            data: { label: 'Group B.A' },
            position: { x: 15, y: 120 },
            className: 'light',
            style: { backgroundColor: 'rgba(255, 0, 255, 0.2)', height: 150, width: 270 },
            parentNode: '4',
          },
          {
            id: '4b1',
            data: { label: 'Node B.A.1' },
            position: { x: 20, y: 40 },
            className: 'light',
            parentNode: '4b',
          },
          {
            id: '4b2',
            data: { label: 'Node B.A.2' },
            position: { x: 100, y: 100 },
            className: 'light',
            parentNode: '4b',
          },
    ];

    return nodes;
}

const getEdges = (project: string = '') => {
    const edges: Edge[] = [
        { 
          id: 'e1-2', 
          source: '1', 
          target: '2', 
          animated: true , 
          type: 'button',
        },
        { 
          id: 'e1-3', 
          source: '1', 
          target: '3', 
          type: 'custom',
          data: { text: 'custom edge' },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        },
        { 
          id: 'e2a-4a', 
          source: '2a', 
          target: '4a', 
          type: 'straight',
          label: 'label only edge',
          // style: { stroke: 'none' },
        },
        { 
          id: 'e3-4', 
          source: '3',
          target: '4',
          animated: true,
          label: 'animated styled edge',
          style: { stroke: 'red' },
        },
        { 
          id: 'e3-4b', 
          source: '3', 
          target: '4b',
          label: 'styled label',
          labelStyle: { fill: 'red', fontWeight: 700 },
          markerEnd: {
            type: MarkerType.Arrow,
          },
        },
        { id: 'e4a-4b1', source: '4a', target: '4b1' },
        { id: 'e4a-4b2', source: '4a', target: '4b2' },
        { id: 'e4b1-4b2', source: '4b1', target: '4b2' },
    ];
    
    return edges;
}

export { getNodes, getEdges }