"use strict";
/* classes to affect...: 
    - the state of a character like     'tired'
    - stats of a character like healthMax
    - 
 */
///////////////////////////////////////////////////////////////
 /**
  * a collection of Stats
  * @class StatsDictionary
  * @extends {Inventory}
  */
 class StatsDictionary extends Inventory {
    constructor(externlist){
        super(externlist);
        window.storage.registerConstructor(StatsDictionary);
    }
    toJSON(){return window.storage.Generic_toJSON("StatsDictionary", this); };
    static fromJSON(value){
        let _x = window.storage.Generic_fromJSON(StatsDictionary, value.data);
        return(_x);
    }
    /**
     *
     *
     * @param {*} id
     * @return {*} 
     * @memberof StatsDictionary
     */
    get(id){return(this.getItem(id));}
    modifyHidden(id,hidden){
        let _data = this.get(id).data;
        _data.hidden=hidden;
    }
    /**
     *
     * adds a modifier to a Stat or replaces it
     * @memberof StatsDictionary
     */
    addModifier(toId, modData){
        let _stat = this.get(toId);
        let _oldMods = _stat.data.modifier;
        let _x=-1;
        for(let i=0;i<_oldMods.length;i++){
            if(_oldMods[i].id===modData.id) _x=i;
        }
        if(_x>=0) _oldMods.splice(_x,1);
        _oldMods.push(modData);
        window.gm.pushLog(_stat.Calc().msg);
    }
    removeModifier(toId,modData){
        let _stat = this.get(toId);
        let _oldMods = _stat.data.modifier;
        let _x=-1;
        for(let i=0;i<_oldMods.length;i++){
            if(_oldMods[i].id===modData.id) _x=i;
        }
        if(_x>=0) _oldMods.splice(_x,1);
        window.gm.pushLog(_stat.Calc().msg);
    }
    getModifier(toId,modId){
        let modData=null,_stat = this.get(toId);
        let _oldMods = _stat.data.modifier;
        let _x=-1;
        for(let i=0;i<_oldMods.length;i++){
            if(_oldMods[i].id===modId) modData=_oldMods[i];
        }
        return(modData);
    }
    //override
    postItemChange(id,operation,msg){
        window.gm.pushLog('Stats: '+operation+' '+id+' '+msg);
    }
    //override; only use to create new stats !
    addItem(stat){
        let _i = this.findItemSlot(stat.name);
        if(_i<0){
            stat._parent=window.gm.util.refToParent(this);
            this.list.push({'id': stat.id,'count': 1, item:stat});
        }
    }
    //override
    removeItem(id){
        let _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        let _stat = this.get(id);
        this.list.splice(_i,1);
        _stat.calc();   //trigger update of dependent stat
    }
    /**
     * adds value to the stats value
     *
     * @param {*} id
     * @param {*} value
     * @memberof StatsDictionary
     */
    increment( id, value){
        let attr = this.get(id);
        attr.data.base += value;
        window.gm.pushLog(attr.Calc(this,id).msg); // todo show only for player
    }
    /**
     * modifys stats value relative, f.e. 0.3 -> add 30% of stats value
     *
     * @param {*} id
     * @param {*} value
     * @memberof StatsDictionary
     */
    scaleValue(id,value){
        let attr = this.get(id);
        attr.data.base = attr.data.base*(1.0+value);
        window.gm.pushLog(attr.Calc(this,id).msg); // todo show only for player
    }
}
/**
 * class for an Attribute
 *
 * @class Stat
 */
