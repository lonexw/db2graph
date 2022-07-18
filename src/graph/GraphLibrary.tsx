
import './graph-library.css';

const GraphLibrary = () => {
  return (
    <div className="graph-library">
      <div className="container">
        <div className="header">
          <div className="userinfo">
            <img src="https://phab.yousails.com/file/data/nabgoecmpcpljgqw3xdv/PHID-FILE-xwy325e5ipisuvas65wk/profile" />
            <span className="username">晓文 Lone</span>
          </div>
          <span className="button-collapse-basic">👈 收起</span>
        </div>
        <div className="search">
          <input placeholder="Type / search" type="text" />
        </div>
        <div className="graph-list-wrapper">
          <p>📝 All Graph</p>
          <p>⭐️ Favorites</p>
          <p>🏷️ 标签</p>
          <div className="tags-wrapper">
            <ul>
              <li>🧐 产业研究
                <ul>
                  <li># 半导体</li>
                  <li># 新能源</li>
                </ul>
              </li>
            </ul>
          </div>
          <p className="trashed">Recently Deleted</p>
        </div>
      </div>
      <div className="footer">
        <p className="explore">🔗 Link awesome graph</p>
        <p className="links"><span>▶️ 视频教程</span> <span>👨🏻‍💻 联系工程师</span></p>
        <br />
        <p className="logo">述知笔记 Expound Note</p>
      </div>
    </div>
  )
}

export default GraphLibrary;