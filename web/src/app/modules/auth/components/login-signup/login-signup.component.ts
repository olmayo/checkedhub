import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SocialAuthService } from "@abacritt/angularx-social-login";
import { FacebookLoginProvider } from "@abacritt/angularx-social-login";

@Component({
  selector: 'auth-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.sass']
})
export class LoginSignupComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private auth2Service: SocialAuthService
  ) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(queryParams => {
      let email = queryParams.get("email");
      let activationToken = queryParams.get("activationToken");
      if (email && activationToken) {
        this.authService.activate(email, activationToken);
      }
    });

    this.auth2Service.authState.subscribe((user) => {
      console.log('USER', user);
      // this.user = user;
      // this.loggedIn = (user != null);
    });
  }

  // signInWithFB(): void {
  //   this.auth2Service.signIn(FacebookLoginProvider.PROVIDER_ID);
  // }

  // signOut(): void {
  //   this.auth2Service.signOut();
  // }

}