class Stat {
    static dataPrototype(){    
        return({id: '', base: 0,value: 0, limits: [{max:999999,min:-999999}],modifier:[], modifys:[], hidden:0});
        //limit = {min: max:}   limit to apply to value and base; either statid or number
        //modifier {id: bonus:}      Stat that modifys value, bonus is value to add             todo: multiplier but then we have to sort modifiers somehow
        //modifys {id:}         point to the Stats that have modifiers from this stat or is used as limit
        //hidden 0 = visible, 1= name unreadable, 2= value unreadable, 4= hidden
    }
    //returns array with Max,Min,Regen,Stat that you have to add to your stats list; you also need to adjust limits
    static setupStatWithLimitAndRegen(name,opt={base:100},def={}){
        let stats=[],_stat,_n;
        if(opt.max!==undefined){
            _stat=(def.max?def.max:new Stat()),_n=_stat.data; 
            _n.id=name+'Max',_n.base=opt.max,_n.hidden=4,_n.value=opt.max,_n.modifys=[{id:name}],_n.limits=[{max:999999,min:0}];
            stats.push(_stat);
        }
        if(opt.min!==undefined){
            _stat=(def.min?def.min:new Stat()),_n=_stat.data; 
            _n.id=name+'Min',_n.base=opt.min,_n.hidden=4,_n.value=opt.min,_n.modifys=[{id:name}],_n.limits=[{max:0,min:-999999}];
            stats.push(_stat);
        }
        if(opt.regen!==undefined){
            _stat=(def.regen?def.regen:new Stat()),_n=_stat.data; 
            _n.id=name+'Regen',_n.base=opt.regen,_n.hidden=4,_n.value=opt.regen,_n.limits=[{max:100,min:-100}];
            stats.push(_stat);
        }
        _stat=new Stat(),_n=_stat.data; 
        _n.id=name,_n.base=opt.base,_n.value=opt.base,
        _n.limits=[{max:((opt.max!==undefined)?(name+'Max'):0),min:((opt.min!==undefined)?(name+'Min'):0)}];
        stats.push(_stat);
        return(stats);
    }
    constructor(){
        this.data = Stat.dataPrototype();
    }
    toJSON(){return window.storage.Generic_toJSON("Stat", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Stat, value.data);};
    // Attention !!_parent will be added dynamical
    get parent(){return this._parent?this._parent():null;}
    _relinkItems(parent){this._parent=window.gm.util.refToParent(parent);}
    get name(){return(this.data.id);}
    get id(){return(this.data.id);}
    get base(){return(this.data.base);}
    get value(){return(this.data.value);}
    get rmax(){return((this.data.value/this.parent.get(this.id+'Max').value));}  //value/max
    get hidden(){return(this.data.hidden);}
    //this is called to update value of the stat and will trigger calculation of dependend stats; 
    //requires that the stats where added to the dictionary! 
    Calc( ){
        let attr = this.data;
        let min = -999999;
        let max = 999999;
        let msg = '';
        //get limits
        for(let k=0;k<attr.limits.length;k++){//this might behave odly if any min>max
            let lmin = attr.limits[k].min, lmax = attr.limits[k].max;  //lm__ is id or number
            if (lmin || lmin===0){
                min= (typeof lmin ==='string')? Math.max(this.parent.get(lmin).value,min): Math.max(lmin,min);
            }
            if (lmax || lmax===0){
                max=(typeof lmax ==='string') ? Math.min(this.parent.get(lmax).value,max): Math.min(lmax,max);
            }
        }
        //recalculate modifiers
        let _old =  attr.value;
        attr.base = attr.value = Math.max(min,Math.min(max,attr.base));  
        for(let i=0;i<attr.modifier.length;i++){
            attr.value += attr.modifier[i].bonus;
        }
        let _new = Math.max(min,Math.min(max,attr.value));
        attr.value = _new;
        msg+=this.formatMsgStatChange(attr,_new,_old);//todo no log hidden
        this.updateModifier();
        //trigger recalculation of dependend Stats
        for(let m=0;m<attr.modifys.length;m++){
            msg+=this.parent.get(attr.modifys[m].id).Calc().msg;
        }
        return({OK:true,msg:msg});
    }
    formatMsgStatChange(attr,_new,_old){
        if((_new-_old)>0){ 
            return('<statup>'+attr.id+" off "+this.parent.parent.name+" regenerated by "+(_new-_old).toFixed(1).toString()+"</statup>");
        } else if((_new-_old)<0){
            return('<statdown>'+attr.id+" off "+this.parent.parent.name+" decreased by "+(_new-_old).toFixed(1).toString()+"</statdown>");
        }
        return("");
    };
    updateModifier(){};
}
/////////////////////////////////////////////////////////////////////////
/**
 * a collection of Effects
 * @class Effects
 * @extends {Inventory}
 */
