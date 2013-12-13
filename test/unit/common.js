'use strict';

describe('common-js-tests', function(){
	it('6. should create a MachineState', inject(function() {
		var state = new firemote.MachineState();
		expect(state.gantries[0].head.spindles[0].name).toBe("Left");
		expect(state.gantries[0].head.spindles.length).toBe(1);
		expect(state.trayFeeders[0].axis.name).toBe("Tray Feeder");
		expect(state.pcbFeeders[0].axis.name).toBe("PCB Feeder");
		expect(state.logLevel).toBe("INFO");
		expect(state.firefuse).toBe(true);
		expect(state.stateId).toBe(1);
		expect(state.message).toBe("FirePick machine state");
    var json = JSON.stringify({
			message:"M",
			stateId:123,
			logLevel:"TRACE",
			firefuse:false,
			gantries:[
				{ head:{
						spindles:[
							{name:"L",on:true,pos:200},
							{"name":"R","on":true,"pos":200}
						],
						angle:0
					},
					axis:{name:"G",posMax:200,pos:20,jog:2,calibrate:false}
				}
			],
			trayFeeders:[
				{axis:{name:"T", posMax:300,"pos":30,"jog":3,"calibrate":false}}
			],
			pcbFeeders:[
			  {axis:{name:"P", posMax:400,"pos":40,"jog":4,"calibrate":false}}
			]}); 

		var state2 = new firemote.MachineState(json);
		expect(state2.stateId).toBe(123);
		expect(state2.message).toBe("M");
		expect(state2.firefuse).toBe(false);
		expect(state2.logLevel).toBe("TRACE");
		expect(state2.gantries[0].head.spindles[0].name).toBe("L");
		expect(state2.gantries[0].head.spindles[1].name).toBe("R");
		expect(state2.gantries[0].axis.posMax).toBe(200);
		expect(state2.gantries[0].axis.pos).toBe(20);
		expect(state2.gantries[0].axis.jog).toBe(2);
		expect(state2.gantries[0].axis.name).toBe("G");
		expect(state2.trayFeeders[0].axis.name).toBe("T");
		expect(state2.trayFeeders[0].axis.pos).toBe(30);
		expect(state2.trayFeeders[0].axis.posMax).toBe(300);
		expect(state2.trayFeeders[0].axis.jog).toBe(3);
		expect(state2.pcbFeeders[0].axis.name).toBe("P");
		expect(state2.pcbFeeders[0].axis.posMax).toBe(400);
		expect(state2.pcbFeeders[0].axis.pos).toBe(40);
		expect(state2.pcbFeeders[0].axis.jog).toBe(4);
		expect(state2.gantries[0].axis.pos = 2000).toBe(2000);
		expect(state2.validate().gantries[0].axis.pos).toBe(200);

		var axes = state.linearAxes();
		var axes2 = state2.linearAxes();
		var df = new firemote.DeltaFactory();

		expect(df.diff([
        { name : 'Gantry', gcAxis : 'y', pos : 0, posMax : 100, jog : 1, calibrate : false }, 
				{ name : 'PCB Feeder', gcAxis : 'z', pos : 0, posMax : 100, jog : 1, calibrate : false }, 
				{ name : 'Tray Feeder', gcAxis : 'x', pos : 0, posMax : 100, jog : 1, calibrate : false },
				],axes)).toEqual(false);

		expect(df.diff([
        { name : 'G', gcAxis : 'y', pos : 200, posMax : 200, jog : 2, calibrate : false }, 
				{ name : 'P', gcAxis : 'z', pos : 40, posMax : 400, jog : 4, calibrate : false }, 
				{ name : 'T', gcAxis : 'x', pos : 30, posMax : 300, jog : 3, calibrate : false },
		],axes2)).toEqual(false);

		expect(df.diff(axes, axes2)).toEqual([
				{ name : 'G', pos : 200, posMax : 200, jog : 2 }, 
				{ name : 'P', pos : 40, posMax : 400, jog : 4 }, 
				{ name : 'T', pos : 30, posMax : 300, jog : 3 }, 
				]);
		
		expect(state.linearMotionGCode(state2)).toEqual("G0y200z40x30");

	}));

  it('7. should create a DeltaFactory', inject(function() {
			var factory = new firemote.DeltaFactory();
			expect(factory.diff({a:1,b:true,c:'red','$$hashKey':'009'}, {a:1,b:true,c:'red'})).toBe(false);
			expect(factory.diff({a:1,b:true,c:'red'}, {a:2,b:true,c:'red'})).toEqual({a:2});
			expect(factory.diff({a:1,b:true,c:'red'}, {a:1,b:false,c:'red'})).toEqual({b:false});
			expect(factory.diff({a:1,b:true,c:'red'}, {a:1,b:true,c:'blue'})).toEqual({c:'blue'});
			expect(factory.diff({a:1,b:2}, {a:1,b:2,c:3})).toEqual({c:3});
			expect(factory.diff({a:1,b:2}, {a:1})).toEqual({b:undefined});
			expect(factory.diff({a:1,b:2}, {a:3,b:2})).toEqual({a:3});
			expect(factory.diff({a:1,b:2}, {a:3,b:'hello'})).toEqual({a:3,b:'hello'});
			expect(factory.diff({a:1,b:{c:2},d:3}, {a:1,b:'hello'})).toEqual({b:'hello',d:undefined});
			expect(factory.diff({a:1,b:{c:2},d:3}, {a:1,b:{c:3}})).toEqual({b:{c:3},d:undefined});
			expect(factory.diff({a:1,b:{c:2,d:3,e:4},f:5}, {a:1,b:{c:2,d:-3,e:4},f:5})).toEqual({b:{d:-3}});
			expect(factory.diff({a:1,b:{c:2,d:3,e:4},f:5}, {a:1,b:{c:3,d:3},f:6})).toEqual({b:{c:3,e:undefined},f:6});

			expect(factory.diff([1,2,3],[1,2,3])).toEqual(false);
			expect(factory.diff([1,2,3],[1,-2,3])).toEqual([undefined,-2,undefined]);
			expect(factory.diff([{a:1},{b:{c:2,d:3}},{e:4}],[{a:1},{b:{c:2,d:-3}},{e:4}])).toEqual([undefined,{b:{d:-3}},undefined]);
			expect(factory.diff([{a:1},{b:{c:2,d:3}},{e:4}],[{a:-1},{b:{c:2,d:3}},{e:-4}])).toEqual([{a:-1},undefined, {e:-4}]);

			var axis1 = new firemote.LinearAxis({pos:101,posMax:501});
			var axis2 = new firemote.LinearAxis({pos:102,posMax:502});
			expect(factory.diff(axis1, axis1.clone())).toEqual(false);
			expect(factory.diff(axis1, axis2)).toEqual({pos:102, posMax:502});

			var pcbFeeder1 = new firemote.PcbFeeder();
			var trayFeeder1 = new firemote.TrayFeeder();
			expect(factory.diff(pcbFeeder1, trayFeeder1)).toEqual({axis: {name:'Tray Feeder', gcAxis:'x'}});

			var gantry1 = new firemote.Gantry();
			var gantry2 = new firemote.Gantry();
			gantry2.head.spindles[0].name = "L";
			expect(factory.diff(gantry1, gantry2)).toEqual({head:{spindles:[{name:"L"}]}});

			expect(factory.applyDiff({a:2},{a:1,b:true,c:'red'})).toEqual({a:2,b:true,c:'red'});
			expect(factory.applyDiff({b:false},{a:1,b:true,c:'red'})).toEqual({a:1,b:false,c:'red'});
			expect(factory.applyDiff({c:'blue'},{a:1,b:true,c:'red'})).toEqual({a:1,b:true,c:'blue'});
			expect(factory.applyDiff({a:-1,b:{d:-3},f:'blue'},{a:1,b:{c:2,d:3,e:4},f:'red'})).toEqual({a:-1,b:{c:2,d:-3,e:4},f:'blue'});
			expect(factory.applyDiff([undefined, undefined, undefined, undefined],[1,true,'red',{a:1,b:{c:2}}])).toEqual([1,true,'red',{a:1,b:{c:2}}]);
			expect(factory.applyDiff([2, undefined, undefined, undefined],[1,true,'red',{a:1,b:{c:2}}])).toEqual([2,true,'red',{a:1,b:{c:2}}]);
			expect(factory.applyDiff([undefined, false, 'blue', undefined],[1,true,'red',{a:1,b:{c:2}}])).toEqual([1,false,'blue',{a:1,b:{c:2}}]);
			expect(factory.applyDiff([undefined, false, 'blue', {b:{c:-2}}],[1,true,'red',{a:1,b:{c:2}}])).toEqual([1,false,'blue',{a:1,b:{c:-2}}]);
			expect(factory.applyDiff([undefined, {b:{c:[undefined,-2,-3]}}],[1,{a:1,b:{c:[1,2,3]}}])).toEqual([1,{a:1,b:{c:[1,-2,-3]}}]);
  }));

  it('1. should create a Part', inject(function() {
			var part = new firemote.Part();
			expect(part.name).toBe("0 ohm resistor");
			expect(part.pcbId).toBe("R0");

			var part2 = part.clone().clone();
			part.name ="A";
			part.pcbId = "B";
			expect(part2.name).toBe("0 ohm resistor");
			expect(part2.pcbId).toBe("R0");
			expect(part.name).toBe("A");
			expect(part.pcbId).toBe("B");

			var part3 = part.clone();
			expect(part3.name).toBe("A");
			expect(part3.pcbId).toBe("B");
	}));

  it('2. should create an LinearAxis', inject(function() {
			// Test default
			var axis = new firemote.LinearAxis();
			expect(axis.name).toBe("Unknown axis");
			expect(axis.pos).toBe(0);
			expect(axis.posMax).toBe(100);
			expect(axis.jog).toBe(1);
			expect(axis.calibrate).toBe(false);

			// Test constructor
			axis = new firemote.LinearAxis({name:"Gantry", posMax:500});
			expect(axis.name).toBe("Gantry");
			expect(axis.pos).toBe(0);
			expect(axis.posMax).toBe(500);
			expect(axis.jog).toBe(1);
			expect(axis.calibrate).toBe(false);

			// Test clone()
			axis.pos = 1;
			axis.posMax = 101;
			axis.jog = 2;
			var axis2 = axis.clone().clone();
			axis.pos = 2;
			axis.name = "blueberry";
			axis.jog = 3;
			axis.posMax = 4;
			axis.calibrate = true;
			expect(axis.name).toBe("blueberry");
			expect(axis.pos).toBe(2);
			expect(axis.posMax).toBe(4);
			expect(axis.jog).toBe(3);
			expect(axis.calibrate).toBe(true);
			expect(axis2.name).toBe("Gantry");
			expect(axis2.pos).toBe(1);
			expect(axis2.posMax).toBe(101);
			expect(axis2.jog).toBe(2);
			expect(axis2.calibrate).toBe(false);
  }));

  it('3. should create a Spindle', inject(function() {
			// Test default
			var spindle = new firemote.Spindle();
			expect(spindle.name).toBe("Spindle");
			expect(spindle.pos).toBe(100);
			expect(spindle.on).toBe(false);
			expect(spindle.part).toBe();

			// Test constructor
			var spindle2 = new firemote.Spindle({name:"Right", pos:50, on:true});
			expect(spindle2.name).toBe("Right");
			expect(spindle2.pos).toBe(50);
			expect(spindle2.on).toBe(true);
			expect(spindle2.part).toBe();
			spindle2.part = new firemote.Part();
			spindle2.pos = 0;
			expect(spindle2.pos).toBe(0);
			expect(spindle2.part.pcbId).toBe("R0");

			// Test clone()
			spindle2 = spindle.clone().clone();
			spindle.name = "X";
			spindle.on = true;
			spindle.pos  = 0;
			expect(spindle2.name).toBe("Spindle");
			expect(spindle2.pos).toBe(100);
			expect(spindle2.on).toBe(false);
  }));

	it('4. should create a Head', inject(function() {
			// Test default
			var head = new firemote.Head();
			expect(head.spindles.length).toBe(1);
			expect(head.spindles[0].name).toBe("Left");
			expect(head.angle).toBe(0);
			head = new firemote.Head({spindles:[{name:"L"}]});
			expect(head.spindles[0].name).toBe("L");
			expect(head.spindles.length).toBe(1);
			head = new firemote.Head({spindles:[{name:"L"}, {name:"R"}]});
			expect(head.spindles.length).toBe(2);
			expect(head.spindles[0].name).toBe("L");
			expect(head.spindles[1].name).toBe("R");
			head = new firemote.Head({spindles:[{name:"L"}, {name:"R"}]});
			expect(head.spindles[0].name).toBe("L");
			expect(head.spindles[1].name).toBe("R");

			var head2 = head.clone().clone();
			head.spindles[0].name = "x";
			head.spindles[1].name = "y";
			head.angle = 360;
			expect(head.spindles[0].name).toBe("x");
			expect(head.spindles[1].name).toBe("y");
			expect(head.angle).toBe(360);
			expect(head2.spindles[0].name).toBe("L");
			expect(head2.spindles[1].name).toBe("R");
			expect(head2.angle).toBe(0);
	}));

	it('5. should create a Gantry', inject(function() {
		 var gantry = new firemote.Gantry();
		 expect(gantry.head.spindles.length).toBe(1);
		 expect(gantry.head.spindles[0].name).toBe("Left");
		 expect(gantry.axis.name).toBe("Gantry");

		 gantry = new firemote.Gantry({axis:{name:"G"}, head:{spindles:[{name:"S0"},{name:"S1"},{name:"S2"},{name:"S3"}]}});
		 expect(gantry.head.spindles.length).toBe(4);
		 expect(gantry.head.spindles[0].name).toBe("S0");
		 expect(gantry.head.spindles[1].name).toBe("S1");
		 expect(gantry.head.spindles[2].name).toBe("S2");
		 expect(gantry.head.spindles[3].name).toBe("S3");
		 expect(gantry.axis.name).toBe("G");
	}));

});
