"use strict";
///////////////////////////////////////////////////////////////
//RL-Items
class LighterDad extends Item {
    constructor(){super('LighterDad');this.addTags([window.gm.ItemTags.Quest]);}
    get desc(){ return('I got this lighter from my real dad.');}
    toJSON(){return window.storage.Generic_toJSON("LighterDad", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(LighterDad, value.data);};
};
class Money extends Item {
    constructor(){super('Money'); this.addTags([window.gm.ItemTags.Money]);}
    get desc(){ return('shiny,clinky coin');}
    toJSON(){return window.storage.Generic_toJSON("Money", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Money, value.data);};
};
class LaptopPS extends Item {
    constructor(){super('LaptopPS');this.addTags([window.gm.ItemTags.Quest]);}
    get desc(){ return 'Power converter for laptop.';    }
    toJSON(){return window.storage.Generic_toJSON("LaptopPS", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(LaptopPS, value.data);};
};
class Dildo extends Item {
    constructor(){super('Dildo');this.price=this.basePrice=20;this.style=0;}
    toJSON(){return window.storage.Generic_toJSON("Dildo", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Dildo, value.data);};
    set style(style){ 
        this._style = style; 
        if(style===0) this.id='DildoSmall',this.name='small dildo';
        else if(style===100) this.id='DildoMedium',this.name='medium dildo';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ='A dildo made from rubbery plastic, smaller than an average human dick.';
        switch(this._style){
            case 100:
                msg=('A medium sized pink dong.');
                break;
            default:
        }
        return(msg);
    }
}
class Lube extends Item {
    constructor(){     super('Lube');  this.addTags([window.gm.ItemTags.Ingredient]);this.price=this.basePrice=4;  }
    get desc(){ return 'Slippery lubricant for personal use.';    }
    toJSON(){return window.storage.Generic_toJSON("Lube", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Lube, value.data);};
}
class Battery extends Item {
    constructor(){ super('Battery'); this.addTags([window.gm.ItemTags.Ingredient]); this.price=this.basePrice=3;}
    get desc(){ return 'Provides electricity for devices.';   }
    toJSON(){return window.storage.Generic_toJSON("Battery", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Battery, value.data);};
}
/////////////////////////////////////////////////////////////////
class Voucher extends Item { //token or coupon for ingame shop
    constructor(){
        super('Voucher');
        this.addTags([window.gm.ItemTags.Money]);this.price=this.basePrice=100;
        this.style=0;this.lossOnRespawn = false;
    }
    toJSON(){return window.storage.Generic_toJSON("Voucher", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Voucher, value.data);};
    set style(style){ 
        this._style = style; 
        if(style===0) this.id=this.name='VoucherIron';
        else if(style===10) this.id=this.name='VoucherBronze';
        else if(style===20) this.id=this.name='VoucherSilver';
        else if(style===30) this.id=this.name='VoucherGold';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ='a token with a certain value';
        return(msg);
    }
};
class QuestItems extends Item { //stuff you have to collect for quest
    constructor(){ super('QuestItems');
    this.addTags([window.gm.ItemTags.Quest]); this.price=this.basePrice=10;   
    this.style=0;this.lossOnRespawn = true;
    }
    set style(style){ //instead of creating full class for every useless junk I use this and just add variable that will be restored after load
        this._style = style; 
        if(style===0) this.id='IgneumPage',this.name='IgneumPage';
        else if(style===10) this.id=this.name='RedAnkh';
        else if(style===20) this.id=this.name='RingOfBurden';
        else if(style===30) this.id=this.name='GemstoneRed';
        else if(style===31) this.id=this.name='GemstoneGreen';
        else if(style===32) this.id=this.name='GemstoneBlue';
        else if(style===40) this.id=this.name='SlaverTag';
        else if(style===50) this.id=this.name='Fuse';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ='';
        switch(this._style){
            case 0: msg ='Pages from the book Igneum Frigus Thalamum';
                break;
            case 10: msg='A pendant made from red crystal shaped like the famous Ankh.';
                break;
            case 20: msg='This ring is heavyer then it seems.';
                break;
            case 30:
            case 31:
            case 32: 
                msg='A large gemstone of a certain color.';
                break;
            case 40:
                msg='Aquired by freeing a slave.';
                break;
            case 50:
                msg='A replacemant fuse for electronics.';
                break;
            default: throw new Error(this.id +' doesnt know '+style);
        }
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("QuestItems", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(QuestItems, value.data);};
}
//this Present-Box has an Inventory to hold Presents; use it to ove those presents into carriers inventory and  
class Box extends Item{
    constructor(){ super('Box');
        //this.addTags([window.gm.ItemTags.Ingredient]); 
        this.price=this.basePrice=10;   
        this.style=0;this.lossOnRespawn = true;
        this.inv = new Inventory()
    }
    _relinkItems(parent){super._relinkItems(this),
        this.inv._parent = window.gm.util.refToParent(this); //does this work if parent is ITEM?
    }
    addItem(item,count=1){
        this.inv.addItem(item,count)
        this._updateId()//boxes should not stack if content differs
    }
    usable(context,on=null){return({OK:true, msg:'unwrap'});}
    use(context,on=null){ 
        var msg="",_item,_count ,_ids =this.inv.getAllIds()
        if(context instanceof Inventory){
            if(on===null) on=context.parent;
            context.removeItem(this.id);
            if(on instanceof Character){
                for(var i=0;i<_ids.length;i++){
                    _item=this.inv.getItem(_ids[i]),_count=this.inv.countItem(_ids[i])
                    msg+=_count+" x "+_item.name+", ";
                    on.changeInventory(_item,_count)
                }
            return({OK:true, msg:'The mysterious box contained: '+msg});
            }
        } else throw new Error('context is invalid');
    }
    set style(style){ 
        this._style = style; 
        if(style===0) this.id='MysteriousBox',this.name='MysteriousBox';
        else if(style===10) this.id=this.name='Surprise';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ='';
        switch(this._style){
            case 0: 
                msg ='a mysterious box';
                break;
            case 10: 
                msg ='a surprise present';
                break;
            default: throw new Error(this.id +' doesnt know '+style);
        }
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("Box", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Box, value.data);};
}
class Ingredient extends Item {
    constructor(){ super('Ingredient');
        this.addTags([window.gm.ItemTags.Ingredient]); this.price=this.basePrice=10;   
        this.style=0;this.lossOnRespawn = true;
    }
    set style(style){ //instead of creating full class for every useless junk I use this and just add variable that will be restored after load
        this._style = style; 
        if(style===0) this.id='ApocaFlower',this.name='ApocaFlower';
        else if(style===10) this.id=this.name='PurpleBerry';
        else if(style===20) this.id=this.name='BogBovus';
        else if(style===30) this.id=this.name='SquishedLeech';
        else if(style===40) this.id=this.name='WolfTooth';
        else if(style===50) this.id=this.name='DryadVine';
        else if(style===60) this.id=this.name='Dimetrium';
        else if(style===70) this.id=this.name='GiantPlum';
        else if(style===80) this.id=this.name='EmptyGlas';
        else if(style===90) this.id=this.name='CrystalWater';
        else if(style===100) this.id=this.name='BlackCandle';
        else if(style===110) this.id=this.name='Beewax';
        else if(style===120) this.id=this.name='RedSlime';
        else if(style===130) this.id=this.name='BlueSlime';
        else if(style===140) this.id=this.name='GreenSlime';
        else if(style===150) this.id=this.name='Cobweb';
        else if(style===160) this.id=this.name='Ingwer';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ='';
        switch(this._style){
            case 0: 
                msg ='yellow bluish flower';
                break;
            case 10:
                msg='purple berrys grown in the forest';
                break;
            case 20:
                msg='a mushroom with purple cap and yellow splotches';
                break;
            case 30:
                msg='I dont wanna carry that around';
                break;
            case 40:
                msg='Some canines from a canine';
                break;
            case 50:
                msg='fibers of a sturdy plant';
                break;
            case 60:
                msg='a arcane metal';
                break;
            case 70:
                msg='a huge purple plum, bigger than your fist';
                break;
            case 80:
                msg='an empty drinking glas';
                break;
            case 90:
                msg='a glas filled with crystal clear water';
                break;
            case 100:
                msg='a black candle; most likely used for (un-)holy rituals';
                break;
            case 110:
                msg='wax produced by bees';
                break;
            case 120:
            case 130:
            case 140:
                msg='glob of slime with a certain color';
                break;
            case 150:
                msg='a fuzz of cobwebs';
                break;
            default: throw new Error(this.id +' doesnt know '+style);
        }
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("Ingredient", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Ingredient, value.data);};
}
class SoulGem extends Item {
    constructor(){ super('SoulGem');   
        this.addTags([window.gm.ItemTags.Ingredient]);this.price=this.basePrice=100;
        this.style=0;this.lossOnRespawn = true;
    }
    set style(style){ //instead of creating full class for every useless junk I use this and just add variable that will be restored after load
        this._style = style; 
        if(style===0) this.id=this.name='TinySoulGem';
        else if(style===10) this.id=this.name='TinyBlackSoulGem';
        else if(style===20) this.id=this.name='SmallSoulGem';
        else if(style===30) this.id=this.name='SmallBlackSoulGem';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg =this.name;
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("SoulGem", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Ingredient, value.data);};
}
class Rope extends Item {
    constructor(){ super('Rope');  
    this.addTags([window.gm.ItemTags.Tool]); this.price=this.basePrice=10;
       this.style=0;this.lossOnRespawn = true;
    }
    set style(style){ //instead of creating full class for every useless junk I use this and just add variable that will be restored after load
        this._style = style; 
        if(style===0) this.id=this.name='Rope';
        else if(style===10) this.id='RopeSturdy',this.name='Sturdy Rope';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg =this.name;
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("Rope", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Rope, value.data);};
}
class KeyRestraint extends Item {
    constructor(){ super('KeyRestraint');   
        this.style=0;this.lossOnRespawn = true;
    }
    set style(style){
        this._style = style; 
        if(style===0) this.id=this.name='KeyRestraintA';
        else if(style===10) this.id=this.name='KeyRestraintB';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg =this.name;
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("KeyRestraint", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(KeyRestraint, value.data);};
}
class FlashBang extends Item {
    constructor(){ super('FlashBang');  }
    get desc(){ return 'Stun someone with a blinding light.';  }
    toJSON(){return window.storage.Generic_toJSON("FlashBang", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(FlashBang, value.data);};

    //context is the skillUseItem calling this
    targetFilter(targets,context){
        if(!window.gm.combat.inCombat()) return([]);
        //to use skill-targetfilter we need an instance of skill bound to the caster  - todo this is ugly
        //let _sk = this.parent.parent.Skills.getItem('UseItem');//._parent=window.gm.util.refToParent(this.parent.parent.Skills); 
        return(context.targetMultiple(context.targetFilterFighting(context.targetFilterEnemy(targets))));
    }
    usable(context,on=null){
        //can only be used while in combat and target is enemy
        let result = {OK:false, msg:'cannot use'};
        if(!window.gm.combat.inCombat()){
            result.msg= 'can only be used in combat';
        } else {
            result.msg= 'use',result.OK=true;
        }
        return(result);
    }
    use(context,on=null){ 
        let result = {OK:false,msg:''};
        if(context instanceof Inventory){
            context.removeItem('FlashBang');
            if(context.parent instanceof Character){
                if(on===null) on=context.parent;
                if(on.length && on.length>0){ //on can be several targets (array)
                } else {
                    on = [on];  //..if not an array change it
                }
                result.msg = context.parent.name+' uses '+this.name+'.';
                for(let _targ of on){
                    _targ.addEffect(new effStunned(),effStunned.id);  //todo should 'FlashBang:Stunned' merge with other stunned? 
                    result.msg +=_targ.name+' got stunned. ';
                }
                result.OK=true;
                return(result);
            }
        } else throw new Error('context is invalid');
    }
};
class CanOfCoffee extends Item {
    constructor(){   super('CanOfCoffee'); this.addTags([window.gm.ItemTags.Drink]);this.price=this.basePrice=2;}
    get desc(){ return 'Cold coffee in a can. Tasty? Not really!';    }
    toJSON(){return window.storage.Generic_toJSON("CanOfCoffee", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(CanOfCoffee, value.data);};
    usable(context){return({OK:true, msg:'drink'});}
    use(context){ 
        if(context instanceof Inventory){
            context.removeItem('CanOfCoffee');
            if(context.parent instanceof Character){
                context.parent.addEffect(new effEnergized(),'CanOfCoffee:Energized');    //apply over-time-effect instead directly changing stat
            return({OK:true, msg:context.parent.name+' gulped down a can of iced coffee.'});
            }
        } else throw new Error('context is invalid');
    }
};
class SimpleFood extends Item {
    constructor(){super('SimpleFood'); this.addTags([window.gm.ItemTags.Food]);this.price=this.basePrice=5;this.style=0;}
    get desc(){ return 'Something to eat.';    }
    toJSON(){return window.storage.Generic_toJSON("SimpleFood", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(SimpleFood, value.data);};
    usable(context,on=null){return({OK:true, msg:'eat'});}
    use(context,on=null){ 
        if(context instanceof Inventory){
            if(on===null) on=context.parent;
            context.removeItem(this.id);
            if(on instanceof Character){
                on.addEffect(new effEnergized(),'Simple food:Energized');
                on.Stats.increment("satiation",1*this.satiation);
                if(this._style===5) window.gm.MutationsLib.changeSavage(on,-5,0,100);
                if(this._style===10) window.gm.MutationsLib.changeSavage(on,3,0,20);
            return({OK:true, msg:on.name+' ate some food.'});
            }
        } else throw new Error('context is invalid');
    }
    set style(style){
        this._style = style; this.satiation=30;
        if(style===0) this.id=this.name='SimpleFood',this.amount=10;
        else if(style===5) this.id=this.name='Sandwich',this.amount=20;
        else if(style===10) this.id=this.name='ViolettMushroom',this.amount=20;
        else if(style===20) this.id=this.name='BrownMushroom',this.amount=20;
        else if(style===30) this.id=this.name='RottenMushroom',this.amount=20;
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this.name;}
}
class HealthPotion extends Item {
    static factory(style){
        let x= new HealthPotion();
        x.style=style;
        return(x);
    }
    constructor(){ super('HealthPotion'); this.addTags([window.gm.ItemTags.Drink]); this.price=this.basePrice=15;this._style=0; }
    toJSON(){return window.storage.Generic_toJSON("HealthPotion", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(HealthPotion, value.data);};
    //context is the skillUseItem calling this
    targetFilter(targets,context){
        if(!window.gm.combat.inCombat()) return([]);
        //to use skill-targetfilter we need an instance of skill bound to the caster  - todo this is ugly
        //let _sk = this.parent.parent.Skills.getItem('UseItem');//._parent=window.gm.util.refToParent(this.parent.parent.Skills); 
        return(context.targetMultiple(context.targetFilterAlly(targets)));
    }
    usable(context,on=null){return({OK:true, msg:'drink'});}
    use(context,on=null){ 
        if(context instanceof Inventory){
            if(on===null) on=context.parent;
            if(on.length && on.length>0){ //on can be several targets (array)
                on = on[0];
            } 
            context.removeItem(this.id);
            if(on instanceof Character){ 
                if(this.style<100){
                    on.Stats.increment("health",on.Stats.getItem("healthMax").value*this.amount/100);
                    return({OK:true, msg:on.name+' drank a potion and feels healthier.'});
                } else if(this.style<200 && this.style>=100){
                    on.Stats.increment("savageness",-1*this.amount*on.Stats.getItem("savagenessMax").value);
                    return({OK:true, msg:on.name+' drank a potion and feels less savage.'});
                }
            }
        } else throw new Error('context is invalid');
    }
    set style(style){
        this._style = style; 
        if(style===0) this.id=this.name='HealthPotion',this.amount=40,this.price=this.basePrice=15;
        else if(style===10) this.id=this.name='HealthPotionSmall',this.amount=20,this.price=this.basePrice=10;
        else if(style===100) this.id=this.name='SerenityPotionSmall',this.amount=10,this.price=this.basePrice=10;
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return(this._style);}
    get desc(){
        let msg='restores '+this.amount+'% health ';
        if(this.style<200 && this.style>=100){
            msg='cools down your savagness ('+this.amount+'%) '
        }
        return(msg);
    }
}
class HorsePotion extends Item {
    constructor(){ super('HorsePotion'); this.addTags([window.gm.ItemTags.Drink]);this.price=this.basePrice=15;this.style=0;}
    toJSON(){return window.storage.Generic_toJSON("HorsePotion", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(HorsePotion, value.data);};
    usable(context,on=null){return({OK:true, msg:'drink'});}
    use(context,on=null){ 
        var _gaveAway=false;
        if(context instanceof Inventory){
            if(on===null) on=context.parent;
            else _gaveAway=true;
            context.removeItem(this.id);
            if(on instanceof Character){ 
                if(this.style===0){
                    on.addEffect(new effHorsePower(),effHorsePower.name);
                } else if(this.style===10){
                    on.addEffect(new effLapineSpeed(),effLapineSpeed.name);
                }
                on.Stats.increment("health",80);on.Stats.increment("energy",40);
                return({OK:true, msg:on.name+' drank a potion.'});
            }
        } else throw new Error('context is invalid');
    }
    set style(style){
        this._style = style;
        if(style===0)  this.id=this.name='HorsePotion';
        else if(style===10) this.id=this.name='CarrotJuice';
        else if(style===20) this.id=this.name='BrownPill';
        else if(style===30) this.id=this.name='RedPill';
        else if(style===40) this.id=this.name='GreenPill';
        else if(style===50) this.id=this.name='BluePill';
        else throw new Error(this.id +' doesnt know '+style); 
    }
    get style(){return this._style;}
    get desc(){ 
        let msg =this.name;
        return(msg);
    }
}
class Pills extends Item {
    constructor(){ super('Pills'); this.addTags([window.gm.ItemTags.Drink]);this.price=this.basePrice=15;this.style=0;}
    toJSON(){return window.storage.Generic_toJSON("Pills", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Pills, value.data);};
    usable(context,on=null){return({OK:true, msg:'swallow'});}
    use(context,on=null){ 
        var _txt='';
        if(context instanceof Inventory){
            if(on===null) on=context.parent;
            context.removeItem(this.id);
            if(on instanceof Character){ 
                on.addEffect(effPillEffect.factory(this.id));
                on.Stats.increment("health",80);on.Stats.increment("energy",40);
                window.gm.MutationsLib['changeSavage'](on,3,0,20);
                _txt=on.name+' swallowed a drug. ';
                _txt+=((this.style===0)?'Poison resistance increased.':
                (this.style===50)?'':'');
                return({OK:true, msg:_txt});
            }
        } else throw new Error('context is invalid');
    }
    set style(style){
        this._style = style;
        if(style===0) this.id=this.name='BrownPill';
        else if(style===30) this.id=this.name='RedPill';
        else if(style===40) this.id=this.name='GreenPill';
        else if(style===50) this.id=this.name='BluePill';
        else if(style===50) this.id=this.name='WhitePill';
        else throw new Error(this.id +' doesnt know '+style); 
    }
    get style(){return this._style;}
    get desc(){ 
        let msg =this.name;
        return(msg);
    }
}
class SkillBook extends Item {   //todo
    static factory(style){
        let x= new SkillBook();
        x.style=style;
        return(x);
    }
    constructor(){ super('SkillBook'); this.addTags([window.gm.ItemTags.Food]);this.price=this.basePrice=100;this.style=0;}
    toJSON(){return window.storage.Generic_toJSON("SkillBook", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(SkillBook, value.data);};
    usable(context,on=null){return({OK:true, msg:'read'});}
    use(context,on=null){ 
        var _txt='';
        if(context instanceof Inventory){
            if(on===null) on=context.parent;
            //todo grant skill
            context.removeItem(this.id);
            if(on instanceof Character){ 
                return({OK:true, msg:_txt});
            }
        } else throw new Error('context is invalid');
    }
    set style(style){
        this._style = style;
        if(style===0) this.id=this.name='SkillbookMedicine';
        else throw new Error(this.id +' doesnt know '+style); 
    }
    get style(){return this._style;}
    get desc(){ 
        let msg =this.name;
        return(msg);
    }
}
class RegenderPotion extends Item {
    constructor(){ super('RegenderPotion'); this.addTags([window.gm.ItemTags.Drink]);this.price=this.basePrice=500;this.style=0;}
    toJSON(){return window.storage.Generic_toJSON("RegenderPotion", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(RegenderPotion, value.data);};
    usable(context,on=null){return({OK:true, msg:'drink'});}
    use(context,on=null){ 
        var _gaveAway=false;
        if(context instanceof Inventory){
            if(on===null) on=context.parent;
            else _gaveAway=true;
            context.removeItem(this.id);
            if(on instanceof Character){ 
                if(on instanceof Character){
                    window.gm.MutationsLib.swapGender(window.gm.player,
                        new window.storage.constructors[(this.style===0)?"VulvaHuman":"PenisHuman"]);
                }
                return({OK:true, msg:on.name+' drank a potion.'});
            }
        } else throw new Error('context is invalid');
    }
    set style(style){
        this._style = style; 
        if(style===0) this.id=this.name='Vaginarium';
        else if(style===10) this.id=this.name='Penilium';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg =this.name;
        if(this.style===0) msg+= ' gets you some female bits.';
        else if(this.style===10) msg+= ' gets you some male bits.';
        return(msg);
    }
}
window.gm.ItemTags = { //
    //Items
    Quest   : "quest", //quest-item; dont sell or give away
    Cursed  : "cursed",
    Money   : 'money', //...for trading
    Ingredient : 'ingred',
    Material : 'material',
    Drink   : 'drink',
    Food    : 'food',
    //Outfit
    Piercing    : "piercing",
    Tattoo      : "tattoo",
    Armor      : "armor",
    //weapons
    Tool    : 'tool',
    Weapon  : "weapon",
    Shield  : "shield",
    Melee   : "melee",
    Ranged  : "ranged" 
};
window.gm.ItemsLib = (function (ItemsLib){
    window.storage.registerConstructor(Box);
    window.storage.registerConstructor(LighterDad);
    window.storage.registerConstructor(Voucher);
    window.storage.registerConstructor(Money);
    window.storage.registerConstructor(LaptopPS);
    window.storage.registerConstructor(Battery);
    window.storage.registerConstructor(Dildo);
    window.storage.registerConstructor(Lube);
    window.storage.registerConstructor(Rope);
    window.storage.registerConstructor(CanOfCoffee);
    window.storage.registerConstructor(KeyRestraint);
    window.storage.registerConstructor(SimpleFood);
    window.storage.registerConstructor(HealthPotion);
    window.storage.registerConstructor(HorsePotion);
    window.storage.registerConstructor(Ingredient);//only need constructor for base-ingredient
    window.storage.registerConstructor(FlashBang);
    window.storage.registerConstructor(Pills);
    window.storage.registerConstructor(QuestItems);
    window.storage.registerConstructor(SoulGem);
    
    //Some of those items are generics that need some setup;
    ItemsLib['Money'] = function(){ return new Money();};
    ItemsLib['LighterDad'] = function(){ return new LighterDad();};
    ItemsLib['LaptopPS'] = function(){ return new LaptopPS();};
    ItemsLib['Battery'] = function(){ return new Battery();};
    ItemsLib['Dildo_small'] =function(){let x=new Dildo();return(x);};
    // consumables
    ItemsLib['Lube'] = function(){ return new Lube();};
    ItemsLib['CanOfCoffee'] = function(){ return new CanOfCoffee(); };
    ItemsLib['SimpleFood'] = function(){ return new SimpleFood(); };
    ItemsLib['Sandwich'] = function(){ let x=new SimpleFood();x.style=5;return(x);};
    ItemsLib['ViolettMushroom'] = function(){ let x=new SimpleFood();x.style=10;return(x);};
    ItemsLib['BrownMushroom'] = function(){ let x=new SimpleFood();x.style=20;return(x);};
    ItemsLib['RottenMushroom'] = function(){ let x=new SimpleFood();x.style=30;return(x);};
    ItemsLib['FlashBang'] = function(){ return new FlashBang(); };
    //healthpotion
    ItemsLib['HealthPotion'] = function(){return(HealthPotion.factory(0));};
    ItemsLib['HealthPotionSmall'] = function(){return(HealthPotion.factory(10));};
    ItemsLib['SerenityPotionSmall'] = function(){return(HealthPotion.factory(100));};
    ItemsLib['HorsePotion'] = function (){ let x= new HorsePotion();return(x);}
    ItemsLib['CarrotJuice'] = function (){ let x= new HorsePotion();x.style=10;return(x);}
    ItemsLib['BrownPill'] = function (){ let x= new Pills();x.style=0;return(x);}
    ItemsLib['RedPill'] = function (){ let x= new Pills();x.style=30;return(x);}
    ItemsLib['GreenPill'] = function (){ let x= new Pills();x.style=40;return(x);}
    ItemsLib['BluePill'] = function (){ let x= new Pills();x.style=50;return(x);}
    ItemsLib['Vaginarium'] = function (){ let x= new RegenderPotion();return(x); };
    ItemsLib['Penilium'] = function(){ let x= new RegenderPotion();x.style=10;return(x)};
    //Mysterious Box
    ItemsLib['Box'] = function(){ let x= new Box();x.style=0;return(x)};
    //Ingredient
    ItemsLib['SquishedLeech'] = function(){ let x=new Ingredient();x.style=30;return(x);};
    ItemsLib['Beewax'] = function(){ let x=new Ingredient();x.style=110;return(x);};
    ItemsLib['BogBovus'] = function(){ let x=new Ingredient();x.style=20;return(x);};
    ItemsLib['PurpleBerry'] = function(){ let x=new Ingredient();x.style=10;return(x);};
    ItemsLib['WolfTooth'] = function(){ let x=new Ingredient();x.style=40;return(x);};
    ItemsLib['ApocaFlower'] = function(){ let x=new Ingredient();return(x);};
    ItemsLib['DryadVine'] = function(){ let x=new Ingredient();x.style=50;return(x);};
    ItemsLib['Dimetrium'] = function(){ let x=new Ingredient();x.style=60;return(x);};
    ItemsLib['GiantPlum'] = function(){ let x=new Ingredient();x.style=70;return(x);};
    ItemsLib['EmptyGlas'] = function(){ let x=new Ingredient();x.style=80;return(x);};
    ItemsLib['CrystalWater'] = function(){ let x=new Ingredient();x.style=90;return(x);};
    ItemsLib['BlackCandle'] = function(){ let x=new Ingredient();x.style=100;return(x);};
    ItemsLib['BlueSlime'] = function(){ let x=new Ingredient();x.style=110;return(x);};
    ItemsLib['RedSlime'] = function(){ let x=new Ingredient();x.style=120;return(x);};
    ItemsLib['GreenSlime'] = function(){ let x=new Ingredient();x.style=130;return(x);};
    ItemsLib['Cobwebs'] = function(){ let x=new Ingredient();x.style=150;return(x);};
    ItemsLib['Ingwer'] = function(){ let x=new Ingredient();x.style=160;return(x);};
    //Questitems
    ItemsLib['IgneumPage'] = function(){ let x=new QuestItems();x.style=0;return(x);};
    ItemsLib['RedAnkh'] = function(){ let x=new QuestItems();x.style=10;return(x);};
    ItemsLib['RingOfBurden'] = function(){ let x=new QuestItems();x.style=20;return(x);};
    ItemsLib['GemstoneRed'] = function(){ let x=new QuestItems();x.style=30;return(x);};
    ItemsLib['GemstoneGreen'] = function(){ let x=new QuestItems();x.style=31;return(x);};
    ItemsLib['GemstoneBlue'] = function(){ let x=new QuestItems();x.style=32;return(x);};
    ItemsLib['Fuse'] = function(){ let x=new QuestItems();x.style=50;return(x);};
    //soulgem
    ItemsLib['TinySoulGem'] = function(){ let x= new SoulGem();return(x); };
    //keys
    ItemsLib['Rope'] = function(){ let x= new Rope();return(x);};
    ItemsLib['RopeSturdy'] = function(){ let x= new Rope();x.style=10;return(x);};
    ItemsLib['KeyRestraintA'] = function(){ let x= new KeyRestraint();return(x);}; 
    ItemsLib['KeyRestraintB'] = function(){ let x= new KeyRestraint();x.style=10;return(x);};
    //voucher
    ItemsLib['VoucherIron'] = function(){ let x= new Voucher();return(x); };
    ItemsLib['VoucherBronze'] = function(){ let x= new Voucher();x.style=10;return(x); };
    ItemsLib['VoucherSilver'] = function(){ let x= new Voucher();x.style=20;return(x);};
    ItemsLib['VoucherGold'] = function(){ let x= new Voucher();x.style=30;return(x);};
    return ItemsLib; 
}(window.gm.ItemsLib || {}));