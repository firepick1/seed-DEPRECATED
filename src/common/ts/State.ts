///<reference path='../include.d.ts'/>
module seedmodule {
	export class State {
		message: string = "This is a message";
		stateId: number = 1;

		constructor(obj = undefined) {
			if (typeof obj === 'string') {
			  obj = JSON.parse(obj);
			}  else if (typeof obj === 'object') {
			  if (obj.hasOwnProperty("message")) this.message = obj.message;
			  if (obj.hasOwnProperty("stateId")) this.stateId = obj.stateId;
			} else if (typeof obj === 'undefined') {
			  // default constructor
			} else {
			   throw "State(" + obj + "?)";
			}
		}

		clone(): State {
			return new State(this);
		}
  }
}

exports.State = seedmodule.State;
