//Variables-----------------------------------------------------------------------
const r=[1,0,-1,0];                             //row action
const c=[0,1,0,-1];                             //column action
const endState=[["1","2","3"],["4","5","6"],["7","8","0"]];
const index=[[0,0],[0,1],[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]];  
const endSt=[["1","2","3"],["4","5","6"],["7","8","0"]]; //endstate
const string=["1","2","3","4","5","6","7","8","0"];
const image=["url('./img/1.jpg')",
"url('./img/9.jpg')",
"url('./img/8.jpg')",
"url('./img/7.jpg')",
"url('./img/6.jpg')",
"url('./img/5.jpg')",
"url('./img/4.jpg')",
"url('./img/3.jpg')",
"url('./img/2.jpg')",
]
//*************************************Create new State*****************************
function createPuzzle(puzzle){
    var y=new Array(puzzle);
    for(var i=0;i<3;i++){
        var x=new Array(3);
        for(var j=0;j<3;j++){
            x[j]=puzzle[i][j];
        }
        y[i]=x;
    }
    return y;
}
//***********************************shuffle the State*********************************
function shuffle(state,cnt){
    if(cnt>20)return;                                       //shuffle upto 30 steps
    var act=action(zero(state));                                  //get all the possible actions
    var noOfAction=act.length;                              //no, of possible actions
    var takeAction=Math.floor(Math.random() * noOfAction);  //take random action
    var nxtState=nextState(state,act[takeAction]);          //next state
    shuffle(nxtState,cnt+1);                                //shuffle step +1 
}
//--------------------------Possible Actions------------------------------------------
function action(z){
    var p=z[0],q=z[1];
    var x=[];
    for(let i=0;i<4;i++){
        if(this.isSafe(p+r[i],q+c[i])){
           x.push([p+r[i],q+c[i]]); 
        }
    }
    return x;
}
//-------------------------Next State on taking Action---------------------------------
function nextState(puzzle,action){
    var z=zero(puzzle);
    var i=action[0],j=action[1],p=z[0],q=z[1];
    var x=puzzle[i][j];
    puzzle[i][j]=puzzle[p][q];
    puzzle[p][q]=x;
    return puzzle;
}
//------------------------index of zero in State----------------------------------------
function zero(puzzle){
    for(let p=0;p<3;p++){
        for(let q=0;q<3;q++){
            if(puzzle[p][q]=="0")return [p,q];
        }
    }
}
//------------------------is index safe -----------------------------------------------
function isSafe(i,j){
    return (i<3 && i>=0 && j<3 && j>=0);
}
//***************************update onScreen State*************************************
function update(tile,states){
    let ind=0;
    for(let i=0;i<3;i++){
        for(let j=0;j<3;j++){
            tile[ind].innerHTML=states[i][j];
            tile[ind].style.backgroundImage=image[states[i][j]];
            tile[ind].style.backgroundSize="127px 127px";
            if(tile[ind].innerHTML!=string[ind]){

                // if(tile[ind].innerHTML=="0"){
                //     tile[ind].style.color="#ffa3a3";
                // }else{
                //     tile[ind].style.color="#252525";
                // }
                // tile[ind].style.backgroundColor= "#ffa3a3";
                tile[ind].style.filter="opacity(100%)";
            }else{
                if(tile[ind].innerHTML=="0"){
                    // tile[ind].style.color="#9fffba";
                }else{
                    // tile[ind].style.color="#252525";
                }
                // tile[ind].style.backgroundColor= "#9fffba";
                tile[ind].style.filter="opacity(100%)";
            }
            if(tile[ind].innerHTML=="0"){
                tile[ind].style.filter="opacity(35%)";
            }
            ind++;
        }
    }
}
//******************************read OnScreen State**************************************
function check(tile){
    let states=[];
    let ind=0;
    for(let i=0;i<3;i++){
        var x=[];
        for(let j=0;j<3;j++){
            x.push(tile[ind].innerHTML);
            ind++;
        }
        states.push(x);
    }
    return states;
}
//********************************return solution of puzzle*****************************
function solve(st){
    var path=[];
    let cache =new Map();
    let q=new priority_queue();
    q.push(st,Cost(st));
    var cnt=0;
    while(!q.isEmpty()){
        if(cnt>=2000)break;
        var front=q.top();
        q.pop();
        // update(tile,front[0]);
        cache.set(gridToString(st),true);
        path.push(front[0]);
        if(isEnd(front[0]))break;
        var actions=action(zero(front[0]));
        for(let i=0;i<actions.length;i++){
            var y=createPuzzle(front[0]);
            var newSt=nextState(y,actions[i]);
            if(cache.has(gridToString(newSt))==true){
                // console.log("continued");
                continue;
            }
            cache.set(gridToString(newSt),true);
            q.push(newSt,Cost(newSt));
        }
        cnt++;
    }
    return path;
}
//---------------------------PriorityQueue (DataStructure)------------------------------
class priority_queue{
    constructor(){
        this.v=[];
    }
    isEmpty(){
        if(this.v.length==0)return true;
    }
    size(){
        return this.v.length;
    }
    top(){
        if(this.size()==0)return -1;
        // console.log(this.v[0]);
        return this.v[0];
    }
    push(state,cost){
        var value=[];
        value.push(state);
        value.push(cost);
        this.v.push(value);        
        var childIndex = this.v.length - 1;
        while(childIndex > 0) {
            var parentIndex =Math.floor((childIndex - 1) / 2);
            if(this.v[childIndex][1] < this.v[parentIndex][1]) {
                var temp = this.v[childIndex];
                this.v[childIndex] = this.v[parentIndex];
                this.v[parentIndex] = temp;
            }
            else {
                break;
            }
            childIndex = parentIndex;
        }
    }
    pop(){
		if (this.isEmpty())
		{
			return;
		}
		this.v[0] = this.v[this.v.length - 1];
		this.v.pop();
		let pi = 0;
		let lci = (2 * pi) + 1;
		let rci = (2 * pi) + 2;
		while (lci < this.v.length)
		{
			let mini = pi;
			if (this.v[mini][1] > this.v[lci][1])
			{
				mini = lci;
		    }
			if (rci<this.v.length && this.v[mini][1] >this.v[rci][1])
			{
				mini = rci;
			}
			if (pi == mini)
			{
				break;
			}
			let temp=this.v[pi];
			this.v[pi] = this.v[mini];
			this.v[mini] = temp;
			pi = mini;
			lci = (2 * pi) + 1;
			rci = (2 * pi) + 2;
		}
    }
}
//--------------------------Convert State into string for mapping-----------------------
function gridToString(path){
    var ans="";
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            ans+=path[i][j];
        }
    }
    return ans;
}
//-------------------------check if currentState==GoalState-----------------------------
function isEnd(puzzle){
    for(let p=0;p<3;p++){
        for(let q=0;q<3;q++){
            if(puzzle[p][q]!=endState[p][q])return false; 
        }
    }
    return true;
}

