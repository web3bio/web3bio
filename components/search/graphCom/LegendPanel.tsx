import Image from 'next/image';
import React, { useEffect } from 'react';
import { global } from './LargeGraphRegister';

const isBrowser = typeof window !== 'undefined';
const G6 = isBrowser ? require('@antv/g6') : null;
const insertCss = isBrowser ? require('insert-css') : null;

if (isBrowser) {
  insertCss(`
    #legend-panel {
      width: 30%;
      position: absolute;
      right: 0px;
      top: 64px;
      height: 100%;
      background-color: #34373A;
      border-left: 2px #444 solid;
      color: rgba(255, 255, 255, 0.85);
      text-align: center;
      box-shadow: 18px 5px 0 0 rgba(0, 0, 0, 0.6);
    }
    #legend-panel .legned-title {
      width: 100%;
      color: rgba(255, 255, 255, 0.85);
      text-align: center;
      margin-bottom: 0px;
    }
    #legend-panel #legend-graph-container {
      width: 100%;
      height: 250px;
      background-color: #2b2f33;
      margin-top: 8px;
    }
    #legend-panel #discription-container {
      margin-top: 16px;
      padding: 0px 16px;
      height: calc(100% - 430px);
      overflow-y: scroll;
    }
  `);
}

let legendGraph = null;
let CANVAS_WIDTH = 100;
let CANVAS_HEIGHT = 800;

