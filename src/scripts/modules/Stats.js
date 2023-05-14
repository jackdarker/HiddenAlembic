"use strict";
//this is special stat used together with Relation-collection
//person is used as id instead of stat-name
class stRelation extends Stat {
    static setup(context, base,max,person){    //todo Max-Limit
        let _stat = new stRelation();
        let _n = _stat.data;
        _n.id=person+"_Max",_n.base=max, _n.value=max,_n.limits=[{max:999,min:-999}];
        context.addItem(_stat);
        _stat = new stRelation();
        _n = _stat.data;
        _n.id=person+"_Min",_n.base=0, _n.value=0,_n.limits=[{max:999,min:-999}];
        context.addItem(_stat);
        _stat = new stRelation();
        _n = _stat.data;
        _n.id=person,_n.base=base, _n.value=base,_n.limits=[{max:person+"_Max",min:person+"_Min"}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){   super();  }
    toJSON(){return window.storage.Generic_toJSON("stRelation", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stRelation, value.data);};
    formatMsgStatChange(attr,_new,_old){
        if((_new-_old)>0){
            return('<statup>Your relation to '+attr.id+" improved by "+(_new-_old).toFixed(1).toString()+"</statup>");
        } else if ((_new-_old)<0){
            return('<statdown>Your relation to '+attr.id+" worsend by "+(_new-_old).toFixed(1).toString()+"</statdown>");
        } else {
            return('Your relation to '+attr.id+" wasnt affected at all by your behaviour.</br>");
        }
    };
}
//generic class for resistance to damage like blunt, fire, poison,...
// Resistance is modified by effects (applied by equipment/perks/items) and stats
// 0 = no bonus resistance; -20 = 20% weaker ; capped at +-100% ?
class stResistance extends Stat {
    static setup(context, base,kind){   
        let _stat = new stResistance();
        let _n = _stat.data;
        _n.id="rst_"+kind,_n.base=base, _n.value=base,_n.limits=[{max:100,min:-100}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){   super();  }
    toJSON(){return window.storage.Generic_toJSON("stResistance", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stResistance, value.data);};
}
//generic class for armor; 
class stArmor extends Stat {
    static setup(context, base,name){   
        let _stat = new stArmor();
        let _n = _stat.data;
        _n.id="arm_"+name,_n.base=base, _n.value=base,_n.limits=[{max:999999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){   super();  }
    toJSON(){return window.storage.Generic_toJSON("stArmor", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stArmor, value.data);};
}
//TODO stBlock  //chances to block physical damage; cant block heavy attacks; after block, chance are halved
//TODO stParry  //chance to parry physical attacks
class stHealth extends Stat {
    static setup(context, base,max){
        /*stHealthMax.setup(context,max);
        stHealthRegen.setup(context,0,100);
        var _stat = new stHealth();
        var _n = _stat.data;
        _n.id='health',_n.base=base, _n.value=base,_n.limits=[{max:'healthMax',min:0}];
        context.addItem(_stat);
        _stat.Calc();*/
        let stats=Stat.setupStatWithLimitAndRegen('health',{base:base,regen:0,max:max});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){super();}
    toJSON(){return window.storage.Generic_toJSON("stHealth", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stHealth, value.data);};
}
class stHealthRegen extends Stat {
    static setup(context, base,max){
        var _stat = new stHealthRegen();
        var _n = _stat.data;
        _n.id='healthRegen',_n.base=base, _n.value=base,_n.limits=[{max:max,min:-1*max}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){ super();}
    toJSON(){return window.storage.Generic_toJSON("stHealthRegen", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stHealthRegen, value.data);};
}
class stEnergy extends Stat { //physical reserves
    static setup(context, base,max){
        let stats=Stat.setupStatWithLimitAndRegen('energy',{base:base,regen:10,max:max});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){ super();   }
    toJSON(){return window.storage.Generic_toJSON("stEnergy", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stEnergy, value.data);};
}
class stWill extends Stat { //mental reserves
    static setup(context, base,max){
        let stats=Stat.setupStatWithLimitAndRegen('will',{base:base,regen:10,max:max});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){ super();   }
    toJSON(){return window.storage.Generic_toJSON("stWill", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stWill, value.data);};
}
class stPoise extends Stat { //stability in combat
    static setup(context, base,max){
        let stats=Stat.setupStatWithLimitAndRegen('poise',{base:base,regen:4,max:max});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){ super();   }
    toJSON(){return window.storage.Generic_toJSON("stPoise", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stPoise, value.data);};
}
class stSatiation extends Stat { //low value==starving    
    static setup(context, base,max){
        let stats=Stat.setupStatWithLimitAndRegen('satiation',{base:base,regen:-2,max:max});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){ super();   }
    toJSON(){return window.storage.Generic_toJSON("stSatiation", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stSatiation, value.data);};
}
class stArousal extends Stat{
    static setup(context, base,max){
        let stats=Stat.setupStatWithLimitAndRegen('arousal',{base:base,regen:-1,max:max,min:0});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){
        super();
        
    }
    toJSON(){return window.storage.Generic_toJSON("stArousal", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stArousal, value.data);};
}
////    Base-Stats ///////////////////////////////////////////////
class stAgility extends Stat { // core attribute
    static setup(context, base,max){ 
        var _stat = new stAgility();
        var _n = _stat.data;
        _n.id='agility',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){
        super();
        
    }
    toJSON(){return window.storage.Generic_toJSON("stAgility", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stAgility, value.data);};
    updateModifier(){
        this.parent.addModifier('energyMax',{id:'agility', bonus:this.parent.get('agility').value*1.5});
    };
}
class stPerception extends Stat { // core attribute
    static setup(context, base,max){ 
        var _stat = new stPerception();
        var _n = _stat.data;
        _n.id='perception',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){
        super();
        
    }
    toJSON(){return window.storage.Generic_toJSON("stPerception", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stPerception, value.data);};
    updateModifier(){
        this.parent.addModifier('willMax',{id:'perception', bonus:this.parent.get('perception').value*1.5});
    };
}
class stLuck extends Stat { // core attribute
    static setup(context, base,max){ 
        var _stat = new stLuck();
        var _n = _stat.data;
        _n.id='luck',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){
        super();
        
    }
    toJSON(){return window.storage.Generic_toJSON("stLuck", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stLuck, value.data);};
    updateModifier(){
    };
}
class stCharisma extends Stat { // core attribute
    static setup(context, base,max){ 
        var _stat = new stCharisma();
        var _n = _stat.data;
        _n.id='charisma',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){
        super();
        
    }
    toJSON(){return window.storage.Generic_toJSON("stCharisma", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stCharisma, value.data);};
    updateModifier(){
        this.parent.addModifier('energyMax',{id:'charisma', bonus:this.parent.get('charisma').value*1.5});
    };
}
class stIntelligence extends Stat { // core attribute
    static setup(context, base,max){ 
        var _stat = new stIntelligence();
        var _n = _stat.data;
        _n.id='intelligence',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){        super(); }
    toJSON(){return window.storage.Generic_toJSON("stIntelligence", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stIntelligence, value.data);};
    updateModifier(){
        this.parent.addModifier('willMax',{id:'intelligence', bonus:this.parent.get('intelligence').value*1.5});
    };
}
class stStrength extends Stat { // core attribute
    static setup(context, base,max){ 
        var _stat = new stStrength();
        var _n = _stat.data;
        _n.id='strength',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){        super();}
    toJSON(){return window.storage.Generic_toJSON("stStrength", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stStrength, value.data);};
    updateModifier(){
        this.parent.addModifier('healthMax',{id:'strength', bonus:this.parent.get('strength').value*1.5});
        //this.parent.addModifier('pAttack',{id:'strength', bonus:Math.floor(this.parent.get('strength').value/4)});
    };
}
class stEndurance extends Stat { // core attribute
    static setup(context, base,max){ 
        var _stat = new stEndurance();
        var _n = _stat.data;
        _n.id='endurance',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor(){        super();}
    toJSON(){return window.storage.Generic_toJSON("stEndurance", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stEndurance, value.data);};
    updateModifier(){
        this.parent.addModifier('healthMax',{id:'endurance', bonus:this.parent.get('endurance').value*1.5});
        //this.parent.addModifier('pDefense',{id:'strength', bonus:this.parent.get('endurance').value%4});
    };
}
////////////////////////////////////////////////////////////////////////////////
class stCorruption extends Stat {
    static setup(context, base,max){
        /*stCorruptionMax.setup(context,max);
        var _stat = new stCorruption();
        var _n = _stat.data;
        _n.id='corruption', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:'corruptionMax',min:0}];
        context.addItem(_stat);
        _stat.Calc();*/
        let stats=Stat.setupStatWithLimitAndRegen('corruption',{base:base,regen:0,max:max});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){super();}
    toJSON(){return window.storage.Generic_toJSON("stCorruption", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stCorruption, value.data);};
}
class stSavageness extends Stat {
    static setup(context, base,max){
        /*stSavagenessMax.setup(context,max);
        stSavagenessRegen.setup(context,-1,100);
        var _stat = new stSavageness();
        var _n = _stat.data;
        _n.id='savageness', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:'savagenessMax',min:0}];
        context.addItem(_stat);
        _stat.Calc();*/
        let stats=Stat.setupStatWithLimitAndRegen('savageness',{base:base,regen:0,max:max,min:0});
        stats.forEach(x=>{context.addItem(x);}),stats.forEach(x=>{x.Calc();})
    }
    constructor(){super();}
    toJSON(){return window.storage.Generic_toJSON("stSavageness", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stSavageness, value.data);};
}
//Fetish
// value >0 means character likes that fetish or <0 hates it  
class stFetish extends Stat {
    static setup(context, base,max,name){ 
        let _stat = new stFetish();
        let _n = _stat.data;
        _n.hidden=4,_n.id=name+"_Max",_n.base=max, _n.value=max,_n.limits=[{max:100,min:-100}];
        context.addItem(_stat);
        _stat = new stFetish();
        _n = _stat.data;
        _n.hidden=4,_n.id=name+"_Min",_n.base=0, _n.value=0,_n.limits=[{max:100,min:-100}];
        context.addItem(_stat);
        _stat = new stFetish();
        _n = _stat.data;
        _n.hidden=4,_n.id=name,_n.base=base, _n.value=base,_n.limits=[{max:name+"_Max",min:name+"_Min"}];
        context.addItem(_stat);
        _stat.Calc();
    }
    static listFetish(){
        let list = [
        'ftZoophil',
        'ftDominant',
        'ftSubmissive',
        'ftAnalLover',
        'ftAnalSlut',
        'ftVaginalLover',//using someones cunt
        'ftVaginalSlut',//getting your cunt used
        'ftOralLover',
        'ftOralSlut',
        'ftCockLover',//
        'ftCockSlut', //controlled by your dick
        'ftSizeQueen',//when penetrator is much larger then penetrated
        'ftCumSlurper',
        'ftBreastLover',
        'ftEggSlut',
        'ftMasochist',
        'ftSadist',
        'ftBondage',
        'ftExhibition'];
        return(list);  
        //ftSizeKing    when penetrator is much smaller ??
        //horseCockAddled
    }
    constructor(){   super();  }
    toJSON(){return window.storage.Generic_toJSON("stFetish", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(stFetish, value.data);};
}
//effects
class effEnergized extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effEnergized.name, this.data.duration = 120,this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effEnergized", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effEnergized, value.data);};
     get desc(){return(effEnergized.name);}

    onTimeChange(time){
        //+ 10Energy per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.data.duration-= delta;
        if(this.data.duration<0){
            delta = delta+this.data.duration; // if delta is 20 but remaining duration is only 5, delta should be capped to 5
            this.data.duration =0;
        }
        //Effects impact Stats:  Effect->Effects->Character->Stats    is there a prettier wy?
        this.parent.parent.Stats.increment('energy',10*delta/60);
        if(this.data.duration<=0){ //remove yourself
            return(function(me){
                return function(Effects){ Effects.removeItem(me.data.id);}}(this));
        }
        return(null);
    }
    onApply(){
        //+10 energy
        this.data.duration = 120;
        this.data.time = window.gm.getTime();
        this.parent.parent.Stats.increment('energy',10);
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            this.onApply(); //refresh 
            return(true);
        }
    }
}
class effNotTired extends Effect {
    constructor(){
        super();
        this.data.id = effNotTired.name,this.data.name="not tired" , this.data.duration = 120, this.data.hidden=4;
    }
    toJSON(){return window.storage.Generic_toJSON("effNotTired", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effNotTired, value.data);};
    get desc(){return(effNotTired.name);}

    onTimeChange(time){
        //Tired after xxh
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0){
        return(function(me){
            return (function(Effects){ 
            var newdata =new effTired(); Effects.replace(me.data.id,newdata);});
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 120;// todo 600;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            this.onApply(); //refresh
            return(true);
        }
    }
}
class effTired extends Effect {
    constructor(){
        super();
        this.data.id = effTired.name, this.data.name="tired", this.data.duration = 0, this.data.hidden=4;
    }
    toJSON(){return window.storage.Generic_toJSON("effTired", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effTired, value.data);};
    get desc(){return(effTired.name);}

    onTimeChange(time){  
        //duration not used -> will never expire unless replaced
        var delta = window.gm.getTime()-this.data.time;
        //-10 max energy after xxh, but only up to 3 times
        if(delta>60*12) this.parent.parent.Stats.addModifier('energyMax',{id:'energyMax:Tired', bonus:-30});
        else if(delta>60*8) this.parent.parent.Stats.addModifier('energyMax',{id:'energyMax:Tired', bonus:-20});
        else if(delta>60*4) this.parent.parent.Stats.addModifier('energyMax',{id:'energyMax:Tired', bonus:-10});
    }
    onApply(){
        this.data.time = window.gm.getTime();
    }
    onRemove(){
        this.parent.parent.Stats.removeModifier('energyMax',{id:'energyMax:Tired'});
    }
    merge(neweffect){
        if(neweffect.name==='effNotTired'){
            return(function(me){
                return (function(Effects){ 
                var newdata =new effNotTired(); Effects.replace(me.data.id,newdata);});
            }(this));
        }
        if(neweffect.name===this.data.name){
            //just ignore
            return(true);
        }
    }
}
class effHunger extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effHunger.name, this.data.duration = 60,this.data.hidden=4;
    }
    toJSON(){return window.storage.Generic_toJSON("effHunger", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effHunger, value.data);};
    get desc(){return(this.data.name);}
    onTimeChange(time){
        //- x Hunger per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        if((this.data.duration-delta)<=0){ //trigger every ...
            this.data.time = time;
            this.data.duration =60;
        } else delta=0;
        this.parent.parent.Stats.increment('satiation',this.parent.parent.Stats.get("satiationRegen").value*delta/60);
        return(null);
    }
    onApply(){
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            this.onApply(); //refresh 
            return(true);
        }
    }
}
class effSanity extends effHunger {
    constructor(){
        super();this.data.id = this.data.name= effSanity.name, this.data.duration = 60,this.data.hidden=4;
    }
    toJSON(){return window.storage.Generic_toJSON("effSanity", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effSanity, value.data);};
    onTimeChange(time){
        // x Sanity per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        if((this.data.duration-delta)<=0){ //trigger every ...
            this.data.time = time;
            this.data.duration =60;
        } else delta=0;
        this.parent.parent.Stats.increment('savageness',this.parent.parent.Stats.get("savagenessRegen").value*delta/60);
        return(null);
    }
}
class effLibido extends effHunger {
    constructor(){
        super();this.data.id = this.data.name= effLibido.name, this.data.duration = 60,this.data.hidden=4;
    }
    toJSON(){return window.storage.Generic_toJSON("effLibido", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effLibido, value.data);};
    onTimeChange(time){
        // x arousal per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        if((this.data.duration-delta)<=0){ //trigger every ...
            this.data.time = time;
            this.data.duration =60;
        } else delta=0;
        this.parent.parent.Stats.increment('arousal',this.parent.parent.Stats.get("arousalRegen").value*delta/60);
        return(null);
    }
}
class effCombatRecovery extends Effect {
    constructor(){
        super();
        this.data.id = effCombatRecovery.name, this.data.name="recover", this.data.duration = 0, this.data.hidden=4;
        this.eRecover=this.wRecover =10;
    }
    toJSON(){return window.storage.Generic_toJSON("effCombatRecovery", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effCombatRecovery, value.data);};
    get desc(){return(effCombatRecovery.name);}

