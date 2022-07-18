
import './graph-header.css';

const GraphHeader = () => {
	return (
		<div className="graph-header">
			<div className="breadcrumb">工具产品 &gt; 述知笔记 &gt; Sonic 文本搜索引擎</div>
			<div>
				<button className="button-new-graph">New Graph</button>
				<span className="button-collapse-basic">收起 👇</span>
			</div>
		</div>
	)
}

export default GraphHeader;