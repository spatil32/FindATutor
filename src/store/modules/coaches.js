export default {
  namespaced: true,
  state() {
    return {
      lastFetch: null,
      coaches: [
        {
          id: 'c1',
          firstName: 'Maximilian',
          lastName: 'Schwarzmüller',
          areas: ['frontend', 'backend', 'career'],
          description:
            "I'm Maximilian and I've worked as a freelance web developer for years. Let me help you become a developer as well!",
          hourlyRate: 30,
        },
        {
          id: 'c2',
          firstName: 'Julie',
          lastName: 'Jones',
          areas: ['frontend', 'career'],
          description:
            'I am Julie and as a senior developer in a big tech company, I can help you get your first job or progress in your current role.',
          hourlyRate: 30,
        },
      ],
    };
  },
  mutations: {
    registerCoach(state, payload) {
      state.coaches.push(payload);
    },
    setCoaches(state, payload) {
      state.coaches = payload;
    },
    setFetchTimestamp(state) {
      state.lastFetch = new Date().getTime();
    },
  },
  getters: {
    coaches(state) {
      return state.coaches;
    },
    hasCoaches(state) {
      return state.coaches && state.coaches.length > 0;
    },
    isCoach(_, getters, _2, rootGetters) {
      const coaches = getters.coaches;
      const userId = rootGetters.userId;
      return coaches.some((coach) => coach.id === userId);
    },
    shouldUpdate(state) {
      const lastFetch = state.lastFetch;
      if (!lastFetch) {
        return true;
      }
      const currentTimestamp = new Date().getTime();
      return (currentTimestamp - lastFetch) / 1000 > 60;
    },
  },
  actions: {
    async registerCoach(context, data) {
      const userId = context.rootGetters.userId;
      const coachData = {
        firstName: data.first,
        lastName: data.last,
        areas: data.areas,
        description: data.desc,
        hourlyRate: data.rate,
      };

      try {
        const result = await fetch(
          `https://tutorsondemand-d38ca-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=${context.rootGetters.token}`,
          {
            method: 'PUT',
            body: JSON.stringify(coachData),
          }
        );

        // const responseData = await result.json();
        if (!result.ok) {
          console.log('not okay');
        }
        context.commit('registerCoach', {
          ...coachData,
          id: userId,
        });
      } catch (err) {
        console.log('catch');
      }
    },
    async loadCoaches(context, payload) {
      if (!payload.forcedRefresh && !context.getters.shouldUpdate) {
        return;
      }
      const response = await fetch(
        'https://tutorsondemand-d38ca-default-rtdb.firebaseio.com/coaches.json'
      );
      const responseData = await response.json();

      if (!response.ok) {
        const error = new Error(responseData.message || 'Failed to fetch!');
        throw error;
      }

      const coaches = [];
      for (const coachId in responseData) {
        const coach = {
          id: coachId,
          firstName: responseData[coachId].firstName,
          lastName: responseData[coachId].lastName,
          areas: responseData[coachId].areas,
          description: responseData[coachId].description,
          hourlyRate: responseData[coachId].hourlyRate,
        };

        coaches.push(coach);
      }

      context.commit('setCoaches', coaches);
      context.commit('setFetchTimestamp');
    },
  },
};
