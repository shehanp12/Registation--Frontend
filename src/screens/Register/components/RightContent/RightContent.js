import React, { Component } from 'react';
import { withRouter} from "react-router-dom";
import { connect } from 'react-redux';
import { ActionCreators } from '../../../../actions/profile';
import stateList from '../../../../mock/state.json';
import { formatPhoneNumber, isValidEmail } from '../../../../utils';
import './style.css';

export class RightContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        firstName: '',
        lastName: '',
        userName:'',
        password:'',
        phoneNumber: '',
        mobileNumber:'',
        email: '',
        state: '',
        country: '',


      },
      errors: {
        user: {
          firstName: 'Enter First Name',
          lastName:'Enter Last Name',
          userName: 'Enter User Name',
          telephone: 'Enter Telephone',
          email: 'Email is not valid',
          phoneNumber:'Phone number is not valid',
          mobileNumber: 'Mobile number is not valid'



        }
      },
      validForm: false,
      submitted: false
    }
  }

  componentDidMount() {
    if(this.props.profile) {
      this.setState({ user: this.props.profile });
      if (this.props.profile.email) {
        this.resetErrorMsg();
      }
    }
  }

  validationErrorMessage = (event) => {
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'firstName':
        errors.user.firstName = value.length < 1 ? 'Enter First Name' : '';
        break;
      case 'lastName':
        errors.user.lastName = value.length < 1 ? 'Enter Last Name': '';
        break;
      case 'userName':
        errors.user.userName = value.length < 1 ? 'Enter User Name': '';
        break;
      case 'email':
        errors.user.email = isValidEmail(value) ? '' : 'Email is not valid';
        break;
      case 'phoneNumber':
        errors.user.phoneNumber = value.length < 1 && value.length > 10 ? 'Enter valid phone number' : '';
        break;
      case 'mobileNumber':
        errors.user.mobileNumber = value.length < 1 && value.length > 10 ? 'Enter valid mobile number' : '';
        break;
      default:
        break;
    }

    this.setState({ errors });
  }

  inputChange = (event) => {
    let mobileNumber = ''
    const { name, value } = event.target;
    const user = this.state.user;
    if (name === 'mobileNumber') {
      mobileNumber = formatPhoneNumber(value);
      user[name] = mobileNumber;
    } else {
      user[name] = value;
    }
    this.setState({ user });
    this.validationErrorMessage(event);
  }

  checkboxChange = (event) => {
    const { name, checked } = event.target;
    const user = this.state.user;
    user[name] = checked;
    this.setState({ user });
  }

  onChangeAddress = (event) => {
    const user = this.state.user;
    user['address'] = event.target.value;
    this.setState({ user });
  }

  onChangeInputRange = (value) => {
    const user = this.state.user;
    user['age'] = value;
    this.setState({ user })
  }

  onSelectedInterest = (value) => {
    const user = this.state.user;
    const errors = this.state.errors;
    user['interests'] = value;
    errors.user.interests = value.length < 1 ? 'Enter your Interests' : '';
    this.setState({ user, errors });
  }

  validateForm = (errors) => {
    let valid = true;
    Object.entries(errors.user).forEach(item => {
      console.log(item)
      item && item[1].length > 0 && (valid = false)
    })
    return valid;
  }

  submitForm = async (event) => {
    this.setState({ submitted: true });
    this.props.dispatch(ActionCreators.formSubmittingStatus(true));
    const user = this.state.user;
    if (user && this.props.profile) {
      user.profileImage = this.props.profile.profileImage;
    }
    event.preventDefault();
    if (this.validateForm(this.state.errors) && this.props.profile && this.props.profile.profileImage) {
      console.info('Valid Form')
      this.props.dispatch(ActionCreators.addProfile(user));
      this.props.history.push('/confirm')
    } else {
      console.log('Invalid Form')
    }
  }

  resetErrorMsg = () => {
    let errors = this.state.errors;
    errors.user.firstName = ''
    errors.user.mobileNumber = ''
    errors.user.email = ''

    this.setState({ errors });
  }

  render() {
    const { firstName, lastName, userName,password,confirmPassword, email, phoneNumber,mobileNumber, state, country} = this.state.user;
    const { submitted } = this.state;
    const listState = stateList.listStates.map((item, key) =>
      <option key={key} value={item.name}>{item.name}</option>
    );
    return (
      <div className="pagecenter loginForm">
        <div className="row">
          <label className="col-sm-2 col-form-label">Name</label>
          <div className="col-sm-3 mb-1">
            <input type="text" value={firstName} name="firstName" onChange={(e) => { this.inputChange(e)} } className="form-control" placeholder="First Name" />
            { submitted && this.state.errors.user.firstName.length > 0 &&  <span className='error'>{this.state.errors.user.firstName}</span>}
          </div>
          <div className="col-sm-3 mb-2">
            <input type="text" value={lastName} name="lastName" onChange={(e) => { this.inputChange(e)} } className="form-control" placeholder="Last Name" />
            { submitted && this.state.errors.user.lastName.length > 0 &&  <span className='error'>{this.state.errors.user.lastName}</span>}
          </div>
          <div className="col-sm-3 mb-2">
            <input type="text" value={userName} name="userName" onChange={(e) => { this.inputChange(e)} } className="form-control" placeholder="User Name" />
            { submitted && this.state.errors.user.userName.length > 0 &&  <span className='error'>{this.state.errors.user.userName}</span>}
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <label className="col-sm-2 col-form-label">Password</label>
          <div className="col-sm-3 mb-2">
            <input type="text" value={password} name="password" onChange={(e) => { this.inputChange(e)} } className="form-control" placeholder="Password" />
            { submitted && this.state.errors.user.userName.length > 0 &&  <span className='error'>{this.state.errors.user.userName}</span>}
          </div>
          <div className="col-sm-3 mb-2">
            <input type="text" value={confirmPassword} name="confirmPassword" onChange={(e) => { this.inputChange(e)} } className="form-control" placeholder="ConfirmPassword" />
          </div>
        </div>

        <div className="row">
          <label htmlFor="email" className="col-sm-2 col-form-label">Email</label>
          <div className="col-sm-6 mb-2">
            <input type="email" value={email} name="email" onChange={(e) => { this.inputChange(e)} } className="form-control" id="email" placeholder="Email" />
            { submitted && this.state.errors.user.email.length > 0 &&  <span className='error'>{this.state.errors.user.email}</span>}
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <label htmlFor="telephone" className="col-sm-2 col-form-label">Tel</label>
          <div className="col-sm-3 mb-2">

              <input type="text" pattern="[0-9]"  value={phoneNumber} name="telephone" onChange={(e) => { this.inputChange(e)} }  className="form-control" id="telephone" placeholder="PhoneNumber" />
              { submitted && this.state.errors.user.phoneNumber.length > 0 &&  <span className='error'>{this.state.errors.user.phoneNumber}</span>}
          </div>


          <div className="col-sm-3 mb-2">
              <input type="text" pattern="[0-9]" value={mobileNumber} name="telephone" onChange={(e) => { this.inputChange(e)} }  className="form-control" id="telephone" placeholder="MobileNumber" />
              { submitted && this.state.errors.user.telephone.length > 0 &&  <span className='error'>{this.state.errors.user.telephone}</span>}



          </div>
        </div>
        <div className="row">
          <label htmlFor="staticEmail1" className="col-sm-2 col-form-label">State</label>
          <div className="col-sm-6 mb-2">
            <select className="custom-select" value={state} name="state" id="inlineFormCustomSelect" onChange={this.inputChange}>
              {listState}
            </select>
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <label htmlFor="staticEmail1" className="col-sm-2 col-form-label">Country</label>
          <div className="col-sm-6 mb-2">
            <select className="custom-select" value={country} name="country" id="inlineFormCustomSelect" onChange={this.inputChange}>
              <option value="SL">Sri Lanka</option>

            </select>
          </div>
          <div className="col-sm-4">
          </div>
        </div>
        <div className="row">
          <div className="col-sm-5 mb-2">
          </div>
          <div className="col-sm-4">
            <button type="button" className="button" onClick={this.submitForm}>Submit</button>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.user.profile
  }
}

export default connect(mapStateToProps)(withRouter(RightContent));
