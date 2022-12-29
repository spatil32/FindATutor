<template>
  <div>
    <base-dialog :show="!!error" title="An Error Occured" @close="confirmError">
      <p>{{ error }}</p>
    </base-dialog>
    <base-dialog fixed :show="isLoading" title="Authenticating....">
      <base-spinner></base-spinner>
    </base-dialog>
    <base-card>
      <form>
        <div class="form-control">
          <label for="email" id="email">Email</label>
          <input type="email" v-model.trim="email" />
        </div>
        <div class="form-control">
          <label for="password" id="password">Password</label>
          <input type="password" v-model.trim="password" />
        </div>
        <p v-if="!formIsValid">Please enter required inputs.</p>
        <base-button @click.prevent="submitForm">{{
          submitButtonCaption
        }}</base-button>
        <base-button
          type="button"
          mode="flat"
          @click.prevent="switchAuthMode"
          >{{ switchModeButtonCaption }}</base-button
        >
      </form>
    </base-card>
  </div>
</template>

<script>
import BaseDialog from '../../components/ui/BaseDialog.vue';
export default {
  components: { BaseDialog },
  data() {
    return {
      email: '',
      password: '',
      formIsValid: false,
      mode: 'login',
      isLoading: false,
      error: null,
    };
  },
  computed: {
    submitButtonCaption() {
      if (this.mode === 'login') {
        return 'Login';
      } else {
        return 'Signup';
      }
    },
    switchModeButtonCaption() {
      if (this.mode === 'login') {
        return 'Signup instead';
      } else {
        return 'Login instead';
      }
    },
  },
  methods: {
    async submitForm() {
      if (
        this.email === '' ||
        !this.email.includes('@') ||
        this.password.length < 6
      ) {
        this.formIsValid = false;
        return;
      }

      this.isLoading = true;
      try {
        if (this.mode === 'login') {
          await this.$store.dispatch('login', {
            email: this.email,
            password: this.password,
          });
        } else {
          await this.$store.dispatch('signup', {
            email: this.email,
            password: this.password,
          });
        }
        const redirectURL = `/${this.$route.query.redirect || 'coaches'}`;
        this.$router.replace(redirectURL);
      } catch (err) {
        this.error = err.message || 'Something went wrong!';
      } finally {
        this.isLoading = false;
      }
    },
    switchAuthMode() {
      if (this.mode === 'login') {
        this.mode = 'signup';
      } else {
        this.mode = 'login';
      }
    },
    confirmError() {
      this.error = null;
    },
  },
};
</script>

<style scoped>
form {
  border-radius: 12px;
  padding: 1rem;
}

.form-control {
  margin: 0.5rem 0;
}

label {
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

input,
textarea {
  display: block;
  width: 100%;
  font: inherit;
  border: 1px solid #ccc;
  padding: 0.15rem;
}

input:focus,
textarea:focus {
  border-color: #3d008d;
  background-color: #faf6ff;
  outline: none;
}
</style>
