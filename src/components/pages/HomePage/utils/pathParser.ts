type MyType = {
  [key: string] : any;
};

export type PathItemObjType = {
  text: string;
  children?: PathItemObjType[];
};

const addPath = (pathItems: string[], obj: MyType = {}) => {
  if (pathItems.length) {
    let pathItem = pathItems.shift();
    let current;
    if(pathItem){
      current = obj[pathItem] || (obj[pathItem] = { text: pathItem })
      if (pathItems.length) {
        addPath(pathItems, current.children || (current.children = {}))
      }
    }
  }
  return obj
};

const makeArray = (obj: MyType) => {
  let arr = Object.values(obj)
  arr.filter(item => item.children).forEach(item => {
    item.children = makeArray(item.children)
  })
  return arr
};

export const parsePath = (pathsArr: string[]) => {
  let treeObj = pathsArr.reduce((obj, path) => addPath(path.split('/'), obj), {});
  let arr = makeArray(treeObj)
  return arr
};