import React, { createContext, useEffect, useState } from 'react'


import { Route, Routes } from 'react-router-dom'


import Navbar from './components/Navbar/Navbar'
import LoginRegister from './pages/LoginRegister/LoginRegister'
import { lookInSession } from './common/Sessions/Sessions';
import EditorPage from './pages/EditorPage/EditorPage';
import Home from './pages/HomePage/Home';
import SearchPage from './pages/SearchPage/SearchPage';
import PageNotFound from './pages/404_page/PageNotFound';
import ProfilePage from './pages/ProfilePages/ProfilePage';
import BlogPage from './pages/BlogPages/BlogPage';
import SideNavBar from './components/SideNavBar/SideNavBar';
import ChangePassword from './pages/ChangePassword/ChangePassword';
import EditProfile from './pages/EditProfile/EditProfile';
import Notification from './pages/Notification/Notification';
import MangeBlogs from './pages/MangeBlogs/MangeBlogs'

// Setting up the GLOBA WEBSITE context
export const UserContext = createContext({});

// Setting up the context for the LIGHT/DARK theme of the WEBSITE
export const ThemeContext = createContext({});

// function to handle the userThemPreference By default when they get started...
const userThemePreference_DARK = () => window.matchMedia("(prefers-color-scheme: dark)").matches



const App = () => {

  const [userAuth, setUserAuth] = useState({});

  const [theme, setTheme] = useState(() => userThemePreference_DARK ? "dark" : "light")

  
  useEffect(() => {
    let userInSession = lookInSession("user");
    // const data = JSON.parse(userInSession)
    // console.log(data)

    let themeInSession = lookInSession("theme")

    userInSession ? (
      setUserAuth(JSON.parse(userInSession))
    ) : (
      setUserAuth({ access_token: null })
    );


    if (themeInSession) {
      setTheme(() => {
        document.body.setAttribute('data-theme', themeInSession)
        return themeInSession;
      })
    } else {
      document.body.setAttribute('data-theme', theme)
    }

  }, []);


  return (
    <>
      <ThemeContext.Provider value={{ setTheme, theme }}>
        <UserContext.Provider value={{ userAuth, setUserAuth }}>

          <Routes>

            <Route path='/editor' element={<EditorPage />} />
            <Route path='/editor/:blog_id' element={<EditorPage />} />
            <Route path='/' element={<Navbar />}>
              <Route path='/' element={<Home />} />

              <Route path='dashboard' element={<SideNavBar />}>
                <Route path='blogs' element={<MangeBlogs />} />
                <Route path='notifications' element={<Notification />} />
              </Route>

              <Route path='settings' element={<SideNavBar />}>
                <Route path='edit-profile' element={<EditProfile />} />
                <Route path='change-password' element={<ChangePassword />} />
              </Route>


              {/* children path ==> / + children-path (.ie. /signin or /signup) */}
              <Route path='signin' element={<LoginRegister type={"SIGN IN"} />} />
              <Route path='signup' element={<LoginRegister type={"SIGN UP"} />} />
              <Route path='search/:query' element={<SearchPage />} />
              <Route path='user/:id' element={<ProfilePage />} />
              <Route path='blog/:blog_id' element={<BlogPage />} />
              <Route path={"*"} element={<PageNotFound />} />
            </Route>

          </Routes>

        </UserContext.Provider>
      </ThemeContext.Provider>
    </>
  )
}

export default App



// 1234$asA