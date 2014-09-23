var map = [
    { regex: /\ba+r+s+e+/gi,     exceptions: [] },
    { regex: /f+u*c+k+/gi,       exceptions: [] },
    { regex: /\bfu+k/gi,         exceptions: [] },
    { regex: /s+h+i+t+/gi,       exceptions: [/shiite/] },
    { regex: /\bc+r+a+p+/gi,     exceptions: [] },
    { regex: /ni+gg+a+/gi,       exceptions: [] },
    { regex: /ballsack/gi,       exceptions: [] },
    { regex: /nig+let/gi,        exceptions: [] },
    { regex: /nutsack/gi,        exceptions: [] },
    { regex: /ni+gg+e+r+/gi,     exceptions: [] },
    { regex: /f+a+g+/gi,         exceptions: [] },
    { regex: /b+i+t+c+h+/gi,     exceptions: [] },
    { regex: /\bass+\b/gi,       exceptions: [] },
    { regex: /\basses\b/gi,      exceptions: [] },
    { regex: /ass+ho+le/gi,      exceptions: [] },
    { regex: /c+u+n+t+/gi,       exceptions: [] },
    { regex: /\bc+o+c+k+s*\b/gi, exceptions: [] },
    { regex: /c+h+i+n+k+/gi,     exceptions: [] },
    { regex: /s+l+u+t+/gi,       exceptions: [] },
    { regex: /d+o+u+c+h+e+/gi,   exceptions: [] },
    { regex: /d+i+c+k+/gi,       exceptions: [] },
    { regex: /d+y+k+e+/gi,       exceptions: [] },
    { regex: /r+e+t+a+r+d+/gi,   exceptions: [/retardant/] },
    { regex: /g+oo+k+/gi,        exceptions: [] },
    { regex: /g+oo+c+h+/gi,      exceptions: [] },
    { regex: /ga+ywa+d+/gi,      exceptions: [] },
    { regex: /gaa+y/gi,          exceptions: [] },
    { regex: /lesbo+/gi,         exceptions: [/blesbok/] },
    { regex: /\bpri+cks*\\b/gi,  exceptions: [] },
    { regex: /ti+t+s/gi,         exceptions: [] },
    { regex: /pu+s+y+/gi,        exceptions: [] },
    { regex: /quee+r+/gi,        exceptions: [] },
];

var observeDOM = (function(){
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver,
    eventListenerSupported = window.addEventListener;

    return function(obj, callback){
        if( MutationObserver ){
            // define a new observer
            var obs = new MutationObserver(function(mutations, observer){
                mutations.forEach(function(mutation){
                    callback(mutation.addedNodes);
                });
            });
            // have the observer observe foo for changes in children
            obs.observe( obj, { childList:true, subtree:true });
        }
    }
})();

filterWords(document);


observeDOM(document,function(addedNodes){
    for(var i=0;i<addedNodes.length;i++){
        filterWords(addedNodes[i]);
    }
});


function filterWords(dom){

    var nodes = getTextNodes(dom);
    var tables = [];

    for(var i=0;i<nodes.length;i++){
        var table = splitStr(nodes[i].data);
        tables.push(table);
    }

    var hashes = {};
    for(word in map){
        hashes[word] = hashCode(word);
    }

    for(var j=0;j<tables.length;j++){

        var offset = 0;

        for(var k=0;k<tables[j].length;k++){

            var word = tables[j][k].word;

            for(var i=0;i<map.length;i++){
                if(map[i].regex.test(tables[j][k].word)){
                    var test = false;
                    for(var w=0;!test && w<map[i].exceptions.length;w++){
                        var whiteExp = map[i].exceptions[w];
                        if(whiteExp.test(tables[j][k].word)){
                            test = true;
                        }
                    }
                    if(!test){
                        var replace = "@!$#@$@!@#$@#$&#".substring(0,Math.min(word.length,15));//map[word];
                        var data = nodes[j].data;

                        var pre = data.substring(0,tables[j][k].pos+offset);
                        var suf = data.substring(tables[j][k].pos+offset+word.length,data.length);
                        nodes[j].data = pre+replace+suf;
                        offset += replace.length-word.length;
                    }
                }
            }
        }
    }
}

function hashCode(str){
    str = str.toLowerCase();
    var hash = 0, i, char;
    if (str.length == 0) return hash;
    for (i = 0, l = this.length; i < l; i++) {
        char  = str.charCodeAt(i);
        hash  = ((hash<<5)-hash)+char;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function getTextNodes(root){
    var nodeStack = [];
    getNodes(root,nodeStack);
    return nodeStack;
}

function getNodes(node,nodeStack){
    // node type 3 is a text node
    if(node.nodeType==3){
        nodeStack.push(node);
    }else {
        var child = node.firstChild, nextChild;
        while(child){
            nextChild = child.nextSibling;
            getNodes(child,nodeStack);
            child = nextChild;
        }
    }
}

function isUpperCase(c){
    return (c>='A'&&c<='Z');
}

function isLetter(c){
    return (c>='A'&&c<='Z')||(c>='a'&&c<='z');
}

function splitStr(str){
    var tokens = [];
    var begin = 0;
    var end = 0;
    var word = false;

    while(end < str.length){
        if(word){
            if(!isLetter(str.charAt(end))){
                if(end-begin>0){
                    var word = str.substring(begin,end);
                    var hash = hashCode(word);
                    var obj = {
                        'pos': begin,
                        'word': word,
                        'hash': hash
                    };
                    tokens.push(obj);
                }
                word = false;
            }
        }else {
            if(isLetter(str.charAt(end))){
                begin = end;
                word = true;
            }
        }
        end++;
    }
    if(end-begin>0&&word){
        var word = str.substring(begin,end);
        var hash = hashCode(word);
        var obj = {'pos':begin,
            'word':word,
            'hash': hash};
        tokens.push(obj);
    }
    return tokens;
}

