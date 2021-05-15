/*
 * @Author: 王正荣
 * @Email: 1614699407@qq.com
 * @Date: 2021-05-14 00:39:20
 * @LastAuthor: 王正荣
 * @LastTime: 2021-05-15 23:33:37
 * @message: ks图
 */
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
// import { datas } from './Data';
import G6 from '@antv/g6';

let graph = null;

const GraphArea = (props) => {
  const { data, count } = props;
  console.log('data', data)
  const ref = React.useRef(null);

  const createGraph = () => {
    graph = new G6.Graph({
      container: ReactDOM.findDOMNode(ref.current),
      width: 800,
      height: 1600,
      fitView: true,
      modes: {
        default: ['drag-canvas'],
      },
      layout: {
        type: 'dagre',
        direction: 'LR',
      },
      defaultNode: {
        type: 'ellipse',
        size: [100, 50],
        labelCfg: {
          style: {
            fill: '#000000A6',
            fontSize: 10,
          },
        },
        style: {
          stroke: '#72CC4A',
          width: 150,
        },
      },
      defaultEdge: {
        type: 'line',
        style: {
          endArrow: true,
          stroke: 'black'
          // startArrow: true
        }
      },
    });
  }

  useEffect(() => {
    if (count === 0) {
      if (!graph) {
        createGraph();
      } 
      // if (graph) {
      //   return () => {
      //     graph = null;
      //   }
      // }
    } else {
      graph.destroy();
      createGraph();

    }
    graph.data(data);
    graph.render();
  }, [data]);

  return <div ref={ref}></div>;
}

export default GraphArea;