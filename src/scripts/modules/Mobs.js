"use strict";
/*
demon/ghost
- imp
- vampire
- gargoyle
- whisp
- mimic, transportation trap
- cursed tome of conjuring

human
- nymph
- beauty nurse

feral scaly
- Giant-Snake
- raptor
- dragon/wyvern

anthro scaly
- kobold
- naga

feral mammal
- grizzly
- gryphon
- felkin

anthro mammal
- stag-boy/-Stud  archer, drummer, warrior
- cougar-girl/-mistress
- werwolf

fetish zealots ; force an item on you if you loose or you can grab an item with a chance that it is Key/tool or a fetish-related item
- latex-, pet-,pony-,cock-sleave-, milk-slave and master/mistress
- enforcer/chastiser - makes sure you dont fuck around
- body artist - gies you tattos/piercings
- bondage

feral insects
- Giant wasp
- spider/tarantula
- glyphid swarmers/ Brood hive
- glyphid soldiers

anthro insect
- drider
- bee queen

lower life
- fungus/spore-pod
- vile vine
- lush orchid
- slug
- Naeodocyte shocker
- cave leech
- vampire squid

mechanic
- otter-bot - a otter controlling a mech
- mobile milker/gynochair/inseminator
- mechanic guard

 */

////////////////////////////////////////////////////////
// normal foes
class Mole extends Mob {
    static factory(type){
        let foe = new Mole();
        if(type==='Squirrel'){
            foe.baseName = foe.id = 'Squirrel';
            this.pic= 'squirrel1';
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Mole';
        this.pic= 'squirrel1';//todo
        this.Stats.increment('healthMax',-0.5*(this.health().max));
    }
}
class Wolf extends Mob {
    static factory(type){
        let foe = new Wolf();
        if(type==='AlphaWolf'){
            foe.baseName = foe.id = 'AlphaWolf';
            foe.Stats.increment('healthMax',-0.3*(foe.health().max));
            foe.Skills.addItem(SkillCallHelp.factory('Wolf')); //todo chance to call?
            foe.pic= 'wolf3';
        } else if(type==='Guarddog'){
            foe.baseName = foe.id = 'Guarddog';
            foe.Stats.increment('healthMax',-0.3*(foe.health().max));
            foe.pic= 'hellhound1';
        } else {
            foe.Stats.increment('healthMax',-0.5*(foe.health().max));
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Wolf';
        this.pic= "wolf3";//'assets/battlers/wolf3.svg';
        this.level_min =3;
        this.loot= [{id:'WolfTooth',chance:25,amount:1},{id:'Money',chance:25,amount:20}];
        this.Outfit.addItem(new BaseQuadruped());
        this.Outfit.addItem(SkinFur.factory('wolf','black'));
        this.Outfit.addItem(HandsPaw.factory('wolf'));
        this.Outfit.addItem(PenisHuman.factory('wolf'));
        this.Outfit.addItem(AnusHuman.factory('wolf'));
        this.Outfit.addItem(TailWolf.factory('wolf'));
        this.Outfit.addItem(FaceWolf.factory('wolf'));
        this.Stats.increment('arm_blunt',5);
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};//this._canAct();
        let rnd = _.random(1,100);
        let spawn="CallHelpWolf";
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount%2===0){
            rnd = _.random(0,enemys.length-1);
            result.action = "Bite";
            result.target = [enemys[rnd]];
            result.msg =this.name+" snaps at "+result.target[0].name+".</br>"+result.msg;
            return(result);
        } else if(window.story.state.combat.turnCount>3 && this.Skills.countItem(spawn)>0 && this.Skills.getItem(spawn).isEnabled().OK){
            result.action = spawn;
            result.target = [this];
            result.msg =this.name+" howls to call its pack for support.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
/*class Dragon extends Mob {   //wyvern, quadrupped w/o wings, w/o horns, scales/fur
    static factory(type){
        let foe = new Dragon();
        if(type==='AlphaWolf'){
        }
        return foe;
    }
    constructor(){
        super();
        this.name = this.id = 'Dragon';
        this.pic= "dragon1";
        this.level_min =10;
        this.loot= [{id:'Money',chance:25,amount:20}];
        this.Outfit.addItem(new BaseQuadruped());
        this.Outfit.addItem(SkinFur.factory('wolf','black'));
        this.Outfit.addItem(HandsPaw.factory('wolf'));
        this.Outfit.addItem(PenisHuman.factory('wolf'));
        this.Outfit.addItem(AnusHuman.factory('wolf'));
        this.Outfit.addItem(TailSnake.factory('dragon'));
        this.Outfit.addItem(FaceWolf.factory('wolf'));
        this.Stats.increment('arm_blunt',5);
    }
}*/
class Slime extends Mob { 
    static factory(type){
        let foe = new Slime();
        foe.Outfit.addItem(WeaponSlobber.factory('slime'));
        foe.baseName = foe.id = ((type===undefined)?'Slime':type);
        if(type ==='SlimeTentacled'){
            //todo add tentacles and grappling
            foe.pic='Blob3';
            foe.loot= [{id:'BlueSlime',chance:55,amount:1},{id:'Money',chance:25,amount:20}];
        } else if(type ==='SlimeBig') {
            foe.pic='Blob1';
            foe.Skills.addItem(SkillTransformSelf.factory(['Slime','Slime']))
            foe.loot= [{id:'GreenSlime',chance:55,amount:1},{id:'Money',chance:25,amount:20}];
        } else { //Slime
            foe.loot= [{id:'RedSlime',chance:55,amount:1},{id:'Money',chance:25,amount:20}];
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Slime';
        this.pic= 'Blob4';
        this.level_min =1;
        this.Outfit.addItem(new BaseWorm());
        this.Outfit.addItem(ArmorTorso.factory('slime'));
        this.Stats.increment('rst_light',-20);
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let skill,rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        skill="TransformSelfSlime"
        let health = this.health()
        if(this.id === 'SlimeBig' && window.story.state.combat.turnCount>2 && (health.value/health.max)<0.6 && this.Skills.getItem(skill).isEnabled().OK){
            result.action = skill;
            result.target = [this];
            return(result);
        }
        skill= 'slime-slobber';
        if(window.story.state.combat.turnCount>2 && rnd>30 && this.Skills.getItem(skill).isEnabled().OK){
            rnd = _.random(0,enemys.length-1);
            result.action = skill;
            result.target = [enemys[rnd]];
            result.msg =/*this.fconv("$[I]$ thrust $[my]$ stinger at "+result.target[0].baseName+".</br>")+*/result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class Slug extends Mob { 
    static factory(type){
        let foe = new Slug();
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Slug';
        this.pic= 'slug2';
        this.level_min =1;
        this.Outfit.addItem(new BaseWorm());
        this.Outfit.addItem(FaceLeech.factory('slug')); 
        this.Outfit.addItem(ArmorTorso.factory('slime'));
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.Stats.countItem(effKamikaze.name)<=0 && this.Stats.get('health').rmax<0.5){ //self-exploding
            this.addEffect(effKamikaze.factory(0));
        }
        if(window.story.state.combat.turnCount%2===0){
            rnd = _.random(0,enemys.length-1);
            result.action = "Bite";
            result.target = [enemys[rnd]];
            result.msg =this.name+" slurps at "+result.target[0].name+".</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class Spider extends Mob { 
    static factory(type){
        let foe = new Spider();
        foe.baseName = foe.id = ((type===undefined)?'Spider':type);
        if(type ==='spiderswarm'){
            foe.pic='spider3';
            foe.Stats.increment('healthMax',-0.3*(foe.health().max));
            foe.loot= [{id:'Cobwebs',chance:55,amount:2},{id:'Money',chance:25,amount:20}];
        } else if(type ==='tarantula'){
            foe.pic='spider2';
            foe.loot= [{id:'Cobweb',chance:55,amount:1},{id:'Money',chance:25,amount:20}];
        } else {
            foe.pic='spider1';
            foe.Stats.increment('healthMax',-0.5*(foe.health().max));
            foe.loot= [{id:'Cobwebs',chance:55,amount:1},{id:'Money',chance:25,amount:20}];
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Spider';
        this.pic= 'unknown';
        this.level_min =1;
        this.Outfit.addItem(new BaseInsect());
        this.Outfit.addItem(new ArmorTorso('chitin'));
        this.Outfit.addItem(new FaceInsect('spider')); //todo legs
        this.Skills.addItem(new SkillGrapple());  //todo paralyzing poison
        this.tmp = {grappleCoolDown:2};
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100), skWeb='Grapple';
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount%2===0){
            rnd = _.random(0,enemys.length-1);
            result.action = "Bite";
            result.target = [enemys[rnd]];
            result.msg =this.name+" snaps at "+result.target[0].name+".</br>"+result.msg;
            return(result);
        } else if(this.Effects.countItem(effGrappling.name)>0){
            this.tmp.grappleCoolDown=5;
            result.msg =this.fconv(this.name +" weaves a web around [my] victim.</br>")+result.msg;
            return(result);
        } else if(this.tmp.grappleCoolDown<=0 && this.Skills.countItem(skWeb)>0 && this.Skills.getItem(skWeb).isEnabled().OK){
            this.tmp.grappleCoolDown=3;
            rnd = _.random(0,enemys.length-1);
            result.action = skWeb;
            result.target = [enemys[rnd]];
            result.msg =this.fconv(this.name + " trys to entangle "+result.target[0].name+" in a web.</br>")+result.msg;
            return(result);
        } else {
            this.tmp.grappleCoolDown-=1;
        } 
        return(super.calcCombatMove(enemys,friends));
    }
}
class Leech extends Mob {
    static factory(type){
        let foe = new Leech();
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Leech';
        this.pic= 'leech2';
        this.level_min =1;
        this.Outfit.addItem(new BaseWorm());
        this.Outfit.addItem(FaceLeech.factory('leech'));
        this.Skills.addItem(new SkillLeechHealth());
        this.tmp = {grappleCoolDown:1};
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.Effects.countItem(effGrappling.name)>0){
            this.tmp.grappleCoolDown=2;
            result.msg =this.fconv(this.name +" sucks blood.</br>")+result.msg;
            return(result);
        } else if(this.tmp.grappleCoolDown<=0){
            this.tmp.grappleCoolDown=2;
            rnd = _.random(0,enemys.length-1);
            result.action = "Leech";
            result.target = [enemys[rnd]];
            result.msg =this.fconv("$[I]$ $[snap]$ at "+result.target[0].name+".</br>")+result.msg;
            return(result);
        } else {
            this.tmp.grappleCoolDown-=1;
        } 
        return(super.calcCombatMove(enemys,friends));
    }
}
class Lizan extends Mob {
    static factory(type){
        let foe = new Lizan();
        if(type==='spearthrower'){
            foe.Outfit.addItem(window.gm.ItemsLib['SpearStone']());
        } else {
            foe.Outfit.addItem(new DaggerSteel());
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Lizan';
        this.pic= 'lizan1';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinScales.factory('lizard'));
        this.Outfit.addItem(HandsHuman.factory('lizard'));
        this.Outfit.addItem(BreastHuman.factory('lizard'));
        this.Outfit.addItem(FaceWolf.factory('lizard'));
        this.Outfit.addItem(AnusHuman.factory('lizard'));
        this.Outfit.addItem(PenisHuman.factory('lizard'));
        this.Outfit.addItem(ShortsLeather.factory(100));
        let sk = new SkillGuard();
        sk.style=2;
        this.Skills.addItem(sk);
        this.levelUp(3);
        this.autoLeveling();
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        let rnd = _.random(1,100);
        result.action =result.target= null;
        //todo shoot arrow, pounce, throw net
        if(window.story.state.combat.turnCount%2===0){
            result.action = "Guard";
            result.target = [this];
            result.msg =this.name+" croutches into a defensive stance.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class AnthroFox extends Mob {
    static factory(type){
        let foe = new AnthroFox();
        if(type==='Huntress'){
            foe.Outfit.addItem(window.gm.ItemsLib['SpearStone']());
        } else {
            foe.Outfit.addItem(new DaggerSteel());
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'AnthroFox';
        this.pic= 'unknown';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinFur.factory('fox'));
        this.Outfit.addItem(HandsHuman.factory('fox'));
        this.Outfit.addItem(BreastHuman.factory('fox'));
        this.Outfit.addItem(FaceWolf.factory('fox'));
        this.Outfit.addItem(AnusHuman.factory('fox'));
        this.Outfit.addItem(TailWolf.factory('fox'));
        this.Outfit.addItem(VulvaHuman.factory('fox'));
        this.Outfit.addItem(ShortsLeather.factory(100));
    }
}
class AnthroCat extends Mob {
    static factory(type){
        let foe = new AnthroCat();
        if(type==='Huntress'){
            foe.Outfit.addItem(window.gm.ItemsLib['SpearStone']());
        } else {
            foe.Outfit.addItem(new DaggerSteel());
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'AnthroCat';
        this.pic= 'unknown';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinFur.factory('cat'));
        this.Outfit.addItem(HandsHuman.factory('cat'));
        this.Outfit.addItem(BreastHuman.factory('cat'));
        this.Outfit.addItem(FaceWolf.factory('cat'));
        this.Outfit.addItem(AnusHuman.factory('cat'));
        this.Outfit.addItem(TailWolf.factory('cat'));
        this.Outfit.addItem(VulvaHuman.factory('cat'));
        this.Outfit.addItem(ShortsLeather.factory(100));
        //let sk = new SkillKick();this.Skills.addItem(sk);
    }
}
class AnthroWolf extends Mob {
    static factory(type){
        let foe = new AnthroWolf();
        if(type==='Wolfman'){
            foe.pic= 'WolfMan1'
            foe.Outfit.addItem(window.gm.ItemsLib['SpearStone']());
        } else {
            foe.Outfit.addItem(new DaggerSteel());
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'AnthroWolf';
        this.pic= 'unknown';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinFur.factory('wolf'));
        this.Outfit.addItem(HandsHuman.factory('wolf'));
        this.Outfit.addItem(BreastHuman.factory('wolf'));
        this.Outfit.addItem(FaceWolf.factory('wolf'));
        this.Outfit.addItem(AnusHuman.factory('wolf'));
        this.Outfit.addItem(TailWolf.factory('wolf'));
        this.Outfit.addItem(VulvaHuman.factory('wolf'));
        this.Outfit.addItem(ShortsLeather.factory(100));
        //let sk = new SkillKick();this.Skills.addItem(sk);
    }
}
class Lapine extends Mob {
    static factory(type){
        let foe = new Lapine();
        if(type==='spearthrower'){
            foe.Outfit.addItem(window.gm.ItemsLib['SpearStone']());
        } else {
            foe.Outfit.addItem(new DaggerSteel());
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Lapine';
        this.pic= 'Bunny1';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinFur.factory('bunny'));
        this.Outfit.addItem(HandsHuman.factory('bunny'));
        this.Outfit.addItem(BreastHuman.factory('bunny'));
        this.Outfit.addItem(FaceHorse.factory('bunny'));
        this.Outfit.addItem(AnusHuman.factory('bunny'));
        this.Outfit.addItem(VulvaHuman.factory('bunny'));
        this.Outfit.addItem(ShortsLeather.factory(100));
        let sk = new SkillKick();
        this.Skills.addItem(sk);
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        let rnd = _.random(1,100);
        result.action =result.target= null;
        let skill = this.Skills.getItem("Kick");
        if(window.story.state.combat.turnCount>2 && rnd>50 && skill.isEnabled().OK){
            result.action = skill.name;
            rnd = _.random(0,enemys.length-1);
            result.target = [enemys[rnd]];
            result.msg =this.name+" prepares for a powerful jump-kick.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class Succubus extends Mob {
    static factory(type){
        let foe = new Succubus();
        if(type==='succubus'){
            foe.Outfit.addItem(window.gm.ItemsLib.WhipLeather());
            foe.Skills.addItem(SkillCallHelp.factory('WispShield',4)); //todo chance to call?
        } else if(type==="nurse"){
            foe.baseName = foe.id = 'BNurse';
            foe.pic= 'Nurse1';
            foe.Outfit.addItem(window.gm.ItemsLib.Syringe());
        } 
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Succubus';
        this.pic= 'succubus1';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinHuman.factory("human"));
        this.Outfit.addItem(HandsHuman.factory('human'));
        this.Outfit.addItem(BreastHuman.factory('human'));
        this.Outfit.addItem(FaceHuman.factory('human'));
        this.Outfit.addItem(AnusHuman.factory('human'));
        this.Outfit.addItem(VulvaHuman.factory('human'));
        this.Outfit.addItem(new BikiniBottomLeather());
        this.Outfit.addItem(new BikiniTopLeather());
        let sk = new SkillGuard();
        sk.style=2;
        this.Skills.addItem(sk);
        this.levelUp(4);
        this.autoLeveling();
        let x= new SkillTease();x.level=3;
        this.Skills.addItem(x);
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        let rnd = _.random(1,100),spawn='CallHelpWispShield';
        result.action =result.target= null;
        //todo whiplash, call tentacles
        if(this.Skills.countItem(spawn)>0 && this.Skills.getItem(spawn).isEnabled().OK){
            result.action = spawn;
            result.target = [this];
            result.msg =this.name+" conjures some protective wisps.</br>";//+result.msg;
            return(result);
        }else if (window.story.state.combat.turnCount %2 ===0){
            rnd = _.random(0,enemys.length-1);
            result.action = "Tease";
            result.target = [enemys[rnd]];
            result.msg =this.name+" throws a kiss at "+result.target[0].name+".</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class Dryad extends Mob {
    static factory(type){
        let foe = new Dryad();
        return foe;
    }
    constructor(){
        super();
        this.name = this.id = 'Dryad';
        this.pic= 'unknown';
        this.loot= [{id:'DryadVine',chance:25,amount:1}];
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinHuman.factory("human"));
        this.Outfit.addItem(HandsHuman.factory('human'));
        this.Outfit.addItem(BreastHuman.factory('human'));
        this.Outfit.addItem(FaceHuman.factory('human'));
        this.Outfit.addItem(AnusHuman.factory('human'));
        this.Outfit.addItem(VulvaHuman.factory('human'));
        this.Outfit.addItem(new BikiniBottomLeather());
        this.Skills.addItem(SkillCallHelp.factory('Vine'));
        this.levelUp(3);
        this.autoLeveling();
        this.tmp = {vines:0};
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.tmp.vines<1){
            this.tmp.vines+=1;
            result.msg =this.fconv(this.name +" starts to summon something...</br>")+result.msg;
            result.action='CallHelp';
            result.target=[this];
            return(result);
        }
        //todo poison
        return(super.calcCombatMove(enemys,friends));
    }
}
class Vine extends Mob {
    static factory(type){
        let foe = new Vine();
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Vine';
        this.pic= 'unknown';
        this.Outfit.addItem(new BaseWorm());
        this.Skills.addItem(new SkillGrapple());
        this.tmp = {grappleCoolDown:1};
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.Effects.countItem(effGrappling.name)>0){
            this.tmp.grappleCoolDown=5;
            result.msg =this.fconv(this.name +" entwines its prey.</br>")+result.msg;
            return(result);
        } else if(this.tmp.grappleCoolDown<=0){
            this.tmp.grappleCoolDown=2;
            rnd = _.random(0,enemys.length-1);
            result.action = "Grapple";
            result.target = [enemys[rnd]];
            result.msg =this.fconv(this.name + " wraps itself around "+result.target[0].name+".</br>")+result.msg;
            return(result);
        } else {
            this.tmp.grappleCoolDown-=1;
        } 
        return(super.calcCombatMove(enemys,friends));
    } 
}
class Fungus extends Mob {
    static factory(type){
        let foe = new Fungus();
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Fungus';
        this.pic= 'Fungi1';
        this.tmp={hitBy:''};
        this.Outfit.addItem(new BaseWorm());
        this.Skills.addItem(new SkillPoisonCloud());
    }
    addEffect(effect,id,who){
        super.addEffect(effect,id,who);
        this.tmp.hitBy=(who)?who.id:'';
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.id === 'Fungus'){
            let skill= 'PoisonCloud';
            if(this.tmp.hitBy!='' && this.Skills.getItem(skill).isEnabled().OK){
                result.action = skill;
                result.target = enemys.concat(friends); //affect all
                result.msg =this.fconv("$[I]$ $[release]$ a cloud of toxic spores into the air.</br>")+result.msg;
                return(result);
            }
        } 
        return({OK:true,msg:'',action:null,target:null});
    } 
}
class Mechanic extends Mob {
    static factory(type){
        let foe = new Mechanic();
        foe.Skills.addItem(new SkillStun());
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Mechanical-Guy';
        this.pic= 'unknown';
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount<3){
            rnd = _.random(0,enemys.length-1);
            result.action = "Stun";
            result.target = [enemys[rnd]];
            result.msg =this.name+" trys to hit your head whith his wrench.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class Hawk extends Mob {
    static factory(type){
        let foe = new Hawk();
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Hawk';
        this.pic= 'Hawk1';
        this.level_min =1;
        this.Outfit.addItem(new BaseBiped());
        this.Outfit.addItem(new ArmorTorso('feathers'));
        this.Outfit.addItem(new SkinFeathers('hawk'));
        this.Outfit.addItem(new FaceBird('hawk'));
        this.Outfit.addItem(Wings.factory('feathered'));
        this.Outfit.addItem(PenisHuman.factory('bird'));
        this.Outfit.addItem(AnusHuman.factory('bird'));
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.id === 'Hawk'){
            let skill= 'Fly';
            if(this.Skills.getItem(skill).isEnabled().OK && !this.Skills.getItem(skill).isActive().OK){
                result.action = skill;
                result.target = [this];
                result.msg =this.fconv(result.target[0].name + " starts flying.</br>")+result.msg;
                return(result);
            }
        } 
        return(super.calcCombatMove(enemys,friends));
    }
}
class Hive extends Mob {
    static factory(type){
        let foe = new Hive();
        if(type==='Hornett'){
            foe.baseName = foe.id = 'HornettHive';
            foe.pic= 'WaspHive';
            foe.Stats.increment('arm_blunt',15);
            foe.Stats.increment('arm_pierce',15);
            foe.Stats.increment('arm_slash',15);
            foe.Stats.increment('rst_fire',-50);
            foe.Stats.increment('healthMax',-0.3*(foe.health().max));
            foe.Skills.addItem(SkillCallHelp.factory('Hornett')); 
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Hive';
        this.pic= 'unknown';
        this.level_min =1;this.loot= [];
        this.Outfit.addItem(new BaseWorm());
        this.cooldown=0;
    }
    calcCombatMove(enemys,friends){
        let result = {OK:false,msg:''};
        let rnd,spawn="CallHelpHornett";
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount>2 && this.Skills.countItem(spawn)>0 &&
            this.Skills.getItem(spawn).isEnabled().OK){
                if(friends.length===1 || (friends.length<3 && this.cooldown<=0 ) ){
                    result.action = spawn;
                    result.target = [this];
                    this.cooldown = 4;
                    result.msg =this.name+" pops out another opponent.</br>"+result.msg;
                } else {
                    this.cooldown-=1;
                }
            return(result);
        }
        return(result);
    }
}
class Hornett extends Mob {
    static factory(type){
        let foe = new Hornett();
        if(type==='PillRoller'){
            foe.baseName = foe.id = 'PillRoller';
            foe.pic= 'PillRoller1';
        } else if(type==='Hornett'){
            foe.Outfit.addItem(WeaponStinger.factory('wasplike'));
            foe.Outfit.addItem(Wings.factory('chitinous'));
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Hornett';
        this.pic= 'wasp1';
        this.level_min =1;
        this.loot= [{id:'Beewax',chance:25,amount:1},{id:'Money',chance:50,amount:20}];
        this.Outfit.addItem(new BaseInsect());
        this.Outfit.addItem(new ArmorTorso('chitin'));
        this.Outfit.addItem(new FaceInsect('wasp'));
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.id === 'Hornett'){
            let skill= 'Fly';
            if(this.Skills.getItem(skill).isEnabled().OK && !this.Skills.getItem(skill).isActive().OK){
                result.action = skill;
                result.target = [this];
                result.msg =this.fconv(result.target[0].name + " starts flying.</br>")+result.msg;
                return(result);
            }
            skill= 'wasp-stinger';
            if(this.Skills.getItem(skill).isEnabled().OK){
                rnd = _.random(0,enemys.length-1);
                result.action = skill;
                result.target = [enemys[rnd]];
                result.msg =/*this.fconv("$[I]$ thrust $[my]$ stinger at "+result.target[0].name+".</br>")+*/result.msg;
                return(result);
            }
        } 
        return(super.calcCombatMove(enemys,friends));
    }
}
class Naga extends Mob {
    static factory(type){
        let foe = new Naga();
        if(type="Quetzal"){
            this.baseName = this.id = type;
            this.Outfit.addItem(Wings.factory('feathered'));
        }
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Naga';
        this.pic= 'naga1';
        this.level_min =1;
        this.Outfit.addItem(new BaseWorm());
        this.Outfit.addItem(new ArmorTorso('scales'));
        this.Outfit.addItem(new SkinScales('lizard'));
        this.Outfit.addItem(new FaceWolf('lizard'));
        this.Outfit.addItem(TailSnake.factory('naga'));
        this.Outfit.addItem(HandsHuman.factory('lizard'));
        this.Outfit.addItem(PenisHuman.factory('lizard'));
        this.Outfit.addItem(AnusHuman.factory('bird'));
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.id === 'Quetzal'){
            let skill= 'Fly';
            if(this.Skills.getItem(skill).isEnabled().OK && !this.Skills.getItem(skill).isActive().OK){
                result.action = skill;
                result.target = [this];
                result.msg =this.fconv(result.target[0].name + " starts flying.</br>")+result.msg;
                return(result);
            }
        } 
        return(super.calcCombatMove(enemys,friends));
    }
}
class Wisp extends Mob {
    static factory(type){
        let foe = new Wisp();
        if(type==='WispShield'){
            foe.baseName = foe.id = 'WispShield';
            foe.Skills.addItem(SkillProtect.factory(0));
            foe.Stats.increment('rst_light',-20);
            foe.Stats.increment('rst_spark',-20);
            foe.Stats.increment('arm_slash',5);
            foe.Stats.increment('arm_pierce',5);
            foe.Stats.increment('arm_blunt',5);
        } 
        return foe;
    }
    constructor(){
        super();
        this.baseName = this.id = 'Wisp';
        this.pic= 'wisp1';
        this.Outfit.addItem(new BaseWorm());
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100),skn='Protect',skill=null;
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.Skills.countItem(skn)>0 && (skill=this.Skills.getItem(skn),skill.isEnabled().OK)){
            let _t=skill.targetFilter(friends.map(function(x){return([x])}));//need to priorize target?
            if(_t.length<=0) return(super.calcCombatMove(enemys,friends));
            result.action = skn;
            result.target = _t[0];
            result.msg =/*this.fconv(this.name + " will protect."+result.target[0].name+"</br>")+*/ result.msg;
            return(result);
        } 
        return(super.calcCombatMove(enemys,friends));
    } 
}
/////////////////////////////////////////////////////////
// special NPC
class Carlia extends Mob {
  constructor(){
      super();
      this.baseName = this.id = 'Carlia';
      this.pic= 'unknown';
      this.Outfit.addItem(new BaseHumanoid());
      this.Outfit.addItem(new SkinHuman());
      this.Outfit.addItem(HandsHuman.factory('cat'));
      this.Outfit.addItem(FaceWolf.factory('cat'));
      this.Outfit.addItem(BreastHuman.factory('human'));
      CSS
      this.Outfit.addItem(VulvaHuman.factory('human'));
      this.Outfit.addItem(new BikiniBottomLeather());
      this.Outfit.addItem(new BikiniTopLeather());
      this.levelUp(3);
      this.autoLeveling();
  }
}
class Ruff extends Mob {
    constructor(){
        super();
        this.baseName = this.id = 'Ruff';
        this.Outfit.addItem(new BaseQuadruped());
        this.Outfit.addItem(SkinFur.factory('wolf','black'));
        this.Outfit.addItem(HandsPaw.factory('wolf'));
        this.Outfit.addItem(PenisHuman.factory('wolf'));
        this.Outfit.addItem(AnusHuman.factory('wolf'));
        this.Outfit.addItem(TailWolf.factory('wolf'));
        this.Outfit.addItem(FaceWolf.factory('wolf'));
        this.Stats.increment('arm_blunt',5);
        this.levelUp(7);
        this.autoLeveling();
    }
    get pic(){return('wolf3');}
    toJSON(){return window.storage.Generic_toJSON("Ruff", this); }
    static fromJSON(value){
        let _x=window.storage.Generic_fromJSON(Ruff, value.data);
        _x.rebuildAfterLoad();
        /*_x.Effects._relinkItems();
        _x.Stats._relinkItems();
        _x.Inv._relinkItems();
        _x.Outfit._relinkItems();
        _x.Wardrobe._relinkItems();
        _x.Rel._relinkItems();
        _x.Skills._relinkItems();*/
        return(_x);}
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};//this._canAct();
        let rnd = _.random(1,100);
        let spawn="CallHelpWolf";
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount%2===0){
            rnd = _.random(0,enemys.length-1);
            result.action = "Bite";
            result.target = [enemys[rnd]];
            result.msg =this.name+" snaps at "+result.target[0].name+".</br>"+result.msg;
            return(result);
        } else if(window.story.state.combat.turnCount>3 && this.Skills.countItem(spawn)>0 &&
            this.Skills.getItem(spawn).isEnabled().OK){
            result.action = spawn;
            result.target = [this];
            result.msg =this.name+" howls to call its pack for support.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class Clyde extends AnthroFox {
    constructor(){
        super();
        this.baseName = this.id = 'Clyde';
        this.Outfit.addItem(AnusHuman.factory('wolf'));
        this.Outfit.addItem(PenisHuman.factory('wolf'));
        this.levelUp(7);
        this.autoLeveling();
    }
}
class Trent extends Mob {
    constructor(){
        super();
        this.baseName = this.id = 'Trent';
        this.pic= 'unknown';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinFur.factory('horse', 'brown'));
        this.Outfit.addItem(HandsHuman.factory('horse'));
        this.Outfit.addItem(TailWolf.factory('horse'));
        this.Outfit.addItem(FaceWolf.factory('horse'));
        this.Outfit.addItem(AnusHuman.factory('horse'));
        this.Outfit.addItem(PenisHuman.factory('horse'));
        this.Outfit.addItem(new ShortsLeather());
        this.Outfit.addItem(new MaceSteel());
        this.levelUp(6);//this.Stats.increment('strength',3);
        this.autoLeveling();
    }
}
//collection of mob-constructors
window.gm.Mobs = (function (Mobs){
    //unique chars that are in save-game need a constructor
    window.storage.registerConstructor(Mob);//some characters derive from Mob
    window.storage.registerConstructor(Ruff);
    //
    Mobs.AnthroCat = function(){ return function(param){return(AnthroCat.factory(param));}("AnthroCat")};
    Mobs.AnthroFox = function(){ return function(param){return(AnthroCat.factory(param));}("AnthroFox")};
    Mobs.Fungus = Fungus.factory;
    Mobs.Huntress = function(){ return function(param){return(AnthroCat.factory(param));}("Huntress")};
    Mobs.Lapine = Lapine.factory;
    Mobs.Mole = Mole.factory;
    Mobs.Naga = Naga.factory;
    Mobs.Squirrel = function(){ return function(param){return(Mole.factory(param));}("Squirrel")};
    Mobs.Hawk = function(){ return function(param){return(Hawk.factory(param));}("Hawk")};
    Mobs.HornettHive = function(){ return function(param){return(Hive.factory(param));}("Hornett")};
    Mobs.Hornett = function(){ return function(param){return(Hornett.factory(param));}("Hornett")};
    Mobs.PillRoller = function(){ return function(param){return(Hornett.factory(param));}("PillRoller")};
    Mobs.Slime = Slime.factory;
    Mobs.Lizan = Lizan.factory;
    Mobs.Wolf = Wolf.factory;
    Mobs.AnthroWolf = AnthroWolf.factory;
    Mobs.Leech = Leech.factory;  
    Mobs.Slug = Slug.factory;
    Mobs.Spider = Spider.factory;
    Mobs.Succubus = Succubus.factory;
    Mobs.Dryad = Dryad.factory; 
    Mobs.Vine = Vine.factory; 
    Mobs.Mechanic = Mechanic.factory;
    Mobs.Wisp = Wisp.factory;
    Mobs.WispShield = function(){ return function(param){return(Wisp.factory(param));}("WispShield")};
    return Mobs; 
}(window.gm.Mobs || {}));