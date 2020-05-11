import { toAbsoluteUrl } from "../utils/utils";

export default [
  {
    id: 1,
    username: "john doe",
    password: "1",
    email: "doe81651@gmail.com",
    accessToken: "access-token-8f3ae836da744329a6f93bf20594b5cc",
    refreshToken: "access-token-f8c137a2c98743f48b643e71161d90aa",
    xZumoAuth: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGFibGVfc2lkIjoic2lkOmNmZWE1M2U2MjU4Y2VhNjAyZWE2MWU2MjBlMGU4MTBkIiwic3ViIjoic2lkOjE3Y2MyZGUxODkzNzZkYzFlZWVkMWI1MDY2ODVjYWZmIiwiaWRwIjoiZ29vZ2xlIiwidmVyIjoiMyIsIm5iZiI6MTU3ODkxNTE3MCwiZXhwIjoxNTgxNTA3MTcwLCJpYXQiOjE1Nzg5MTUxNzAsImlzcyI6Imh0dHBzOi8vZGV2LmltY2Fkby5hcHAvIiwiYXVkIjoiaHR0cHM6Ly9kZXYuaW1jYWRvLmFwcC8ifQ.H3QMuK4L827yz1dUoJ_e8iajQZUnwN87rTpwZT9Af_Q",
    roles: [1], // Administrator
    pic: toAbsoluteUrl("https://lh6.googleusercontent.com/-8vaBqSGsNwM/AAAAAAAAAAI/AAAAAAAAAAA/ACHi3rejGCjKuRUw10-T_GA23jjZbhNmkQ/s120/photo.jpg"),
    fullname: "john doe",
    "DataCollectionConsent": "true",
    "ApplicationRated": false,
    "FeaturesFlag": "31"
  },
  {
    id: 2,
    username: "user",
    password: "demo",
    email: "user@demo.com",
    accessToken: "access-token-6829bba69dd3421d8762-991e9e806dbf",
    refreshToken: "access-token-f8e4c61a318e4d618b6c199ef96b9e55",
    roles: [2], // Manager
    pic: toAbsoluteUrl("/media/users/100_2.jpg"),
    fullname: "Megan",
    occupation: "Deputy Head of Keenthemes in New York office",
    companyName: "Keenthemes",
    phone: "456669067891",
    address: {
      addressLine: "3487  Ingram Road",
      city: "Greensboro",
      state: "North Carolina",
      postCode: "27409"
    },
    socialNetworks: {
      linkedIn: "https://linkedin.com/user",
      facebook: "https://facebook.com/user",
      twitter: "https://twitter.com/user",
      instagram: "https://instagram.com/user"
    }
  },
  {
    id: 3,
    username: "guest",
    password: "demo",
    email: "guest@demo.com",
    accessToken: "access-token-d2dff7b82f784de584b60964abbe45b9",
    refreshToken: "access-token-c999ccfe74aa40d0aa1a64c5e620c1a5",
    roles: [3], // Guest
    pic: toAbsoluteUrl("/media/users/default.jpg"),
    fullname: "Ginobili Maccari",
    occupation: "CFO",
    companyName: "Keenthemes",
    phone: "456669067892",
    address: {
      addressLine: "1467  Griffin Street",
      city: "Phoenix",
      state: "Arizona",
      postCode: "85012"
    },
    socialNetworks: {
      linkedIn: "https://linkedin.com/guest",
      facebook: "https://facebook.com/guest",
      twitter: "https://twitter.com/guest",
      instagram: "https://instagram.com/guest"
    }
  }
];
