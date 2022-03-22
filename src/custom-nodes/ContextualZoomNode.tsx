import { memo } from 'react';
import { Handle, Position, ReactFlowState, useStore } from 'react-flow-renderer';

import './contextual_zoom_node.css';

const Placeholder = () => (
  <div className="placeholder">
    <div />
    <div />
    <div />
  </div>
);

const zoomSelector = (state: ReactFlowState) => state.transform[2];

export default memo(({ data }: any) => {
  const zoom = useStore(zoomSelector);
  const showContent = zoom >= 1.5;

  return (
    <>
      <Handle type="target" position={Position.Left} />
      {showContent ? data.content : <Placeholder />}
      <Handle type="source" position={Position.Right} />
    </>
  );
});