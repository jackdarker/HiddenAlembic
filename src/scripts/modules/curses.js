
"use strict";
/**
 * Items can have bonus/curse(s) that is applied when its condition is met 
 * condition is checked when equipped and on every timechange (no check if not equipped ? )
 * if trigger succeeds, apply-function is called  
 * the curse should be initially hidden to the player but might be revealed by a magican
 * 
 * possible conditions to think of:
 * - is activated if worn for some time
 * - is activated if other certain (cursed) items are worn
 * - is activated if effect is active
 * - is activated if in location
 * 
 * possible actions to think of:
 * - disable unequip/ locking
 * - replace the item with a different one
 * - add an effect
 * - give a skill
 * 
 * use deffered event to show the triggerd curse
 * 
 * ways to remove a curse (not yet triggered)
 * - by magican?
 * 
 * ways to remove active curse
 * - a key to unlock
 * - dissolve the item by a magican
 * - use item/potion that counters the effect
 * - mutate body to remove bodypart (snake -> no wristcuffs) 
 */
/**
 * //hidden 0 = visible, 1= name=???, 2= , 4= hidden
 */
class Curse {
    constructor(){
        this.hidden=0;
        this.trigger = null;
        this.list=[];
    }
    /* 
    * parent is the item !
    * Attention !! _parent will be added dynamical
    */
    get parent(){return(this._parent?this._parent(): null);} 
    _relinkItems(parent){
        this._parent = window.gm.util.refToParent(parent);
        this.trigger._parent=window.gm.util.refToParent(this);
        for(var n of this.list){
            n._parent=window.gm.util.refToParent(this);
        }
    }
    configureCurse(item,trigger,curses){
        this.trigger = trigger;
        this.list=curses;
        item.bonus.push(this);
        this._relinkItems(item);
        //todo: basePrice if bonus/curse is hidden; if bonus/curse is known, increase/lower price; if bonus/curse is not fully known, increase price slightly 
        item.price=item.basePrice*(1+item.bonus.length);
        item._updateId();
    }
    toJSON(){return window.storage.Generic_toJSON("Curse", this); }
    static fromJSON(value){let x=window.storage.Generic_fromJSON(Curse, value.data);return(x);}
    onEquip(){
        if(this.trigger.onEquip()) this.apply();
    }
    onUnequip(){
        if(this.trigger.onUnequip()) this.apply(true);
    }
    canUnequip(){ //ask effects if allowed to unequip/not locked
        let res;
        for(var n of this.list){
            res = n.canUnequip();
            if(res.OK==false) return(res);
        }
        res = {OK:true, msg:'unequipable'};
        return(res);
    }
    onTimeChange(time){
        if(this.trigger.onTimeChange(time)) this.apply();
    }
    apply(unapply){
        this.hidden=0; //reveal
        for(var n of this.list){
            n.apply(unapply); //todo 3 effects would generate 3 defferedEvents; instead combine text into single event
        }
    }
    get desc(){
        let msg='';
        if((this.hidden & 0x4)>0){  //completely hidden

        } else if((this.hidden & 0x1)>0){
            msg = 'unknown effect';
        } else if(this.hidden===0 ){
            msg = this.trigger.desc;
            for(var n of this.list){
                msg += "; " + n.desc;
            }
        }
        return(msg);
    }
}
//-------------------------------------------------------------------------
class CrsTrigger { //each curse has a trigger that evaluates if the curse gets triggered
    constructor(){ }
     /* 
    * parent is the curse !
    * Attention !! _parent will be added dynamical
    */
    get parent(){return(this._parent?this._parent(): null);} 
    _relinkItems(parent){this._parent=window.gm.util.refToParent(parent);}
    onEquip(){return(false);}
    onUnequip(){return(true);} //by default trigger unapply when unequipped
    onTimeChange(time){return(false);}
    get desc(){ return('');}
}
class CrsTrgOnEquip extends CrsTrigger {
    constructor(){
        super();
        this.minItems=0; //if 0 always trigger onEquip
        this.curseName='crs'; // ..otherwise min no. items with this tag need to be equipped
    }
    onEquip(){
        if(this.minItems<=0) return(true);
        let owner=this.parent.parent.parent.parent.Outfit,list = owner.getAllIds();
        let _c = 0;
        for(var n of list){
            if(owner.getItem(n).hasTag(this.curseName)) _c+=1;
        }
        return(_c>=this.minItems);  
    }
    onTimeChange(time){
        if(this.minItems<=0) return(false);
        return(this.onEquip());
    }
    toJSON(){return window.storage.Generic_toJSON("CrsTrgOnEquip", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsTrgOnEquip, value.data));}
    get desc(){ return('when equipped');}
}
class CrsTrgDelayed extends CrsTrigger {
    constructor(){
        super();
        this.timeToTrigger = 60*2; //in min
        this.timeStart=null;
    }
    onEquip(){
        this.timeStart = window.gm.getTime();
        return(false);
    }
    onTimeChange(time){
        return(this.timeToTrigger< window.gm.getDeltaTime(time,this.time));
    }
    toJSON(){return window.storage.Generic_toJSON("CrsTrgDelayed", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsTrgDelayed, value.data));}
    get desc(){ return('after '+window.gm.util.formatNumber(this.timeToTrigger,0)+'min');}
}
//-------------------------------------------------------------------------
class CrsEffect {
    constructor(){this.hidden=0;}
     /* 
    * parent is the curse !
    * Attention !! _parent will be added dynamical
    */
    get parent(){return(this._parent?this._parent(): null);} 
    canUnequip(){return({OK:true,msg:'unequipable'});}
    get desc(){ return('');}
    apply(unapply){} //override to do something!
}
//todo timed lock
class CrsEffLock extends CrsEffect{
    constructor(){ super(); this.key='KeyRestraintA';}
    toJSON(){return window.storage.Generic_toJSON("CrsEffLock", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsEffLock, value.data));}
    get desc(){return("The item can only be unlocked with a "+this.key+".")}
    canUnequip(){
        let res= {OK:true,msg:'This devices requires '+this.key+' to unlock'};
        if(this.parent.parent.parent.parent.Inv.countItem(this.key)<=0){
            res.OK=false;
        }
        return(res);
    }
    apply(unapply){
        if(unapply){
            this.parent.parent.parent.parent.Inv.removeItem(this.key,1);
            window.gm.pushDeferredEvent("GenericDeffered",['With the key, it was now possible to unlock '+this.parent.parent.name+' !']);
        } else {
            window.gm.pushDeferredEvent("GenericDeffered",['As soon as you equiped '+this.parent.parent.name+', some hidden lock sealed the item on you !']);
        }
    }
}
class CrsEffSeal extends CrsEffect{
    constructor(){ super(); this.key='KeyRestraintA';}
    toJSON(){return window.storage.Generic_toJSON("CrsEffSeal", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsEffSeal, value.data));}
    get desc(){return("The item is sealed magically to its wearer. The magic seal has to be weakened before the item can be removed.")}
    canUnequip(){
        let res= {OK:false,msg:'This device is seald by magic.'};
        return(res);
    }
    apply(unapply){
        if(unapply){
            window.gm.pushDeferredEvent("GenericDeffered",['The seal was removed!']);
        } else {
            window.gm.pushDeferredEvent("GenericDeffered",['As soon as you equiped '+this.parent.parent.name+', the item sealed itself on you!']);
        }
    }
}
class CrsEffConvert extends CrsEffect{
    constructor(){   super(); this.newItem='GlovesRubber'; this.newCurse={lock:true,energydrain:2}; }
    toJSON(){return window.storage.Generic_toJSON("CrsEffConvert", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsEffConvert, value.data));}
    get desc(){return("Converts the item to "+this.newItem+".")}
    apply(unapply){
        if(unapply){
        } else {
            let item = window.gm.ItemsLib[this.newItem]();
            item.addTags(['cursed']);//this is ugly
            window.gm.makeCursedItem(item,this.newCurse); //todo how to configure this
            if(this.parent.parent.parent.parent.Outfit.removeItem(this.parent.parent.id).OK){
            this.parent.parent.parent.parent.Wardrobe.removeItem(this.parent.parent.id);
            window.gm.pushDeferredEvent("GenericDeffered",['To your surprise, '+this.parent.parent.name+' contorts its shape to something different, reforming itself into '+item.name+'! ']);
            this.parent.parent.parent.parent.Wardrobe.addItem(item);
            this.parent.parent.parent.parent.Outfit.addItem(item);
            }
        }
    }
}
//adds an effect that drains your energy
class CrsEffEnergyDrain extends CrsEffect{
    constructor(){   super();  }
    toJSON(){return window.storage.Generic_toJSON("CrsEffEnergyDrain", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsEffEnergyDrain, value.data));}
    get desc(){return("Drains wearers energy.")}
    apply(unapply){
        if(unapply){
            this.parent.parent.parent.parent.Effects.removeItem(this.parent.parent.id+'_EnergyDrain');
        } else {
        //this->curse->item->outfit->char     id="cursed_leather_bracer.EnergyDrain"
            this.parent.parent.parent.parent.addEffect(new window.storage.constructors['effEnergyDrain'](),this.parent.parent.id+'_EnergyDrain');
        }
    }
}
//modifies a stat
class CrsEffStatBonus extends CrsEffect{
    constructor(){
        super();
        this.statid ='strength';
        this.statbonus = 5;
    }
    toJSON(){return window.storage.Generic_toJSON("CrsEffStatBonus", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsEffStatBonus, value.data));}
    get desc(){return(this.statid+" +"+this.statbonus)}
    apply(unapply){
        if(unapply){
            this.parent.parent.parent.parent.Stats.removeModifier(this.statid,{id:this.statid+":"+this.parent.parent.id});
        } else {
            this.parent.parent.parent.parent.Stats.addModifier(this.statid,{id:this.statid+":"+this.parent.parent.id, bonus:this.statbonus});
        }
    }
}
//gives you a skill
class CrsEffSkill extends CrsEffect{
    constructor(){
        super();
        this.skillid =this.newskillid='';
    }
    toJSON(){return window.storage.Generic_toJSON("CrsEffSkill", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsEffSkill, value.data));}
    get desc(){return("gives skill "+this.newskillid)}
    apply(unapply){
        if(unapply){
            this.parent.parent.parent.parent.Skills.removeItem(this.newskillid);
        } else {
            let sk = new window.storage.constructors[this.skillid]();
            sk.id=sk.name=this.newskillid;
            this.parent.parent.parent.parent.Skills.addItem(sk);
        }
    }
}
//disables a skill
class CrsEffSkillSeal extends CrsEffect{
    constructor(){
        super();
        this.skillid='';
    }
    toJSON(){return window.storage.Generic_toJSON("CrsEffSkillSeal", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(CrsEffSkillSeal, value.data));}
    get desc(){return("mmakes it ipossible to use "+this.skillid)}
    apply(unapply){
        if(this.parent.parent.parent.parent.Skills.findItemSlot(this.skillid)<0) return;
        _item=this.parent.parent.parent.parent.Skills.getItem(this.skillid)
        if(unapply){
            _item.seal=0; //#todo how handle multiple seals
        } else {
            _item.seal=1;
        }
    }
}
//todo wrap you in rubber; pony gear,
// slaver harness - if you defeat a foe with higher level then you, you gain ftDomination, otherwise ftSubmission
/**
 * adds a curse-function to an item
 */
