export function treeFind (tree, func) {
    for (const data of tree) {
        if (func(data)) return data
        if (data.children) {
            const res = treeFind(data.children, func)
            if (res) return res
        }
    }
    return null
}

export function getQueryString(name) {
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = window.location.href.match(reg);
    if (arr) {
        arr.forEach((item) => {
            let tempArr = item.substring(1).split('=');
            obj[tempArr[0]] = tempArr[1];
        })
    }
    return obj[name]

}

export function getParent(data2, nodeId2) {
    let arrRes = [];
    if (data2.length == 0) {
        if (!!nodeId2) {
            arrRes.unshift(data2)
        }
        return arrRes;
    }
    let rev = (data, nodeId) => {
        for (let i = 0, length = data.length; i < length; i++) {
            let node = data[i];
            if (node.id == nodeId) {
                arrRes.unshift(node)
                rev(data2, node.parentId);
                break;
            }
            else {
                if (!!node.children) {
                    rev(node.children, nodeId);
                }
            }
        }
        return arrRes;
    };
    arrRes = rev(data2, nodeId2);
    return arrRes;
}
