"use strict";

/*bunch of combat encounters are defined here */
window.gm = window.gm || {};
window.gm.encounters = window.gm.encounters || {};
window.gm.encounters._setup= function(params){
    let _params=params||{}
    _params.amount=(params&&params.amount)?params.amount:1, _params.location=(params&&params.location)?params.location:window.passage.name;
    _params.type =(params&&params.type)?params.type:0, _params.levelUp=(params&&params.levelUp)?params.levelUp:0;
    _params.noStart = (params&&params.noStart)?params.noStart:false,_params.noFlee =(params&&params.noFlee)?params.noFlee:false;
    window.gm.Encounter = new Encounter();
    window.gm.Encounter.enableFlee=!_params.noFlee;
    window.gm.Encounter.Location = _params.location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(window.gm.Encounter.Location);
    return(_params)
};
//params = {location:window.passage.name, amount:1};
//params={[{amount:1,type:"Wolf",sub:"AlphaWolf", location:"cave", levelUp:3}]} but how to assign submit/defeat??
window.gm.encounters.mole = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Mole(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    window.gm.Encounter.onSubmit = function() {
        return('What will now happen to you?</br>'+ window.gm.printPassageLink('Next','Mole Submit'));
    }
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.leech = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Leech(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
        if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.slime = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Slime(_params.type); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.slug = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Slug(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.fungus = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Fungus(_params.type); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.slugLeech = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Slug(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
            x = window.gm.Mobs.Leech(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.succubus = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Succubus(_params.type); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.mechanicguy = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Mechanic(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.hawk = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Hawk(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.hornett = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Hornett(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.hornetthive = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=2;i>0;i-=1) {
            let x;
            if(i===2){  //spawns always hive and a hornett
                x = window.gm.Mobs.HornettHive(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            } else { x = window.gm.Mobs.Hornett(); x.scaleLevel(window.gm.player.level+_params.levelUp);}
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.pillRoller = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.PillRoller(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.huntress = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Huntress(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.lizan = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Lizan(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.naga = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.naga(_params.type); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
/*------------------------*/
window.gm.encounters.wolf = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x;
            x = window.gm.Mobs.Wolf(_params.type); x.scaleLevel(window.gm.player.level+_params.levelUp);
            if(_.random(1,100)>50) {
                window.gm.MutationsLib.swapGender(x,window.storage.constructors["VulvaHuman"]);
            } 
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('You cannot fight anymore and surrender to the beast.</br>'+ window.gm.printPassageLink('Next','WolfSubmit'));
    }
    window.gm.Encounter.onVictory = function() {
        window.story.state.tmp.args=[(function() { window.gm.sex.wolfOnPlayer({state:0, battleResult:'victory'});})];
        return('Intimitated, the wolf rolls on its back, whimpering submissively and exposing its throat.</br>'+this.fetchLoot()+'</br>'+ window.gm.printPassageLink('Next','GenericPassage'));
        //return('Intimitated, the wolf rolls on its back, whimpering submissively and exposing its throat.</br>'+this.fetchLoot()+'</br>'+ window.gm.printPassageLink('Next','WolfVictory'));
    }
    /*window.gm.Encounter.sceneDone=false; //attach flag to Encounter-Instance;
    window.gm.Encounter.onMoveSelect = function() {
        let s=window.story.state;
        let result = {OK:false, msg:''};
        if(window.gm.Encounter.sceneDone===false && s.combat.turnCount===3) {
            result.OK=window.gm.Encounter.sceneDone=true;
            result.msg = 'Wolf growls at you.</br>'+ window.gm.printPassageLink('Next','WolffightIntermezzo');
        } 
        return(result);
    }*/
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.lapine = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Lapine(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('That bunny literally kicked your ass.</br>'+ window.gm.printPassageLink('Next','LapineDefeat'));
    }
    window.gm.Encounter.onVictory = function() {
        return('The bunny surrenders.</br>'+this.fetchLoot()+'</br>'+ window.gm.printPassageLink('Next','LapineVictory'));
    }
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.anthrocat = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.AnthroCat(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('Raked by a cat....</br>'+ window.gm.printPassageLink('Next','LapineDefeat'));
    }
    window.gm.Encounter.onVictory = function() {
        return('The cat surrenders.</br>'+this.fetchLoot()+'</br>'+ window.gm.printPassageLink('Next','LapineVictory'));
    }
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
window.gm.encounters.dryad = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=_params.amount;i>0;i-=1) {
            let x = window.gm.Mobs.Dryad(); x.scaleLevel(window.gm.player.level+_params.levelUp);
            x.name+='#'+i;mobs.push(x);
        }
        return(mobs);});
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('You cannot fight anymore and surrender to the strange woman.</br>'+ window.gm.printPassageLink('Next','DryadSubmit'));
    }
    window.gm.Encounter.onVictory = function() {
        return('The dryad has run out of energy.</br>'+this.fetchLoot()+'</br>'+ window.gm.printPassageLink('Next','DryadVictory'));
    }
    if(!_params.noStart) window.gm.Encounter.initCombat();
}
/////////////////////////////////////////////////////////////
//special encounter
window.gm.encounters.Carlia = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let x = window.story.state.Carlia;
        x.Stats.increment("health",9999); x.Stats.increment("energy",9999);x.Stats.increment("will",9999);
        return([x]);});
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('You surrender to the monster-girl.</br>'+ window.gm.printPassageLink('Next','CarliaSubmit'));
    }
    window.gm.Encounter.onVictory = function() {
        return('Carlia doesnt want to fight anymore.</br>'+ window.gm.printPassageLink('Next','CarliaVictory'));
    }
    window.gm.Encounter.sceneDone=0; //attach flag to Encounter-Instance;
    window.gm.Encounter.onMoveSelect = function() {
        let s=window.story.state;
        let result = {OK:false, msg:''};
        if(window.gm.Encounter.sceneDone===0 && s.combat.turnCount>=4) {
            result.OK=window.gm.Encounter.sceneDone=100;
            window.gm.Encounter.endCombat();
            result.msg = window.gm.printPassageLink('Next','CarliaMakeDeal');
        } 
        return(result);
    }
    if(noStart===false) window.gm.Encounter.initCombat();
}
window.gm.encounters.Trent = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let x = window.story.state.Trent; 
        x.Stats.increment("health",9999); x.Stats.increment("energy",9999);x.Stats.increment("will",9999); 
        return([x]);});
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('You cannot fight anymore and surrender to the beast-man.</br>'+ window.gm.printPassageLink('Next','TrentSubmit'));
    }
    window.gm.Encounter.onVictory = function() {
        return('It was barely an even fight but you showed this horsy its place.</br>'+ window.gm.printPassageLink('Next','TrentVictory'));
    }
    if(noStart===false) window.gm.Encounter.initCombat();
}
window.gm.encounters.Ruff = function(params) {
    let _params=window.gm.encounters._setup(params);
    window.gm.Encounter.EnemyFunc = (function() { 
        let x = window.story.state.Ruff; 
        x.Stats.increment("health",9999); x.Stats.increment("energy",9999);x.Stats.increment("will",9999); 
        return([x]);});
    /*window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('You cannot fight anymore and surrender to the beast.</br>'+ window.gm.printPassageLink('Next','RuffSubmit')); //TODO !!
    }
    window.gm.Encounter.onVictory = function() {
        return('you dominated him.</br>'+ window.gm.printPassageLink('Next','RuffVictory'));
    }*/
    if(!_params.noStart) window.gm.Encounter.initCombat();
}