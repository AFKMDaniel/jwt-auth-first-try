import { observer } from 'mobx-react-lite';
import React from 'react'
import { useState } from 'react'
import store from '../store/store';

const LoginFrom = () => {

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');

  return (
    <div>
        <input type="text" placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}/>
        <input type="password" placeholder='Пароль' value={password} onChange={e => setPassword(e.target.value)}/>
        <button onClick={() => store.login(email,password)}>Войти</button>
        <button onClick={() => store.registration(email,password)}>Регистрация</button>
    </div>
  )
}

export default observer(LoginFrom)