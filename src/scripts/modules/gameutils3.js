"use strict";
//database of all recipes
window.gm.AlchemyDef = (function (Lib) {
    Lib.HealthPotionSmall={name:'weak health potion', tier:0, ingr:['ApocaFlower','ApocaFlower'], result:'HealthPotionSmall'};
    Lib.HealthPotion={name:'health potion', tier:0, ingr:['ApocaFlower','PurpleBerry','ApocaFlower'], result:'HealthPotion'};
    Lib.DominancePotion={name:'dominance potion', tier:0, ingr:['PurpleBerry','PurpleBerry','ApocaFlower'], result:'DominancePotion'};
return Lib; }(window.gm.AlchemyDef || {}));

window.gm.printGoto=function(location,time,energy,alias){
    let msg='';
    msg=window.gm.printLink((alias===''?location:alias),
    "window.gm.addTime("+time.toString()+");window.story.show(\""+location+"\");")
    return(msg);
};

window.gm.__Ingrds={};//temp- lookuptable
//create list of recipes OR ingredients
window.gm.brewInit=function(mode) {
    let z,y,x;
    window.story.state.Lab={
        mode:mode,
        in:[],      //'herbGreen','herbBlue',''
        state:0,
        startTime:''
      };
    window.gm.__Ingrds={};
    x=window.gm.player.Inv.getAllIds();
    for(var i=x.length-1;i>=0;i--){ //filter ingredients
        y=window.gm.player.Inv.getItem(x[i]);
        if(y.hasTag(window.gm.ItemTags.Ingredient)){
            window.gm.__Ingrds[y.id]={name:y.name,cnt:window.gm.player.Inv.countItem(y.id)}
        }
    }
    window.gm.brewUpdateView();
    //add brew-button and preview success chance 
};
window.gm.brewUpdateView=function(){
    let entry,panel,all =window.gm.AlchemyDef;
    let z,y,x=window.gm.player.Inv.getAllIds(),lab=window.story.state.Lab;
    panel=document.getElementById('recipe');
    for(var i=panel.childNodes.length-1;i>=0;i-- ) {
        panel.removeChild(panel.childNodes[i]);
    } 
    if(lab.mode==='known' || lab.mode==='potential' || lab.mode==='unavailable') {
        //if recipe is selected, replace all ingredients in batch
        
        let list=window.story.state.Known.recipes,ids=Object.keys(list);
        for(var el of ids){ //list recipes
            x= all[el];
            const _id=el;
            var need={};
            z=1; //
            x.ingr.forEach(v=>(need[v]=((!need[v])?1:need[v]+1)));
            x.ingr.forEach(v=>(z=(!window.gm.__Ingrds[v] || (window.gm.__Ingrds[v].cnt-need[v])<0)?0:z));
            if((lab.mode==='potential' && list[el]<1) || 
                (lab.mode==='known' && list[el]>=1)) {
               // 
               entry = document.createElement('button');
               entry.addEventListener('click',(function(list){
                   window.story.state.Lab.in=[],list.forEach(v=>(window.story.state.Lab.in.push(v)));
                   window.gm.printOutput("");window.gm.brewUpdateView();}).bind(null,x.ingr));
               entry.id=_id;
               entry.textContent=x.name;
               entry.disabled=(z<1); //todo show disabled reason
               panel.appendChild(entry);
            } else if(lab.mode==='unavailable' && (z<1)){
                entry = document.createElement('button');
                entry.addEventListener('click',(function(list){
                   let x='requires ';list.forEach(v=>(x+=v+", "));
                   window.gm.printOutput(x);}).bind(null,x.ingr));
                entry.id=_id;
                entry.textContent=x.name;
                panel.appendChild(entry);
            }
        }
    } else { //if ingredient is selected, add to next free slot
        x=Object.keys(window.gm.__Ingrds);
        for(var i=x.length-1;i>=0;i--){ //list ingredients
            const _id=x[i];
            y=window.gm.__Ingrds[_id];
            z=y.cnt;
            window.story.state.Lab.in.forEach(v=>z-=((v===_id)?1:0));
            entry = document.createElement('button');
            entry.addEventListener('click',window.gm.brewAddIngr);
            entry.id=_id;
            entry.textContent=window.gm.__Ingrds[_id].name+': '+z;
            entry.disabled=(z<1);
            panel.appendChild(entry);
        }
    }  
    panel=document.getElementById('retorte');
    for(var i=panel.childNodes.length-1;i>=0;i-- ) {
        panel.removeChild(panel.childNodes[i]);
    } 
    entry = document.createElement('p');
    entry.textContent=""
    for(var i=0;i<lab.in.length;i++){
        entry.textContent+="-["+window.gm.__Ingrds[lab.in[i]].name+"]-";
    }
    panel.appendChild(entry);
};
//add an Ingredient to free slot
window.gm.brewAddIngr=function(evt){
    let lab=window.story.state.Lab;
    if(lab.in.length>=3) return;
    /*let x=parseInt(evt.target.textContent.substr(evt.target.textContent.lastIndexOf(': ')+2)); //todo ugly
    x-=1;
    evt.target.textContent=evt.target.textContent.substr(0,evt.target.textContent.lastIndexOf(': ')+2)+x;
    evt.target.disabled=(x<1);*/
    lab.in.push(evt.target.id);
    window.gm.printOutput("");
    window.gm.brewUpdateView();
}
//
window.gm.brewCraftPotion=function(){
    let list,all=window.gm.AlchemyDef,lab=window.story.state.Lab,known=window.story.state.Known.recipes;
    let res={OK:false,msg:'epic fail'};
    list=Object.keys(all);
    for(var el of list){
        if(window.gm.util.arrayEquals(lab.in,all[el].ingr)) { //find recipe match
            if(!known[el]) { //new
                res.OK=true;
                res.msg="This looks promissing. But some improvements are necessary.</br>"
                known[el]=0;
            } else if(known[el]>=1) { //master
                res.OK=true;
                res.msg="You expertly craft something.</br>"
            } else { //learning
                res.OK=true;
                known[el]=Math.min(known[el]+0.2,1);//todo learnrate
                if(known[el]>=1) { res.msg="I mastered this recipe!</br>";}
                else {res.msg="There is still room for improvement.</br>";}
            }
            if(res.OK===true) {
                res.msg+=all[el].result+" was produced.</br>";
                window.gm.player.Inv.addItem(window.gm.ItemsLib[all[el].result]());
                break;
            }
        }
    }
    lab.in.forEach(v=>(window.gm.player.Inv.removeItem(v,1)));
    lab.in=[];
    window.gm.brewInit(lab.mode);
    window.gm.printOutput(res.msg);
}
