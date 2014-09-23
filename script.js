var map = {
        /\ba+r+s+e+/gi:[],
        /f+u*c+k+/gi:[],
        /\bfu+k/gi:[],
        /s+h+i+t+/gi:[/shiite/],
        /\bc+r+a+p+/gi:[],
        /ni+gg+a+/gi:[],
        /ballsack/gi:[],
        /nig+let/gi:[],
        /nutsack/gi:[],
        /ni+gg+e+r+/gi:[],
        /f+a+g+/gi:[],
        /b+i+t+c+h+/gi:[],
        /\bass+\b/gi:[],
        /\basses\b/gi:[],
        /ass+ho+le/gi:[],
        /c+u+n+t+/gi:[],
        /\bc+o+c+k+s*\b/gi:[],
        /c+h+i+n+k+/gi:[],
        /s+l+u+t+/gi:[],
        /d+o+u+c+h+e+/gi:[],
        /d+i+c+k+/gi:[],
        /d+y+k+e+/gi:[],
        /r+e+t+a+r+d+/gi:[/retardant/],
        /g+oo+k+/gi:[],
        /g+oo+c+h+/gi:[],
        /ga+ywa+d+/gi:[],
        /gaa+y/gi:[],
        /lesbo+/gi:[/blesbok/],
        /\bpri+cks*\\b/gi:[],
        /ti+t+s/gi:[],
        /pu+s+y+/gi:[],
        /quee+r+/gi:[]
};

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
        else if( eventListenerSupported ){
        	console.log("mutation not suported");
           // obj.addEventListener('DOMNodeInserted', callback, false);
            //obj.addEventListener('DOMNodeRemoved', callback, false);
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
	
	//console.log("Running script");
	//var exp1 = new RegExp("t+e*s+t+","i");
	//console.log(exp1.test("txsstt"));
	
	for(var j=0;j<tables.length;j++){
		
		var offset = 0;
		
		for(var k=0;k<tables[j].length;k++){
			
			var word = tables[j][k].word;
			
			for(exp in map){
				if (!map.hasOwnProperty(exp)){
					continue;
				}
				
				if(exp.test(tables[j][k].word)){
					
					
					var test = false;
					for(var w=0;!test && w<map[exp].length;w++){
						var whiteExp = map[exp][w];
						if(whiteExp.test(tables[j][k].word)){
							console.log('safe: '+tables[j][k].word);
							test = true;
						}
					}
					if(!test){
						var replace = "@!$#@$@!@#$@#$&#".substring(0,Math.min(word.length,15));//map[word];
						var data = nodes[j].data;
						
						console.log(tables[j][k].word);
						
						
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
					var obj = {'pos':begin,
							'word':word,
							'hash': hash};
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

