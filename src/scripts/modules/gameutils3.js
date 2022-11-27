"use strict";
window.gm.initGameFlags = function(forceReset,NGP=null) {
    let s= window.story.state,map,data;
    function dataPrototype(){return({visitedTiles:[],mapReveal:[],tmp:{},version:0});}
    if (forceReset) {  
      s.Settings=s.DngSY=null; 
      s.Lab=s.Known=null;
    }
    let Settings = {
      showCombatPictures:true,
      showNSFWPictures:true,
      showDungeonMap:true
    };
    let DngSY = {
        remainingNights: -1,
        resourceForest: 5,   //number resource left
        exploreForest:0,
        visitedTiles: [],mapReveal: [],
        dng:'', //current dungeon name
        prevLocation:'', nextLocation:'', //used for nav-logic
        dngMap:{} //dungeon map info
    };
    let Lab={} //see brewInit
    let Known={ //flags for things you know, see Data.ods
      recipes:{}  //'LustPotion:20%'
      ,places:{},study:{}
    }
    //see comment in rebuildFromSave why this is done
    s.Settings=window.gm.util.mergePlainObject(Settings,s.Settings);
    s.DngSY=window.gm.util.mergePlainObject(DngSY,s.DngSY);
    s.Lab=window.gm.util.mergePlainObject(Lab,s.Lab);
    s.Known=window.gm.util.mergePlainObject(Known,s.Known);
    //todo cleanout obsolete data ( filtering those not defined in template) 
  }
//database of all recipes
window.gm.AlchemyDef = (function (Lib) {
    Lib.HealthPotionSmall={name:'weak health potion', tier:0, ingr:['ApocaFlower','ApocaFlower'], result:'HealthPotionSmall'};
    Lib.HealthPotion={name:'health potion', tier:0, ingr:['ApocaFlower','PurpleBerry','ApocaFlower'], result:'HealthPotion'};
    Lib.DominancePotion={name:'dominance potion', tier:0, ingr:['PurpleBerry','PurpleBerry','ApocaFlower'], result:'DominancePotion'};
return Lib; }(window.gm.AlchemyDef || {}));

window.gm.printGoto=function(location,time,energy,alias){
    let msg='';
    msg=window.gm.printLink((alias===''?location:alias)+((time>0)?' ('+time+'min)':''),
    "window.gm.addTime("+time.toString()+");window.story.show(\""+location+"\");")
    return(msg);
};

window.gm.__Ingrds={};//temp- lookuptable
//create list of recipes OR ingredients
window.gm.brewInit=function(mode) {
    let z,y,x;
    window.story.state.Lab={
        mode:mode, //
        ingr:[],      //'herbGreen','herbBlue',''
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
    let z,y,x=window.gm.player.Inv.getAllIds(),s=window.story.state,Lab=window.story.state.Lab;
    panel=document.getElementById('recipe');
    for(var i=panel.childNodes.length-1;i>=0;i-- ) {
        panel.removeChild(panel.childNodes[i]);
    } 
    if(Lab.mode==='known' || Lab.mode==='potential' || Lab.mode==='unavailable') {
        //if recipe is selected, replace all ingredients in batch
        let list=s.Known.recipes,ids=Object.keys(list);
        for(var el of ids){ //list recipes
            x= all[el];
            const _id=el;
            var need={};
            z=1; //
            x.ingr.forEach(v=>(need[v]=((!need[v])?1:need[v]+1)));
            x.ingr.forEach(v=>(z=(!window.gm.__Ingrds[v] || (window.gm.__Ingrds[v].cnt-need[v])<0)?0:z));
            if((Lab.mode==='potential' && list[el]<1) || 
                (Lab.mode==='known' && list[el]>=1)) {
               // 
               entry = document.createElement('button');
               entry.addEventListener('click',(function(list){
                   window.story.state.Lab.ingr=[],list.forEach(v=>(window.story.state.Lab.ingr.push(v)));
                   window.gm.printOutput("");window.gm.brewUpdateView();}).bind(null,x.ingr));
               entry.id=_id;
               entry.textContent=x.name;
               entry.disabled=(z<1); //todo show disabled reason
               panel.appendChild(entry);
            } else if(Lab.mode==='unavailable' && (z<1)){
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
            window.story.state.Lab.ingr.forEach(v=>z-=((v===_id)?1:0));
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
    for(var i=0;i<Lab.ingr.length;i++){
        entry.textContent+="-["+window.gm.__Ingrds[Lab.ingr[i]].name+"]-";
    }
    panel.appendChild(entry);
};
//add an Ingredient to free slot
window.gm.brewAddIngr=function(evt){
    let Lab=window.story.state.Lab;
    if(Lab.ingr.length>=3) return;
    /*let x=parseInt(evt.target.textContent.substr(evt.target.textContent.lastIndexOf(': ')+2)); //todo ugly
    x-=1;
    evt.target.textContent=evt.target.textContent.substr(0,evt.target.textContent.lastIndexOf(': ')+2)+x;
    evt.target.disabled=(x<1);*/
    Lab.ingr.push(evt.target.id);
    window.gm.printOutput("");
    window.gm.brewUpdateView();
}
//
window.gm.brewCraftPotion=function(){
    let list,all=window.gm.AlchemyDef,Lab=window.story.state.Lab,known=window.story.state.Known.recipes;
    let res={OK:false,msg:'epic fail'};
    list=Object.keys(all);
    for(var el of list){
        if(window.gm.util.arrayEquals(Lab.ingr,all[el].ingr)) { //find recipe match
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
    Lab.ingr.forEach(v=>(window.gm.player.Inv.removeItem(v,1)));
    Lab.ingr=[];
    window.gm.brewInit(Lab.mode);
    window.gm.printOutput(res.msg);
}
window.gm.qID = window.gm.qID || {};
window.gm.questDef = window.gm.questDef || {};
{
    let quest = new Quest("qGarden","Green thumb","");
    quest.addMileStone(new QuestMilestone(1,"","Find the garden.",QuestMilestone.NOP,QuestMilestone.HIDDEN));
    quest.addMileStone(new QuestMilestone(100,"","The garden is a mess and you dont have a use for it. So why bother?.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(200,"","Get some tools to clear the garden from the rubble..",QuestMilestone.NOP));
    window.gm.qID.qGarden=quest.id;window.gm.questDef[quest.id]= quest;

    quest = new Quest("qBarJob","Serve'em drinks","");
    quest.addMileStone(new QuestMilestone(1,"","Find the Inn.",QuestMilestone.NOP,QuestMilestone.HIDDEN));
    quest.addMileStone(new QuestMilestone(100,"","Maybe the owner of the Inn has a job for you?.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(200,"","Earn money by working as a waitress.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(300,"","Work at least 6 shifts between Monday and sunday.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(10000,"","???",QuestMilestone.NOP));
    window.gm.qID[quest.id]=quest.id;window.gm.questDef[quest.id]= quest;

    quest = new Quest("qTraderThomas","A Trader to trade","");
    quest.addMileStone(new QuestMilestone(1,"","Find the Traders house.",QuestMilestone.NOP,QuestMilestone.HIDDEN));
    quest.addMileStone(new QuestMilestone(100,"","Ask around for the traders absence.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(200,"","Find the lookout point.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(300,"","Report back to the innkeeper.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(500,"","Find the traders carriage on the road to Redwick.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(900,"","Return with Thomas to his store.",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(1000,"","NYI",QuestMilestone.NOP));
    quest.addMileStone(new QuestMilestone(10000,"","???",QuestMilestone.NOP));
    window.gm.qID.qTraderThomas=quest.id;window.gm.questDef[quest.id]= quest;

}