    onApply(){
        this.data.time = window.gm.getTime();
    }
    onCombatStart(){
        this.parent.parent.Stats.increment("poise",9999); //TODO reset on start??
        return({OK:false,msg:''});
    }
    onTurnStart(){ //this is no combat effect but ticked in combat; dont remmove after combatend !
        this.parent.parent.Stats.increment("poise",this.parent.parent.Stats.get('poiseRegen').value);
        this.parent.parent.Stats.increment("energy",this.parent.parent.Stats.get('energyRegen').value);
        this.parent.parent.Stats.increment("will",this.parent.parent.Stats.get('willRegen').value);
        this.parent.parent.Stats.increment("arousal",this.parent.parent.Stats.get('arousalRegen').value);
        this.parent.parent.Stats.increment("health",this.parent.parent.Stats.get('healthRegen').value);
        return({OK:true,msg:''});
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){return(true);}
    }
}
class effEnergyDrain extends Effect {
    constructor(){
        super();
        this.data.id = effEnergyDrain.name, this.data.name="energy drained", this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effEnergyDrain", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effEnergyDrain, value.data);};
    get desc(){return(effEnergyDrain.name);}

    onTimeChange(time){  
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.parent.parent.Stats.increment('energy',-3*delta/60);
    }
    onApply(){
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            return(true);
        }
    }
}
//////////////   Mutations ////////////////////////
class effMutateHorse extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effMutateHorse.name, this.data.hidden=0;
        this.data.duration = 60,this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effMutateHorse", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effMutateHorse, value.data);};
    get desc(){return(this.data.name);}
    onTimeChange(time){
        //after some time you mutate a bit
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0){
            this.data.duration = 60;
            return(function(me){
                return (function(Effects){ 
                    me.data.cycles-=1;
                    me.data.magnitude=me.parent.parent.Stats.get("savageness").value; //=(x+Max)/2 ?? 
                    me.__mutate();
                    if(me.data.cycles<=0){Effects.removeItem(me.data.id);}
                });
                }(this));
            }
        return(null);
    }
    onApply(){
        this.data.duration = 60,this.data.cycles = 3;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){//dont refresh
            return(true);
        }
    }
    __mutate(){
        window.gm.MutationsLib.mutateHorse(this.parent.parent,this.data.magnitude);
        //todo non-PC can be mutated (if receives timechange !) but the scene will assume its player?!
    }
}
class effMutateHuman extends effMutateHorse {
    constructor(){
        super();
        this.data.id = this.data.name= effMutateHuman.name, this.data.hidden=0;
        this.data.duration = 60,this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON(){return window.storage.Generic_toJSON("effMutateHuman", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effMutateHuman, value.data);};
    __mutate(){window.gm.MutationsLib.mutateHuman(this.parent.parent,this.data.magnitude);}
}
class effMutateCat extends effMutateHorse {
    constructor(){
        super();
        this.data.id = this.data.name= effMutateCat.name, this.data.hidden=0;
        this.data.duration = 60,this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON(){return window.storage.Generic_toJSON("effMutateCat", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effMutateCat, value.data);};
    __mutate(){window.gm.MutationsLib.mutateCat(this.parent.parent,this.data.magnitude);}
}
class effMutateWolf extends effMutateHorse {
    constructor(){
        super();
        this.data.id = this.data.name= effMutateWolf.name, this.data.hidden=0;
        this.data.duration = 60,this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON(){return window.storage.Generic_toJSON("effMutateWolf", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effMutateWolf, value.data);};
    __mutate(){window.gm.MutationsLib.mutateWolf(this.parent.parent,this.data.magnitude);}
}
class effMutateBunny extends effMutateHorse {
    constructor(){
        super();
        this.data.id = this.data.name= effMutateBunny.name;
    }
    toJSON(){return window.storage.Generic_toJSON("effMutateBunny", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effMutateBunny, value.data);};
    __mutate(){ window.gm.MutationsLib.mutateBunny(this.parent.parent,this.data.magnitude); }
}
class effHorsePower extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effHorsePower.name, this.data.hidden=0;
        this.data.duration = 120,this.data.cycles = 1, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effHorsePower", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effHorsePower, value.data);};
    get desc(){return(this.data.name);}