//----------------------------Hamming+Manhattan Cost of current State------------------------
function Cost(puzzle){
    var cost=0;
    for(let p=0;p<3;p++){
        for(let q=0;q<3;q++){
            if(puzzle[p][q]!=endState[p][q])cost++;
            if(puzzle[p][q]==0){
                cost+=Math.abs(p-2)+Math.abs(q-2);
            }else{
                cost+=Math.abs(p-index[puzzle[p][q]-1][0]);
                cost+=Math.abs(q-index[puzzle[p][q]-1][1]);
            }
        }
    }
    return cost;
}
//*******************************check if two states are adjecent or not*********************
function valid(state1,state2){
    var act=action(zero(state1));
    for(let i=0;i<act.length;i++){
        var y=createPuzzle(state1);
        var newSt=nextState(y,act[i]);
        if(comp(newSt,state2))return true;
    }
    return false;

}
//-----------------------compare two states---------------------------------------
function comp(state1,state2){
    for(var i=0;i<3;i++){
        for(var j=0;j<3;j++){
            if(state1[i][j]!=state2[i][j])return false;
        }
    }
    return true;
}
//******************************Print state animation onScreen***************************
function solution(path,i,len,tile) {  
    setTimeout(function() { 
        update(tile,path[i]);            
        i++;                               
        if (i < len) { 
            solution(path,i,len,tile);          
        }                               
    }, 150);
}
//------------------------------add player action feature----------------------------------
function takeAction(ind,tile){
    var state=check(tile);
    // console.log(ind);
    var act=action(ind);
    for(let i=0;i<act.length;i++){
        if(state[act[i][0]][act[i][1]]=="0"){
            var temp=state[ind[0]][ind[1]];
            state[ind[0]][ind[1]]=state[act[i][0]][act[i][1]];
            state[act[i][0]][act[i][1]]=temp;
            update(tile,state);
        }
    }
}
//----------------------------------------------------------------------------------------

//************************************main function*************************************
window.addEventListener('load', function () {
    var tile=document.getElementsByClassName("puzzle");     //get all(on screen) tiles
    update(tile,endState); 
    function shuffleButton(){
        document.getElementById("shuffle").removeEventListener("click",shuffleButton);
        var eSt=createPuzzle(endState);                     //reset to endState
        shuffle(eSt,0);                                     //than shuffle upto 30 steps
        update(tile,eSt); 
        document.getElementById("shuffle").addEventListener("click",shuffleButton);
    }                                
    document.getElementById("shuffle").addEventListener("click",shuffleButton);
    for(let i=0;i<9;i++){
        tile[i].addEventListener("click",function(){
            // console.log(i);
            takeAction(index[i],tile);
        });
    }
    function solveButton(){
        document.getElementById("solve").removeEventListener("click",solveButton);
        document.getElementById("shuffle").removeEventListener("click",shuffleButton);
        var states=check(tile);                             //read state from tiles
        let path=solve(states,tile);
        let realPath=[];
        var i=path.length-1;
        var j=path.length-2;
        realPath.push(path[path.lenght-1]);
        while(i>=0 && j>0){
            if(valid(path[i],path[j])){
                realPath.push(path[j]);
                i=j;
                j=j-1;
            }else{
                j=j-1;
            }
        }    
        path=realPath.reverse(); 
        path[path.length-1]=endSt;
        console.log("solution->",path);                   
        solution(path,0,path.length,tile);   
        document.getElementById("solve").addEventListener("click",solveButton);
        document.getElementById("shuffle").addEventListener("click",shuffleButton);
    }
    document.getElementById("solve").addEventListener("click",solveButton);
});