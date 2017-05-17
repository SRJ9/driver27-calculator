# `driver27-calculator` — Calculate the champion

Calculator allows to calculate to calculate the final classification of a racing championship from the current standing 
through a form where you can predict the results of the remaining races. Calculator is an [AngularJS] app based on
[django-driver27].

## Getting Started

Simply execute `npm start` and node server will be opened in port 8080.

### to-Do

- [ ] Move standing JSON to file standing.json
- [ ] Create service/factory to connect driver27 API (use custom params)
- [ ] Switch button to use standing.json or dr27 API response
- [ ] Alert when position is repeated by two contenders in same race
- [ ] Modularize the APP
- [ ] Punctuation system logic could be in the API side or use Flask
- [ ] TypeScript
- [ ] Convert to Angular2 APP (To evaluate)

[angularjs]: https://angularjs.org/
[django-driver27]: https://github.com/SRJ9/django-driver27