    onTimeChange(time){
        //+ 10Energy per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.data.duration-= delta;
        if(this.data.duration<0){
            delta = delta+this.data.duration; // if delta is 20 but remaining duration is only 5, delta should be capped to 5
            this.data.duration =0;
        }
        this.parent.parent.Stats.increment('energy',10*delta/60);
        this.parent.parent.Stats.increment('health',10*delta/60);
        this.parent.parent.Stats.increment('will',10*delta/60);        
        if(this.data.duration<=0){ 
            this.data.cycles-=1;
            if(this.data.magnitude>=2){
                this.__trgMutation();
            }
            if(this.data.cycles<=0){//remove yourself
                return(function(me){return function(Effects){ 
                    Effects.removeItem(me.data.id);}
                }(this));
            }            
        }
        return(null);
    }
    __trgMutation(){
        let _i = this.parent.findItemSlot(effMutateHorse.name);
        if(_i===-1){ //todo extend if exist?
            this.parent.parent.addEffect(new effMutateHorse(),effMutateHorse.name );
        }
    }
    onApply(){
        this.data.duration = 120;
        this.data.time = window.gm.getTime();
        /*this.parent.parent.Stats.addModifier('rst_blunt',{id:'rst_blunt:Guard', bonus:this.data.weapResist});
        this.parent.parent.Stats.addModifier('rst_slash',{id:'rst_slash:Guard', bonus:this.data.weapResist});
        this.parent.parent.Stats.addModifier('rst_pierce',{id:'rst_pierce:Guard', bonus:this.data.weapResist});*/
    }
    merge(neweffect){
        if(neweffect.id===this.data.id){
            this.onApply(); //refresh 
            this.data.magnitude +=1; //bonus effect triggers only if added multiple times
            return(true);
        }
    }
}
class effLapineSpeed extends effHorsePower{
    constructor(){
        super();
        this.data.id = this.data.name= effLapineSpeed.name;
    }
    toJSON(){return window.storage.Generic_toJSON("effLapineSpeed", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effLapineSpeed, value.data);};
    get desc(){return(effLapineSpeed.name);}
    __trgMutation(){
        let _i = this.parent.findItemSlot(effMutateBunny.name);
        if(_i===-1){ //todo extend if exist?
            this.parent.parent.addEffect(new effMutateBunny(),effMutateBunny.name );
        }
    }
}
class effGrowBreast extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effGrowBreast.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON(){return window.storage.Generic_toJSON("effGrowBreast", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effGrowBreast, value.data);};
    get desc(){return(effGrowBreast.name);}

