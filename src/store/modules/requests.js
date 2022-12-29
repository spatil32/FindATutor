export default {
  namespaced: true,
  state() {
    return {
      requests: [],
    };
  },
  mutations: {
    addRequests(state, payload) {
      state.requests.push(payload);
    },
    setRequests(state, payload) {
      state.requests = payload;
    },
  },
  getters: {
    requests(state, _, _2, rootGetters) {
      return state.requests.filter((req) => req.coachId === rootGetters.userId);
    },
    hasRequests(_, getters) {
      return getters.requests && getters.requests.length > 0;
    },
  },
  actions: {
    async contactCoach(context, payload) {
      const newRequest = {
        userEmail: payload.email,
        message: payload.message,
      };

      const response = await fetch(
        `https://tutorsondemand-d38ca-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
        {
          method: 'POST',
          body: JSON.stringify(newRequest),
        }
      );
      const responseData = response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Failed to contach coach!'
        );
        throw error;
      }

      context.commit('addRequests', {
        ...newRequest,
        id: responseData.name,
        coachId: payload.coachId,
      });
    },
    async fetchRequests(context) {
      const coachId = context.rootGetters.userId;
      const response = await fetch(
        `https://tutorsondemand-d38ca-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=${context.rootGetters.token}`
      );

      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(
          responseData.message || 'Failed to load requests!'
        );
        throw error;
      }

      const requests = [];
      for (const key in responseData) {
        const req = {
          id: key,
          coachId: coachId,
          userEmail: responseData[key].userEmail,
          message: responseData[key].message,
        };
        requests.push(req);
      }

      context.commit('setRequests', requests);
    },
  },
};
