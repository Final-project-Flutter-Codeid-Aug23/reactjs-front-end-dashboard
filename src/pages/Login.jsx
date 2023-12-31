import { Button, Checkbox, TextField } from '@mui/material'
import PokopediaLogo from '../assets/pokopedia-Icon.png'
import "./style/Login.css"
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [error, setError] = useState('')

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) navigate('/admin/user-manage')
  }, [navigate])

  const login = async (e) => {
    e.preventDefault()
    if (!username || !password) {
      setError('Plese enter your username and password')
      return
    }
    try {
      const config = {
        url: 'http://localhost:3000/users/login',
        method: 'POST',
        data: {
          username,
          password
        }
      }
      const { data } = await axios(config)
      const accessToken = data.data.access_token
      const userInfo = data.data.userInfo
      console.log(userInfo);
      if (!userInfo.isAdmin) {
        setError('User not an Admin.')
        return
      }
      dispatch({
        type: 'LOGIN',
        payload: {
          accessToken,
          userInfo
        }
      })
      navigate('/admin/user-manage')
    } catch (error) {
      console.log(error.response.data)
      setError(error.response.data.error)
    }
  }

  return (
    <div className="login">
      <div className="form-container">
        <div className="head">
          <img src={PokopediaLogo} alt="pokopedia" />
          <div className='form-subtitle'>Welcome to Pokopedia Dashboard!</div>
        </div>
        {error && <div className="warning-sign">{error}</div>}
        <form className="login-form" onSubmit={(e) => login(e)}>
          <TextField id="outlined-email-input" label="Username" className='input input-email' value={username} onChange={(e) => setUsername(e.target.value)} />
          <TextField id="outlined-password-input" label="Password" type={isShowPassword ? 'text' : 'password'} className='input input-password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          <div className="password-show">
            <Checkbox checked={isShowPassword} onClick={() => setIsShowPassword(!isShowPassword)} /> <span>Show Password</span>
          </div>
          <Button variant="contained" className='login-button' onClick={(e) => login(e)} type='submit'>Log In</Button>
        </form>
      </div>
    </div>
  )
}
 
export default Login