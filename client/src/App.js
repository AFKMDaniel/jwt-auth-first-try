import React, { useEffect, useState } from 'react'
import LoginFrom from './component/LoginFrom'
import store from './store/store'
import {observer} from 'mobx-react-lite'
import UserService from './services/UserService'

const App = () => {

  const [users,setUsers] = useState([]);

  useEffect(() => {
      if(localStorage.getItem('token')){
        store.checkAuth()
      }
  },[])

  const getUsers = async () => {
    try {
      const fetchedUsers = await UserService.getAllUsers();
      setUsers([...fetchedUsers.data]);
    } catch (error) {
      
    }
  }

  if(store.isLoading){
    return <div>Загрузка...</div>
  }

  if(!store.isAuth){
    return (
      <div>
        <LoginFrom/>
        <button onClick={getUsers}>Получить пользователей</button>
      </div>
    )
  }

  return (
      <div>
        <h1>{store.user.email}</h1>
        <button onClick={(getUsers) => {store.logout()}}>Выйти</button>
        <button onClick={getUsers}>Получить пользователей</button>
        {users.map(user => 
          <div key={user.id}>
              <p>{`${user.id}. ${user.email}`}</p>
          </div>
        )}
      </div>
  )
}

export default observer(App)
