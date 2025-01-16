import { jwtDecode } from "jwt-decode";

interface UserToken {
  username: string;
  email: string;
  id: string;
  exp: number;
}

class AuthService {
  getProfile() {
    return jwtDecode(this.getToken() || "");
  }

  loggedIn() {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<UserToken>(token);
      if (decoded?.exp && decoded?.exp < Date.now() / 1000) {
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    return localStorage.getItem("id_token");
  }

  login(token: string, userData: UserToken) {
    localStorage.setItem("id_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    window.location.assign("/discover");
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("user");
    window.location.assign("/discover");
  }
}

export default new AuthService();
