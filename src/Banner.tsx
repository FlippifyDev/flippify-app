import React from 'react';



// PascalCasing for function names
function Banner() {
    const title = <Title />
    const imageLogo = <ImageLogo />
    const bannerTabsContainer = <BannerTabsContainer />
    const signInButtonContainer = <SignInButtonContainer />;

    let banner = (
        <div className="banner">
            {imageLogo}{title}{bannerTabsContainer}{signInButtonContainer}
        </div>
    );

    return banner;
}

export default Banner;



/* --------------------------------------------------------------- */


class Title extends React.Component {
    title = <div id="banner-title-div"><h1 id="banner-title">Flippify</h1></div>

    render() {
        return this.title
    }
     
}


class ImageLogo extends React.Component {
    image = <img src="/public/flippify-logo.png" alt="Flippify Logo" /> // This isnt working

    render() {
        return this.image
    }
}


/* --------------------------------------------------------------- */


class BannerTabsContainer extends React.Component {
    homeButton = <HomeButton />; 
    aboutButton = <AboutButton />
    discordButton = <DiscordButton />

    signInContainer = <div id="banner-tabs-container">
        {this.homeButton}
        {this.aboutButton}
        {this.discordButton}
    </div>

    render() {
        return this.signInContainer;
    }
}


class HomeButton extends React.Component {
    handleClick = () => {
        // Handle
    };

    button = <div id="home-button-div">
        <button type="button" className="banner-tab-button">
            <span className="a">Home</span>
        </button>
    </div>

    render() {
        return this.button;
    }
}


class AboutButton extends React.Component {
    handleClick = () => {
        // Handle
    };

    button = <div id="about-button-div" >
        <button type="button" className="banner-tab-button">
            <span className="a">About</span>
        </button>
    </div>

    render() {
        return this.button;
    }
}


class DiscordButton extends React.Component {
    handleClick = () => {
        // Handle
    };

    button = <div id="discord-button-div">
        <button type="button" className="banner-tab-button">
            <span className="a">Discord</span>
        </button>
    </div>

    render() {
        return this.button;
    }
}


/* --------------------------------------------------------------- */


function loginPressed() {
    // Handle Login
}


function getStartedPressed() {
    // Handle sign up
}


class SignInButtonContainer extends React.Component {
    loginButton = <LoginButton />; 
    getStartedButton = <GetStartedButton />

    signInContainer = <div id="sign-in-btn-container">
        {this.loginButton}
        {this.getStartedButton}
    </div>

    render() {
        return this.signInContainer;
    }
}


class LoginButton extends React.Component {
    handleClick = () => {
        loginPressed();
    };

    button = <div id="login-button-div" className="sign-in-button">
        <input
            type="button"
            value="Login"
            onClick={this.handleClick}
        />
    </div>

    render() {
        return this.button;
    }
}


class GetStartedButton extends React.Component {
    handleClick = () => {
      // Handle button click logic here
      getStartedPressed();
    };

    button = <div id="get-started-button-div" className="sign-in-button">
        <input
            type="button"
            value="Get Started"
            onClick={this.handleClick}
        />
    </div>

    render() {
        return this.button;
    }
}


/* --------------------------------------------------------------- */