class Effects extends Inventory {
    constructor(externlist){
        super(externlist);
        window.storage.registerConstructor(Effects);
        //! this doesnt work after load! see PubSub comments
        //window.gm.timeEvent.subscribe("change", this.updateTime.bind(this) ); 
    }
    toJSON(){return window.storage.Generic_toJSON("Effects", this); };
    static fromJSON(value){
        let _x = window.storage.Generic_fromJSON(Effects, value.data);
        return(_x);
    }
    get(id){
        return(this.getItem(id));
    }
    /*
    * findItemslot uses id, this one finds all effects with a name
    */
    findEffect(name){
        let _items = [] ;
        for (let i = 0; i < this.count(); i++){
            if(this.list[i].item.name===name) _items.push(this.list[i].item);
        }
        return(_items);
    }
    //override
    removeItem(id){
        let _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        let _eff = this.get(id);
        this.list.splice(_i,1);
        _eff.onRemove(this,this.list[_i]);
        this.postItemChange(id,"removed","");
    }
    addItem(effect,id=''){
        id=effect.id; //if(id==='') id= effect.name; todo effects remove themself by id, not by name
        let _i = this.findItemSlot(id);
        let res;
        //todo what if there are 2 damage effects from 2 attackers, blunt for 2 rounds , blunt for 3 ??
        //if effect with same id is already present, merge them
        if(_i>-1){
            let _old = this.get(id);//effect.id);
            res = _old.merge(effect);
            if(res!=null){
                if(res===true){}
                else res(this); //should be a function
                this.postItemChange(id,"merged","");
                return;
            }  
        }
        //or if there are similiar effects try to merge with them
        for(let i=0;i<this.list.length;i++){
            let _old = this.list[i].item;
            res = _old.merge(effect);
            if(res!=null){
                if(res===true){}
                else res(this); //should be a function
                this.postItemChange(id,"merged","");
                return;
            }  
        }
        //else add it to list
        this.list.push({'id': id,'count': 1, item:effect});
        effect._parent = window.gm.util.refToParent(this);
        effect.onApply();
        this.postItemChange(id,"added","");
    }
    replace(id, neweffect){
        let _i = this.findItemSlot(id);
        if(_i<0) return; //Todo do nothing
        let _old = this.get(id);
        _old.onRemove();
        neweffect._parent = window.gm.util.refToParent(this);
        this.list[_i].id= neweffect.id,this.list[_i].item = neweffect;
        neweffect.onApply();
    }
    updateTime(){
        let now =window.gm.getTime();
        for(let i=0;i<this.list.length;i++){
            let _eff = this.list[i].item;
            let foo = _eff.onTimeChange(now);   
            if(foo) foo(this);
        }
    }
    //override
    postItemChange(id,operation,msg){
        window.gm.pushLog('Effects: '+operation+' '+id+' '+msg,
            window.story.state._gm.debug || (window.gm.player && (window.gm.player.id === this.parent.id)));
    }
}
/////////////////////////////////////////////////////////////////////////
/**
 * @class Effect
 */
class Effect {  
    constructor(){
        this.data = Effect.dataPrototype();
        this.data.time = window.gm.getTime();
    }
    static dataPrototype(){
        return({id:'xxx', name: Effect.name, time: 0, duration:0,hidden:0});
        //hidden 0 = visible, 1= name unreadable, 2= value unreadable, 4= hidden
    }
    /**
     * Attention !! _parent will be added dynamical
     *
     * @readonly
     * @memberof Effect
     */
    get parent(){return this._parent?this._parent():null;}
    _relinkItems(parent){this._parent=window.gm.util.refToParent(parent);}
    // id = SlumberPotion:Stunned;  name = Stunned
    get id(){return(this.data.id);}
    set id(id){ this.data.id=id;}
    /**
     * Attention !!  effTired.name returns constructor-name but Effects.getById('effTired').name returns data.name
     *
     * @readonly
     * @memberof Effect
     */
    get name(){return(this.data.name);}
    get time(){return(this.data.time);}
    get duration(){return(this.data.duration);}
    get hidden(){return(this.data.hidden);}
    get desc(){return(this.name);}
    get shortDesc(){return(this.name);}
        
    //
    /**
     *is called when a effect is applied to check if the new effect can be combined with an exisitng one
     * return null if no merge occured
     * return true if the neweffect was merged into existing one; no other effects are then checked for mergeability
     * or return function that has to be executed: (function(Effects){ Effects.replace(data.id,NotTired);}));
     *
     * @param {*} neweffect
     * @return {*} 
     * @memberof Effect
     */
    merge(neweffect){
        return(null);
    }
    /**
     *
     * @param {*} time
     * @return {*} 
     * @memberof Effect
     */
    onTimeChange(time){
        return(null);
    }
    /**
     *
     * @memberof Effect
     */
    onApply(){}
    /**
     *
     * @memberof Effect
     */
    onRemove(){}
}
/////////////////////////////////////////////////////////////////////////
/**
 * combat effect use turn-count instead of realtime as duration
 *
 * @class CombatEffect
 * @extends {Effect}
 */
class CombatEffect extends Effect {
    constructor(){
        super(); this.castMsg='';
    }
    /**
     *shown in skill-select
     *
     * @readonly
     * @memberof CombatEffect
     */
    get shortDesc(){return(this.desc+" for " + this.data.duration+" turns");}  //duration in turns !
    /**
     *shown when casting the effect
     *
     * @return {*} 
     * @memberof CombatEffect
     */
    castDesc(){return(this.castMsg);}

    /**
     * called after victory/defeat (before -scene plays)
     * combateffect should be removed after combat (call super if overridden) ! 
     *
     * @memberof CombatEffect
     */
    onCombatEnd(){this.parent.removeItem(this.data.id);}

    /**
     * 
     */
    onCombatStart(){return({OK:false,msg:''});}
    /**
     * called before targets turn
     *
     * @return {*} 
     */
    onTurnStart(){ return({OK:true,msg:''}); }
    //at end of targets turn   UNUSED
    //onTurnEnd(){ return({OK:true,msg:''}); }
}






