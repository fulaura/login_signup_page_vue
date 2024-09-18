<template>
  <div id="app">

    <div v-if="!loggedIn">


      <div v-if="!showLogin">
        <h2><strong>Sign Up</strong></h2>

        <input class="input"
              :class="{ 'is-danger': !signupUsername && usernameTouched && !usernameFocused }"
              v-model="signupUsername"
              placeholder="Username"
              @focus="usernameFocused = true" 
              @blur="checkUsername" />
        <br>
        <input class="input" 
        type="password" 
              :class="{ 'is-danger': !signupPassword && passwordTouched && !passwordFocused }"
              v-model="signupPassword" 
              placeholder="Password"
              @focus="passwordFocused = true" 
              @blur="checkPassword" />
        <br>


        <button @click="register" class="button button1 is-info is-outlined">Sign Up</button>
        <button @click="showLogin = true, alert_visible=false" class="button button2 is-light is-inverted is-outlined">Already have an account? Log in</button>
        <center>
          <DoItNow v-if="alert_visible==true"/>
        </center>
      </div>



      <div v-else>
        <h2><strong>Login</strong></h2>

        <input class="input" v-model="loginUsername" placeholder="Username" />
        <br>
        <input class="input" type="password" v-model="loginPassword" placeholder="Password" />
        <br>


        <button @click="login" class="button button1 is-primary is-outlined">Log In</button>
        <button @click="showLogin = false" class="button button2 is-light is-inverted is-outlined">Don't have an account? Sign up</button>
      </div>
    </div>


    <div v-else>
      <h2>Welcome, {{ loginUsername }}</h2>
      <button @click="logout" class="button is-danger is-inverted is-outlined">Log Out</button>
    </div>


  </div>
</template>

<script>
import DoItNow from './components/DoItNow.vue'

import axios from 'axios';

export default {
  components:{
      DoItNow
    },
  data() {
    return {
      loggedIn: false,
      showLogin: true,
      signupUsername: '',
      signupPassword: '',
      loginUsername: '',
      loginPassword: '',
      usernameTouched: false,
      passwordTouched: false,
      alert_visible: false
    };
    
  },
  methods: {
    checkUsername() {
      this.usernameTouched = true;
      this.usernameFocused = false;
    },
    checkPassword() {
      this.passwordTouched = true;
      this.passwordFocused = false;
    },

    async register() {
      this.checkUsername();
      this.checkPassword();
      if(!this.signupUsername || !this.signupPassword){
        this.alert_visible=true;
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/api/users', {
          params: { username: this.username }
        });
        if (response.data.exists === 0) {
          this.signupUsername = !this.signupUsername;
          this.usernameTouched = true;
          this.usernameFocused = false;
          return
        } 
      } 
      catch (error) {
        console.log("ok")
      }


      this.alert_visible=false;

      try {
        await axios.post('http://localhost:3000/api/register', {
          username: this.signupUsername,
          password: this.signupPassword
        });
        alert('Registration successful');
        this.showLogin = true;
        this.signupUsername = '';
        this.signupPassword = '';
      } catch (error) {
        alert('Error registering user');
      }
    },
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          username: this.loginUsername,
          password: this.loginPassword
        });
        console.log(response.data.message);
        this.loggedIn = true;
        this.showLogin = false;
        //this.loginUsername = '';
        //this.loginPassword = '';
      } catch (error) {
        alert('Error logging in');
      }
    },
    logout() {
      this.loggedIn = false;
      this.loginUsername = '';
      this.loginPassword = '';
    },
  },
};
</script>

<style>
@import "https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css";
#app {
  text-align: center;
  margin-top: 60px;
}
input {
  margin: 5px;
}
button {
  margin: 5px;
  margin-top: 10px;
}

.input{
  max-width: 30%
}
h2{
  font-size: 2rem;
}
.button2{
  width: 20%;
}
.button1{
  width: 8%;
}

</style>
