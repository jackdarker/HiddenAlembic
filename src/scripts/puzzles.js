"use strict";
window.gm = window.gm || {};
///////////////////////////////////////////////////////////////////////
window.gm.startDominoCombat=function(stopCB, startCB){
  function start(){ 
    //setup teams,cards
    data.teams=[];
    let i,skills,players,x=0;
    for(i=0;i<=1;i++){ //teams
      players=[];
      for(var k=0;k<(i+1);k++){
        skills=[];   //skills
        if(x===0){
        skills.push({id:'skill#'+0,start:'blue',end:'red',hp:15,charge:1,cooldown:0});
        skills.push({id:'skill#'+1,start:'red',end:'blue',hp:5,charge:1,cooldown:0});
        skills.push({id:'skill#'+2,start:'blue',end:'blue',hp:25,charge:3,cooldown:0});
        skills.push({id:'skill#'+3,start:'red',end:'green',hp:25,charge:3,cooldown:0});
        skills.push({id:'skill#'+4,start:'red',end:'red',hp:25,charge:4,cooldown:0});
        } else if(x===1){
          skills.push({id:'skill#'+3,start:'red',end:'red',hp:25,charge:3,cooldown:0});
          skills.push({id:'skill#'+4,start:'blue',end:'red',hp:25,charge:4,cooldown:0});
        } else {
          skills.push({id:'skill#'+0,start:'blue',end:'red',hp:15,charge:2,cooldown:0});
          skills.push({id:'skill#'+2,start:'red',end:'blue',hp:5,charge:2,cooldown:0});
          skills.push({id:'skill#'+3,start:'red',end:'red',hp:5,charge:2,cooldown:0});
        }
        players.push({id:'player#'+x,hp:100,color:'blue',skills:skills});
        x+=1;
      }
      data.teams.push(players);
    }   
    data.run=true;
    newTurn();
  }
  function updateBoard(){
    let player,skill;
    //update players or remove them: list health and color of each player
    //check victory condition
    let entry,panel=document.getElementById('panel')
    for(var i=panel.childNodes.length-1;i>=0;i-- ){
      panel.removeChild(panel.childNodes[i]);
    } 
    //cleanout skill selection
    let choice=document.getElementById('choice')
    for(var i=choice.childNodes.length-1;i>=0;i-- ){
      choice.removeChild(choice.childNodes[i]);
    } 
    for(var i=data.teams.length-1;i>=0;i--){
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        entry=document.createElement('button');
        entry.id=player.id;entry.style['color']=player.color;
        if(player.hp>0){
          entry.textContent='Team'+i+' '+player.id+' hp:'+player.hp+' '+player.color;
        } else {
          entry.textContent='Team'+i+' '+player.id+' is down';
        }
        if(data.team===i || player.hp<=0){
          entry.disabled=true;
        } else {
          //bind click handler targetselect
          entry.addEventListener("click",(function(target){return(selectTarget.bind(data,target));}(player.id))); 
          data.target=player.id;
        }
        panel.appendChild(entry);
        if(player.hp>0 && player.id===data.player){  //list skills for curr. player
          entry.style['border-block-color']='khaki',entry.style['border-block-width']='5px';
          for(var l=player.skills.length-1;l>=0;l--){
            skill=player.skills[l];
            entry=document.createElement('button');
            entry.id=skill.id;
            entry.textContent=skill.id+' '+skill.start+' -> '+skill.end+' hits:'+skill.hp+' cooldown:'+skill.cooldown;
            if(skill.cooldown>0){
              entry.disabled=true;
            }else {
              entry.addEventListener("click",(function(player,skill){return(selectSkill.bind(data,player,skill));}(player.id,skill.id)));  
            }  
            choice.appendChild(entry);
          }   
          entry=document.createElement('button');
          entry.id=entry.textContent='skip';  
          entry.addEventListener("click",nextPlayer);
          choice.appendChild(entry);
        }
        if(player.hp<=0 && player.id===data.player){ //skip dead players
          nextPlayer();return;
        }
      }
      entry=document.createElement('hr');
      panel.appendChild(entry);
    } 
    entry=document.createElement('p');
    entry.textContent=data.player+': select target and skill:';
    choice.appendChild(entry);  
  }
  function newTurn(){
    //check if any team is down
    let teamDead,player,skill;
    for(var i=data.teams.length-1;i>=0;i--){
      teamDead=true;
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        if(player.hp>0) teamDead=false;
        for(var l=player.skills.length-1;l>=0;l--){ //tick skills
          skill=player.skills[l];
          skill.cooldown=Math.max(0,skill.cooldown-1);
        }
      }
      if(teamDead){
        alert('team '+i+' is defeated')
        stop();
        break;
      } else { //start new round with team0 - note that all for-loops are operated backwards
        data.team=data.teams.length-1;
        let x=data.teams[data.team].length-1;
        data.player=data.teams[data.team][x].id;
        updateBoard();
      }
    }
  }
  function nextPlayer(){
    let player,_usethis;
    //skip to next alive in team
    _usethis=false;
    for(var k=data.teams[data.team].length-1;k>=0;k--){
      player=data.teams[data.team][k];
      if(_usethis===true){ //the previous player was the current - this is next 
        data.player=player.id;
        _usethis=false;
        break;
      }
      if(player.id===data.player){
        _usethis=true;
      }
    }
    if(_usethis===true){//no more players in team, switch to next
      data.team-=1;
      for(var i=data.team;(_usethis&&i>=0);i--){
        for(var k=data.teams[i].length-1;(_usethis&&k>=0);k--){
          player=data.teams[i][k];
          if(player.hp>0){
            data.player=player.id;
            _usethis=false;
          }
        }
      }
      if(_usethis===true){
        newTurn();//but if no one left... 
        return;
      }
    }
    updateBoard();
  }
  function selectTarget(id){this.target=id; }
  function selectSkill(playerId,skillId){
    let playerA,playerB,player,skill,skillA;
    for(var i=data.teams.length-1;i>=0;i--){ //find players
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        if(player.id===data.target){
          playerB=player;
        } 
        if(player.id===playerId){
          playerA=player;
          for(var l=player.skills.length-1;l>=0;l--){ //get skill
            skill=player.skills[l];
            if(skill.id===skillId){
              skillA=skill;
            }
          }
        }
      }
    }
    //execute skill & print log
    let _log="div#output";
    if(playerA.color===skillA.start){
      if(playerB.color===skillA.start){
        playerB.hp-=skillA.hp;playerB.color=skillA.end;
        window.gm.printOutput(playerA.id+" dealt "+skillA.hp+" damage to "+playerB.id,_log)
      } else {
        playerB.hp-=skillA.hp/5;
        window.gm.printOutput(playerB.id+" color doesnt match - less damage",_log)
      }
    } else {
      window.gm.printOutput(playerA.id+" color wrong - epic fail",_log)
    }
    playerA.color=skillA.end;
    skillA.cooldown=skillA.charge;
    nextPlayer();
  }
  function stop(){ data.run=false;}
  let data ={ //internal state of game
    scoreBoard : document.getElementById(panel),
    run:false, //game started?
    teams:[],
    team:0,
    player:'',
    target:'',
    stopCB: stopCB, //callback after user trigger 
    startCB: startCB, //callback after start
    start: start, //ref to start-function
  }
  return(data);
}
///////////////////////////////////////////////////////////////////////
window.gm.startCounterChargeCombat=function(stopCB, startCB){
  function start(){ 
    //setup teams,cards
    data.teams=[];
    let i,skills,defense,players,x=0;
    for(i=0;i<=1;i++){ //teams
      players=[];
      for(var k=0;k<(i+1);k++){
        defense=[],skills=[];   //skills
        if(x===0){
        skills.push({id:'skill#'+0,start:'blue',charge:'',hp:15,tick:0,cooldown:0});
        skills.push({id:'skill#'+1,start:'red',charge:'',hp:5,tick:0,cooldown:0});
        skills.push({id:'skill#'+2,start:'blue',charge:'blue',hp:25,tick:0,cooldown:0});
        skills.push({id:'skill#'+3,start:'red',charge:'green',hp:25,tick:0,cooldown:0});
        skills.push({id:'skill#'+4,start:'red',charge:'red',hp:25,tick:0,cooldown:0});
        defense.push({id:'defense#'+1,start:'red',charge:'red',tick:0,cooldown:1})
        defense.push({id:'defense#'+2,start:'blue',charge:'red',tick:0,cooldown:1})
        } else if(x===1){
          skills.push({id:'skill#'+3,start:'red',charge:'red',hp:25,tick:0,cooldown:0});
          skills.push({id:'skill#'+4,start:'blue',charge:'',hp:5,tick:0,cooldown:0});
          defense.push({id:'defense#'+1,start:'red',charge:'red',tick:0,cooldown:1})
          defense.push({id:'defense#'+2,start:'blue',charge:'red',tick:0,cooldown:1})
        } else {
          skills.push({id:'skill#'+0,start:'blue',charge:'red',hp:15,tick:0,cooldown:0});
          skills.push({id:'skill#'+2,start:'red',charge:'',hp:5,tick:0,cooldown:0});
          skills.push({id:'skill#'+3,start:'red',charge:'',hp:5,tick:0,cooldown:0});
        }
        players.push({id:'player#'+x,hp:100,charge:{blue:0,red:50,green:0},skills:skills,defenses:defense});
        x+=1;
      }
      data.teams.push(players);
    }   
    data.run=true,data.phase=0;
    newTurn();
  }
  function updateBoard(){
    let player,skill;
    let entry,panel=document.getElementById('panel')
    for(var i=panel.childNodes.length-1;i>=0;i-- ){
      panel.removeChild(panel.childNodes[i]);
    } 
    //cleanout buttons
    let choice=document.getElementById('choice')
    for(var i=choice.childNodes.length-1;i>=0;i-- ){
      choice.removeChild(choice.childNodes[i]);
    } 
    //update players or remove them: list health and color of each player
    for(var i=data.teams.length-1;i>=0;i--){
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        entry=document.createElement('button');
        entry.id=player.id;
        if(player.hp>0){
          entry.textContent='Team'+i+' '+player.id+' hp:'+player.hp+' blue:'+player.charge.blue+' red:'+player.charge.red+' green:'+player.charge.green;
        } else {
          entry.textContent='Team'+i+' '+player.id+' is down';
        }
        if(data.team===i || player.hp<=0 || data.phase===1){  //phase1 -> defender selects defense
          entry.disabled=true;
        } else {
          //bind click handler targetselect
          entry.addEventListener("click",(function(target){return(selectTarget.bind(data,target));}(player.id))); 
          data.target=player.id;
        }
        panel.appendChild(entry);
        if(player.hp<=0){ //skip dead players
          nextPlayer();return;
        }
        if(data.phase===0 && player.hp>0 && player.id===data.player){  //list skills of attacker
          entry.style['border-block-color']='khaki',entry.style['border-block-width']='5px';
            for(var l=player.skills.length-1;l>=0;l--){
              skill=player.skills[l];
              entry=document.createElement('button');
              entry.id=skill.id;
              entry.textContent=skill.id+' '+skill.start+' hits:'+skill.hp+((skill.charge!=='')?' requires:'+skill.charge:'')+' cooldown:'+skill.tick;
              if(skill.tick>0 || (skill.charge!=='' && player.charge[skill.charge]<50)){
                entry.disabled=true; //disable if cooldown or not enough charge
              }else {
                entry.addEventListener("click",(function(player,skill){return(selectSkill.bind(data,player,skill));}(player.id,skill.id)));  
              }  
              choice.appendChild(entry);
            }   
            entry=document.createElement('button');
            entry.id=entry.textContent='skip';  
            entry.addEventListener("click",nextPlayer);
            choice.appendChild(entry);
        } else if(data.phase===1 && player.hp>0 && player.id===data.target){ //list defense of target
          for(var l=player.defenses.length-1;l>=0;l--){
            skill=player.defenses[l];
            entry=document.createElement('button');
            entry.id=skill.id;
            entry.textContent=skill.id+' '+skill.start+' charges:'+skill.charge+' cooldown:'+skill.tick;
            if(skill.tick>0 || (data.skillcolor!==skill.start)){ //
              entry.disabled=true; //disable if cooldown or color wrong
            }else {
              entry.addEventListener("click",(function(player,skill){return(selectDefense.bind(data,player,skill));}(player.id,skill.id)));  
            }  
            choice.appendChild(entry);
          }
          entry=document.createElement('button');
          entry.id=entry.textContent='skip';  
          entry.addEventListener("click",(function(player,skill){return(selectDefense.bind(data,player,skill));}(player.id,''))); 
          choice.appendChild(entry);
        }        
      }
      entry=document.createElement('hr');
      panel.appendChild(entry);
    } 
    entry=document.createElement('p');
    entry.textContent=(data.phase===0)?data.player+': select target and skill:':data.target+': select defense:';
    choice.appendChild(entry);  
  }
  function newTurn(){
    //check if any team is down
    let teamDead,player,skill;
    data.phase=0;
    for(var i=data.teams.length-1;i>=0;i--){
      teamDead=true;
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        if(player.hp>0) teamDead=false;
        for(var l=player.skills.length-1;l>=0;l--){ //tick skills
          skill=player.skills[l];
          skill.tick=Math.max(0,skill.tick-1);
        }
        for(var l=player.defenses.length-1;l>=0;l--){ //tick skills
          skill=player.defenses[l];
          skill.tick=Math.max(0,skill.tick-1);
        }
      }
      if(teamDead){
        alert('team '+i+' is defeated')
        stop();
        break;
      } else { //start new round with team0 - note that all for-loops are operated backwards
        data.team=data.teams.length-1;
        let x=data.teams[data.team].length-1;
        data.player=data.teams[data.team][x].id;
        updateBoard();
      }
    }
  }
  function nextPlayer(){
    let player,_usethis;
    data.phase=0;
    //skip to next alive in team
    _usethis=false;
    for(var k=data.teams[data.team].length-1;k>=0;k--){
      player=data.teams[data.team][k];
      if(_usethis===true){ //the previous player was the current - this is next 
        data.player=player.id;
        _usethis=false;
        break;
      }
      if(player.id===data.player){
        _usethis=true;
      }
    }
    if(_usethis===true){//no more players in team, switch to next
      data.team-=1;
      for(var i=data.team;(_usethis&&i>=0);i--){
        for(var k=data.teams[i].length-1;(_usethis&&k>=0);k--){
          player=data.teams[i][k];
          if(player.hp>0){
            data.player=player.id;
            _usethis=false;
          }
        }
      }
      if(_usethis===true){
        newTurn();//but if no one left... 
        return;
      }
    }
    updateBoard();
  }
  function selectTarget(id){this.target=id; }
  function selectDefense(playerId,skillId){
    let playerA,playerB,player,skill,skillA,defenseB;
    let _log="div#output";
    for(var i=data.teams.length-1;i>=0;i--){ //find players
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        if(player.id===data.target){
          playerB=player;
          for(var l=player.defenses.length-1;l>=0;l--){ //get skill
            skill=player.defenses[l];
            if(skill.id===skillId){
              defenseB=skill;
            }
          }
        } 
        if(player.id===data.player){
          playerA=player;
          for(var l=player.skills.length-1;l>=0;l--){ //get skill
            skill=player.skills[l];
            if(skill.id===data.skill){
              skillA=skill;
            }
          }
        } 
      }
    }
    
    if(skillId==='' || skillA.start!==defenseB.start){ //full damage if no color match or nor defense selected
      playerB.hp-=skillA.hp;
      playerA.charge[skillA.start]+=10;
      window.gm.printOutput(playerA.id+" dealt "+skillA.hp+" damage to "+playerB.id,_log)
    } else { //if color matches, reduce damage & build charge on target
      playerB.charge[defenseB.charge]+=20;
      playerB.hp-=skillA.hp/2;
      window.gm.printOutput(playerB.id+" defended against "+playerB.id+ ' and charged '+defenseB.charge,_log)
    }
    skillA.tick=skillA.cooldown;
    if(skillA.charge!==''){
      playerA.charge[skillA.charge]-=50;
    }
    if(skillId!==''){
      defenseB.tick=defenseB.cooldown;
    }
    nextPlayer();
  }
  function selectSkill(playerId,skillId){
    let playerA,playerB,player,skill,skillA;
    let _log="div#output";
    for(var i=data.teams.length-1;i>=0;i--){ //find players
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        if(player.id===data.target){
          playerB=player;
        } 
        if(player.id===playerId){
          playerA=player;
          for(var l=player.skills.length-1;l>=0;l--){ //get skill
            skill=player.skills[l];
            if(skill.id===skillId){
              skillA=skill;
            }
          }
        }
      }
    }
    window.gm.printOutput("",_log)
    data.phase=1;
    data.skill=skillA.id,data.skillcolor=skillA.start;
    updateBoard();
  }
  function stop(){ data.run=false;}
  let data ={ //internal state of game
    scoreBoard : document.getElementById(panel),
    run:false, //game started?
    teams:[],
    team:0,
    player:'',skill:'',skillcolor:'',
    target:'',
    stopCB: stopCB, //callback after user trigger 
    startCB: startCB, //callback after start
    start: start, //ref to start-function
  }
  return(data);
}
///////////////////////////////////////////////////////////////////////
window.gm.startOmeterCombat=function(stopCB, startCB)
{
  function start(Teams,AI,debug){ 
    //setup teams,cards
    data.debug.display=debug.display?'all':'minimum',data.teams=[];
    data.debug.staminaOff=debug.staminaOff;
    data.AI=[];
    for(var _x of AI){
      switch(_x) {
        case 'none': data.AI.push(null);break;
        case 'passive': data.AI.push(AIpassive);break;
        case 'selfish': data.AI.push(AIselfish);break;
        default: throw new Error("invalid AI "+_x);
      }
    }
    
    let i,playerid,skills,defense,players,x=-1;
    for(i=0;i<=1;i++){ //teams
      players=[];
      for(var k=0;k<(1);k++){
        x+=1,defense=[],skills=[];   //skills   // own lust also depends on foe-lustinput*FactorReceive
        skills.push({id:'tease',stamina:-10,fr:1.5,lustself:1,lustother:3,tick:0,cooldown:0});
        skills.push({id:'calm',stamina:-3,fr:0.5,lustself:-3,lustother:0,tick:0,cooldown:0});
        skills.push({id:'fuck',stamina:-10,fr:1.2,lustself:4,lustother:5,tick:0,cooldown:0});   
        skills.push({id:'deny',stamina:-10,fr:0.5,lustself:-5,lustother:-5,tick:0,cooldown:0});
        skills.push({id:'passive',stamina:20,fr:1.0,lustself:-1,lustother:-1,tick:0,cooldown:0}); 
        playerid= 'player#'+x;   
        players.push({id:playerid,
          skills:skills,defenses:defense,skill:'',target:'',essence:0
          ,stamina:Teams[i][k].stamina//{min:0,max:100,exhausted:20,curr:80,regen:5}
          ,ometer:Teams[i][k].ometer//{min:0,denial:20,minor:60,gasm:85,max:100,curr:0}, //ostim=max
          ,pleasure:Teams[i][k].pleasure//{min:0,annoy:20,good:60,max:80,PNR:70,curr:10}
        });
        _createBars(players[players.length-1],i,i===0&&k===0);
      }
      data.teams.push(players);
    }   
    data.run=true;
    newTurn();
  }
  function _createBars(player,teamidx,firstcall) {
    let box,box2,entry,entry2,panel=document.getElementById('panel2');
      for(var i=panel.childNodes.length-1;firstcall && i>=0;i-- ){ 
        panel.removeChild(panel.childNodes[i]);
      } 
    //create bargraphs with ids = player.id+'stamina'
    //<div class="progressbar" id='clickHere' style='height:1em; width: 100%;'><div id='bar' style="position:relative; width:5%; height:100%; background-color:green;"></div></div>
    box=document.createElement('p');
    //box.style['width']='25em';
    box.textContent=player.id,box.id=player.id;
    box2=document.createElement('span');
    box2.id=player.id+'essence';
    box.appendChild(box2);
    for(var el of ['ometer','pleasure','stamina']) {
      box2=document.createElement('p');
      box2.textContent=el;box2.hidden=(el==='stamina'&&data.debug.display!=='all'&&teamidx>0);
      entry=document.createElement('div');
      entry.className="progressbar",entry.style['height']='1em',entry.style['width']='100%';
      entry2=document.createElement('div');
      entry2.id=player.id+el;
      entry2.style['height']='100%',entry2.style['width']='2%',entry2.style['position']='relative',entry2.style['background-color']='fuchsia';
      entry.appendChild(entry2);
      box2.appendChild(entry);
      box.appendChild(box2)
      entry2.style.transition = "left "+data.speed+"ms linear"; //configure css-transition for slider animation
    }
    panel.appendChild(box);
  }
  ///
  let maxx=0,maxv=0;
  function _updateBars(player) {
    let box,bar,value,gradient='',areas=[];
    box=document.getElementById(player.id+'essence');
    box.textContent=' essence:'+window.gm.util.formatNumber(player.essence,0);
    for(var i=0;i<=1;i++) { //2 swipes
      for(var el of ['ometer','pleasure','stamina']) {
        if(i===0){
          bar=document.getElementById(player.id+el);
          value=player[el].curr/(player[el].max-player[el].min);
          maxv=Math.max(value,maxv);maxx=Math.max(player[el].max-player[el].min,maxx);
          var rwidth,width =window.getComputedStyle(bar).getPropertyValue('width');
          var total = window.getComputedStyle(bar.parentNode).getPropertyValue('width');
          rwidth=100*parseFloat(width.split('px'))/parseFloat(total.split('px')); 
          bar.style.left=(value*100-rwidth)+'%';//wouldnt
          switch(el) {
            case 'pleasure':
              areas=[ {a:0,b:player[el].annoy*100/player[el].max,color:'steelblue'},
                      {a:player[el].annoy*100/player[el].max,b:player[el].good*100/player[el].max,color:'white'},
                      {a:player[el].good*100/player[el].max,b:player[el].PNR*100/player[el].max,color:'lightgreen'},
                      {a:player[el].PNR*100/player[el].max,b:(player[el].PNR+2)*100/player[el].max,color:'crimson'},
                      {a:(player[el].PNR+2)*100/player[el].max,b:100,color:'lightgreen'}]
              break;
            case 'stamina':
              areas=[ {a:0,b:player[el].exhausted*100/player[el].max,color:'crimson'},
                      {a:player[el].exhausted*100/player[el].max,b:100,color:'white'}]
              break;
            case 'ometer':
                areas=[ {a:0,b:player[el].denial*100/player[el].max,color:'steelblue'},
                        {a:player[el].denial*100/player[el].max,b:player[el].minor*100/player[el].max,color:'white'},
                        {a:player[el].minor*100/player[el].max,b:player[el].gasm*100/player[el].max,color:'violet'},
                        {a:player[el].gasm*100/player[el].max,b:100,color:'coral'}]
                break;
              default: throw new Error("unknown: "+el);
                break;
          }
          gradient='';
          for(var n of areas){ //todo need to sort from left to right
            gradient += '#80808000 0 '+n.a+'%, '+n.color+' '+n.a+'%,'+n.color+' '+n.b+'%,#80808000 '+n.b+'%,';
          }
          bar.parentNode.style.backgroundImage='linear-gradient(to right,'+gradient.slice(0,-1)+')';
        } else{ //on 2.pass adjust width of each bar relative to maxv
          bar=document.getElementById(player.id+el);
          bar.parentElement.style['width']=parseInt(40*(player[el].max-player[el].min)*maxv/maxx)+'em';
        }
      }
    }
  }
  ///
  function updateBoard(){
    let player,skill;
    let entry,box,panel=document.getElementById('panel');
    for(var i=panel.childNodes.length-1;i>=0;i-- ){
      panel.removeChild(panel.childNodes[i]);
    } 
    //cleanout buttons
    let choice=document.getElementById('choice');
    for(var i=choice.childNodes.length-1;i>=0;i-- ){
      choice.removeChild(choice.childNodes[i]);
    } 
    //update players or remove them: list health and color of each player
    for(var i=data.teams.length-1;i>=0;i--){
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        _updateBars(player);
        entry=document.createElement('button');
        entry.id=player.id;
        entry.textContent='Team'+i+' '+player.id+
          ' stamina:'+window.gm.util.formatNumber(player.stamina.curr,0)+
          ' pleasure:'+window.gm.util.formatNumber(player.pleasure.curr,0)+
          ' ometer:'+window.gm.util.formatNumber(player.ometer.curr,0);
        if(player.stamina.curr<=player.stamina.exhausted){
          entry.textContent+='   Exhausted !'
        }
        box=document.getElementById(player.id);
        if(data.team===i || !data.run ){
          entry.disabled=true;
          box.style["background-color"]="lightsteelblue";
        } else {
          box.style["background-color"]="unset";
          //button to select opponent
          entry.addEventListener("click",(function(target){return(selectTarget.bind(data,target));}(player.id))); 
          data.target=player.id;
        }
        panel.appendChild(entry);
        if(player.id===data.player.id && data.run){   //list skills of attacker
          if(data.AI[data.team]!==null) { //select by AI
            //data.AI[data.team]();
          }else {
            entry.style['border-block-color']='khaki';
              for(var l=player.skills.length-1;l>=0;l--){
                skill=player.skills[l];
                entry=document.createElement('button');
                entry.id=skill.id;entry.title=skill.id;
                entry.textContent=skill.id+' (fatigue:'+skill.stamina+' lustself:'+skill.lustself+/*' lustother:'+skill.lustother+*/')'+' cooldown:'+skill.tick;
                if(skill.tick>0 || (skill.stamina<0 && (player.stamina.curr-player.stamina.exhausted)<skill.stamina*-1)){
                  entry.disabled=true; //disable if cooldown or not enough charge
                }else {
                  entry.addEventListener("click",(function(player,skill){return(function(me){selectSkill.bind(me,player,skill)();})}(player.id,skill.id)));//(function(player,skill){return(selectSkill.bind(data,player,skill));}(player.id,skill.id)));  
                }  
                choice.appendChild(entry);
              }   
              //entry=document.createElement('button');
              //entry.id=entry.textContent='skip';  
              //entry.addEventListener("click",nextPlayer);
              //choice.appendChild(entry);
          }   
        }     
      }
      entry=document.createElement('hr');
      panel.appendChild(entry);
    }
    if(data.run) {
      entry=document.createElement('p');entry.style['color']='red'
      entry.textContent=(data.phase===0)?data.player.id+': select target and skill:':data.target+': select defense:';
      choice.appendChild(entry);  
      if(data.AI[data.team]!==null) { //select by AI
        clearTimeout(data.timer); //fire timer or get stackoverflow
        data.timer = setTimeout(data.AI[data.team], 300);
      }
    }
  }
  function newTurn(){
    //check if any team is down
    let teamDead,player,skill;
    data.phase=0;
    teamDead=true;
    for(var i=data.teams.length-1;i>=0;i--){
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        if(player.stamina.curr>player.stamina.exhausted) teamDead=false; //battle continues until no one has stamina
        for(var l=player.skills.length-1;l>=0;l--){ //tick skills
          skill=player.skills[l];
          skill.tick=Math.max(0,skill.tick-1);
        }
        for(var l=player.defenses.length-1;l>=0;l--){ //tick skills
          skill=player.defenses[l];
          skill.tick=Math.max(0,skill.tick-1);
        }
      }
    }
    data.team=data.teams.length-1;
    let x=data.teams[data.team].length-1;
    data.player=data.teams[data.team][x];
    if(teamDead){
      stop(),updateBoard();
      alert('team '+i+' is defeated');
    } else { //start new round with team0 - note that all for-loops are operated backwards
      updateBoard();
    }
  }
  function nextPlayer(){
    let player,_usethis;
    data.phase=0;
    //skip to next alive in team
    _usethis=false;
    for(var k=data.teams[data.team].length-1;k>=0;k--){
      player=data.teams[data.team][k];
      if(_usethis===true){ //the previous player was the current - this is next 
        data.player=player;
        _usethis=false;
        break;
      }
      if(player===data.player){
        _usethis=true;
      }
    }
    if(_usethis===true){//no more players in team, switch to next
      data.team-=1;
      for(var i=data.team;(_usethis&&i>=0);i--){
        for(var k=data.teams[i].length-1;(_usethis&&k>=0);k--){
          player=data.teams[i][k];
          if(true){//player.hp>0){
            data.player=player;
            _usethis=false;
          }
        }
      }
      if(_usethis===true){//but if no one left... 
        calcDamage();
        return;
      }
    }
    updateBoard();
  }
  function selectTarget(id){this.target=id; }
  function selectSkill(playerId,skillId){
    let player,skill;
    let _log="div#output";
    if(this) {
      let choice=this.target.parentNode;
      for(var i=choice.childNodes.length-1;i>=0;i-- ){//disable buttons
        choice.childNodes[i].disabled=true;
      }
    }
    for(var i=data.teams.length-1;i>=0;i--){ //find players
      for(var k=data.teams[i].length-1;k>=0;k--){
        player=data.teams[i][k];
        if(player.id===playerId){
          player.skill=_findSkill(player,skillId),player.target=data.target;
        }
      }
    }
    window.gm.printOutput(playerId+' will use '+skillId+' on '+data.target,_log)
    nextPlayer();
  }
  function _findSkill(player,id){
    let skill;
    for(var l=player.skills.length-1;l>=0;l--){ //get skill
      skill=player.skills[l];
      if(skill.id===id){ return(skill);}
    }
    throw new Error("unknown skillid: "+id);
  }
  function _describeAction(player,target,skill,top){
    let msg='';
    if(top===true){
      if(skill.id==='tease') {
        msg+=player.id+' teases '+target.id+' ';
      } else if(skill.id==='calm') {
        msg+=player.id+' calms itself ';
      } else if(skill.id==='fuck') {
        msg+=player.id+' fucks '+target.id+' ';
      } else {
        msg+=player.id+' just waits ';
      }
    } else {
      msg+='and '
      if(skill.id==='tease') {
        msg+=player.id+' teases back ';
      } else if(skill.id==='calm') {
        msg+=player.id+' calms itself ';
      } else if(skill.id==='fuck') {
        msg+=player.id+' fucks '+target.id+' ';
      } else {
        msg+=player.id+' just takes it ';
      }
    }
    return(msg);
  }

  function AIpassive() {
    selectSkill(data.player.id,'passive')
  }
  function AIselfish() {
    let player=data.player,skill = _findSkill(data.player,'fuck');
    if((skill.stamina<0 && (player.stamina.curr-player.stamina.exhausted-5)<skill.stamina*-1)){
      selectSkill(data.player.id,'passive');
    } else {
      selectSkill(data.player.id,'fuck');
    }
  }
  let _dt=null;//what pleasure opponent receives
  function _damt(skillid,other){
    if(!_dt){ _dt={};
    _dt["fuck-fuck"]=8,
    _dt["fuck-tease"]=6,
    _dt["fuck-passive"]=6,
    _dt["fuck-calm"]=0,
    _dt["fuck-deny"]=-2,
    _dt["tease-fuck"]=5,
    _dt["tease-tease"]=2,
    _dt["tease-passive"]=2,
    _dt["tease-calm"]=-2,
    _dt["tease-deny"]=-4,
    _dt["passive-fuck"]=0,
    _dt["passive-tease"]=0,
    _dt["passive-passive"]=-3,
    _dt["passive-calm"]=-4,
    _dt["passive-deny"]=-4,
    _dt["calm-fuck"]=2,
    _dt["calm-tease"]=0,
    _dt["calm-passive"]=0,
    _dt["calm-calm"]=-2,
    _dt["calm-deny"]=-4,
    _dt["deny-fuck"]=-4,
    _dt["deny-tease"]=-4,
    _dt["deny-passive"]=-4,
    _dt["deny-calm"]=-4,
    _dt["deny-deny"]=-10;
    }
    return(_dt[skillid+'-'+other]);
  }
  function calcDamage() {
    let entry,i,choice=document.getElementById('choice2');
    data.turn+=1;
    for(i=choice.childNodes.length-1;i>=5;i-- ){//cleanout log
      choice.removeChild(choice.childNodes[i]);
    } 
    //build pairs of interacting players; first is Top
    //right now we have only 1:1
    let essence,action,target,actions=[[data.teams[0][0],data.teams[1][0]]];
    function fpl(player){ //change of pleasure reduced in green range
      if(player.pleasure.curr>player.pleasure.minor) {
        return(0.5);
      }
      return(1.0);
    }
    function fom(player){ //change of ometer reduced in green range
      if(player.ometer.curr>player.ometer.minor) {
        return(0.5);
      }
      return(1.0);
    }
    for(var pair of actions){
      entry=document.createElement('p');
      entry.textContent='turn:'+data.turn+' '+_describeAction(pair[0],pair[1],pair[0].skill,true)+_describeAction(pair[1],pair[0],pair[1].skill,false)+'</br>';
      choice.insertBefore(entry,choice.firstChild); 
      for(i=pair.length-1;i>=0;i--) {
        action=pair[i],target=pair[1-i];
        action.stamina.curr=Math.max(action.stamina.min,Math.min(action.stamina.curr+action.skill.stamina,action.stamina.max));
        if(data.debug.staminaOff) action.stamina.curr=50;
        action.pleasure.curr=Math.max(action.pleasure.min,
          Math.min(action.pleasure.curr+action.skill.lustself+_damt(target.skill.id,action.skill.id),//(target.skill.lustother*action.skill.fr)*fpl(action),
            action.pleasure.max));
        if(action.ometer.curr>action.ometer.gasm) { //ostim
          action.pleasure.curr=action.pleasure.annoy/2;
        }
        if(action.pleasure.curr>action.pleasure.good) { //ometer gain
          action.ometer.curr=Math.max(action.ometer.min,Math.min(action.ometer.max,action.ometer.curr+5));//action.pleasure.curr/5));
        } else if(action.pleasure.curr<action.pleasure.annoy) { //annoy
          action.ometer.curr=Math.max(action.ometer.min,Math.min(action.ometer.max,action.ometer.curr-7));//action.pleasure.curr/5));
        } else {
          action.ometer.curr=Math.max(action.ometer.min,Math.min(action.ometer.max,action.ometer.curr-2));//action.pleasure.curr/15));
        }
        _updateBars(action);
      }
    }
    clearTimeout(data.timer); //update bars, then check if something triggered
    data.timer = setTimeout(calcDamage2, 1000);
  }
  function calcDamage2() {
    let entry,entry2,i,choice=document.getElementById('choice2');
    let essence,action,target,actions=[[data.teams[0][0],data.teams[1][0]]];
    for(var pair of actions){
      for(i=pair.length-1;i>=0;i--) {
        action=pair[i],target=pair[1-i];
        if(action.pleasure.curr>action.pleasure.PNR){//ogasm
          essence=action.ometer.curr;
          if(action.ometer.curr<action.ometer.minor){
            essence=0;
          }
          action.ometer.curr=action.ometer.min, action.pleasure.curr=action.pleasure.annoy*1.2, 
          action.stamina.curr=Math.max(action.stamina.min,Math.min(action.stamina.curr-action.stamina.max/2,action.stamina.max));
          action.essence+=essence;
          entry2=document.createElement('p');
          entry2.textContent=action.id+' came and created '+window.gm.util.formatNumber(essence,0)+' essence.</br>';
          choice.insertBefore(entry2,choice.firstChild); 
          _updateBars(action);
        }
      }
    }
    entry=document.createElement('hr');
    choice.insertBefore(entry,choice.firstChild); 
    newTurn();
  }
  function stop(){ data.run=false;}
  let data ={ //internal state of game
    scoreBoard : document.getElementById(panel),
    run:false, //game started?
    teams:[], //store data of team & players
    team:0,
    turn:0,
    cost:{

    },
    timer:0, //AI update timer
    AI:null,
    speed:300, //slider anim speed
    debug:{display:'all'},
    player:'',skill:'',target:'',
    stopCB: stopCB, //callback after user trigger 
    startCB: startCB, //callback after start
    start: start, //ref to start-function
  }
  return(data);
}
/* initialize a puzzle with tetris-styled pieces; 
* the player has to dragNdrop all pieces to completely cover the goals; Note that the pieces dont have to fit completely into the goals 
* custom shapes of pieces/goals can be set.
* the function returns a data-object that you have to configure before calling init()
*/
window.gm.startBlockPuzzle=function(){
    const PUZZLE_HOVER_TINT = '#009900';
    var _stage, _canvas, _mtt;
    var _pieces,_goals;
    var _puzzleWidth,_puzzleHeight,_gridwidth;
    var startX =0, startY= 0;
    // Goal is an array of gridfields that need to be completely covered with puzzle-pieces
    var Goal = function(x,y,grid,parts){
      let goal={x:x*grid,y:y*grid,parts:parts,grid:grid};
      goal.render = function(ctx){
          ctx.save();
          ctx.strokeStyle ='#000000';ctx.fillStyle = '#AAAAAA';
          ctx.setLineDash([5, 10]);
          ctx.beginPath();
          for(var _r of this.parts){
              ctx.rect(this.grid*_r[0]+this.x , this.grid*_r[1]+this.y , this.grid, this.grid);
          }
          ctx.fill();ctx.stroke();
          ctx.restore();
      };
      goal.getGrid =function(){
          let grid=[];
          for(var _r of this.parts){
              var x=_r[0]*this.grid+this.x,y=_r[1]*this.grid+this.y;
              grid.push([x,y]);
          }
          return(grid);
      }
      return(goal);
    }
    //Piece is a puzzle-piece which shape is defined by part-rects. 
    //Grid defines the size of the part-rects. x/y is specified in multiples of grid
    //parts is an array of arrays with 2 elements specifiying x,y of every part-rect; x/y is relativ to piece-x/y 
    var Piece = function(x, y, grid, parts,design){
      let piece={x:x*grid,y:y*grid,parts:parts,grid:grid,isDragging:false,
        fill:(design&&design.fill)?design.fill:'#2793ef',
        canRotate:(design&&design.canRotate)?design.canRotate:false};
        piece.oldX=piece.newX=piece.x;piece.oldY=piece.newY=piece.y;
        piece.render = function(ctx){
            ctx.save();
            if(this.isDragging){
                ctx.globalAlpha = .4;
                ctx.fillStyle = PUZZLE_HOVER_TINT;
            } else {
                ctx.fillStyle = this.fill;
            }
            ctx.strokeStyle ='#000000';
            ctx.beginPath();
            for(var _r of this.parts){
                ctx.rect(this.grid*_r[0]+this.x , this.grid*_r[1]+this.y , this.grid, this.grid);
                if(_r[0]===0 && _r[1]===0 && this.canRotate){ //mark rotation on part [0,0]
                  var _cx=this.grid*(_r[0]+0.5)+this.x,_cy=this.grid*(_r[1]+0.5)+this.y;
                  ctx.moveTo(_cx+this.grid*0.3,_cy); //if ..(_cx,_cy) there would be another line from circle to center
                  ctx.arc(_cx,_cy,this.grid*0.3,0,Math.PI*2);
                }
            }
            ctx.fill();ctx.stroke();
            ctx.restore();
        };
        piece.getGrid =function(){
            let grid=[];
            for(var _r of this.parts){
                var x=_r[0]*this.grid+this.x,y=_r[1]*this.grid+this.y;
                grid.push([x,y]);
            }
            return(grid);
        }
        piece.rotate=function(angle){
          //rotate-Matrix 90°
          // 0 -1
          // 1  0
          if(!this.canRotate) return;
          this.parts=this.parts.map(
            function(pt){ return([pt[1]*-1,pt[0]*1]);}
          );
        }
        piece.isHit=function(x,y){
            for(var _r of this.parts){
                /*if (x > this.grid*_r[0]+this.x - this.grid * 0.5                && y > this.grid*_r[1]+this.y - this.grid * 0.5 && 
                    x < this.grid*_r[0]+this.x + this.grid - this.grid * 0.5    && y < this.grid*_r[1]+this.y + this.grid - this.grid * 0.5){*/
                if (x > this.grid*_r[0]+this.x              && y > this.grid*_r[1]+this.y && 
                    x < this.grid*_r[0]+this.x + this.grid  && y < this.grid*_r[1]+this.y + this.grid ){
                    return true;
                }
            }
            return false;
        };
        return(piece);
    }
    // this structure is returned by the start-fct and is the public interface to the game
    let data ={
      init:init,      //points to the init-function
      setup:demoLevel, //set this to a function that defines the level; see demoLevel
      start:start,  //(re-)starts the game at a level
      onWin:demoWinLevel, //callback called on solving a level
      onLoss:demoLossLevel, //todo callback called on failing a level
      onFinish:demoWinGame, //callback called on solving all level
      level:1,  //tracks the current level
      createGoal:Goal,  //points to a helper-function to build goal-areas
      createPiece:Piece //points to a helper-fct to build pieces
    }
    //utility function to track touch & mouse movement
    var MouseTouchTracker = function(canvas, callback){
        function processEvent(evt){
            var rect = canvas.getBoundingClientRect();
            var offsetTop = rect.top;
            var offsetLeft = rect.left;
            if (evt.touches){return { x: evt.touches[0].clientX - offsetLeft, y: evt.touches[0].clientY - offsetTop }
            } else { return {x: evt.clientX - offsetLeft,y: evt.clientY - offsetTop }
            }
        }
        function onDown(evt){
            evt.preventDefault();
            _canvas.focus(); //this is to make sure canvas can receive keyup; canvas also has to have tabindex set to be focusable!
            var coords = processEvent(evt);
            callback('down', coords.x, coords.y);
        }
        function onUp(evt){ 
            evt.preventDefault(); 
            callback('up');  
        }
        function onMove(evt){
            evt.preventDefault();
            var coords = processEvent(evt);
            callback('move', coords.x, coords.y);
        }
        function onKey(evt){
          evt.preventDefault();
          callback('key', evt.code);
      }
        var _canvas=canvas;
        canvas.ontouchmove = onMove;
        canvas.onmousemove = onMove;
        canvas.ontouchstart = onDown;
        canvas.onmousedown = onDown;
        canvas.ontouchend = onUp;
        canvas.onmouseup = onUp;
        canvas.onkeyup = onKey;
    }
    /**
     * expects a canvas-element with proper size on the page with id='canvas'
     * initialize setup-function before calling this !
     *
     * @param {*} grid : puzzle-part-size in pixel
     */
    function init(grid){
        _canvas = document.getElementById('canvas');
        _stage = _canvas.getContext('2d');
        _gridwidth=grid;
        _puzzleWidth=_canvas.width; _puzzleHeight=canvas.height;
        _mtt = new MouseTouchTracker(_canvas,dragPiece);
        start(this.level);
    }
    //draw canvas; called internally
    function redraw(){
        _stage.clearRect(0, 0, _canvas.width, _canvas.height);
        for(var n of _goals){
            n.render(_stage);
        }
        for(var n of _pieces){
            n.render(_stage);
        }
    }
    //returns true if pieces collides with other piece or outside border; called internally
    function collides(piece){ 
        var _a=piece.getGrid();
        //todo outside border
        for(var _p of _a){
            if(_p[0]<0 || _p[1]<0 || _p[0]>=_puzzleWidth || _p[1]>=_puzzleHeight) return(true);
        }
        for(var _p of _pieces){
            if(_p===piece) continue;
            var _b = _p.getGrid();
            for(var i=_a.length-1;i>=0;i--){
                if(_b.find(function(value,index){return((_a[i][0]===value[0])&&(_a[i][1]===value[1]))})) return(true);
            }
        }
        return(false);
    }
    //check if goals are completly covered (but pieces dont have to be completely inside goal); called internally
    function checkWin(){
        let won=true;
        let a,allG=[],allP=[];
        for(var _p of _pieces){
            allP=allP.concat(_p.getGrid());
        }
        for(var _g of _goals){
            allG=allG.concat(_g.getGrid());
        }
        for(var i=allG.length-1;i>=0;i--){//check if no goal-part is uncovered
            if(allP.find(function(value,index){return((allG[i][0]===value[0])&&(allG[i][1]===value[1]))})){}
            else{won=false};
        }
        return(won);
    }
    //drag&drop operation; called internally
    function dragPiece(evtType, x, y){
        switch(evtType){
        case 'key':
          if(x==='KeyR'){
            for(var n of _pieces){
              if (n.isDragging){
                n.rotate(90);
              }
            }
          }
          break;
        case 'down':
            startX = x;
            startY = y;
            for(var n of _pieces){
                if (!n.isDragging && n.isHit( x, y)){ 
                    n.isDragging = true; 
                    n.oldX=n.newX=n.x,n.oldY=n.newY=n.y;
                }
            }
            break;
        case 'up':
            for(var n of _pieces){ 
                n.isDragging = false;
                if(collides(n)){ n.x =n.oldX,n.y=n.oldY;}
            }
            break;
        case 'move':
            var dx = x - startX, dy = y - startY;
            startX = x;startY = y;
            for(var n of _pieces){
                if (n.isDragging){
                    n.newX += dx, n.newY += dy; 
                    /*n.x=Math.floor(((n.newX-_gridwidth/2)/_gridwidth))*_gridwidth+_gridwidth/2;
                    n.y=Math.floor(((n.newY-_gridwidth/2)/_gridwidth))*_gridwidth+_gridwidth/2;*/
                    n.x=Math.floor(((n.newX)/_gridwidth))*_gridwidth; //floor is used to snap to grid
                    n.y=Math.floor(((n.newY)/_gridwidth))*_gridwidth;
                }
            }
            break;
        }
        redraw();
        if(evtType==='up' && checkWin()){
          data.onWin(data.level);
        }
    }
    //used to start a certain level; the onWin-callback has to call this to continue the game
    function start(level){
        _pieces=[];_goals=[];
        data.level=level;
        var tmp=data.setup(level);
        if(!tmp){
          data.onFinish(level);
        } else {
          _goals=tmp.goals;
          _pieces=tmp.pieces;
        }
        redraw();
    }
    //the setup-fct receives a level-No and has to return a object containing the goals and pieces of that level
    function demoLevel(level){
      return({goals:[new Goal(3,3,_gridwidth,[[0,0],[0,1],[1,0],[1,1],[1,2],[2,2],[2,3]])],
      pieces:[new Piece(0, 0, _gridwidth, [[0,0],[1,0],[1,1]],{fill:'#57535f'}),
          new Piece(4, 1, _gridwidth, [[0,0],[0,1],[1,0],[1,1]])
      ]})
    }
    function demoWinGame(level){
      alert("You solved all puzzles");
    }
    function demoWinLevel(level){
      alert("You solved the puzzle-level "+level);
      this.start(level+1);
    }
    function demoLossLevel(level){
      alert("You failed to solve the puzzle");
    }
    return(data);
};
/*
* ReactTest = a box is moing repeatedly left-right-left and the user has to click on it to 
* stop it inside a hit area (success if center of moving box is inside one hit-area)
*
* call this setup-function once and use the returned start & click function for game input
* bar is the id of the moving element-node; example:
* <div style='height:1em; width: 100%;'><div id='bar' style="position:relative; width:5%; height:100%; background-color:green;"></div></div>
* 
* you might provide callbacks for start & stop, stop will get area-index on success or -1 on fail
* speed is ms for one movement of the box from left to right 
* area is a list of non-overlapping hit-areas like [{a:5,b:10, color:'orange'}]; 
*/
window.gm.startReactTest=function(bar, speed, stopCB, startCB,areas){
    /**
     * starts the game
     */
    function start(){ //todo instead left-right also up-down should be possible
      ///////////////svg test ////////////////////
      var draw = SVG().addTo('#canvas').size(300, 300);
      var rect = draw.rect(100, 100).attr({ fill: '#f06' })
  
      ///////////////////////////////////////////////////
      data.stop();
      data.value=0,data.run=true;
      data.bargraph.style.left = data.value+'%'; //dont start in between; speed would be slowed down to maintain transition time
      var width =window.getComputedStyle(data.bargraph).getPropertyValue('width');
      var total = window.getComputedStyle(data.bargraph.parentNode).getPropertyValue('width');
      //calculate barsize relative to total width (necessary if windowsize changed in between )
      data.barsize=100*parseFloat(width.split('px'))/parseFloat(total.split('px')); 
      data.bargraph.style.transition = "left "+data.speed+"ms linear"; //configure transition for animation
      if(data.startCB) data.startCB(); //called before transition-start!
      data.bargraph.ontransitionend(); //start transition
    }
    /**
     * this stops the game and returns the index of hit area; use click() instead !
     */
    function stop(){
      var computedStyle = window.getComputedStyle(data.bargraph);
      var left = computedStyle.getPropertyValue('left');
      data.bargraph.style.left=left;
      data.bargraph.style.transition = null; // disable transition AFTER fetching computed value !
      var total = window.getComputedStyle(data.bargraph.parentNode).getPropertyValue('width');
      left =parseFloat(left.split('px')),total=parseFloat(total.split('px'));
      left = 100*left/total+data.barsize/2;
      var res =-1; //detect if area was hit or not
      for(var i=data.areas.length-1; i>=0;i--){
        if(data.areas[i].a<=left && left<=data.areas[i].b) res=i; 
      }
      data.run=false;
      return(res);
    }
    /**
     * this can be bound to eventhandler for user input detection to trigger stop and will call stop-CB
     */
    function click(){
      var run = data.run;
      var res = data.stop();
      if(run && data.stopCB) data.stopCB(res);
    }
    let data ={ //internal state of game
      bargraph : document.getElementById(bar),
      run:false, //game started?
      value: 0, //actual setpoint in%
      barsize: 5, //width of hitbox relative to total width in %
      areas:areas,  //list of areas to hit in %;
      speed:speed, //transition time in ms
      stopCB: stopCB, //callback after user trigger 
      startCB: startCB, //callback after start
      start: start, //ref to start-function
      stop: stop, //ref to stop-func
      click: click //ref to click-func
    }
    let gradient=''; 
    for(var n of data.areas){ //todo need to sort from left to right
      gradient += '#80808000 0 '+n.a+'%, '+n.color+' '+n.a+'%,'+n.color+' '+n.b+'%,#80808000 '+n.b+'%,';
    }
    data.bargraph.parentNode.style.backgroundImage='linear-gradient(to right,'+gradient.slice(0,-1)+')';
    /**
     * instead of using timers rely on css-transition handling and events
     */
    data.bargraph.ontransitionend = () => {
      data.value = (data.value===0)?100-data.barsize:0;
      data.bargraph.style.left=data.value+'%'; //this should trigger css-transition
    };
    return(data);
  }
  /**
   * by pressing left/right alternatively you move a box along a bar until you reach its end or run out of time
   * the bar will slowly slide back to origin without proper input (you have to press quickly to finish); each time you pass an area, this movement increases 
   * 
   * @param {*} bar : the element to move
   * @param {*} speed : recovery rate in ms 
   * @param {*} stopCB 
   * @param {*} startCB 
   * @param {*} areas 
   */
  window.gm.startReactTest2=function(bar, speed, stopCB, startCB,areas){   //todo timeout starts after first click
    /**
     * starts the game
     */
    function start(){ //todo instead left-right also up-down should be possible
      data.stop();
      data.run=true;
      data.bargraph.style.left = data.value+'%'; //dont start in between; speed would be slowed down to maintain transition time
      var width =window.getComputedStyle(data.bargraph).getPropertyValue('width');
      var total = window.getComputedStyle(data.bargraph.parentNode).getPropertyValue('width');
      //calculate barsize relative to total width (necessary if windowsize changed in between )
      data.barsize=100*parseFloat(width.split('px'))/parseFloat(total.split('px')); 
      //data.bargraph.style.transition = "left "+data.speed+"ms linear"; //configure transition for animation
      if(data.startCB) data.startCB(); //called before transition-start!
      //data.bargraph.ontransitionend(); //start transition
      data.value=20, data.speed2 =1;
      tick();
      data.intervalID = window.setInterval( tick,data.speed);
    }
    /**
     * this stops the game and returns the index of hit area; use click() instead !
     */
    function stop(){
      if(data.intervalID) window.clearInterval(data.intervalID);
      var computedStyle = window.getComputedStyle(data.bargraph);
      var left = computedStyle.getPropertyValue('left');
      data.bargraph.style.left=left;
      data.bargraph.style.transition = null; // disable transition AFTER fetching computed value !
      data.run=false;
    }
    function tick(){
        data.value= Math.max(0,data.value-data.speed2);
        data.bargraph.style.left=data.value+'%';
      }
    /**
     * this can be bound to eventhandler for user input detection to trigger stop and will call stop-CB
     */
    function click(evt){
      if(!data.run) return;
      let prevKey = data.lastKey;
      if((prevKey !==evt.key && (evt.key==='a' || evt.key==='ArrowLeft' || evt.key==='d'|| evt.key==='ArrowRight'))){
        data.lastKey=evt.key,data.value+=5;
        data.bargraph.style.left=data.value+'%';
      } 
      var left = data.value+data.barsize/2;
      var res =-1; //detect if area was hit or not
      for(var i=data.areas.length-1; i>=0;i--){
        if(data.areas[i].a<=left && left<=data.areas[i].b){
          res=i; data.speed2=(i+1)*2; } 
      }
      if(res===data.areas.length-1){
        stop();
        if(data.stopCB) data.stopCB(res); 
      }
    }
    let data ={ //internal state of game
      bargraph : document.getElementById(bar),
      run:false, //game started?
      value: 0, //actual setpoint in%
      barsize: 5, //width of hitbox relative to total width in %
      areas:areas,  //list of areas to hit in %;
      speed:speed, //transition time in ms
      speed2 : 1,  //recovery speed in % of barwidth
      stopCB: stopCB, //callback after user trigger 
      startCB: startCB, //callback after start
      start: start, //ref to start-function
      stop: stop, //ref to stop-func
      click: click, //ref to click-func
      intervalID: null,
      lastKey: ''
    }
    let gradient=''; 
    for(var n of data.areas){ //todo need to sort from left to right
      gradient += '#80808000 0 '+n.a+'%, '+n.color+' '+n.a+'%,'+n.color+' '+n.b+'%,#80808000 '+n.b+'%,';
    }
    data.bargraph.parentNode.style.backgroundImage='linear-gradient(to right,'+gradient.slice(0,-1)+')';
    /**
     * instead of using timers rely on css-transition handling and events
     */
    /*data.bargraph.ontransitionend = () => {
      data.value = (data.value===0)?100-data.barsize:0;
      data.bargraph.style.left=data.value+'%'; //this should trigger css-transition
    };*/
    return(data);
  }
  window.gm.startPong=function(){
    ///// fixed sample from https://svgjs.dev/ ////////
  // define document width and height
  var width = 450, height = 300
  // create SVG document and set its size
  var draw = SVG().addTo('#pong').size(width, height)
  draw.viewbox(0,0,450,300)
  // draw background
  var background = draw.rect(width, height).fill('#dde3e1')
  // draw line
  var line = draw.line(width/2, 0, width/2, height)
  line.stroke({ width: 5, color: '#fff', dasharray: '5,5' })
  // define paddle width and height
  var paddleWidth = 15, paddleHeight = 80
  // create and position left paddle
  var paddleLeft = draw.rect(paddleWidth, paddleHeight)
  paddleLeft.x(0).cy(height/2).fill('#00ff99')
  // create and position right paddle
  var paddleRight = draw.rect(paddleWidth, paddleHeight)//paddleLeft.clone()
  paddleRight.x(width-paddleWidth).fill('#ff0066')
  // define ball size
  var ballSize = 10
  // create ball
  var ball = draw.circle(ballSize)
  ball.center(width/2, height/2).fill('#7f7f7f')
  // define inital player score
  var playerLeft =0, playerRight = 0
  // create text for the score, set font properties
  var scoreLeft = draw.text(playerLeft+'').font({
    size: 32,
    family: 'Menlo, sans-serif',
    anchor: 'end',
    fill: '#fff'
  }).move(width/2-10, 10)
  // cloning doesnt work!
  var scoreRight = draw.text(playerRight+'').font({
    size: 32,
    family: 'Menlo, sans-serif',
    anchor: 'end',
    fill: '#fff'
  }).move(width/2-10, 10)
    .font('anchor', 'start')
    .x(width/2+10)
  // random velocity for the ball at start
  var vx = 0, vy = 0
  // AI difficulty
  var difficulty = 2
  // update is called on every animation step
  function update(dt){
    // move the ball by its velocity
    ball.dmove(vx*dt, vy*dt)
    // get position of ball
    var cx = ball.cx(), cy = ball.cy()
    // get position of ball and paddle
    var paddleLeftCy = paddleLeft.cy()
    // move the left paddle in the direction of the ball
    var dy = Math.min(difficulty, Math.abs(cy - paddleLeftCy))
    paddleLeftCy += cy > paddleLeftCy ? dy : -dy
    // constraint the move to the canvas area
    paddleLeft.cy(Math.max(paddleHeight/2, Math.min(height-paddleHeight/2, paddleLeftCy)))
    // check if we hit top/bottom borders
    if ((vy < 0 && cy <= 0) || (vy > 0 && cy >= height)){ vy = -vy }
    var paddleLeftY = paddleLeft.y() , paddleRightY = paddleRight.y()
    // check if we hit the paddle
    if((vx < 0 && cx <= paddleWidth && cy > paddleLeftY && cy < paddleLeftY + paddleHeight) ||
       (vx > 0 && cx >= width - paddleWidth && cy > paddleRightY && cy < paddleRightY + paddleHeight)){
      // depending on where the ball hit we adjust y velocity
      // for more realistic control we would need a bit more math here
      // just keep it simple
      vy = (cy - ((vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 // magic factor
      // make the ball faster on hit
      vx = -vx * 1.05
    } else
    // check if we hit left/right borders
    if ((vx < 0 && cx <= 0) || (vx > 0 && cx >= width)){
      // when x-velocity is negative, it's a point for player 2, otherwise player 1
      if(vx < 0){ ++playerRight }
      else { ++playerLeft }
      reset()
      scoreLeft.text(playerLeft+'')
      scoreRight.text(playerRight+'')
    }  
    // move player paddle
    var playerPaddleY = paddleRight.y()
    if (playerPaddleY <= 0 && paddleDirection == -1){
      paddleRight.cy(paddleHeight/2)
    } else if (playerPaddleY >= height-paddleHeight && paddleDirection == 1){
      paddleRight.y(height-paddleHeight)
    } else {
      paddleRight.dy(paddleDirection*paddleSpeed)
    }  
    // update ball color based on position
    ball.fill(ballColor);//??.at(1/width*ball.x()))
  }
  var lastTime, animFrame
  function callback(ms){
    // we get passed a timestamp in milliseconds
    // we use it to determine how much time has passed since the last call
    if (lastTime){
      update((ms-lastTime)/1000) // call update and pass delta time in seconds
    }
    lastTime = ms
    animFrame = requestAnimationFrame(callback)
  }
  callback()
  var paddleDirection = 0 , paddleSpeed = 5
  SVG.on(document, 'keydown', function(e){
    paddleDirection = e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0
    e.preventDefault()
  })
  SVG.on(document, 'keyup', function(e){
    paddleDirection = 0
    e.preventDefault()
  })
  draw.on('click', function(){
    if(vx === 0 && vy === 0){
      vx = Math.random() * 500 - 150
      vy = Math.random() * 500 - 150
    }
  })
  function reset(){
    // visualize boom
    boom()
    // reset speed values
    vx = 0,  vy = 0
    // position the ball back in the middle
    ball.animate(100).center(width/2, height/2)
    // reset the position of the paddles
    paddleLeft.animate(100).cy(height/2)
    paddleRight.animate(100).cy(height/2)
  }
  // ball color update
  var ballColor = new SVG.Color('#ff0066')
  //?? ballColor.morph('#00ff99')
  // show visual explosion 
  function boom(){
    // detect winning player
    var paddle = ball.cx() > width/2 ? paddleLeft : paddleRight
    // create the gradient
    var gradient = draw.gradient('radial', function(stop){
      stop.stop(0, paddle.attr('fill'))
      stop.stop(1, paddle.attr('fill'))
    })
    // create circle to carry the gradient
    var blast = draw.circle(300)
    blast.center(ball.cx(), ball.cy()).fill(gradient)
    // animate to invisibility
    blast.animate(1000, '>').opacity(0).after(function(){
      blast.remove()
    })
  }
  }