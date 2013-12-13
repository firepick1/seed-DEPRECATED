///<reference path='../include.d.ts'/>
var seedmodule;
(function (seedmodule) {
    var State = (function () {
        function State(obj) {
            if (typeof obj === "undefined") { obj = undefined; }
            this.message = "This is a message";
            this.stateId = 1;
            if (typeof obj === 'string') {
                obj = JSON.parse(obj);
            } else if (typeof obj === 'object') {
                if (obj.hasOwnProperty("message"))
                    this.message = obj.message;
                if (obj.hasOwnProperty("stateId"))
                    this.stateId = obj.stateId;
            } else if (typeof obj === 'undefined') {
                // default constructor
            } else {
                throw "State(" + obj + "?)";
            }
        }
        State.prototype.clone = function () {
            return new State(this);
        };
        return State;
    })();
    seedmodule.State = State;
})(seedmodule || (seedmodule = {}));

exports.State = seedmodule.State;
