import Vue from 'vue';

Vue.prototype.$mouse = new Vue();

document.onkeydown = (evt) => {
	evt = evt || window.event;
	let isEscape = false;

	if ('key' in evt) {
		isEscape = (evt.key === 'Escape' || evt.key === 'Esc');
	} else {
		isEscape = (evt.keyCode === 27);
	}

	if (isEscape) {
		Vue.prototype.$mouse.$emit('is-mouse-down', false);
	}
};