    onTimeChange(time){
        //after some time you mutate a bit
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0){
            this.data.cycles-=1;
            return(function(me){
                return (function(Effects){ 
                    if(me.data.cycles<=0){ 
                        Effects.removeItem(me.data.id);
                        window.gm.pushDeferredEvent("MutateBreastEnd");
                    }
                    else window.gm.MutationsLib.growBreast(this.parent.parent);
                });
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            this.data.cycles+= neweffect.data.cycles; //prolong the effect
            return(true);
        }
    }
}
class effGrowVulva extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effGrowVulva.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON(){return window.storage.Generic_toJSON("effGrowVulva", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effGrowVulva, value.data);};
    get desc(){return(effGrowVulva.name);}

    onTimeChange(time){
        //after some time you mutate a bit
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0){
            this.data.cycles-=1;
            return(function(me){
                return (function(Effects){ 
                    if(me.data.cycles<=0){ 
                        Effects.removeItem(me.data.id);
                        window.gm.pushDeferredEvent("MutateVulvaEnd");
                    }
                    else window.gm.MutationsLib.growVulva(this.parent.parent);
                });
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            this.data.cycles+= neweffect.data.cycles; //prolong the effect
            return(true);
        }
    }
}
class effPillEffect extends Effect {
    static factory(type){
        let eff = new effPillEffect();
        eff.type = type;
        eff.data.id=eff.data.name='eff'+type;
        return(eff);
    }
    constructor(){
        super();
        this.data.id = this.data.name= effPillEffect.name, this.data.hidden=0;
        this.data.duration = 120,this.data.cycles = 1, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effPillEffect", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effPillEffect, value.data);};
    get desc(){return(this.data.name);}

    onTimeChange(time){
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.data.duration-= delta;
        if(this.data.duration<0){
            delta = delta+this.data.duration; // if delta is 20 but remaining duration is only 5, delta should be capped to 5
            this.data.duration =0;
        }
        /*this.parent.parent.Stats.increment('energy',10*delta/60);
        this.parent.parent.Stats.increment('health',10*delta/60);
        this.parent.parent.Stats.increment('will',10*delta/60);    */    
        if(this.data.duration<=0){ 
            this.data.cycles-=1;
            if(this.data.magnitude>=2){
                this.__trgMutation();
            }
            if(this.data.cycles<=0){//remove yourself
                return(function(me){return function(Effects){ 
                    Effects.removeItem(me.data.id);}
                }(this));
            }            
        }
        return(null);
    }
    __trgMutation(){
        let _i = this.parent.findItemSlot(effMutateHorse.name);
        if(_i===-1){ //todo extend if exist?
            this.parent.parent.addEffect(new effMutateHorse(),effMutateHorse.name );
        }
    }
    onApply(){
        this.data.duration = 120;
        this.data.time = window.gm.getTime();
        if(this.data.id='effBrownPill'){
            this.parent.parent.Stats.addModifier('arm_poison',{id:'arm_poison:'+this.data.name, bonus:25});
        }else if(this.data.id='effRedPill'){
            this.parent.parent.Stats.addModifier('rst_blunt',{id:'rst_blunt:'+this.data.name, bonus:25});
            this.parent.parent.Stats.addModifier('rst_slash',{id:'rst_slash:'+this.data.name, bonus:25});
            this.parent.parent.Stats.addModifier('rst_pierce',{id:'rst_pierce:'+this.data.name, bonus:25});
        }
    }
    onRemove(){
        if(this.data.id='effBrownPill'){
            this.parent.parent.Stats.addModifier('arm_poison',{id:'arm_poison:'+this.data.name, bonus:25});
        }else if(this.data.id='effRedPill'){
            this.parent.parent.Stats.addModifier('rst_blunt',{id:'rst_blunt:'+this.data.name, bonus:25});
            this.parent.parent.Stats.addModifier('rst_slash',{id:'rst_slash:'+this.data.name, bonus:25});
            this.parent.parent.Stats.addModifier('rst_pierce',{id:'rst_pierce:'+this.data.name, bonus:25});
        }
    }
    merge(neweffect){
        if(neweffect.id===this.data.id){
            this.onApply(); //refresh 
            this.data.magnitude +=1; //bonus effect triggers only if added multiple times
            return(true);
        }
    }
}
/**
 * todo 
 * on a female the mark indicates that you can bear soulgems; the stronger the mark, the better the gem but it will take longer and absorb more
 * with each birth, the mark grows stronger ?
 * while pampering the gem, it sucks up your arcana if you dont have sex
 * chance to go into heat if you dont have a gem
 * 
 * on a male the mark encourage cum stud fetish
 * makes host more submissive to females? shrinks cock if not used?
 * there is a slight chance to add lewd mark to fucked female?
 * chance to go into rut
 * 
 * if a male with lm fucks female with lm&gem, the gem will vanish and both gain a level; no effect otherwise
 *
 * @class effLewdMark
 * @extends {Effect}
 */
class effLewdMark extends Effect {
    constructor(){
        super();
        this.data.id = effLewdMark.name, this.data.name='Lewdmark',this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effLewdMark", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effLewdMark, value.data);};
    get desc(){return(effLewdMark.name);}
    onTimeChange(time){
        
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
        window.gm.know(window.gm.FKnow.LewdMark);
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            return(true);
        }
    }
}
class effInHeat extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effInHeat.name, this.data.duration = 60, this.data.hidden=3;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effInHeat", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effInHeat, value.data);};
    get desc(){return(effInHeat.name);}
    //todo if female, you might go into heat (only when not carrying child/soulgem ?) 
    //more arousal damage by studs
    //succesful impregation or time might end heat
}
class effInRut extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effInRut.name, this.data.duration = 60, this.data.hidden=3;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effInRut", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effInRut, value.data);};
    get desc(){return(effInRut.name);}
    //todo if male, you might go into rut  
    //more arousal damage by sluts
    //multiple succesful impregations/balldrain or time might end rut
}

/**
 * #todo
 * walking around makes you horny faster and stretches your bum
 * slowly increases anal sex liking
 * your bum is secured against infestation unless its a holePlug
 * 
 * @class effButtPlugged
 * @extends {Effect}
 */
class effButtPlugged extends Effect {
    static get cycleDur(){return(60);}
    constructor(){
        super();
        this.data.id = this.data.name= effButtPlugged.name, this.data.duration = effButtPlugged.cycleDur, this.data.hidden=3;
        this.data.cycles = 0, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effButtPlugged", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effButtPlugged, value.data);};
    get desc(){return(effButtPlugged.name);}
    onTimeChange(time){
        let delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;this.data.duration-= delta;
        if(this.data.duration<0){
            delta = delta+this.data.duration;
            this.data.cycles+=1; 
            this.__mutate();
            this.data.duration=effButtPlugged.cycleDur;
        }
        return(null);
    }
    onApply(){
        this.data.duration = effButtPlugged.cycleDur;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            return(true);
        }
    }
    __mutate(){
        // todo window.gm.MutationsLib.effMutateButt(this.parent.parent);
    }
}
class effVaginalFertil extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effVaginalFertil.name, this.data.duration = 60, this.data.hidden=3;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON(){return window.storage.Generic_toJSON("effVaginalFertil", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effVaginalFertil, value.data);};
    get desc(){return(effVaginalFertil.name);}
    onTimeChange(time){
        //todo can get pregnant with child,eggs ; natural heat might be triggered
        // if fertility of Vagina is 0, can still bear parasites,soulgem; fertility heat might not trigger 
        return(null);
    }
    onApply(){
        //todo remove infertile,fertileEffect
        this.parent.removeItem(effVaginalPregnant.name);
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){ //no merge
            return(true);
        }
    }
}
class effVaginalPregnant extends Effect {
    constructor(){
        super();
        this.data.id = this.data.name= effVaginalPregnant.name, this.data.duration = 60, this.data.hidden=3;
        this.data.cycles = 3, this.data.magnitude = 1, this.data.type='';
    }
    toJSON(){return window.storage.Generic_toJSON("effVaginalPregnant", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effVaginalPregnant, value.data);};
    get desc(){return(effVaginalPregnant.name);}
    onTimeChange(time){
        //todo be pregnant with child,eggs,parasites,soulgem
        //normal pregnancy will grow over time, might be aborted by medicine
        //soulgem grows over time, consumes arcana or sperm
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0){
            this.data.cycles-=1,this.data.duration = 60;
            window.gm.MutationsLib.vaginaPregnancy(this.parent.parent)
        }
        return(null);
    }
    onApply(){
        //todo remove infertile,fertileEffect
        this.parent.removeItem(effVaginalFertil.name);
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){ //no merge
            return(true);
        }
    }
}

