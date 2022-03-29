import { Graph } from "@antv/x6";

export function generateNodePorts(){
  return {
    groups: {
      // 输入链接桩群组定义
      in: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      // 输出链接桩群组定义
      out: {
        position: 'bottom',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'port1',
        group: 'in',
      },
      {
        id: 'port2',
        group: 'out',
      },
    ],
  }
}

export function generateNodeRemoveTools(scene){
  return {
    name: 'button-remove',
    args: {
      x: '100%',
      y: 0,
      offset: {x: -5, y: 10},
    },
  }
}

export function generateEdgeRemoveTools(scene){
  return {
    name: 'button-remove',
    args: {
      distance: -20
    },
  }
}

export function initGraph(width, height, scene){
  const graph =  new Graph({
    container: document.getElementById("container"),
    width: width,
    height: height,
    background: {
      color: '#F2F3F5', // 设置画布背景颜色
    },
  })

  // 监听边生成期间，添加删除工具
  graph.on('edge:added', ({ edge, index, options }) => {
    edge.addTools(
      [
        generateEdgeRemoveTools(scene)
      ]
    )
  })

  // 监听节点生成时间，添加删除工具
  graph.on('node:added', ({ node, index, options }) => {
    node.addTools(
      [
        generateNodeRemoveTools(scene)
      ],
    );

  })
  return graph;
}

export const OPERATION_TYPE = {
  ADD: "add",
  UPDATE: "update",
  PREVIEW: 'preview'
}

//计算text的宽度
export function getTextWidth(text = "") {
  const dom = document.createElement("span");
  dom.style.display = "inline-block";
  dom.textContent = text;
  document.body.appendChild(dom);
  const width = dom.clientWidth;
  document.body.removeChild(dom);
  return width + 50;
}
