import React from 'react';

class PageDetailsContainer extends React.Component {
    signInContainer = <SignInContainer />

    pageContainer = <div id="page-details-container">
        <div>
            <h1 className="title">Welcome to Flippify</h1>
            <p className="description">Fast-track your profits with our lightning-quick deal bots, from lego to sneakers.</p>
        </div>
        {this.signInContainer}

        <p>Copyright © 2024 Flippify. All rights reserved.</p>
    </div>

    render() {
        return this.pageContainer
    }
}

export default PageDetailsContainer;



class SignInContainer extends React.Component {
    emailInput = <EmailInput />;
    signUpWithEmailBtn = <SignUpWithEmailBtn />
    signUpWithDiscordBtn = <SignUpWithDiscordBtn />

    container = <div id="sign-in-container">
        <p><strong>Create an account</strong></p>
        <p>Enter your email or login with Discord to start.</p>
        {this.emailInput}
        {this.signUpWithEmailBtn}
        {this.signUpWithDiscordBtn}
    </div>

    render() {
        return this.container
    }
}


class EmailInput extends React.Component {
    input = <form>
        <div className="form-group">
            <input type="text" className="form-control" id="formGroupExampleInput" placeholder="email@domain.com" />
        </div>
    </form>

  render() {
    return this.input
  }
}

class SignUpWithEmailBtn extends React.Component {
    input = <form>
        <div className="form-group">
            <button type="button" className="btn btn-dark">Sign up with email</button>
        </div>
    </form>

  render() {
    return this.input
  }
}

class SignUpWithDiscordBtn extends React.Component {
    input = <form>
        <div className="form-group">
            <button type="button" className="btn btn-primary">Sign up with Discord</button>
        </div>
        <p>By clicking continue, you agree to our <strong>Terms of Service</strong> and <strong>Privacy Policy</strong></p>
    </form>

  render() {
    return this.input
  }
}
