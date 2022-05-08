
"use strict";
//used for pathfinding in map not using dungeon
//grid = grid =[{room:'H2', dirs:['H3','I2']},...]
window.gm.gridToGraph=function(grid) {
  let _r,_rooms= new Map();
  for(el of grid) {
      _rooms.set(el.room,{name:el.room, neighbours:[]});
  }
  for(el of grid) {
      _r = _rooms.get(el.room);
      for(var dir of el.dirs) {
          _r.neighbours.push(_rooms.get(dir));
      }
      _rooms.set(el.room,_r);
  }
  let graph = new window.Graph(Array.from(_rooms.values( )));
  graph.neighbors=function(node){
      var dir,ret = [],dirs = node.origNode.neighbours;
      for(dir of dirs) {
          var room = dir;
          var next=this.nodes.find((el)=>{return(el.origNode===room);})
          ret.push(next);
      }
      return ret;
  };
  graph.areNodesEqual=function(nodeA,nodeB){return(nodeA.origNode.name===nodeB.origNode.name)};
  return(graph)
}
window.gm.printNav2=function(label,to) {
    let args = { func: function(to){return('window.gm.navHere(\"'+to+'\")');}};
    return(window.gm.printNav(label,to,args));
}
window.gm.navHere = function(to) {
    window.story.state.DngSY.prevLocation=window.gm.player.location;
    window.story.state.DngSY.nextLocation=to;
    to=window.gm.navEvent(to,window.story.state.DngSY.prevLocation);
    if(to==="") to=window.story.state.DngSY.nextLocation;
    window.gm.addTime(15);
    window.story.show(to);
}
window.gm.navEvent = function(to,from) {
    let _targ = '',dir,dirs,evt,evts,dng=window.story.state.DngSY.dng;
    let _to=to.replace(dng+"_",""),_from=from.replace(dng+"_","");
    let _room=to.replace(dng+"_","");
    //tick = timestamp  
    //state: 0-active  1-inactive  
    let _leaveChance=0,_allChances=0,_now=window.gm.getTime(), _rnd=_.random(0,100);
    evts = window.story.state[dng].tmp.evtLeave[_from+'_'+_to]; 
    if(evts) { //leave-check
        evts=evts.filter(x=>(x.state===0));
        evts.forEach(x=>(_allChances+=x.chance));
        dir=null,dirs=window.gm.getRoomDirections(_from);
        for(var i=dirs.length-1;i>=0;i--){
            if(dirs[i].dir===_to) {
                dir=dirs[i];break;
            }
        }
        if(dir){ //choose an event; the more you explored that direction, the higher the chance to find the exit
            //0x: 0%    1x: 10%   5x: 50%    10x: 70%  100x: 90%  of OVERALL-chance
            _leaveChance=(dir.exp>=5)?50.0:((dir.exp>=1)?10.0:(0));
            _leaveChance=_leaveChance/100.0*_allChances;_allChances+=_leaveChance;
            dir.exp+=1;//exp-count is updated
            _rnd=_.random(0,_allChances-0.01);
            for(var i = evts.length-1;i>=0;i--) { 
                if(_rnd<_allChances && _rnd>=(_allChances-evts[i].chance)) {
                    window.story.state.tmp.args=[evts[i],_from+'_'+_to];
                    return(dng+'_'+evts[i].id); //DngPC_wolf5
                }
                _allChances-=evts[i].chance;
            }//if no event rolled continue with door check 
        }
    }
    evts = window.story.state[dng].tmp.doors[_from];
    if(evts) { //door-check
        evt = evts[_to];
        if(evt) {
            if(evt.state===0) _targ=dng+"_Door_Closed";
            if(_targ!=='') return(_targ);
        }
    }
    evts = window.story.state[dng].tmp.evtEnter[_room];
    if(evts) { //mobs
        evt = evts["dog"];
        if(evt) {
            if(evt.state===0) _targ=dng+"_Meet_Dog";
            if(_targ!=='') return(_targ);
        }
        evt = evts["gas"];
        if(evt && _rnd>70 && window.gm.getDeltaTime(_now,evt.tick)>400) {//todo chance modifier
            if(evt.state===0) evt.tick=_now,_targ=dng+"_Trap_Gas";
            if(_targ!=='') return(_targ);
        }evt = evts["tentacle"];
        if(evt && _rnd>0 && window.gm.getDeltaTime(_now,evt.tick)>400) {//todo chance modifier
            if(evt.state===0) evt.tick=_now,_targ=dng+"_Trap_Tentacle";
            if(_targ!=='') return(_targ);
        }
    }
    return(_targ);
}
window.gm.getRoomDirections=function(from) {
    let rooms=window.story.state.DngSY.dngMap.grid
    for(var i=rooms.length-1;i>=0;i--){
        if(rooms[i].room===from) {
            return(rooms[i].dirs)
        }
    }
    return([]);
};
window.gm.mobAI = function(mob){
    var _now=window.gm.getTime();
    if(mob.state!==0 || mob.tick==='') {mob.tick=_now;return;}
    if(window.gm.getDeltaTime(_now,mob.tick)>30) {
        mob.tick=_now;
        var _to = getRoomDirections(mob.pos).filter(el=> mob.path.includes(el.dir));
        if(_to.length>0) {
            mob.pos=_to[_.random(0,_to.length-1)].dir;
            //alert(mob.id+' now moving to '+mob.pos);
        }
    }
}
//dynamic room description 
window.gm.renderRoom= function(room){
    let msg="",deltaT,dng=window.story.state.DngSY.dng,_evt,_evts= window.story.state[dng].tmp.evtSpawn[room];
    if(!_evts) return(msg);
    _evt=_evts["chest"];
    if(_evt && (_evt.state===0 || _evt.state===1)) {
      msg+=window.story.render(dng+"_Chest");
    }
    _evt=_evts["mushroom"];
    if(_evt && (_evt.state===0 || _evt.state===1)) {
        deltaT=window.gm.getDeltaTime(window.gm.getTime(),_evt.tick);
        if(_evt.loot==="BrownMushroom" && deltaT>4800) { //growth of...
            _evt.tick=window.gm.getTime();_evt.loot="RottenMushroom";
        } else if(_evt.loot==="ViolettMushroom" && deltaT>2400){
            _evt.tick=window.gm.getTime();_evt.loot="BrownMushroom";
        }
        msg+=window.story.render(dng+"_Mushroom");
    }
    _evt=_evts["lectern"];
    if(_evt && (_evt.state===0 || _evt.state===1)) {
        deltaT=window.gm.getDeltaTime(window.gm.getTime(),_evt.tick);
        if(deltaT>4000) { //respawn
            _evt.tick=window.gm.getTime();_evt.state=0;
        }
    }
    if(_evt && (_evt.state===0)) {
        msg+=window.story.render(dng+"_Lectern");
    }
    return(msg);
}
window.gm.finishTask=function(){
    let task=window.story.state.DngHC.task,_res={OK:(task.done>0),msg:''};
    switch(task.id) {
        case 'getEarsPierced':
            break;
        case 'getVagina':
            break;
        case 'findCursed':
            break;
        case 'lootChest':if(task.data<=0){ _res.OK=true;}
            else{ _res.OK=false,_res.msg='Need to loot '+task.data+' more chests. They appear randomly in the dungeon at certain places.</br>'};
            break;
        case 'bringIron':if(window.gm.player.Inv.countItem('VoucherIron')>=task.data){ window.gm.player.Inv.removeItem('VoucherIron',task.data),_res.OK=true;}
            else{ _res.OK=false,_res.msg='Not enough iron tokens.</br>'};
            break;
        case 'bringSilver':if(window.gm.player.Inv.countItem('VoucherSilver')>=task.data){ window.gm.player.Inv.removeItem('VoucherSilver',task.data),_res.OK=true;}
            else{ _res.OK=false,_res.msg='Not enough silver tokens.</br>'};
            break;
        case 'bringGold':
            break;
        case 'bringMoney':if(window.gm.player.Inv.countItem('Money')>=task.data){ window.gm.player.Inv.removeItem('Money',task.data),_res.OK=true;}
            else{ _res.OK=false,_res.msg='Not enough money.</br>'};
            break;
        default:
            throw new Error('unknown task'+task.id);
    }
    if(_res.OK===true){
        window.story.state.DngHC.tasks[task.id].cnt+=1,window.story.state.DngHC.tasks[task.id].done=0,window.story.state.DngHC.task={};//,window.story.show(window.passage.name);
        window.story.state.DngHC.tmp.tier+=1;_res.msg='donation request fullfilled. Your tier is now: '+window.story.state.DngHC.tmp.tier+'</br>';
        if(window.story.state.DngHC.tmp.tier%3===0) {_res.msg="A <b>golden token</b> is your price that you can use to open another door in the dungeon.</br>";window.gm.player.Inv.addItem(window.gm.ItemsLib.VoucherGold());}
    }
    window.gm.printOutput(_res.msg,'#choice');
};
window.gm.getAvailableTasks=function() { 
    var _task,_tasks=[],_d=window.story.state.DngHC,_t=_d.tmp.tier;
    var msg='choose a task:</br>';
    function taskDescr(task){
        var msg='';
        switch(task.id) {
            case 'lootChest':msg='Find and loot '+task.data+' treasure chests.';
                break;
            case 'getEarsPierced':msg='Get your ears pierced.';
                break;
            case 'getVagina':msg='Swap that dick of yours against a fine cunt.';
                break;
            case 'findCursed':msg='The dungeon is spoiled with cursed gear. Do me a favor and find at least one.';
                break;
            case 'bringIron':msg='Gather some iron-tokens by looting the dungeon or trading from the vendor.';
                break;
            case 'bringSilver':msg='Loot a silver-token from a boss.';
                break;
            case 'bringGold':msg='Gain a gold-token with a special job.';
                break;
            case 'bringMoney':msg='Some easy task here: get '+task.data+'$.';
                break;
            default:
                throw new Error('unknown task'+task.id);
        }
        msg='Within '+Math.floor((task.time-window.gm.getDeltaTime(window.gm.getTime(),task.start))/100)+'hours : '+msg;
        return(msg);
    }
    function foo(task){
        msg+=taskDescr(task)+window.gm.printLink("Choose this",'window.story.state.DngHC.task={id:\"'+task.id+'\",help:0,start:'+window.gm.getTime()+',time:'+task.time+',data:\"'+task.data+'\"},window.story.show(window.passage.name)')+'</br></br>';
    }
    function fooList(){_d.rolledTask.forEach(x=>(x.start=window.gm.getTime(),foo(x)));}
    //if task in progress - show task-info instead
    if(_d.task.id) {
        _d.rolledTask=[],msg='in progress: '+taskDescr(_d.task)+'</br>';
        //msg+=finishTask().msg;
        msg+=window.gm.printLink("finish task","window.gm.finishTask()");
        //todo possibility to abort and reroll for SilverVoucher?
        window.gm.printOutput(msg,'#choice');return;  
    }
    if(_d.rolledTask.length>0) { //tasks got already rolled
        fooList();
    } else {
        var _allChances=0,_tns=Object.keys(_d.tasks);
        for(var i=_tns.length-1;i>=0;i--) {
            var _chance=100,_tk=_d.tasks[_tns[i]];
            if(_tk.tick!=='') { //reduce chance for recent tasks or done ones
                var _dt=window.gm.getDeltaTime(window.gm.getTime(),_tk.tick);
                if(_dt<1440 || _tk.cnt>7) _chance*=0.5;
                else if(_dt<2880 || _tk.cnt>4) _chance*=0.3;
            }
            
            if(_tk.min>_d.tmp.tier)_chance=0;
            _task={id:_tns[i],chance:_chance,time:(2400),data:''}
            switch(_tns[i]) {
                case 'getEarsPierced': //only if piercing slot available
                    break;
                case 'getVagina': //only if not present 
                    break;
                case 'findCursed'://how to know what was aquired?
                    break;
                case 'bringMoney':_task.data=30*(1+_t);
                    break;
                case 'lootChest':_task.data=2;
                    break;
                case 'bringIron':
                case 'bringSilver':
                    _task.data=1+Math.floor(_t/6);
                    break;
                case 'bringGold':
                    _task.data=1;
                    break;
                default:
                    throw new Error('unknown task'+_tns[i]);
            }
            _tasks.push(_task);
            _allChances+=_chance;
        }
        //for(var i=1;i>0;i--) { //up to x tasks to choose from       todo remove task and recalc allchances
            if(_allChances>0.0) {//choose rnd tasks
                var _rnd=_.random(0,_allChances-0.01);
                for(var i = _tasks.length-1;i>=0;i--) { 
                    if(_rnd<_allChances && _rnd>=(_allChances-_tasks[i].chance)) {
                        _d.rolledTask.push(_tasks[i]);                  
                        break;
                    }
                    _allChances-=_tasks[i].chance;
                }
            }
        //}
        fooList();
    }
    window.gm.printOutput(msg,'#choice');
};
//build the map and other data; if the dng is already initilized and has the correct version, the actual data is returned
window.gm.build_DngHC=function() {
    const _m=[
        'D2--E2  F2--G2--H2--I2--J2--K2--L2',
        '|       |                       | ',
        'D3--E3--F3  G3  H3  I3--J3  K3  L3',
        '    |       |   |   |       |     ',
        'D4--E4  F4--G4--H4--I4  J4--K4--L4'];
        let grid =[
            {room:'G3', dirs:[{dir:'G4',exp:0}]},
            {room:'H3', dirs:[{dir:'H4',exp:0}]             ,anno:['S']},
            {room:'I3', dirs:[{dir:'I4'},{dir:'J3',exp:0}]},
            {room:'J3', dirs:[{dir:'I3',exp:0}]},
            {room:'F4', dirs:[{dir:'G4',exp:0}]},
            {room:'G4', dirs:[{dir:'F4',exp:0},{dir:'H4',exp:0}]},
            {room:'H4', dirs:[{dir:'H3',exp:0},{dir:'G4',exp:0},{dir:'I4',exp:0}]},
            {room:'I4', dirs:[{dir:'H4',exp:0},{dir:'I3',exp:0}]}
            ];
    let data,map={grid:grid,width:14,height:8,legend:'S=Start  B=Boss'}
    var s = window.story.state;    
    const version=1;                            // <== increment this if you change anything below
    if(s.DngHC && s.DngHC.version===version) {
        data=s.DngHC;
    } else {
        data=s.DngHC,data.version=version;
        data.tmp={tickPass:'', tier:0};
        data.tmp.evtLeave = { //events on tile-leave
            H3_H4: [{id:"wolf",type:'encounter',instance:"Ruff",tick:window.gm.getTime(),state:0,chance:100 },
                    {id:"Trent",type:'encounter',instance:"Trent",tick:window.gm.getTime(),state:0,chance:100 }],
            H4_I4: null
        }
        data.tmp.evtEnter = { //events on tile-enter
            H4: {gas:{tick:window.gm.getTime(),state:0 }},
        }
        data.tmp.doors = { //doors
            G4:{F4:{tick:'',state:0,token:1,tier:3 }}
        }
        data.tmp.evtSpawn = { //respawn evts 
            DngHC_I4: {chest:{tick:window.gm.getTime(),state:0, loot:[{id:"Money",count:30}]},
                        mushroom:{tick:window.gm.getTime(),state:0,loot:"BrownMushroom" }}
            ,DngHC_K4: {mushroom:{tick:window.gm.getTime(),state:0,loot:"ViolettMushroom" }}
            ,DngHC_F5: {mushroom:{tick:window.gm.getTime(),state:0,loot:"ViolettMushroom" }}
            ,DngHC_G6: {chest:{tick:window.gm.getTime(),state:0,loot:[{id:"Money",count:30}]}}
        }
        data.tmp.mobs = [ //wandering mobs pos=current tile
            //{id:"HornettI4",mob:"hornett",pos:"I4",path:["I4","H4","I3"],state:0,tick:'',aggro:0}
          ]
        data.task = {},data.rolledTask=[]; //active task
        data.tasks = { //task list  tick=timestamp last update  cnt=Number of finished task  min=minimum tierlevel   start=timestamp start
            bringIron:{tick:'',done:0,cnt:0,min:1}
            ,bringSilver:{tick:'',done:0,cnt:0,min:3}
            ,bringGold:{tick:'',done:0,cnt:0,min:5}
            ,bringMoney:{tick:'',done:0,cnt:0,min:0}
            ,lootChest:{tick:'',done:0,cnt:0,min:3}
            ,findCursed:{tick:'',done:0,cnt:0,min:3}
            ,getEarsPierced:{tick:'',done:0,cnt:0,min:5}
            // open mysterious chests
            //,{id:'getTattoed',tick:'',done:0,cnt:0,min:8}
            ,getVagina:{tick:'',done:0,cnt:0,min:5}
            //,{id:'getBreast',tick:'',done:0,cnt:0,min:4}
            //,{id:'getPregnant',tick:'',done:0,cnt:0,min:7}
            //,{id:'walkNude',tick:'',done:0,cnt:0,min:4}
            //,{id:'walkNude',tick:'',done:0,cnt:0,min:4}
            //,{id:'maidoutfit',tick:'',done:0,cnt:0,min:6}
            //,{id:'ponysuit',tick:'',done:0,cnt:0,min:7}
            //,{id:'bitchsuit',tick:'',done:0,cnt:0,min:9}
        };
    }
    return({map:map,data:data});
};