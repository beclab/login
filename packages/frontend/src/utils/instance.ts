let instance: any = null;

export default {
	setInstance: function (ins: any) {
		instance = ins;
	},

	getInstance: function () {
		return instance;
	}
};
