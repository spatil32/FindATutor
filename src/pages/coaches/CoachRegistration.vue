<template>
  <section>
    <base-card>
      <h2>Register a coach now!</h2>
      <keep-alive>
        <coach-form @save-data="saveData"></coach-form>
      </keep-alive>
    </base-card>
  </section>
</template>

<script>
import CoachForm from '../../components/coaches/CoachForm.vue';

export default {
  components: {
    CoachForm,
  },
  methods: {
    saveData(formData) {
      this.$store.dispatch('coaches/registerCoach', formData);
      this.$router.replace('/coaches');
    },
  },
};
</script>
