"use strict";
window.gm.dbgHelper=function(){
  window.gm.getSaveVersion();
}
/* bundles some utility operations*/
window.gm.getSaveVersion= function(){return([0,0,1,0]);};
// reimplement to setup the game
let _origInitGame = window.gm.initGame;
window.gm.initGame= function(forceReset,NGP=null) {
  _origInitGame(forceReset,NGP);
  window.gm.images = imagesBattlers(window.gm.images||{});
  window.gm.images = imagesMaps(window.gm.images);
  window.gm.images = imagesEquip(window.gm.images);
  window.gm.images = imagesIcons(window.gm.images);
    var s = window.story.state;
    s._gm.timeRL= s._gm.timeVR = s._gm.time;
    s._gm.dayRL= s._gm.dayVR = s._gm.day;
    //TODO set debug to 0 for distribution !
    s._gm.debug = 1,   
    s._gm.dbgShowCombatRoll= true,
    s._gm.dbgShowQuestInfo= true;
    s._gm.dbgShowMoreInfo=true;
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        inVR: false,
        spawnAt: 'ForestRespawnPodExit',
        playerPartyVR:[], //names of chars
        playerPartyRL:[],
        //flags for global states
        qDogSit : 0,   // see park
        qUnlockCampus : 0,  //see passage into city
        qUnlockPark : 0,
        qUnlockMall : 0,
        qUnlockBeach : 0,
        qUnlockDowntown : 0,
        qUnlockNorthlake : 0,
        qUnlockRedlight : 0,
        qUnlockBeach : 0,
        crowBarLeft: 1,
        //VR flags todo character specific ?
        wolfKnowledge: 0,
        wolfSubmit: 0,
        wolfVictory: 0
        }; 
    }
    
    if (!window.gm.achievements||forceReset) {  //outside of window.story !
      window.gm.achievements= {
        looseEnd: false //add your flags here
      }
      window.storage.loadAchivementsFromBrowser();
    }
    if (!s.mom||forceReset) {
      s.mom = {
        location : "Kitchen",
        coffeeStore : 5,
        foodStore : 3,
        foodMaxStore : 4
      };
    }
    if (!s.Cyril||forceReset) {  //
      let ch = new Character()
      ch.name=ch.id="Cyril";
      ch.faction="Player";
      //add some basic inventory
      ch.Outfit.addItem(new BaseHumanoid());
      ch.Outfit.addItem(new SkinHuman());
      ch.Outfit.addItem(HandsHuman.factory('human'));
      ch.Outfit.addItem(new FaceHuman());
      ch.Wardrobe.addItem(new Jeans());
      ch.Wardrobe.addItem(new TankShirt());
      ch.Outfit.addItem(new Jeans());
      ch.Outfit.addItem(new TankShirt());
      ch.Stats.increment('strength',3);
      s.Cyril = ch;
    }
    if (!s.Carlia||forceReset) {  //the cat/dog-woman
      let ch = new Carlia()
      s.Carlia = ch;
    }
    if (!s.Ruff||forceReset) {  //Ruff the wolf
      s.Ruff = new Ruff()
    }
    if (!s.Clyde||forceReset) {  //Clyde the foxman
      s.Clyde = new Clyde()
    }
    if (!s.Trent||forceReset) {  //the horse-bully from the bridge
      let ch = new Trent()
      ch.name=ch.id="Trent";
      s.Trent = ch;
    }
    if (!s.PlayerVR||forceReset) {  
      let ch = new Character();
      ch.id="PlayerVR";
      ch.name="Zeph";
      ch.faction="Player";
      //body
      ch.Outfit.addItem(new BaseHumanoid());
      ch.Outfit.addItem(new SkinHuman());
      ch.Outfit.addItem(new FaceHuman());
      ch.Outfit.addItem(HandsHuman.factory('human'));
      ch.Outfit.addItem(AnusHuman.factory('human'));
      ch.Outfit.addItem(PenisHuman.factory('human'));
      if(s._gm.debug) {
        ch.Skills.addItem(new SkillInspect());
        ch.Skills.addItem(new SkillUltraKill());
        ch.Skills.addItem(SkillCallHelp.factory('Wolf'));
        ch.Skills.addItem(SkillDetermined.factory());
        ch.Skills.addItem(new SkillStun());
        ch.Skills.addItem(new SkillHeal());
        ch.Skills.addItem(new SkillTease());
        ch.Skills.addItem(new SkillSubmit());
      }
      s.PlayerVR=ch;
    }
    if (!s.PlayerRL||forceReset) {  
        let ch = new Character();
        ch.id="PlayerRL";
        ch.name="Andrew";
        ch.faction="Player";
        ch.Effects.addItem(new skCooking());
        //add some basic inventory
        ch.Inv.addItem(new Money(),20);
        ch.Inv.addItem(new LighterDad());
        ch.Inv.addItem(new FlashBang(),2);
        ch.Inv.addItem(new CanOfCoffee(),2);
        ch.Wardrobe.addItem(new Jeans());
        ch.Wardrobe.addItem(new Briefs());
        ch.Wardrobe.addItem(new Sneakers());
        ch.Wardrobe.addItem(new TankShirt());
        ch.Wardrobe.addItem(new Pullover());
        ch.Outfit.addItem(new BaseHumanoid());
        ch.Outfit.addItem(new FaceHuman());
        ch.Outfit.addItem(HandsHuman.factory('human'));
        ch.Outfit.addItem(new SkinHuman());
        ch.Outfit.addItem(AnusHuman.factory('human'));
        ch.Outfit.addItem(PenisHuman.factory('human'));
        ch.Wardrobe.addItem(new Briefs());
        ch.Outfit.addItem(new Jeans());
        ch.Outfit.addItem(new Sneakers());
        ch.Outfit.addItem(new Pullover());
        //special skills
        ch.Effects.addItem(new effNotTired()); //depending on sleep Tired will be set to NotTired or Tired
        //ch.Skills.addItem(SkillCallHelp.factory('Mole'));
        s.PlayerRL=ch;
    }
    /*let dngs = [BeeHive,ShatteredCity]; //add your dngs here !
    for(el of dngs) {
      if (!s.dng[el.name]||forceReset) { 
        s.dng[el.name] = el.persistentDngDataTemplate();
      }
    } */   
    
    window.gm.initGameFlags(forceReset,NGP);
    window.gm.switchPlayer("PlayerRL");
    //take over flags for newgameplus
    if(NGP) { window.story.state.vars.crowBarLeft = NGP.crowBarLeft; }
    NGP=null; //release memory
}
//this initialises game-objects that are not class-based
window.gm.initGameFlags = function(forceReset,NGP=null) {
  let s= window.story.state,map,data;
  function dataPrototype(){return({visitedTiles:[],mapReveal:[],tmp:{},version:0});}
  if (forceReset) {  
    s.Settings=s.DngCV=s.DngDF=s.DngAM=s.DngSY=s.DngMN=s.DngAT=null; 
    s.DngFM=s.DngSC=s.DngLB=s.DngHC=s.DngPC=null;
    s.Lab=s.Known=null;
  }
  let Settings = {
    showCombatPictures:true,
    showNSFWPictures:true,
    showDungeonMap:true
  };
  let DngSY = {
      remainingNights: 0,
      dngLevel: 1, //tracks the mainquest you have finished
      dngOW: false, //if this flag is set while in dng, player is here for some freeplay (no quest)  
      dildo:0, //1 small oraltraining,
      pussy:0,
      visitedTiles: [],mapReveal: [],
      dng:'', //current dungeon name
      prevLocation:'', nextLocation:'', //used for nav-logic
      dngMap:{} //dungeon map info
  };
  let DngHC = dataPrototype();
  if(s.DngHC) { //update if exist
    ({map,data}=window.gm.build_DngHC());
    s.DngHC=window.gm.util.mergePlainObject(DngHC,s.DngHC);
  }
  let Lab={}
  let Known={
    recipes:{HealthPotionSmall:1}  //'LustPotion:20%'
    ,places:{}
  }
  //see comment in rebuildFromSave why this is done
  s.Settings=window.gm.util.mergePlainObject(Settings,s.Settings);
  s.DngSY=window.gm.util.mergePlainObject(DngSY,s.DngSY);
  s.Lab=window.gm.util.mergePlainObject(Lab,s.Lab);
  s.DngHC=window.gm.util.mergePlainObject(DngHC,s.DngHC);
  s.Known=window.gm.util.mergePlainObject(Known,s.Known);
  //todo cleanout obsolete data ( filtering those not defined in template) 
}
// update non-class-objects of previous savegame
let _origRebuildObjects = window.gm.rebuildObjects;
window.gm.rebuildObjects= function(){ 
  var s = window.story.state;
  _origRebuildObjects();
  window.gm.initGameFlags(false,null);
}
// lookup function for sidebar icon
window.gm.getSidebarPic = function(){ //todo display doll ??
  if(window.story.state.vars.inVR) {
    return("assets/icons/icon_swordspade.svg");
  }
  return('assets/icons/icon_cityskyline.svg');
}
// lookup function for scene background ( 640x300 )
window.gm.getScenePic = function(id){
  let x='',y;
  if(id==='Garden' || id ==='Park')   return('assets/bg/bg_park.png');
  if(id==='Bedroom' || id==='Your Bedroom')   return('assets/bg/bg_bedroom.png');
  if(id.slice(0,7)==='AM_Lv2_') return('assets/bg/bg_dungeon_2.png');
  if(id.slice(0,5)==='DngPC' || id.slice(0,5)==='DngHC'){
    x=id.slice(6,8);
    y=[{x:["H4","I4"],p:'assets/bg/bg_dungeon_2.png'}
      ,{x:["I4","J4"],p:'assets/bg/bg_dungeon_4.png'}
      ,{x:["F4","F5"],p:'assets/bg/bg_dungeon_3.png'} ]
    for(var el of y){
      if(el.x.indexOf(x)>=0) return el.p;
    }
    return('assets/bg/bg_dungeon_2.png');
  }
  if(id.slice(0,5)==='DngCV') return('assets/bg/bg_cave_4.png');
  //if(id.slice(0,5)==='DngCV') return('assets/bg/bg_cave_2.png');
  return('assets/bg_park.png')//return('assets/bg/bg_VR_1.png');//todo placehodler
}
window.gm.enterVR=function() {
  let s= window.story.state;
  if(s.vars.inVR) return;
  s.vars.playerPartyRL = s._gm.playerParty;
  s._gm.playerParty = s.vars.playerPartyVR;
  window.gm.switchPlayer("PlayerVR");
  s.vars.inVR =true;
  //time in VR is paused when in RL
  s._gm.timeRL = s._gm.time,s._gm.dayRL = s._gm.day;
  s._gm.time = s._gm.timeVR,s._gm.day = s._gm.dayVR;
  window.gm.addTime(0);
  window.gm.respawn({keepInventory:true});
}
window.gm.leaveVR=function() {
  //todo update effects in VR but stop RL effects
  let s= window.story.state;
  if(!s.vars.inVR) return;
  s.vars.playerPartyVR = s._gm.playerParty;
  s._gm.playerParty = s.vars.playerPartyRL;
  window.gm.switchPlayer("PlayerRL");
  s.vars.inVR =false;
  //while in VR time in RL is paused but advances 1h on leave??
  s._gm.timeVR = s._gm.time,s._gm.dayVR = s._gm.day;
  s._gm.time = s._gm.timeRL,s._gm.day = s._gm.dayRL;
  window.gm.addTime(60);
  //todo copy fetish-stats back to RLPlayer ?
}
window.gm.fightArena=function(enc,params,prize,next) {
  window.gm.encounters[enc](params);
  window.gm.Encounter.onVictory = function() {
        window.story.state.dng.arena.loot=window.story.state.dng.arena.loot.concat(prize);
        return('You defeated the enemy. '+this.fetchLoot()+'</br>'+ 
        window.gm.printPassageLink('Next',next));
    }
  window.gm.Encounter.onFlee = (function(){return('After your retreat you find your way back to start-position.</br>'+ window.gm.printLink('Next','window.gm.postDefeat()'));});
}
window.gm.cursedChest=function(next) {
  let rnd = _.random(0,100); //this is rolling the dice, then call Loot-paasage !
  window.story.state.tmp.args=[window.passage.name,rnd,next];
}
//call this after onVictory/onFlee-scene to continue in dng or other location
//this function is also used to restore after loading save !
window.gm.postVictory=function(params) {
  let reloadDng = (window.gm.dng===null);
  if(window.story.state.dng.id!=="") {
    if(reloadDng) window.gm.dng = window.gm.dngs[window.story.state.dng.id]();
    var floor = window.gm.dng.getFloor(window.story.state.dng.floorId);
    var room = floor.getRoom(window.story.state.dng.roomId);
    if(reloadDng) window.gm.dng.enterDungeon();//first call enterdungeon to setup everything !
    window.gm.dng.teleport(room);
  } else {
    window.story.show(window.gm.player.location);//history disabled ! window.story.history[window.story.history.length - 1], true);   
  }
}
//call this after your onDefeat/onSubmit-scene to respawn at respawn-point; cleansup dng-variables
window.gm.postDefeat=function() { 
  window.story.state.dng.id="";window.gm.dng = null;
  window.gm.respawn();
}
//after passing out: heal player and remove inventory {keepInventory=false,location=''}
window.gm.respawn=function(conf={keepInventory:false}) {
  for(var name of window.story.state._gm.playerParty){
      let _x=window.story.state[name];
      _x.Stats.increment("energy",9999);_x.Stats.increment("will",9999);_x.Stats.increment("health",9999);
  }
  window.gm.player.Stats.increment("energy",9999);
  window.gm.player.Stats.increment("will",9999);
  window.gm.player.Stats.increment("health",9999);

  if(!conf.keepInventory) { //remove inentory and outfit that is not questitem, cursed or permanent
    for(let i =window.gm.player.Outfit.list.length-1;i>=0;i-=1) {
      let el = window.gm.player.Outfit.list[i];
      if(el.item && el.item.lossOnRespawn ) window.gm.player.Outfit.removeItem(el.id,true);
    }
    for(let i =window.gm.player.Wardrobe.list.length-1;i>=0;i-=1) {
      let el = window.gm.player.Wardrobe.list[0];
      if(el.item.lossOnRespawn ) window.gm.player.Wardrobe.removeItem(el.id,el.count);
    }
    for(let i =window.gm.player.Inv.list.length-1;i>=0;i-=1){
      let el = window.gm.player.Inv.list[i];
      if(el.item.lossOnRespawn ) window.gm.player.Inv.removeItem(el.id,el.count);
    }
  }
  /*if(window.gm.quests.getMilestoneState("qDiedAgain").id===2) {
    window.story.show('YouDiedOnce'); 
  } else if([100,200,300].includes(window.gm.quests.getMilestoneState("qBondageKink").id)){
      window.story.show('YouDiedWithCursedGear');
  } else {*/
    let robes;
    if(window.gm.player.Outfit.getItemForSlot(window.gm.OutfitSlotLib.Breast)===null) {
      robes = window.gm.ItemsLib['PrisonerCloths']();
      window.gm.makeCursedItem(robes,{minItems:2,convert:'HarnessRubber'});
      window.gm.player.Wardrobe.addItem(robes);
      window.gm.player.Outfit.addItem(robes);
    }
    if(window.gm.player.Outfit.getItemForSlot(window.gm.OutfitSlotLib.uHips)===null) {
      robes = window.gm.ItemsLib['Knickers']();
      window.gm.player.Wardrobe.addItem(robes);
      window.gm.player.Outfit.addItem(robes);
    }
    if(window.gm.player.Outfit.getItemForSlot(window.gm.OutfitSlotLib.LHand)===null) {
      let staff = new window.storage.constructors['StaffWodden']();
      window.gm.player.Inv.addItem(staff);
      window.gm.player.Outfit.addItem(staff);
    }
    window.story.show(window.story.state.vars.spawnAt);
  //}
};
//sets current player location and advances time
//call this in passage header
window.gm.moveHere = function(time=15){
  if(window.gm.player.location!==window.passage.name) {
    window.gm.player.location=window.passage.name;
    var s=window.story.state.vars;
    switch(window.passage.name){ //when crossing a certain point, set spawnpoint
      case 'ForestBorder': 
        s.spawnAt = 'ForestRespawnPodExit'; 
        break;
      case 'VillageMarketPlace': 
        s.spawnAt = 'VillageRespawnPodExit'; 
        break;
      case 'AM_Lv2_Start':
        s.spawnAt ='AM_Lv2_Start';
        break;
      default:break;
    }
    window.gm.addTime(time); 
  }
};
/* used for the dungeons ..state.DngSY.dng. Creates links for adjoined tiles by adding the following code in passage: 
* <%=window.gm.printNav('go west','west')%> OR <%=window.gm.printNav()%> for all directions
* creates link for ('enter door', 'north'):  [[enter door| DngMN_F2]]  - assuming you are in tile DngMN_F3 in DngMN_Lv3 
* only creates the link if the passage with this name exist and the direction in the dngMap is specified 
*/
window.gm.printNav=function(label,dir,args=null){
  if(!label && !dir) {
    return('</br><p>'+window.gm.printNav('Go north','north',args)+'</br>'+
    window.gm.printNav('Go west','west',args)+' '+window.gm.printNav('Go east','east',args)+'</br>'+
    window.gm.printNav('Go south','south',args)+'</br></p>');
  }
  let foo= (args!==null && args.func)?args.func:(function(to){return('window.story.show(\"'+to+'\");');}); 
  let here = window.passage.name.replace(window.story.state.DngSY.dng+'_','');
  let to,k,i=0;
  const X=['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],Y=['0','1','2','3','4','5','6','7','8','9'];
  switch(dir) {
    case 'north':
      i=Y.findIndex((el)=>{return(el===here[1]);});
      if(i<0||i<=0) return('');
      to = here[0]+Y[i-1];
      break;
    case 'south':
      i=Y.findIndex((el)=>{return(el===here[1]);});
      if(i<0||i>=Y.length-1) return('');
      to = here[0]+Y[i+1];
      break;
    case 'east':
      i=X.findIndex((el)=>{return(el===here[0]);});
      if(i<0||i>=X.length-1) return('');
      to = X[i+1]+here[1];
      break;
    case 'west':
      i=X.findIndex((el)=>{return(el===here[0]);});
      if(i<0||i<=0) return('');
      to = X[i-1]+here[1];
      break;
    default: return('');
  }
  let grid=window.story.state.DngSY.dngMap.grid,found=false;
  for(i=grid.length-1;i>=0;i--){
    if(grid[i].room===here){
      for(k=grid[i].dirs.length-1;k>=0;k--){
        if(grid[i].dirs[k].dir===to) {found=true;break;}
      }
      if(found) break;
    }
  }
  if(!found) return(''); //no dir
  to=window.story.state.DngSY.dng+'_'+to;
  if(!window.story.passage(to)) return(''); //no passage
  return(window.gm.printLink(label,foo(to)));//return(window.gm.printPassageLink(label,to));
};
window.gm.rollExploreCity= function() {
  let s=window.story.state;
  let places=[];   
  let r = _.random(0,100);
  //todo:depending of your actual location you have a chance to find connected locations or end up in a known one
  if(window.gm.player.location=='Park')   places = ['Mall','Beach','Downtown'];
  if(window.gm.player.location=='Mall')   places = ['Park','Beach','Downtown']; 
  if(window.gm.player.location=='Beach')   places = ['Park','Mall']; 
  if(window.gm.player.location=='Downtown')   {
    places.push('Pawn shop'); 
  }
  if(places.length==0) places = [window.gm.player.location]; //fallback if unspeced location
  r = _.random(1, places.length)-1; //chances are equal
  window.gm.addTime(20);
  window.story.show(places[r]);
};
window.gm.giveCyrilFood= function(){
    if(window.gm.player.Inv.countItem('SimpleFood')>0) {
        var res=window.gm.player.Inv.use('SimpleFood', window.story.state.Cyril);
        window.gm.printOutput(res.msg);
    } else {
        window.gm.printOutput("you have no food to spare");
    }
};
/*
* prints a (svg-) map  
*/
window.gm.printMap=function(MapName,playerTile,reveal,visitedTiles) {
  var width=600,height=300;
  var draw = document.querySelector("#canvas svg");
  if(!draw) draw = SVG().addTo('#canvas').size(width, height);
  else draw = SVG(draw);//recover svg document instead appending new one
  draw.rect(width, height).attr({ fill: '#303030'});
  var node = SVG(window.gm.images[MapName]());
  if(playerTile!=='' && visitedTiles.indexOf(playerTile)<0) {
    visitedTiles.push(playerTile);
  }
  //node.find("#AM_Lv2_A1")[0].addClass('roomNotFound');
  var _n,el,list= node.find('[data-reveal]');
  for(el of list) {
    var x= parseInt(el.attr('data-reveal'),16);
    if((x&reveal)===0) el.addClass('roomNotFound');
  }
  for(el of visitedTiles) {
    if(el===playerTile) continue;
    _n= node.find('#'+el)[0];
    if(_n) {_n.removeClass('roomFound');_n.addClass('roomVisited');}
  }
  _n= node.find('#'+playerTile)[0];
  if(_n) {_n.removeClass('roomFound');_n.addClass('playerPosition');}
  node.addTo(draw);
}
/* 
* constructs map from template and dng-data
*/
window.gm.printMap2=function(dng,playerTile,reveal,visitedTiles) {
  if(!window.story.state.Settings.showDungeonMap) return;
  var step=32, width=step*(dng.width||12),height=step*(dng.height||8);
  const X=['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],Y=['0','1','2','3','4','5','6','7','8','9'];
  var mypopup = document.getElementById("svgpopup"); //todo popup-functions as parameters
  function showPopup(evt) {
    //var iconPos = evt.getBoundingClientRect();
    mypopup.style.left = (evt.x+12)+"px";//(iconPos.right + 20) + "px";
    mypopup.style.top = (evt.y-12)+"px";//(window.scrollY + iconPos.top - 60) + "px";
    mypopup.textContent=evt.currentTarget.id;
    mypopup.style.display = "block";
  }
  function hidePopup(evt) {
    mypopup.style.display = "none";
  }
  function nameToXY(name) {
    let i,pos={x:0,y:0};
    i=Y.findIndex((el)=>{return(el===name[1]);});
    pos.y=i*step;//if(i<0||i>=Y.length-1) return('');
    i=X.findIndex((el)=>{return(el===name[0]);});
    pos.x=i*step;//if(i<0||i>=Y.length-1) return('');
    return(pos);
  }  
  function addAnno(){//add up to 4 annotation-letters
    const dx2= [6,6,-6,-6], dy2=[0,10,10,0]; //
    for(k=room.anno?room.anno.length-1:-1;k>=0;k--){
      if(k>3) continue;
      lRoom.text(function(add) {add.tspan(room.anno[k])}).addClass('textLabel').ax(_rA.cx()+ox+dx2[k]).ay(_rA.cy()+oy+dy2[k]);
    }
  }
  var draw = document.querySelector("#canvas svg");
  if(!draw) draw = SVG().addTo('#canvas').size(width, height);
  else draw = SVG(draw);//recover svg document instead appending new one
  draw.rect(width, height).attr({ fill: '#303030'});
  var node = SVG(window.gm.images['template3']()); //get the source-svg
  node.size(width,height);
  var lRoom=node.find('#layer1')[0]; //fetch a layergroup by id to add to
  var lPath=node.find('#layer2')[0]; 
  var tmpl = node.find('#tmplRoom')[0];
  var ox= tmpl.cx(),oy=tmpl.cy(); //offset tmpl
  if(playerTile!=='' && visitedTiles.indexOf(playerTile)<0) {
    visitedTiles.push(playerTile);
  }
  let _rA,i,k,xy,room,dir;
  let xyB,dx,dy;
  for(i=dng.grid.length-1;i>=0;i--) {// foreach room create room
    room=dng.grid[i];
    xy=nameToXY(room.room);
    _rA=lRoom.use('tmplRoom').attr({id:room.room, title:room.room}).move(xy.x, xy.y);
    //var link = document.createElement('title');    link.textContent=room.room;    _rA.put(link);// appendchild is unknown // adding title to use dosnt work - would have to add to template
    _rA.node.addEventListener("mouseover", showPopup);_rA.node.addEventListener("mouseout", hidePopup);
    if(visitedTiles.indexOf(room.room)<0) {
      if(reveal.indexOf(room.room)<0){_rA.addClass('roomNotFound');}
      else {_rA.addClass('roomFound'); addAnno();}
    }else {
      if(room.room===playerTile) {_rA.removeClass('roomFound').addClass('playerPosition');} else _rA.addClass('roomVisited');
      addAnno();
      for(k=room.dirs.length-1;k>=0;k--) {//foreach direction create path to next room
        dir=room.dirs[k].dir;
        xyB=nameToXY(dir); dx=xyB.x-xy.x,dy=xyB.y-xy.y;
        lPath.polyline([[_rA.cx()+ox,_rA.cy()+oy],[_rA.cx()+ox+dx/2,_rA.cy()+oy+dy/2]]).addClass('pathFound');//.insertBefore(_rA)
      }
    }
  }
  //todo add gridlines and grid-labels
  //add legend
  node.text(function(add) {add.tspan(dng.legend||'')}).addClass('textLabel').ax(0).ay(0);
  node.addTo(draw);
}
//display svg
window.gm.printSceneGraphic2=function(background,item) {
  var width=600,height=300;
  var draw = document.querySelector("#canvas svg");
  if(!draw) draw = SVG().addTo('#canvas').size(width, height);
  else draw = SVG(draw);//recover svg document instead appending new one
  var background = draw.rect(width, height).attr({ fill: '#303030'});
  draw.image(background);
  var node = SVG(item);
  if(node) node.addTo(draw);
}
//for debug: builds link-list to display svg
window.gm.listImages = function(){
  let list = Object.keys(window.gm.images);
  let g,entry = document.createElement('p');
  entry.textContent ="";
  for(let el of list) {
    if(el==='strToBuf'||el==='cache') continue;
    g = document.createElement('a');
    g.href='javascript:void(0)',g.textContent=el;
    const x = window.gm.images[el]();
    g.addEventListener("click",window.gm.printSceneGraphic2.bind(this,"",x));
    entry.appendChild(g);entry.appendChild(document.createTextNode(' '));//add \s or no automatic linebreak
  };
  $("div#choice")[0].appendChild(entry);      // <- requires this node in html
}

//print list of actions for actual day and hour
window.gm.printSchedule = function(){
  var elmt='';
  var s= window.story.state;
  var now = window.gm.getTimeStruct();

  var jobs = Object.values(window.gm.jobs);
  for(var i=0;i<jobs.length;i++) {
    var id = jobs[i].id;
    if(jobs[i].isHidden()===true) {
      //NOP;
    } else if(jobs[i].isDisabled()===true) {
      elmt +=`<div>${jobs[i].disabledReason()}</div></br>`;
    } else if(jobs[i].DoW.includes(now.DoW)&& s._gm.time>=jobs[i].startTimeMin && s._gm.time<jobs[i].startTimeMax) {
      if(window.gm.player.energy().value>=jobs[i].reqEnergy) {
        elmt +=`<a0 id='${id}' onclick='(function($event){window.story.show("${id}");})(this);'>${jobs[i].name} </a>`;
        elmt +=`</br><div>${jobs[i].descr} It might require ${(jobs[i].reqTime)} minutes of your time and around ${jobs[i].reqEnergy} energy.</div></br>`;
      } else {
        elmt +=`<div>You are to tired to do ${jobs[i].name}.</div></br>`;
      }
    } else {
      var days = "";
      for(var k=0;k<jobs[i].DoW.length;k++) {days +=window.gm.DoWs[jobs[i].DoW[k]-1]+","; }
      elmt +=`<div>${jobs[i].name} is only available between ${(jobs[i].startTimeMin/100).toFixed(0)} and ${(jobs[i].startTimeMax/100).toFixed(0)} at ${days}. </div></br>`;
    }
  }
  return(elmt);
};
//prints a list of quest
window.gm.printQuestList= function() {
  let elmt='<hr><form><ul style=\"list-style-type: none; padding-inline-start: 0px;\" ><legend>In progress</legend>';
  let s= window.story.state;
  
  //elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>always: keep the fridge filled</label></li>";
  for(let i=0; i<s.quests.activeQuests.length; i++) {
      let qId = s.quests.activeQuests[i].id;
      let flags = s.quests.activeQuests[i].flags;
      let msId = s.quests.activeQuestsMS[i].id;
      let quest = window.gm.questDef[qId];
      let mile = quest.getMileById(msId);
      if(!quest.HiddenCB() || window.story.state._gm.dbgShowQuestInfo) {
        elmt +="<li style=\"padding-bottom: 0.5em;\"><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled><label>"+
          quest.name+(window.story.state._gm.dbgShowQuestInfo?(" "+msId+" 0x"+flags.toString(16)):(""))+" : "+ ((mile.HiddenCB()===true)?("???"):(mile.descr))+"</label></li>"; //checked="checked"
      }
  }
  elmt +="</ul></form></br>";
  elmt +='<hr><form><ul style=\"list-style-type: none\" ><legend>Completed</legend>';
  for(let i=0; i<s.quests.finishedQuests.length; i++) {
    let qId = s.quests.finishedQuests[i].id;
    let flags = s.quests.activeQuests[i].flags;
    let msId = s.quests.finishedQuestsMS[i].id;
    let quest = window.gm.questDef[qId];
    let mile = quest.getMileById(msId);
    if(!quest.HiddenCB() || window.story.state._gm.dbgShowQuestInfo) {
      elmt +="<li><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled checked=\"checked\"><label>"+
        quest.name+(window.story.state._gm.dbgShowQuestInfo?(" "+msId+" 0x"+flags.toString(16)):(""))+" : "+ mile.descr+"</label></li>"; 
    }
}
  elmt +="</ul></form></br>";
  return(elmt);
};
//prints a description of the chars-body
window.gm.printBodyDescription= function(whom,onlyvisible=false) {
  let msg = "";
  let conv = window.gm.util.descFixer(whom);
  let wornIds =whom.Outfit.getAllIds(); //todo this returns wearables & bodyparts
  let base = [] , head = [], torso =[], arms =[],legs =[], groin=[], other=[],breast=[],ignore=[];
  
  //sort the order: place Breast & Nipple-Piercing together 
  let fbase = ['bBase','bSkin'] , fhead = ['bHeadHair','bFace','bEars','bEyes','bMouth','bTongue','Head','Mouth','Neck'], 
  ftorso =['bTorso','bTailBase','bWings','Breast','Stomach','Hips'], 
  farms =['bArms','bHands','Arms','Wrists','RHand','LHand'],flegs =['bLegs','bFeet','Feet','Thighs'], 
  fbreast =['bBreast','pNipples'],
  fgroin=['bVulva','bPenis','pClit','bPubicHair','bHips','bAnus','Vulva','Clit','Anus','Penis','Balls'], fignore = [],
  fcovered=[];
  if(onlyvisible) {// filter by visibility 
    let covered=[];
    for(el of wornIds) { //notice that an item is only pushed once even if has multiple slots
      let item=whom.Outfit.getItem(el);
      covered = covered.concat(item.slotCover);
    }
    for(el of covered) {
      if(!fcovered.includes(el)) fcovered.push(el);
    }
  }
  for(el of wornIds) { //notice that an item is only pushed once even if has multiple slots
    let item=whom.Outfit.getItem(el);
    if(item.slotUse.every(name => fcovered.includes(name))) ignore.push(item); //ignore those that are covered completely
    else if(item.slotUse.some(name => fignore.includes(name))) ignore.push(item);
    else if(item.slotUse.some(name => fbase.includes(name))) base.push(item);
    else if(item.slotUse.some(name => fhead.includes(name))) head.push(item);
    else if(item.slotUse.some(name => ftorso.includes(name))) torso.push(item);
    else if(item.slotUse.some(name => fbreast.includes(name))) breast.push(item);
    else if(item.slotUse.some(name => farms.includes(name))) arms.push(item);
    else if(item.slotUse.some(name => flegs.includes(name))) legs.push(item);
    else if(item.slotUse.some(name => fgroin.includes(name))) groin.push(item);
    else other.push(item);
  }
  
  //null is used to mark linebreaks
  let all = base.concat([null]).concat(head).concat([null]).concat(torso).concat([null]).concat(arms).concat([null]);
  all = all.concat(legs).concat([null]).concat(groin).concat([null]).concat(breast).concat([null]).concat(other);
  //todo "considering the size of your manmeat you are hung like a horse"
  for(el of all){ msg+= (el!==null)?el.descLong(conv)+' ':'</br>';}
  let lewd = whom.Outfit.getLewdness();
  //msg +='</br>Total lewdness sluty:'+lewd.slut+' bondage:'+lewd.bondage+' sm:'+lewd.sm;
	return msg+"</br>";
};
// returns singular pronoun for the char depending on gender
window.gm.util.estimatePronoun= function(whom) {
    let isplayer = (whom.name===window.gm.player.name);
    let vulva = whom.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bVulva);
    let penis = whom.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bPenis);
    //todo what if whom is a gang of imps?
    if(isplayer) {
      return('i')
    } else if(vulva && penis) {
      return('shi');
    } else if(vulva) {
      return('she');
    } else if(penis) {
      return('he');
    }
    return('it');
};
//returns a function that accept a text and fixes the word-phrases: let fixer = window.gm.util.descFixer(this.actor);msg=fixer('[I] [like] this shit.');
window.gm.util.descFixer = function(whom) {
  let pron = window.gm.util.estimatePronoun(whom);
  return(function(pron) { 
    return function(text) {
      let repl = [],br = 0, aft,bef,found;
      //search brackets like $[dff]$ $[[sdff]]$ dont find [ ] or \[ \] ; 
      //using no regex because couldnt get it get working:(!\[|[^\[])([\[]{1})(!\]|!\[|[^\[\]])+[\]]{1}([^\]]|!\])
      for(let i=text.length-1, max=text.length-1;i>=0;i-=1){ //in backward direction !
        bef= (i>0)? text[i-1]:'';
        aft= (i<max)?text[i+1]:'';
        if(text[i]===']' && aft==='$') { //opening braket
          br+=1;
          if(br>1) {  //there was already opening but no closing bracket !
            //no bracket in bracket allowed; ignore previous bracket
            br =1;
          }
          found = {end:i};
        }
        if(text[i]==='[' && bef==='$') { //opening braket
          br-=1;
          if(br<0) {  //there was already closing but no opening bracket !
            //no bracket in bracket allowed; ignore previous bracket
            br =0;
          } else {
            found.start=i;
            found.text=text.slice(found.start+1,found.end); //text within brackets
            found.start -=1,found.end +=1;  // inlude $ $
            repl.push(found);
          }
        }
      }
      for(el of repl) {//replace bracket+bracketcontent,
        el.new = window.gm.util.lookupWord(el.text,pron);
        let bef = text.substring(0,el.start), aft = text.substr(el.end+1);
        text= bef+el.new+aft;
      }
      // $[I]$ $[have]$ some rough [hair] that needs a lot combing. He has some rough...
      // c. She buys those pants. 
      // That hat [I] [wear] is ugly. That hat she wears is ugly.  
      // A dense fur covers $[my]$ body. A dense fur covers your body.  
      return(text);
    }
  }(pron))
};
// add irregular words here
window.gm.util.wordlist = function buildWordList(list) {
  //defines for each word a list to match to pronoun to replace with
  //have = [I have, you have, he/she has, we have, you have, they have ]
  list['i'] = {def:'I',i:'I',you:'you',he:'he',she:'she',shi:'shi',it:'it'};
  list['you'] = list['i']; //if you use you instead I as it would be required ...
  list['me'] = {def:'me',i:'me',you:'you',he:'him',she:'her',shi:'hir',it:'it'};
  list['my'] = {def:'my',i:'my',you:'your',he:'his',she:'her',shi:'hir',it:'its'};
  list['have'] = {def:'have',he:'has',she:'has',shi:'has',it:'has'};
  list['am'] = {def:'is',i:'am',he:'is',she:'is',shi:'is',it:'is'};
  list['them'] = {def:'them',i:'me',he:'him',she:'her',shi:'hir',it:'it'}; //I snap at them -> He snaps at me.
  return(list);
}(window.gm.util.wordlist || {});

//looks up a word in the wordlist and retourns the version fitting pronoun
window.gm.util.lookupWord = function(word,pron) {
  let output = word;
  let x = word.toLowerCase();
  let repl =window.gm.util.wordlist[x];
  if(repl) {
    output = (repl[pron])?repl[pron]:repl.def;
    if(word[0]===word[0].toUpperCase()) { //check if first letter needs to be large; 'I' is always large
      output= output[0].toUpperCase()+output.substr(1);
    }
  } else {
    if(pron==='he' || pron==='she'|| pron==='shi' ) {  
      output+='s';//wear -> wears
    }
  }
  return(output);
}