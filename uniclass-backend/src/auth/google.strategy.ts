import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptions } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
constructor() {
		super(<StrategyOptions>{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			scope: ['email', 'profile'],
		});
}
async validate(accessToken: string, refreshToken: string, profile: any, done:
VerifyCallback) {
const { id, emails, displayName, photos } = profile;
done(null, { googleId: id, email: emails[0].value, name: displayName, photo:
photos[0].value });
}
}