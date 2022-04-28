import {ElMessage} from "@enn/element-plus";

//校验画布数据规则
export const checkGraphData = (graphData) => {
    const edges = graphData.edges;
    const nodes = graphData.nodes;
    console.log(">>>>>>>>>>>>>>>> nodes edges", nodes, edges)
    console.log("allNodeIds --------->", nodes.map(node => node.id))
    const nodeIds = nodes.map(node => node.id);
    for (let i = 0; i < edges.length; i++) {
        //校验每条边的source与target是否存在
        if(!edges[i].source.cell || !edges[i].target.cell){
            ElMessage.error("存在边的指向或者源头节点不明");
            throw new Error("存在边的指向或者源头节点不明");
        }
        for (let j = i+1; j < edges.length; j++) {
            if(edges[i].source.cell === edges[j].target.cell &&
                edges[i].target.cell === edges[j].source.cell
            ){
                ElMessage.error("两个节点之间不可互相指向");
                throw new Error("两个节点之间不可互相指向");
            }
        }
    }
    for (let i = 0; i < nodeIds.length; i++) {
        let asSource = 0;
        let asTarget = 0;
        for (let j = 0; j < edges.length; j++) {
            if(nodeIds[i] == edges[j].source.cell) asSource++;
            if(nodeIds[i] == edges[j].target.cell) asTarget++;
        }
        if(asSource > 1){
            ElMessage.error("同一个节点有且只能有一条线指向其他节点");
            throw new Error("同一个节点有且只能有一条线指向其他节点");
        }
        if(asTarget > 1){
            ElMessage.error("同一个节点有且只能有一条线指向该节点");
            throw new Error("同一个节点有且只能有一条线指向该节点");
        }
    }
    if (nodes.length == 0) {
        ElMessage.error("没有要保存的节点");
        throw new Error("没有要保存的节点");
    }
    if (nodes.length !== 1 && nodes.length - edges.length > 1) {
        ElMessage.error("节点没有闭合");
        throw new Error("节点没有闭合");
    }
};

export const sortRule = (edges, sortedRules = []) => {
    if (sortedRules.length == 0 && edges.length > 0) {
        sortedRules.push(edges[0].source.cell, edges[0].target.cell);
    }
    if (edges.length == 1) return sortedRules;
    for (let i = 1; i < edges.length; i++) {
        const source = edges[i].source.cell;
        const target = edges[i].target.cell;
        //该节点为数组中尾节点的target
        if (source == sortedRules[sortedRules.length - 1]) {
            sortedRules.push(target);
        }

        //该节点为数组中首节点的source
        if (target == sortedRules[0]) {
            sortedRules.unshift(source);
        }

        if (i < edges.length - 1) continue;
    }
    //如果遍历完之后 排序好的列表的长度与edges的长度不一致说明仍然有边没有参与，所以需要再遍历一次
    if (sortedRules.length < edges.length + 1) {
        sortRule(edges, sortedRules);
    }
    return sortedRules;
};