window.gm.makeCursedItem = function(item, extra){
    let curse = new Curse();
    let eff =null;
    let list=[];
    curse.trigger = new CrsTrgOnEquip();
    if(extra.hidden){          //hidden:4
        curse.hidden=extra.hidden;
    } else curse.hidden=4; //by default hidden
    if(extra.minItems){
        curse.trigger.minItems=extra.minItems;
        curse.trigger.curseName = 'cursed'; //todo PonyCurse
        item.addTags([curse.trigger.curseName]); 
    }
    if(extra.delayed){         //delayed:60
        curse.trigger = new CrsTrgDelayed();
        curse.trigger.timeToTrigger=extra.delayed;
    }
    if(extra.lock){            //lock:1
        eff = new CrsEffLock();
        list.push(eff);
    }
    if(extra.seal){            //seal:1
        eff = new CrsEffSeal();
        list.push(eff);
    }
    if(extra.sealSkill){       //sealSkill:'SkillFireball'
        eff = new CrsEffSkillSeal();
        eff.skillid=extra.skillid
        list.push(eff);
    }
    if(extra.convert){         //convert:'rubber'
        eff = new CrsEffConvert();
        eff.newItem=extra.convert;
        eff.newCurse={lock:1};
        list.push(eff);
    }
    if(extra.energydrain){     //energydrain:3
        eff = new CrsEffEnergyDrain();
        list.push(eff);
    }
    curse.configureCurse(item,curse.trigger,list);  //todo should change item-id or the item would not properly add to wardrobe if there is already similiar item;item.getHash()??
    return(item);
}
window.gm.makeBonusItem = function(item, extra){
    let curse = new Curse();
    let eff =null;
    let list=[];
    curse.trigger = new CrsTrgOnEquip();
    if(extra.hidden){ 
        curse.hidden=extra.hidden;
    } else curse.hidden=0; //by default visible?
    if(extra.statBoost && extra.statBonus){
        eff = new CrsEffStatBonus();
        eff.statid=extra.statBoost, eff.statbonus=extra.statBonus;
        list.push(eff);
    }
    if(extra.skillid){
        eff = new CrsEffSkill();
        eff.skillid=extra.skillid,eff.newskillid=extra.skillname;
        list.push(eff);
    }
    curse.configureCurse(item,curse.trigger,list);
    return(item);
}

window.gm.ItemsLib = (function (ItemsLib){
    window.storage.registerConstructor(Curse);
    window.storage.registerConstructor(CrsTrgDelayed);
    window.storage.registerConstructor(CrsTrgOnEquip);
    window.storage.registerConstructor(CrsEffLock);
    window.storage.registerConstructor(CrsEffSeal);
    window.storage.registerConstructor(CrsEffConvert);
    window.storage.registerConstructor(CrsEffEnergyDrain);
    window.storage.registerConstructor(CrsEffSkill);
    window.storage.registerConstructor(CrsEffSkillSeal);
    window.storage.registerConstructor(CrsEffStatBonus);
}(window.gm.ItemsLib || {}));