/**
 * if you have womb or anus filled with sperm, this handles impregnation and sperm-decay
 * //todo VaginalParasite
 * @class effSpermDecay
 * @extends {Effect}
 */
class effSpermDecay extends Effect {   
    constructor(){
        super();
        this.data.id = this.data.name= effSpermDecay.name, this.data.duration = 60, this.data.hidden=3;
        this.data.cycles = 1, this.data.magnitude = 2;
    }
    toJSON(){return window.storage.Generic_toJSON("effSpermDecay", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effSpermDecay, value.data);};
    get desc(){return(effSpermDecay.name);}
    onTimeChange(time){
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0){
            this.data.duration = 60;
            this.__decay();
        }
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            return(true);
        }
    }
    __decay(){
        let msg='',char =this.parent.parent;
        let vagina = char.getVagina(), anus = char.getAnus();
        let lewdMark=char.Effects.findEffect(effLewdMark.name)[0];
        let pregnancy=char.Effects.findEffect(effVaginalPregnant.name)[0];
        if(vagina && vagina.data.sperm>0){
            vagina.removeSperm(2); //todo decay depends on looseness, soulgem absorption??
            msg+="You can feel some of the cum from your womb dribble down your leg. "; //todo "into your panties. Cumslut as you are, shoving your fingers down your nethers, you scope up some of it and slurp it into your mouth."Hmm,Taste like wolf" "
            if(pregnancy){
                if(lewdMark){
                    msg+="More of that precious seed is absorbed by that soulgem growing in you.</br>";
                    vagina.removeSperm(2); //todo decay depends on looseness, soulgem absorption??
                } else msg+="But you are pregnant already anyway.</br>"; 
            } 
            if(!pregnancy){
                pregnancy=char.Effects.findEffect(effVaginalFertil.name)[0];
                if(pregnancy){ 
                    //todo random chance according to base-fertility-stat, sperm-fertility, vagina-fertility
                    //race-compatibility between father-mother
                    if(true || _.random(0,100)>75){
                        msg+="Has your last fling got you impregnated?</br>";
                        pregnancy = new effVaginalPregnant();
                        pregnancy.data.type=vagina.data.spermtype;
                        if(lewdMark) pregnancy.data.type='soulgem'; 
                        char.addEffect(pregnancy,effVaginalPregnant.name)
                    } else msg+="Hopefully there is nothing to worry about?</br>";
                }
            }    
            if(vagina.data.sperm>0){
                msg+="There might still be "+window.gm.util.formatNumber(vagina.data.sperm,0)+"ml sperm left.</br>"
            } else msg+="This was possibly the last remains of sperm from your breeding-hole.</br>";
        }
        if(anus && anus.data.sperm>0){
            anus.removeSperm(2);
            msg+="Your butt is lubed up by leaking spunk from your hole. ";
        }
        if(msg!=='' && char===window.gm.player){
            window.gm.pushDeferredEvent("GenericDeffered",[msg]);
        }
    }
}
/////////////// combateffects /////////////////////////
class effHeal extends CombatEffect {
    static factory(amount,duration=0){
        let eff = new effHeal();
        eff.startduration=duration;
        eff.amount=amount;
        return(eff);
    }
    constructor(){
        super();
        this.amount = 5;
        this.data.id = this.data.name= effHeal.name, this.data.startduration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effHeal", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effHeal, value.data);};
    get desc(){return(effHeal.name);}
    onApply(){
        this.data.duration=this.data.startduration;
        this.parent.parent.Stats.increment('health',this.amount);
        this.castMsg=window.gm.util.descFixer(this.parent.parent)('$[Name]$ $[was]$ healed by +'+this.amount+'.');
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //extends
            this.onApply();
            return(true);
        }
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
        else {
            this.parent.parent.Stats.increment('health',this.amount);
            this.castMsg=window.gm.util.descFixer(this.parent.parent)('$[Name]$ recovered +'+this.amount+' health.');
        }
        return({OK:true,msg:''});
    }
}
class effGuard extends CombatEffect {
    static factory(weapResist,eRecover,duration){
        let x = new effGuard();
        x.data.weapResist = weapResist; x.data.eRecover = eRecover;x.data.duration = duration;
        return x;
    }
    constructor(){
        super();
        this.data.id = this.data.name= effGuard.name, this.data.duration = 0, this.data.hidden=0;
        this.data.weapResist = 5; this.data.eRecover=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effGuard", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effGuard, value.data);};
    get desc(){return(effGuard.name);}
    onApply(){
        this.data.duration = 2;
        this.parent.parent.Stats.addModifier('rst_blunt',{id:'rst_blunt:Guard', bonus:this.data.weapResist});
        this.parent.parent.Stats.addModifier('rst_slash',{id:'rst_slash:Guard', bonus:this.data.weapResist});
        this.parent.parent.Stats.addModifier('rst_pierce',{id:'rst_pierce:Guard', bonus:this.data.weapResist});
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            return(true);
        }
    }
    onTurnStart(){
        this.data.duration-=1;
        this.parent.parent.Stats.increment("energy",this.data.eRecover);
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
        return({OK:true,msg:''});
    }
    onRemove(){
        this.parent.parent.Stats.removeModifier('rst_blunt',{id:'rst_blunt:Guard'});
        this.parent.parent.Stats.removeModifier('rst_slash',{id:'rst_slash:Guard'});
        this.parent.parent.Stats.removeModifier('rst_pierce',{id:'rst_pierce:Guard'});
    }
}
class effProtect extends CombatEffect {
    static factory(duration){  //TODO what to protect for, how much?
        let x = new effProtect();
        x.data.duration = duration;
        return x;
    }
    constructor(){
        super();
        this.data.id = this.data.name= effProtect.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effProtect", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effProtect, value.data);};
    get desc(){return(effProtect.name);}
    onApply(){  //effect is handled in combat-sm
        this.data.duration = 2;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){
            return(true);
        }
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
        return({OK:true,msg:''});
    }
    onRemove(){    }
}
class effChangeStance extends CombatEffect {
    static factory(newStanceID){
        let x = new effChangeStance();
        x.data.newStanceID=newStanceID;
        return x;
    }
    constructor(){
        super();
        this.data.id = this.data.name= effChangeStance.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effChangeStance", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effChangeStance, value.data);};
    get desc(){return(this.data.newStanceID);}
    onApply(){
        this.parent.parent.changeStance(new window.gm.StanceLib[this.data.newStanceID]);
    }
    merge(neweffect){
        if(neweffect.name===this.data.name) return(true);
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
        return({OK:true,msg:''});
    }
    onRemove(){
    }
}
/** todo
 * boost will&Energy-generation and arousal-resistance
 */
class effDetermined extends CombatEffect {
    static factory(wRecover,eRecover,teaseResist,duration){
        let x = new effDetermined();
        x.data.teaseResist = teaseResist; x.data.eRecover = eRecover;x.data.wRecover = wRecover;x.data.duration = duration;
        return x;
    }
    constructor(){
        super();
        this.data.id = this.data.name= effDetermined.name, this.data.duration = 0, this.data.hidden=0;
        this.data.teaseResist = 5; this.data.wRecover=0;this.data.eRecover=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effDetermined", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effDetermined, value.data);};
    get desc(){return(effDetermined.name);}
    onApply(){
        this.data.duration = 3;
        this.parent.parent.Stats.addModifier('rst_tease',{id:'rst_tease:Determined', bonus:this.data.teaseResist});
        this.parent.parent.Stats.addModifier('willRegen',{id:'willRegen:Determined', bonus:this.data.wRecover});
        this.parent.parent.Stats.addModifier('energyRegen',{id:'energyRegen:Determined', bonus:this.data.eRecover});
    }
    merge(neweffect){
        if(neweffect.name===this.data.name) return(true);
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
        return({OK:true,msg:''});
    }
    onRemove(){
        this.parent.parent.Stats.removeModifier('rst_tease',{id:'rst_tease:Determined'});
        this.parent.parent.Stats.removeModifier('willRegen',{id:'willRegen:Determined'});
        this.parent.parent.Stats.removeModifier('energyRegen',{id:'energyRegen:Determined'});
    }
}
//to combine multiple effects that get dispelled together 
class effCombined extends CombatEffect {
    constructor(EffectsA,EffectsB){
        super();
        this.effects = EffectsA.concat(EffectsB);
        this.data.id = this.data.name= effCombined.name, this.data.duration = 0, this.data.hidden=0;
        for(var n of this.effects){
            n.onRemove = (function(me){
                let _old = n.onRemove.bind(n); 
                let foo = function(){
                    _old.call(n); //override onRemove but call orignial fct
                    let i = me.effects.indexOf(n);
                    if(i>=0) me.effects.splice(i,1);
                    me.removeAll();
                }
                return(foo);
            } (this));
        }
    }
    removeAll(){
        for(var n of this.effects){
            if(n) n.parent.removeItem(n.id);
        }
        this.parent.removeItem(this.id);
    }
    toJSON(){return window.storage.Generic_toJSON("effCombined", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effCombined, value.data);};
}
class effDamage extends CombatEffect {
    static factory(amount,type,turns=0,msg=''){
        let eff = new effDamage();
        eff.amount = amount,eff.data.duration=turns;
        eff.type=type;
        eff.data.id=eff.data.name=type+'-damage'
        eff.castMsg=msg;
        return(eff);
    }
    constructor(){
        super();
        this.amount = 8;
        this.data.id = this.data.name= effDamage.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effDamage", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effDamage, value.data);};
    onApply(){
        //this.data.duration = 0;
        this.parent.parent.Stats.increment('health',-1*this.amount);
        if(this.data.duration<1) this.parent.removeItem(this.data.id);
        this.castMsg=window.gm.util.descFixer(this.parent.parent)(this.amount+' '+this.data.name+' '); //'$[Name]$ got hurt for '+  
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            return;
        }
    }
    onTurnStart(){ this.data.duration-=1; 
        if(this.data.duration<=0) { this.parent.removeItem(this.data.id); }
        this.parent.parent.Stats.increment('health',-1*this.amount); return({OK:true,msg:''});}
}
/**
 * type says which bonus is applied from lewds
 * lewds is calculated tease bonus from gear
 */
 class effTeaseDamage extends CombatEffect {
    static factory(amount,type,lewds,msg=''){
        let eff = new effTeaseDamage();
        eff.amount = amount;
        eff.type = type;
        eff.lewds = lewds;
        eff.castMsg=msg;
        return(eff);
    }
    constructor(amount){
        super();
        this.amount = amount;
        this.data.id = this.data.name= effTeaseDamage.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effTeaseDamage", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effTeaseDamage, value.data);};
    get desc(){return(effTeaseDamage.name);}
    onApply(){
        this.data.duration = 0;
        this.parent.parent.Stats.increment('arousal',1*this.amount);
        if(this.data.duration<1) this.parent.removeItem(this.data.id);  
        this.castMsg=window.gm.util.descFixer(this.parent.parent)('$[Name]$ got aroused by '+this.amount+'.');  
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            //this.onApply();
            return(false);
        }
    }
    onTurnStart(){ this.data.duration-=1; if(this.data.duration<=0) this.parent.removeItem(this.data.id); return({OK:true,msg:''});   }
}
/**
 * 
 */
 class effPoiseDamage extends CombatEffect {
    static factory(amount,msg=''){
        let eff = new effPoiseDamage();
        eff.amount = amount;
        eff.castMsg=msg;
        return(eff);
    }
    constructor(amount){
        super();
        this.amount = amount;
        this.data.id = this.data.name= effPoiseDamage.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effPoiseDamage", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effPoiseDamage, value.data);};
    get desc(){return(effPoiseDamage.name);}
    onApply(){
        this.data.duration = 0;
        this.parent.parent.Stats.increment('poise',-1*this.amount);
        if(this.data.duration<1) this.parent.removeItem(this.data.id);  
        this.castMsg=window.gm.util.descFixer(this.parent.parent)('$[Name]$ poise '+((this.amount>0)?'decreased':'increased')+' by '+this.amount+'.');  
        this.parent.parent.updateStance();
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            return(false);
        }
    }
    onTurnStart(){ this.data.duration-=1; if(this.data.duration<=0) this.parent.removeItem(this.data.id); return({OK:true,msg:''});   }
}
//someone with this eff will gain arousal when hit
class effMasochist extends CombatEffect {
    static factory(amount){
        let eff = new effMasochist();
        eff.amount = amount;
        return(eff);
    }
    constructor(){
        super();
        this.amount = 8;
        this.data.id = this.data.name= effMasochist.name, this.data.duration =6, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effMasochist", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effMasochist, value.data);};
    onApply(){
        if(this.data.duration<1) this.parent.removeItem(this.data.id);  
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            return;
        }
    }
    onTurnStart(){ this.data.duration-=1; if(this.data.duration<=0) this.parent.removeItem(this.data.id); return({OK:true,msg:''});   }
}
/**
 * damage over time todo affects only bleedable targets 
 */
class effBleed extends CombatEffect {
    constructor(amount){
        super();
        this.amount = amount;
        this.data.id = this.data.name= effBleed.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effBleed", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effBleed, value.data);};
    onApply(){
        this.data.duration = 3;
        this.parent.parent.Stats.increment('health',-1*this.amount);
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            //this.onApply();
            return(true);
        }
    }
    onTurnStart(){ this.data.duration-=1; 
        if(this.data.duration<=0){
            this.parent.removeItem(this.data.id);   
        } else {
            this.parent.parent.Stats.increment('health',-1*this.amount);
        }
        return({OK:true,msg:''});
    }
}
//the character is in close combat with whom; 
class effGrappled extends CombatEffect {
    static factory(){
        let grappled = new effGrappled(2), grappling= new effGrappling();
        grappled.source = grappling, grappling.target = grappled;
        return({targetEff:grappled,sourceEff:grappling});
    }
    constructor(amount){
        super();
        this.source=null;
        this.data.id = this.data.name= effGrappled.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effGrappled", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effGrappled, value.data);};
    onApply(){
        this.data.duration = 5;
        this.data.name = this.data.name+"("+this.source.parent.parent.name+")";
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            //this.onApply();
            return(true);
        }
    }
    onRemove(){
        if(this.source){
            this.source.parent.removeItem(effGrappling.name);
            this.source=null;
        }
    }
    onTurnStart(){ 
        this.data.duration-=1; 
        if(this.data.duration<=0){this.parent.removeItem(this.data.id);}  
        return({OK:true,msg:''});
    }
}
//when a char casts grappling, the target gets effGrappled and the caster gets effGrappling
//if one of the effects got removed, it will also remove the other
class effGrappling extends CombatEffect {
    constructor( targetEffect){
        super();
        this.target=targetEffect;
        this.data.id = this.data.name= effGrappling.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effGrappling", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effGrappling, value.data);};
    get desc(){return(this.data.name);}
    onApply(){
        this.data.duration = 5;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            //this.onApply();
            return(true);
        }
    }
    onRemove(){
        if(this.target){
            this.target.parent.removeItem(effGrappled.name);
            this.target=null;
        }
    }
    onTurnStart(){ this.data.duration-=1; 
        if(this.data.duration<=0){this.parent.removeItem(this.data.id); } 
        return({OK:true,msg:''});
    }
}
class effUngrappling extends CombatEffect {
    constructor( targetEffect){
        super();
        this.target=targetEffect;
        this.data.id = this.data.name= effUngrappling.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effUngrappling", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effUngrappling, value.data);};
    get desc(){return(this.data.name);}
    onApply(){ 
        this.parent.removeItem(this.target.id);
        this.parent.removeItem(this.data.id);
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            //this.onApply();
            return(true);
        }
    }
    onTurnStart(){ this.data.duration-=1; if(this.data.duration<=0) this.parent.removeItem(this.data.id); return({OK:true,msg:''});   }
}

class effStunned extends CombatEffect {
    static factory(duration=2){
        let eff = new effStunned();
        eff.startduration=duration;
        return(eff);
    }
    constructor(){
        super();
        this.data.id = this.data.name= effStunned.name,this.data.duration=this.data.startduration = 2;
    }
    toJSON(){return window.storage.Generic_toJSON("effStunned", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effStunned, value.data);};
    get desc(){return(this.data.name);}
    onApply(){
        this.data.duration = 2;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //extends duration
            this.onApply();
            return(true);
        }
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
        return({OK:true,msg:''});
    }
} 
class effFlying extends CombatEffect {
    constructor(){
        super();
        this.data.id = this.data.name= effFlying.name, this.data.duration = 0;
    }
    toJSON(){return window.storage.Generic_toJSON("effFlying", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effFlying, value.data);};
    get desc(){return(this.data.name);}
    onApply(){
        this.data.duration = 4;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //applying effect again toggles it !
            return(function(me){
                return (function(Effects){ 
                    Effects.removeItem(me.data.id);});
            }(this));
        }
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id); //todo stop flying if no more stamina
        return({OK:true,msg:''});
    }
}
 class effFairyLight extends CombatEffect {
    static factory(duration=2){
        let eff = new effFairyLight();
        eff.startduration=duration;
        return(eff);
    }
    constructor(){
        super();
        this.data.id = this.data.name= effFairyLight.name,this.data.duration=this.data.startduration = 2;
    }
    toJSON(){return window.storage.Generic_toJSON("effFairyLight", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effFairyLight, value.data);};
    get desc(){return(this.data.name);}
    onApply(){
        this.data.duration = 6;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //extends duration
            this.onApply();
            return(true);
        }
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.parent.parent.Stats.get('rst_light').value<0) { //if vulnerable to light, the mob will guard instead of attack
            this.parent.parent.addEffect(new effHesitant(),'FairyLight:Hesitant')
        }
        if(this.data.duration<=0) { 
            this.parent.removeItem(this.data.id);
        }
        return({OK:true,msg:''});
    }
}
class effHesitant extends CombatEffect {  //when active, the Mob should back away; needs to be handled in Mob-AI
    constructor(){
        super();
        this.data.id = this.data.name= effHesitant.name, this.data.duration = 0;
    }
    toJSON(){return window.storage.Generic_toJSON("effHesitant", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effHesitant, value.data);};
    get desc(){return(this.data.name);}
    onApply(){
        this.data.duration = 6;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //extends duration
            this.onApply();
            return(true);
        }
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration<=0) { 
            this.parent.removeItem(this.data.id);
        }
        return({OK:true,msg:''});
    }
}
/**
 * this effect is usd as a marker to block spawning again while there is still a spawn
 *
 * @class effCallHelp
 * @extends {CombatEffect}
 */