const LegendPanel = () => {
  const container = React.useRef<HTMLDivElement>(null);
  const data = {
    nodes: [
      {
        id: 'aggregated-node-legend',
        x: 50,
        y: 30,
        type: 'aggregated-node',
        count: 10,
      },
      {
        id: 'real-node-legend',
        x: 50,
        y: 90,
        size: 20,
        type: 'real-node',
      },
      {
        id: 'aggregated-node-legend-new',
        x: 50,
        y: 220,
        type: 'aggregated-node',
        count: 10,
        new: true,
      },
      {
        id: 'real-node-legend-new',
        x: 100,
        y: 220,
        size: 20,
        type: 'real-node',
        new: true,
      },
    ],
    edges: [
      {
        source: 'aggregated-node-legend',
        target: 'real-node-legend',
        type: 'custom-line',
        isReal: false,
        size: 4,
      },
      {
        source: 'aggregated-node-legend',
        target: 'real-node-legend',
        type: 'custom-line',
        isReal: true,
        size: 4,
      },
    ],
  };
  data.edges.forEach((edge: any) => {
    const dash = edge.size;
    const lineDash = edge.isReal ? undefined : [dash, dash];
    const stroke = edge.isReal ? global.edge.style.realEdgeStroke : global.edge.style.stroke;
    const opacity = edge.isReal
      ? global.edge.style.realEdgeOpacity
      : global.edge.style.strokeOpacity;

    const arrowWidth = Math.max(edge.size / 2 + 2, 3);
    const arrowLength = 10;
    const arrowBeging = arrowLength;
    let arrowPath = `M ${arrowBeging},0 L ${arrowBeging + arrowLength},-${arrowWidth} L ${
      arrowBeging + arrowLength
    },${arrowWidth} Z`;
    let d = arrowLength;

    edge.style = {
      stroke,
      strokeOpacity: opacity,
      cursor: 'pointer',
      lineAppendWidth: Math.max(edge.size || 5, 5),
      fillOpacity: 1,
      lineDash,
      endArrow: arrowPath
        ? {
            path: arrowPath,
            d,
            fill: stroke,
            strokeOpacity: 0,
          }
        : false,
    };
  });
  useEffect(() => {
    if (container && container.current) {
      CANVAS_WIDTH = container.current.offsetWidth;
      CANVAS_HEIGHT = container.current.offsetHeight;
    }
    if (!legendGraph || legendGraph.get('destroyed')) {
      legendGraph = new G6.Graph({
        container: container.current as HTMLElement,
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        defaultEdge: {
          labelCfg: {
            style: {
              fill: 'rgba(255, 255, 255, 0.85)',
            },
          },
        },
      });
      legendGraph.data(data);
      legendGraph.render();

      legendGraph.getEdges().forEach((edge) => {
        if (!edge.getModel().isReal) {
          legendGraph.updateItem(edge, {
            source: { x: 20, y: 130 },
            target: { x: 80, y: 130 },
            count: 10,
          });
        } else {
          legendGraph.updateItem(edge, {
            source: { x: 20, y: 170 },
            target: { x: 80, y: 170 },
            count: 10,
          });
        }
      });

      const group = legendGraph.getGroup();
      const textStyle = {
        fill: 'rgba(255, 255, 255, 0.85)',
        textBaseline: 'middle',
        x: 100,
        fontWeight: 800,
        fontSize: 14,
      };
      const aggregatedNodeText = group.addShape('text', {
        attrs: {
          text: 'Aggregate Node',
          y: 20,
          ...textStyle,
        },
      });
      group.addShape('text', {
        attrs: {
          text: 'The number in the middle of the node represents the number of nodes contained in the cluster',
          y: aggregatedNodeText.getBBox().maxY + 16,
          ...textStyle,
          opacity: 0.6,
          fontSize: 10,
        },
      });

      const realNodeText = group.addShape('text', {
        attrs: {
          text: 'real node',
          y: 80,
          ...textStyle,
        },
      });
      group.addShape('text', {
        attrs: {
          text: 'Its a real node',
          y: realNodeText.getBBox().maxY + 8,
          ...textStyle,
          opacity: 0.6,
          fontSize: 10,
        },
      });

      const aggregatedEdgeText = group.addShape('text', {
        attrs: {
          text: 'Aggregate edges',
          y: 130,
          ...textStyle,
        },
      });
      group.addShape('text', {
        attrs: {
          text: 'At least one endpoint is an aggregation node',
          y: aggregatedEdgeText.getBBox().maxY + 8,
          ...textStyle,
          opacity: 0.6,
          fontSize: 10,
        },
      });

      const realEdgeText = group.addShape('text', {
        attrs: {
          text: 'real side',
          y: 170,
          ...textStyle,
        },
      });
      group.addShape('text', {
        attrs: {
          text: 'Both endpoints are real nodes',
          y: realEdgeText.getBBox().maxY + 8,
          ...textStyle,
          opacity: 0.6,
          fontSize: 10,
        },
      });

      const newNodeText = group.addShape('text', {
        attrs: {
          text: 'Green dot mark: new node',
          y: 210,
          ...textStyle,
          x: 130,
        },
      });
      group.addShape('text', {
        attrs: {
          text: 'Compared with the previous result, the small green dot on the upper right marks the new aggregated node or real node in the updated result.',
          y: newNodeText.getBBox().maxY + 16,
          ...textStyle,
          opacity: 0.6,
          fontSize: 10,
          x: 130,
        },
      });
    }
  });

  return (
    <div id="legend-panel">
      <h1 className="legned-title">Legend and Usage</h1>
      <a
        className="description"
        href="https://github.com/antvis/G6/blob/master/packages/site/site/pages/largegraph.zh.tsx"
        target="_blanck"
      >
        Source Code
      </a>
      <div id="legend-graph-container" ref={container} />
      <div id="discription-container">
        <span className="description">
          {' '}
          Some research has found that the graph visulization is readable and interactable for end
          users under 500 nodes. To reach this principle for large graph, we clustering the source
          data by LOUVAIN algorithm, and visualize the aggregated graph first. Then, end users are
          able to do drilling down exploration.
        </span>
        <span className="description">
          {' '}
          If the number of nodes still large on aggregated graph, we can do multi-level aggregation.
          To control the number of rendering nodes, the earliest expanded cluster will be collapsed
          automatically. These rules also help us to avoid overloaded computation and rendering on
          front-end.
        </span>
        <br />
        <br />
        <h3 className="legned-title">{`<Graph Interaction>`}</h3>
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*IgoxQ7wfjCcAAAAAAAAAAAAAARQnAQ"
          width="120"
          alt=''
        />{' '}
        &nbsp; &nbsp; &nbsp; &nbsp;
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*cCk4SrHVfDsAAAAAAAAAAAAAARQnAQ"
          width="150"
          alt=''
        />
        <br />
        <br />
        <span className="description">
          Each Aggregated Node
          <Image
            src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*1y4AS7ucVXMAAAAAAAAAAAAAARQnAQ"
            width="50"
            alt=''
          />
          represents a cluster generated by LOUVAIN, it contains several Real Node
          <Image
            src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*IOgvSLWF1IQAAAAAAAAAAAAAARQnAQ"
            width="20"
            alt=''
          />
          .<strong>「Right Click」</strong> any node or edge on the graph, a corresponding
          contextmenu will show up. Right click{' '}
          <Image
            src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*1y4AS7ucVXMAAAAAAAAAAAAAARQnAQ"
            width="50"
            alt=''
          />{' '}
          and select Expand Node, the aggregated node will be replaced by the real nodes of the
          cluster. You can also right click{' '}
          <Image
            src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*IOgvSLWF1IQAAAAAAAAAAAAAARQnAQ"
            width="20"
            alt=''
          />{' '}
          and select Collapse the Cluster to collapse it, or select Find k-Degree Neighbor, A
          neighbor graph of the selected node will be merged into the current graph.
        </span>
        <br /> <br />
        <h3 className="legned-title">{`<The Canvas Menu>`}</h3>
        <Image
          src="https://gw.alipayobjects.com/mdn/rms_f8c6a0/afts/img/A*FKbFRIzj34EAAAAAAAAAAAAAARQnAQ"
          width="300"
          alt=''
        />
        <br />
        <span>
          There is a set of assistant tools on the canvas menu, which is on the left top of the
          canvas. From left to right, they are:
        </span>
        <br />
        <span>
          <strong>
            - Show/Hide Edge Labels;
            <br />
            - Fisheye Lens;
            <br />
            - Lasso Select Mode;
            <br />
            - Find the Shortest Path (by clicking select two end nodes);
            <br />
            - Zoom-out;
            <br />
            - Fit the Graph to the View Port;
            <br />
            - Zoom-in;
            <br />- Search a Node(by typing the id).
          </strong>
        </span>
        <br /> <br />
        <h3 className="legned-title">{`<Notice>`}</h3>
        <span>
          The demo shows a small mocked dataset just for demonstration. Besides the functions
          introduced above, there are lots of other functions. We hope it is helpful for you.
          Explore it and have fun!
        </span>
      </div>
    </div>
  );
};

export default LegendPanel;