// import React, { ReactElement } from 'react';
// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from 'react-router-dom';

// import Login from './containers/Login';
// import Signup from './containers/Signup';
// import ListMembers from './containers/ListMembers';
// import Profile from './containers/Profile';
// import Edit from './containers/Edit';
// import ChatList from './containers/ChatList';
// import ChatView from './containers/ChatView';
// import NotFound from './containers/NotFound';

// interface RouteElementProps {
//   element: ReactElement;
// }

// // ✅ 인증 상태 감지
// const isAuthenticated = !!localStorage.getItem('idToken');

// // ✅ 로그인 안 한 유저만 접근 가능
// export const NotLoggedInRoute = ({ element }: RouteElementProps) => {
//   const isAuthenticated = !!localStorage.getItem('idToken');
//   return !isAuthenticated ? element : <Navigate to="/profile" />;
// };


// // ✅ 로그인한 유저만 접근 가능
// export const PrivateRoute = ({ element }: RouteElementProps) => {
//   const location = useLocation();
//   const isAuthenticated = !!localStorage.getItem('idToken');
//   return isAuthenticated ? element : <Navigate to="/login" state={{ from: location }} />;
// };

// // ✅ App 컴포넌트 전체 구성
// const App = () => {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* 기본 경로 리다이렉트 */}
//         <Route path="/" element={<Navigate to="/login" replace />} />

//         {/* 로그인/회원가입 */}
//         <Route path="/login" element={<NotLoggedInRoute element={<Login />} />} />
//         {/* <Route path="/signup" element={<NotLoggedInRoute element={<Signup />} />} /> */}

//         {/* 콜백 처리
//         <Route path="/callback" element={<Callback />} /> */}

//         {/* 인증 필요 라우트 */}
//         <Route path="/profile/edit" element={<PrivateRoute element={<Edit />} />} />
//         <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
//         <Route path="/users/list" element={<PrivateRoute element={<ListMembers />} />} />
//         <Route path="/chats" element={<PrivateRoute element={<ChatList />} />} />
//         <Route path="/chat/room/:roomId" element={<PrivateRoute element={<ChatView />} />} />

//         {/* 404 처리 */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </BrowserRouter>
//   );
// };

// export default App;

import React, { ReactNode } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Login from './containers/Login';
import Signup from './containers/Signup';
import ListMembers from './containers/ListMembers';
import Profile from './containers/Profile';
import Edit from './containers/Edit';
import ChatList from './containers/ChatList';
import ChatView from './containers/ChatView';
import NotFound from './containers/NotFound';
import EmailVerification from './containers/EmailVerification';

// ✅ 공통 props 타입 정의
interface AuthRouteProps {
  children: React.ReactNode;
}

// ✅ 로그인하지 않은 유저만 접근 가능
const NotLoggedInRoute = ({ children }: AuthRouteProps) => {
  const isAuthenticated = !!localStorage.getItem('idToken');
  return !isAuthenticated ? <>{children}</> : <Navigate to="/profile" replace />;
};

// ✅ 로그인한 유저만 접근 가능
const PrivateRoute = ({ children }: AuthRouteProps) => {
  const location = useLocation();
  const isAuthenticated = !!localStorage.getItem('idToken');
  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace state={{ from: location }} />
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 기본 경로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 로그인/회원가입 */}
        <Route
          path="/login"
          element={
            <NotLoggedInRoute>
              <Login />
            </NotLoggedInRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <NotLoggedInRoute>
              <Signup />
            </NotLoggedInRoute>
          }
        />

        {/* 인증 필요한 라우트 */}
        <Route
          path="/profile/edit"
          element={
            <PrivateRoute>
              <Edit />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/users/list"
          element={
            <PrivateRoute>
              <ListMembers />
            </PrivateRoute>
          }
        />
        <Route
          path="/chats"
          element={
            <PrivateRoute>
              <ChatList />
            </PrivateRoute>
          }
        />
        <Route
          path="/chat/room/:roomId"
          element={
            <PrivateRoute>
              <ChatView />
            </PrivateRoute>
          }
        />
        <Route path="/verify-email" element={<EmailVerification />} />

        {/* 404 처리 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