class effCallHelp extends CombatEffect { //summons someone
    constructor(){
        super();
        this.data.id = this.data.name= effCallHelp.name, this.data.duration = 2;
        this.data.spawns=[];
    }
    toJSON(){return window.storage.Generic_toJSON("effCallHelp", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effCallHelp, value.data);};
    get desc(){return(effCallHelp.name);}
    onApply(){
        this.data.duration = 2;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            return(true);
        }
    }
    get shortDesc(){
        if(this.data.spawns.length>0) return("Summoned a"+this.data.item);
        else return("Summons "+this.data.item+" in " + this.data.duration+" turns");
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration===0){ //spawn after delay
            this.data.spawns.push(window.gm.Encounter.spawnChar(this.data.item,this.data.faction,this.parent.parent.level));
            
        } else if(this.data.spawns.length>0){
            //remove effect after spawns are killed
            let remove=true;
            let mobs = window.story.state.combat.enemyParty.concat(window.story.state.combat.playerParty);
            for(var i=mobs.length-1;i>=0;i--){
                if(this.data.spawns.includes(mobs[i].name)&& !mobs[i].isKnockedOut()) remove=false;
            }
            if(remove===true) this.parent.removeItem(this.data.id);
        }
        return({OK:true,msg:''});
    }
    configureSpawn(item,faction,amount=1){
        this.data.item=item,this.data.faction=faction,this.data.amount=amount;
    }
}
//transform the mob into different mob
class effTransformSelf extends CombatEffect {
    constructor(){
        super();
        this.data.id = this.data.name= effTransformSelf.name, this.data.duration = 1;
        this.data.spawns=[];
    }
    toJSON(){return window.storage.Generic_toJSON("effTransformSelf", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effTransformSelf, value.data);};
    get desc(){return(effTransformSelf.name);}
    onApply(){
        //this.data.duration = 0;
    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            return(true);
        }
    }
    get shortDesc(){
        if(this.data.spawns.length>0) return("Transformed into"+this.data.item[0]);
        else return("Transforms into "+this.data.item[0]);
    }
    onTurnStart(){
        this.data.duration-=1;
        if(this.data.duration===0){ //spawn after delay
            for(var i=0;i<this.data.item.length;i++) {   //todo how to transform into higher level
                if(i===0){ this.data.spawns.push(window.gm.Encounter.replaceChar(this.data.item[i],this.parent.parent)); }
                else {this.data.spawns.push(window.gm.Encounter.spawnChar(this.data.item[i],this.parent.parent.faction,this.parent.parent.level));}
            }
            let _h=this.parent.parent.health(); _h=-0.7; //_h=(_h.value/_h.max)-1
            let mobs = window.story.state.combat.enemyParty.concat(window.story.state.combat.playerParty);
            for(var i=mobs.length-1;i>=0;i--){
                if(this.data.spawns.includes(mobs[i].name)) mobs[i].Stats.scaleValue('health',_h); //decrease new mobs health;
            }            
        } //todo reverse transformation after time,damage,energyloss...
        return({OK:true,msg:''});
    }
    //items is a list of mob-ids; the first one will replace this mob, the others will be added 
    configureSpawn(items){
        if(items instanceof Array) this.data.item=items;
        else this.data.item=[items];
    }
}
class effKamikaze extends CombatEffect { //kill yourslef and damage all enemys
    static factory(style,duration=2){
        let eff = new effKamikaze();
        eff.data.duration=duration, eff.style=style;
        return(eff);
    }
    constructor(){
        super();
        this.data.id = this.data.name= effKamikaze.name, this.data.duration = 0, this.style=0;
    }
    toJSON(){return window.storage.Generic_toJSON("effKamikaze", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(effKamikaze, value.data);};
    get desc(){return(effKamikaze.name);}
    set style(style){
        this._style = style;
    }
    get style(){return this._style;}
    onApply(){    }
    merge(neweffect){
        if(neweffect.name===this.data.name){    //ignore
            return(true);
        }
    }
    onTurnStart(){
        let result ={OK:true,msg:''},s=window.story.state;
        this.data.duration-=1;
        if(this.data.duration<=0){
            let targets= s.combat.playerParty.concat(s.combat.enemyParty)
            for(let n of targets){
                n.addEffect(effDamage.factory(10,'slash')); //TODO dmg = ? should use calcAttack
            }
            this.parent.removeItem(this.data.id);
            this.parent.parent.Stats.increment("health",-1*h-1);
            result.msg= this.parent.parent.name+' decides to explode in a fiery mess. ';
        }
        /*let h = this.parent.parent.Stats.get('health').value, hmax= this.parent.parent.Stats.get('healthMax').value;
        if(h/hmax<0.5){ //if health is low trigger effect and kill yourself
            
        }*/
        return(result);
    }
    configureSpawn(item,faction,amount=1){
        this.data.item=item,this.data.faction=faction,this.data.amount=amount;
    }
}
//todo transformSelf: replace the caster with a different class & regenerate energy  
//restricted: stuck in cobwebs, goo
//skills
//////////////--   abilities   --///////////////////////
// an ability (cooking, climbing) is a stat ? always present, represented by number, can be modified by effects
// or an effect ? might not be present, has a cooldown
class Ability extends Stat { //double check if ability is present !
    static setup(context, base,kind){   
        let _stat = new Ability();
        let _n = _stat.data;
        _n.id="sk_"+kind,_n.base=base, _n.value=base,_n.limits=[{max:1000,min:-1000}];
        context.addItem(_stat);
        _stat.Calc();
    }
    static info(id) {return(id);}
    constructor(){   super();  }
    toJSON(){return window.storage.Generic_toJSON("Ability", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Ability, value.data);};
    get desc() {
        let msg="";
        switch(id){
            case "sk_Cooking":
                msg="You know how to cook a tasty meal. Improving this skill increases your chance to get extra-meals and allows to cook more difficult meals."
                break;
            case "sk_Diving":
                msg="You are more comfortable to dive in deep water. You might still require the proper tools like diver googles and scuba gear."
                break;
            case "sk_Swimming":
                msg="You are confident in your ability to swim larger distance. Big waves and dangerous currents are still a threat. You require less energy with each rank."
                break;
            case "sk_Climbing":
                msg="Beeing able to climb rocks and walls, as long as they are not to smooth. You might still require the proper tools like rope and pick."
                break;
            case "sk_Fishing":
                msg="Finding got spots for fishing and making use of net and fishing rod to catch them."
                break;
            case "sk_Herbalist": //Funguist/Insectoist
                msg="Its easier to you to identify all kind of plants. Increases chances to find more rare plants or to give extra resources."
                break;
            case "sk_Looter": //Scrapper
                msg="Increases chance to find lootable containers or loot."
                break;
            case "sk_Scrapper":
                msg="Salvaging more craftmaterials from breaking down things."
                break;
            case "sk_WoodWorker": //SteelWorker, StoneWorker
                msg="Creating useful things from wood like tools and furniture is your speciality."
                break;
            case "sk_Stitching":
                msg="Fixing cloths or creating new one is possible for you."
                break;
            default:
                throw new Error(this.id +' is unknown');
        }
        return(msg);
    }
    get name() {
        return(this.data.id);
    }
}
/*skAlchemist
 * Lv1 - can create potions from 1 ingredient
 * Lv2 - can create potion from 2 ingredients
 * Lv3 - can combine 2 potions into better one
 * Lv4 - can use 3 ingredients
 */
window.gm.StatsLib = (function (StatsLib){
    //...stats
    window.storage.registerConstructor(Stat);
    window.storage.registerConstructor(stHealth);
    window.storage.registerConstructor(stRelation);
    window.storage.registerConstructor(stFetish);
    window.storage.registerConstructor(stAgility);
    window.storage.registerConstructor(stCharisma);
    window.storage.registerConstructor(stEndurance);
    window.storage.registerConstructor(stIntelligence);
    window.storage.registerConstructor(stLuck);
    window.storage.registerConstructor(stPerception);
    window.storage.registerConstructor(stStrength);
    window.storage.registerConstructor(stResistance);
    window.storage.registerConstructor(stEnergy);
    window.storage.registerConstructor(stWill);
    window.storage.registerConstructor(stSatiation);
    window.storage.registerConstructor(stArousal);
    window.storage.registerConstructor(stCorruption);
    window.storage.registerConstructor(stSavageness);
    window.storage.registerConstructor(stArmor);   
    window.storage.registerConstructor(stPoise);  
    //...effects
    window.storage.registerConstructor(effCallHelp);
    window.storage.registerConstructor(effCombatRecovery);
    window.storage.registerConstructor(effDamage);
    window.storage.registerConstructor(effDetermined);
    window.storage.registerConstructor(effHunger);
    window.storage.registerConstructor(effLibido);
    window.storage.registerConstructor(effSanity);
    window.storage.registerConstructor(effFlying);
    window.storage.registerConstructor(effBleed);
    window.storage.registerConstructor(effCombined);
    window.storage.registerConstructor(effFairyLight);
    window.storage.registerConstructor(effGrappled);
    window.storage.registerConstructor(effGrappling);
    window.storage.registerConstructor(effUngrappling);
    window.storage.registerConstructor(effEnergized);    
    window.storage.registerConstructor(effNotTired);
    window.storage.registerConstructor(effPillEffect);
    window.storage.registerConstructor(effPoiseDamage);
    window.storage.registerConstructor(effTeaseDamage);
    window.storage.registerConstructor(effTired);
    window.storage.registerConstructor(effStunned);
    window.storage.registerConstructor(effTransformSelf);
    window.storage.registerConstructor(effGuard);
    window.storage.registerConstructor(effProtect);
    window.storage.registerConstructor(effHeal);
    window.storage.registerConstructor(effMasochist);
    window.storage.registerConstructor(effEnergyDrain);
    window.storage.registerConstructor(effHorsePower);
    window.storage.registerConstructor(effLapineSpeed);
    window.storage.registerConstructor(effMutateBunny);
    window.storage.registerConstructor(effMutateHorse);
    window.storage.registerConstructor(effMutateWolf);
    window.storage.registerConstructor(effMutateCat); 
    window.storage.registerConstructor(effMutateHuman);
    window.storage.registerConstructor(effGrowBreast);
    window.storage.registerConstructor(effGrowVulva);
    window.storage.registerConstructor(effLewdMark);
    window.storage.registerConstructor(effInHeat);
    window.storage.registerConstructor(effInRut);
    window.storage.registerConstructor(effSpermDecay);
    window.storage.registerConstructor(effButtPlugged);
    window.storage.registerConstructor(effVaginalFertil);
    window.storage.registerConstructor(effVaginalPregnant);
    //non-combat skills
    window.storage.registerConstructor(Ability);
    StatsLib.Ability=Ability;
    return(StatsLib); 
}(window.gm.StatsLib || {}));