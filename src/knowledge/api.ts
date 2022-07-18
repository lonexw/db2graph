import { Node, Edge, MarkerType } from 'react-flow-renderer';
import axios from 'axios';

const getGraph = (id: string, callback: Function) => {
  axios.get(`http://127.0.0.1:4000/graph?id=${id}`, 
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      callback(res.data.data[0])
    })
}

const updateNodePos = (id: string, position: any) => {
  axios.get(`http://127.0.0.1:4000/nodes/update?id=${id}&position=(${position.x},${position.y})`, 
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
}

export { getGraph, updateNodePos }