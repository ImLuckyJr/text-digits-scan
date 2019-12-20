export const state = () => ({
	isMouseDown: false,
});

export const mutations = {
	SET_MOUSE_DOWN(state, isMouseDown) {
		state.isMouseDown = isMouseDown;
	}
};

export const actions = {
	setMouseDown({ commit }, isMouseDown) {
		commit('SET_MOUSE_DOWN', isMouseDown);
	}
};

export const getters = {
	isMouseDown: state => {
		return state.isMouseDown;
	}
};
