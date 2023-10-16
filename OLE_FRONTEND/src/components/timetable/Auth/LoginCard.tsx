import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, FormControl, IconButton, Input, InputAdornment, InputLabel, TextField, Tooltip, Typography } from '@mui/material';
import { AccountCircle, Visibility, VisibilityOff } from '@mui/icons-material';
import LockIcon from '@mui/icons-material/Lock';
import { animated, useSpring } from '@react-spring/web';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { login, register } from '../../../helpers/RequestHelpers';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import * as EmailValidator from 'email-validator';

type Props = {
  loginModalActive: boolean
  setLoginModalActive: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginCard = (props: Props) => {

  const [showPassword, setShowPassword] = React.useState(false);
  const [firstName, setFirstName]= React.useState("");
  const [lastName, setLastName]= React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [samePassword, setSamePassword] = React.useState(true);
  const [email, setEmail] = React.useState("");
  const [rememberMe, setRememberMe] = React.useState(true);

  const [loginButtonSprings, loginButtonApi] = useSpring(() => ({
    from: {
      backgroundImage: "linear-gradient(90deg, rgba(38,166,154,1) 0%, rgba(21,101,192,1) 0%)"
    }
  }));

  const [loginCardSprings, loginCardApi] = useSpring(() => ({
    from: {
      right: "0%"
    },
  }));

  const [signUpCardSprings, signUpCardApi] = useSpring(() => ({
    from: {
      left: "100%"
    },
  }));

  const [tooltipSprings, tooltipApi] = useSpring(() => ({
    from: {
      bottom: "0%",
      opacity: "0%"
    },
  }));


  function handlePasswordInput(pass: string) {
    setPassword(pass);
    setSamePassword(pass.localeCompare(confirmPassword) === 0);
  }

  function handleConfirmPasswordInput(pass: string) {
    setConfirmPassword(pass);
    setSamePassword(pass.localeCompare(password) === 0);
  }

  function handleLoginButtonEnter() {
    loginButtonApi.start({
      from: {
        backgroundImage: "linear-gradient(90deg, rgba(38,166,154,1) 0%, rgba(21,101,192,1) 0%)"
      },
      to: {
        backgroundImage: "linear-gradient(90deg, rgba(38,166,154,1) 50%, rgba(21,101,192,1) 100%)"
      }
    })
  }

  function handleLoginButtonLeave() {
    loginButtonApi.start({
      from: {
        backgroundImage: "linear-gradient(90deg, rgba(38,166,154,1) 50%, rgba(21,101,192,1) 100%)"
      },
      to: {
        backgroundImage: "linear-gradient(90deg, rgba(38,166,154,1) 0%, rgba(21,101,192,1) 0%)"
      }
    })
  }

  function handleSignUpClick() {
    animateTooltipLeave();
    loginCardApi.start({
      from: {
        right: "0%"
      },
      to: {
        right: "100%"
      }
    });
    signUpCardApi.start({
      from: {
        left: "200%"
      },
      to: {
        left: "35%"
      }
    })
  }

  function registerFieldsFilled() {
    if ( !email || !password || !samePassword || !firstName || !lastName) {
        return false;
      }
    return true;
  }

  function loginFieldsFilled() {
    if (!email || !password) return false;
    return true;
  }

  function getRegisterTooltipMessage() {
    if (!registerFieldsFilled()) return "Please fill all fields";
    else if (!EmailValidator.validate(email)) return "Please enter a valid email";
    return "An account with this email already exists";
  }

  function getLoginTooltipMessage() {
    if (!loginFieldsFilled()) return "Please fill all fields";
    else if (!EmailValidator.validate(email)) return "Please enter a valid email";
    return "There is no account with this email";
  }

  function setTooltipActive() {
    animateTooltipEnter();
    setTimeout(() => {
      animateTooltipLeave();
    }, 1750);
  }

  async function handleRegisterSubmit() {
    if (!registerFieldsFilled() || !EmailValidator.validate(email)) {
      setTooltipActive();
      return;
    }
    register(normaliseName(firstName), normaliseName(lastName), email, password, setTooltipActive);
  }

  function animateTooltipEnter() {
    tooltipApi({
      from: {
        bottom: "0%",
        opacity: "0%"
      },
      to: {
        bottom: "125%",
        opacity: "100%"
      }
    });
  }

  function animateTooltipLeave() {
    tooltipApi({
      from: {
        bottom: "125%",
        opacity: "100%"
      },
      to: {
        bottom: "0%",
        opacity: "0%"
      }
    });
  }

  function normaliseName(name: string) {
    return name.substring(0, 1).toUpperCase() + name.substring(1).toLowerCase();
  }

  async function handleLoginSubmit() {
    if (!email || !password || !EmailValidator.validate(email)) {
      setTooltipActive();
      return;
    }
    login(email, password, rememberMe, setTooltipActive);
  }

  function handleBackClick() {
    animateTooltipLeave();
    loginCardApi.start({
      from: {
        right: "100%"
      },
      to: {
        right: "0%"
      }
    });
    signUpCardApi.start({
      from: {
        left: "35%"
      },
      to: {
        left: "200%"
      }
    })
  }

  return (
    <>
      <animated.div className='login-card-inner' style={{...loginCardSprings}} onClick={e => e.stopPropagation()}>

        <div className='login-card-close-button'>
          <Button onClick={() => props.setLoginModalActive(false)}><CloseIcon htmlColor='gray'/></Button>
        </div>

        <div className='login-card-title'>
          <Typography sx={{fontSize: "2rem", color: "black"}}>
            LOG IN
          </Typography>
        </div>

        <div className='login-card-inputs'>

          <TextField
          id="email"
          type='email'
          label="Email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle/>
              </InputAdornment>
            ),
          }}
          variant="outlined"
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleLoginSubmit()
          }}
          />

          <TextField
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon/>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
            )
          }}
          variant="outlined"
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleLoginSubmit();
          }}
          />

          <div onClick={() => window.open("http://olebackend.com/accounts/reset_password", "_blank")} className="login-card-forgot-password">
            <Typography>Forgot password?</Typography>
          </div>

          <div className="login-card-remember-me">
            <FormGroup>
              <FormControlLabel control={<Checkbox size='small' checked={rememberMe} onClick={() => setRememberMe(!rememberMe)}/>} label="Remember me" />
            </FormGroup>
          </div>

        </div>

        <animated.div
        className="login-card-login-button"
        onClick={() => handleLoginSubmit()}
        onMouseEnter={() => handleLoginButtonEnter()}
        onMouseLeave={() => handleLoginButtonLeave()}
        style={{...loginButtonSprings}}>
          <Typography sx={{fontSize: "1.25rem", color: "white"}}>
            Log In
          </Typography>

          {
            <animated.div style={{...tooltipSprings, position: "absolute", width: "300%", display: "flex", justifyContent: "center"}}>
              <Typography sx={{fontSize: "1rem", color: "#b71c1c"}}>{getLoginTooltipMessage()}</Typography>
            </animated.div>
          }
        </animated.div>

        <br/>

        <div className="login-card-create-account" onClick={() => handleSignUpClick()}>
          <Typography>
            New here? Become a student
          </Typography>
        </div>
      </animated.div>

      <animated.div className='register-card-inner' style={{position: "absolute", ...signUpCardSprings}} onClick={e => e.stopPropagation()}>

        <div className='login-card-close-button'>
          <Button onClick={() => props.setLoginModalActive(false)}><CloseIcon htmlColor='gray'/></Button>
        </div>

        <div className='signup-card-close-button'>
          <Button onClick={() => handleBackClick()}><ArrowBackIcon htmlColor='gray'/></Button>
        </div>


        <div className='register-card-title'>
          <Typography sx={{ fontSize: "2rem", color: "black", }}>
            NEW STUDENT
          </Typography>
        </div>

        <div className='signup-card-inputs'>

          <Box sx={{display: "flex"}}>
            <TextField
            size='small'
            id="firstname"
            type='text'
            label="First Name"
            fullWidth
            onChange={e => setFirstName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleRegisterSubmit()
            }}
            />

            <br/>

            <TextField
            size='small'
            id="firstname"
            type='text'
            label="Last Name"
            fullWidth
            onChange={e => setLastName(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleRegisterSubmit()
            }}
            />
          </Box>

          <br/>
          <TextField
          size='small'
          id="email"
          type='email'
          label="Email"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <AccountCircle/>
              </InputAdornment>
            ),
          }}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter") handleRegisterSubmit()
          }}
          />

          <br/>

          <TextField
          size='small'
          id="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          onChange={e => handlePasswordInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon/>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
            )
          }}
          onKeyDown={e => {
            if (e.key === "Enter") handleRegisterSubmit()
          }}
          />

          <br/>

          <TextField
          size='small'
          id="confirm-password"
          type="password"
          label="Confirm Password"
          error={!samePassword}
          onChange={e => handleConfirmPasswordInput(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon/>
              </InputAdornment>
            )
          }}
          onKeyDown={e => {
            if (e.key === "Enter") handleRegisterSubmit()
          }}
          />
        </div>

        <animated.div
        className="register-card-register-button"
        onClick={() => handleRegisterSubmit()}
        onMouseEnter={() => handleLoginButtonEnter()}
        onMouseLeave={() => handleLoginButtonLeave()}
        style={{...loginButtonSprings}}>
          {
            <animated.div style={{...tooltipSprings, position: "absolute", width: "300%", display: "flex", justifyContent: "center"}}>
              <Typography sx={{fontSize: "1rem", color: "#b71c1c"}}>{getRegisterTooltipMessage()}</Typography>
            </animated.div>
          }
          <Typography sx={{fontSize: "1.25rem", color: "white"}}> Register </Typography>
        </animated.div>

      </animated.div>
    </>
  )
}

export default LoginCard