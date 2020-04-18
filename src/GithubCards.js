import React from 'react';
import ReactDOM from 'react-dom';

// Start with what components to create
//    first what makes sense right now, rename or delete later as needed

class Card extends React.Component {
  render() {
    const profile = this.props;
    return (
      <div className="github-profile" style={{ margin: '1rem'} }>
        <img src={profile.avatar_url} style={{width: '75px'}} />
        <div className="info" style={{display: 'inline-block', marginLeft: 10}}>
          <div className="name" style={{fontSize: '125%'}}>{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
      </div>
    );
  }
}

class Form extends React.Component {
  state = {
    userName: ''
  }
  handleSubmit = async (event) => {
    event.preventDefault();
    const resp = await fetch(`https://api.github.com/users/${this.state.userName}`);
    const data = await resp.json();

    // All this is doing is calling the function reference we passed down from
    // the parent (Page), and sending up the data the Form collected from 
    // the API. This Form component does not know or care what onSubmit is
    // doing.
    this.props.onSubmit(data);
    this.setState({ userName: '' });
  };

  render() {
    return (
      <form onSubmit = {this.handleSubmit}>
        <input
          type="text"
          value={this.state.userName}
          onChange={event => this.setState({userName: event.target.value})}
          placeholder="GitHub username"
          required
        />
        <button>Add card</button>
      </form>
    );
  }
}

const CardList = (props) => (
    <div>
      {props.profiles.map(profile => <Card key={profile.id} {...profile} />)}
    </div>
);

class Page extends React.Component {
  // each react component MUST have a 'render' function
  //  - render is the only required function

  // this is the original way
  //constructor(props) {
  //  super(props);
  //  this.state = {
  //    profiles: testData, 
  //  };
  //}

  // this is the "new" way, not part of official JS language yet according
  //   to Samer Buna of Pluralsight React beginner course, but because we're
  //   using JSX and Babel, Babel knows about it and converts it for you
  state = {
    profiles: [],
  };

  // we use setState here, because remember you can't just change state 
  //   willy-nilly! You need to use setState!
  addNewProfile = (newProfile) => {
    this.setState(prevState => ({
      profiles: [...prevState.profiles, newProfile]
    }))
  };

  render() {
    return (
      <div>
        <h3 className="header">{this.props.title}</h3>
        <Form onSubmit={this.addNewProfile} />
        <CardList profiles={this.state.profiles}/>
      </div>
    );
  }
}

class App extends React.Component {
  render() {
    return <Page title="The GitHub Cards App" />
  }
}

export default App;
