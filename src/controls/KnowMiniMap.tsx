import { MiniMap, Node } from 'react-flow-renderer';

const nodeColor = (node: Node) => {
    switch (node.type) {
        case 'input':
          return '#eee';
        case 'default':
          return '#00ff00';
        case 'output':
          return '#444';
        default:
          return '#eee';
      }
}

const nodeStrokeColor: any = (node: Node) => {
    if (node.style?.background) return node.style.background;
    if (node.type === 'input') return '#0041d0';
    if (node.type === 'output') return '#000000';
    if (node.type === 'default') return '#f5f5f9';

    return '#eee';
}
const KnowMiniMap = () => {
    return (
        <MiniMap
            nodeStrokeColor={nodeStrokeColor}
            nodeColor={nodeColor}
            nodeBorderRadius={2}
        />);
};

export default KnowMiniMap;
