const tree = [];
const findHeadingTagNameList = ['H1', 'H2', 'H3', 'H4', 'H5', 'H6'];
const semanticTagList = ['SECTION', 'MAIN', 'ASIDE', 'NAV', 'ARTICLE', 'HEADER', 'FOOTER', 'BODY'];
const actionTagList = ['LI', 'A', 'BUTTON', 'SELECT', 'LABEL', 'INPUT'];
const findTagNameList = [...semanticTagList, ...actionTagList];



function generateChildernList (headingLevel) {
    const listElement = document.createElement('ul');
    listElement.setAttribute('data-heading-level', headingLevel);
    return listElement;
}

function generateHeadingTagListItem (headingTag) {
    const headingItem = document.createElement('li');
    const headingContent = document.createElement('button');
    headingContent.textContent = `${headingTag.tagName.replace('H', '')}. ${headingTag.textContent}`;
    headingContent.addEventListener('click', () => {
        headingTag.scrollIntoView(true);
        headingTag.setAttribute('style', 'border: 4px solid red');
    });
    headingItem.appendChild(headingContent);
    return headingItem;
}


// h2를 만들 때 current h1을 parent로 저장
// current보다 높은 heading tag를 만나면 parent를 parent의 parent에 해당 parent를 append
// current의 heading이 h1일경우 root에 append
const generateHeadingTree = () => {
    const hadingTagList = Array.from(document.querySelectorAll(findHeadingTagNameList.join(', ').toLowerCase()));
    let listElement = document.createElement('ul');
    let currentListElement = listElement;
    let prevListItemElement = null;
    let currentHeadingLevel = 0;
    listElement.setAttribute('data-heading-level', '1');

    hadingTagList?.forEach((headingTag, index) => {
        const headingLevel = parseInt(headingTag.tagName.replace('H', ''), 10);
        const listItemElement = generateHeadingTagListItem(headingTag);

        if (headingLevel === 1) {
            currentListElement = listElement;
        }

        if (headingLevel > currentHeadingLevel) {
            const loopLimit = headingLevel - currentHeadingLevel;

            for (let index = 0; index < loopLimit; index++) {
                const childernListElement = generateChildernList(headingLevel);
                if (prevListItemElement === null) {
                    currentListElement = listElement;
                } else {
                    prevListItemElement?.appendChild(childernListElement);
                    currentListElement = childernListElement;
                }
                

                if (index + 1 < loopLimit) {
                    const emptyHeadingLevel = currentHeadingLevel + 1;
                    currentListElement.setAttribute('data-heading-level', emptyHeadingLevel);
                    const emptyHeadingElement = document.createElement(`H${emptyHeadingLevel}`);
                    emptyHeadingElement.textContent = 'empty';
                    const headingElement =  generateHeadingTagListItem(emptyHeadingElement);
                    currentListElement.appendChild(headingElement);
                    currentHeadingLevel = emptyHeadingLevel;
                    prevListItemElement = headingElement;
                }
            }
        }

        if (headingLevel < currentHeadingLevel) {
            currentListElement = currentListElement.closest(`[data-heading-level="${headingLevel}"]`);
        }

        currentListElement.appendChild(listItemElement);
        prevListItemElement = listItemElement;
        currentHeadingLevel = headingLevel;
    });

    return listElement;
};






// 부모 노드의 모든 자식 노드를 탐색하여 자식요소 중 heading 요소를 가진 element를 찾아, children에 저장하는 함수
function findChildern(node, findNodeNameList, result) {
    const childNodes = Array.from(node.childNodes);
    let currentReslut = result;
  
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (childNode.nodeType === Node.ELEMENT_NODE) {
        if (findNodeNameList.find(item => item === childNode.tagName)) {
            const newObject = {
                target: childNode,
                tagName: childNode.tagName,
                children: [],
              };
            
            currentReslut.children.push(newObject);
            findChildern(childNode, findNodeNameList, newObject);
        } else {
            findChildern(childNode, findNodeNameList, currentReslut);
        }
      }
    }
  
    return currentReslut;
}

const generateArea = (elementInfo) => {
    const element = elementInfo.target;
    const style = window.getComputedStyle(element);
    let isSemanticTag = false;
    if (style.display === 'none' || style.visibility === 'hidden') {
        return null;
    }

    if (semanticTagList.find(item => item === element.tagName)) {
        isSemanticTag = true;
    }
    const { width, height, top, left } = element.getBoundingClientRect();
    const wrapper = document.createElement('div');
    const title = document.createElement('button');

    wrapper.setAttribute('style', `width: ${width}px; height: ${height}px; position: absolute; top: ${top}px; left: ${left}px; ${isSemanticTag ? 'outline: 4px dashed red;' : 'border: 4px solid blue;'} margin-top: 0; z-index: 1; box-sizing: border-box; pointer-events: none; ${isSemanticTag ? '' : 'padding: 4px;'}`)
    
    title.textContent = `${element.tagName}`;
    // if(actionTagList.find(item => item === element.tagName)) {
    //     title.textContent = Array.from(element.childNodes).map((node) => {
    //         if (node.nodeType === Node.TEXT_NODE && !node.data.indexOf('\n') > -1) { // 만약 childNode가 text node라면,
    //             return node.data;
    //           }
    //     }).join(' ');
    // }
    title.setAttribute('style', `position: absolute; top: ${isSemanticTag ? '-15px' : '0'}; left: -4px; margin-top: 0; line-height: 15px; color: #fff; background-color: ${isSemanticTag ? 'red' : 'blue'}; pointer-events: all;`);
    title.addEventListener('click', () => {
        element.scrollIntoView(true);
    });

    wrapper.appendChild(title);
    return wrapper;
}

const generateOutline = (elementInfoList, tree) => {
    let outLineRoot = document.createElement('div');
    outLineRoot.setAttribute('data-tree-outline', 'root');
    outLineRoot.setAttribute('style', `width: ${document.body.clientWidth}px; height: ${document.body.clientHeight}px; position: absolute; top: 0; left: 0; border: 4px solid grey; margin-top: 0; z-index: 999999; box-sizing: border-box; pointer-events: none;`);
    
    if (tree) {
        outLineRoot = tree;
    }

    elementInfoList.children?.forEach((elementInfo) => {
        const area = generateArea(elementInfo);
        if(!area) {
            return;
        }
        if(elementInfo.children?.length > 0) {
            generateOutline(elementInfo, outLineRoot);
        }
        outLineRoot.appendChild(area);
    });

    return outLineRoot;
};

setTimeout(() => {
    const headingTree = generateHeadingTree();
    const TagList = findChildern(document.body, findTagNameList, {
        target: document.body,
        tagName: 'BODY',
        children: [],
      });
      console.log('TagList', TagList);
    const outline = generateOutline(TagList);
    
    document.body.appendChild(headingTree);
    document.body.appendChild(outline);
}, 4000);
